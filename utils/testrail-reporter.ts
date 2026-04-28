import dotenv from 'dotenv';
import path from 'path';

import type {
    FullConfig,
    FullResult,
    Reporter,
    Suite,
    TestCase,
    TestResult,
} from '@playwright/test/reporter';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// ─── Interfaces ──────────────────────────────────────────────

interface TestRailResult {
    case_id: number;
    status_id: number;
    comment: string;
    elapsed?: string;
}

interface TestRailRunResponse {
    id: number;
    name: string;
    [key: string]: unknown;
}

// ─── TestRail Status IDs ─────────────────────────────────────
//  1 = Passed
//  2 = Blocked
//  3 = Untested
//  4 = Retest
//  5 = Failed

const STATUS = {
    PASSED: 1,
    BLOCKED: 2,
    UNTESTED: 3,
    RETEST: 4,
    FAILED: 5,
} as const;

// ─── Constants ───────────────────────────────────────────────

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RATE_LIMIT_DELAY_MS = 5000;

// ─── Reporter Class ──────────────────────────────────────────

class TestRailReporter implements Reporter {
    private baseUrl: string;
    private projectId: string;
    private suiteId: string;
    private email: string;
    private apiKey: string;
    private runName: string;
    private results: TestRailResult[] = [];
    private caseIds: Set<number> = new Set();
    private enabled: boolean = true;

    constructor() {
        this.baseUrl = (process.env.TESTRAIL_BASE_URL || '').replace(/\/+$/, '');
        this.projectId = process.env.TESTRAIL_PROJECT_ID || '';
        this.suiteId = process.env.TESTRAIL_SUITE_ID || '';
        this.email = process.env.TESTRAIL_EMAIL || '';
        this.apiKey = process.env.TESTRAIL_API_KEY || '';
        this.runName = process.env.TESTRAIL_RUN_NAME || '';

        if (!this.baseUrl || !this.email || !this.apiKey || !this.projectId) {
            console.warn(
                '[TestRail Reporter] ⚠️  Missing env vars — reporter disabled. ' +
                'Set TESTRAIL_BASE_URL, TESTRAIL_EMAIL, TESTRAIL_API_KEY, TESTRAIL_PROJECT_ID to enable.',
            );
            this.enabled = false;
        }
    }

    // ─── Playwright Reporter Hooks ───────────────────────────

    onBegin(_config: FullConfig, _suite: Suite): void {
        if (!this.enabled) return;
        this.results = [];
        this.caseIds.clear();
        console.log('[TestRail Reporter] 🚀 Collecting test results...');
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        if (!this.enabled) return;

        const caseId = this.extractCaseId(test);
        if (!caseId) return;

        this.caseIds.add(caseId);

        const statusId = this.mapStatus(result.status, test.outcome());
        const elapsed = this.formatElapsed(result.duration);
        const comment = this.buildComment(test, result);

        this.results.push({
            case_id: caseId,
            status_id: statusId,
            comment,
            elapsed,
        });
    }

    async onEnd(_result: FullResult): Promise<void> {
        if (!this.enabled || this.results.length === 0) {
            if (this.enabled) {
                console.log('[TestRail Reporter] ℹ️  No tests with @TC tags found — nothing to report.');
            }
            return;
        }

        console.log(`[TestRail Reporter] 📊 Reporting ${this.results.length} result(s) to TestRail...`);

        try {
            const runId = await this.createRun();
            await this.addResults(runId);
            await this.closeRun(runId);

            console.log(`[TestRail Reporter] ✅ Results pushed to TestRail Run #${runId}`);
            console.log(`[TestRail Reporter] 🔗 ${this.baseUrl}/index.php?/runs/view/${runId}`);
        } catch (err: any) {
            console.error(`[TestRail Reporter] ❌ Failed to push results: ${err.message}`);
        }
    }

    // ─── Case ID Extraction ──────────────────────────────────

    private extractCaseId(test: TestCase): number | null {
        // Pattern: @TC{id} in test title
        const titleMatch = test.title.match(/@TC(\d+)/);
        if (titleMatch) return parseInt(titleMatch[1], 10);

        // Fallback: check Playwright tags/annotations
        for (const tag of test.tags) {
            const tagMatch = tag.match(/@?TC(\d+)/);
            if (tagMatch) return parseInt(tagMatch[1], 10);
        }

        return null;
    }

    // ─── Status Mapping ──────────────────────────────────────

    private mapStatus(_status: TestResult['status'], outcome: ReturnType<TestCase['outcome']>): number {
        switch (outcome) {
            case 'expected':
                return STATUS.PASSED;
            case 'flaky':
                return STATUS.RETEST;
            case 'skipped':
                return STATUS.BLOCKED;
            case 'unexpected':
            default:
                return STATUS.FAILED;
        }
    }

    // ─── Comment Builder ─────────────────────────────────────

    private buildComment(test: TestCase, result: TestResult): string {
        const lines: string[] = [];

        lines.push(`**Test:** ${test.titlePath().join(' > ')}`);
        lines.push(`**Status:** ${result.status}`);
        lines.push(`**Duration:** ${this.formatElapsed(result.duration)}`);
        lines.push(`**Browser:** ${test.parent?.project()?.name || 'unknown'}`);

        if (result.status === 'failed' || result.status === 'timedOut') {
            for (const error of result.errors) {
                if (error.message) {
                    lines.push('');
                    lines.push('**Error:**');
                    lines.push('```');
                    const msg = error.message.length > 1000
                        ? error.message.substring(0, 1000) + '...(truncated)'
                        : error.message;
                    lines.push(msg);
                    lines.push('```');
                }
            }
        }

        if (result.retry > 0) {
            lines.push(`\n**Retry:** Attempt ${result.retry + 1}`);
        }

        return lines.join('\n');
    }

    // ─── Time Formatting ─────────────────────────────────────

    private formatElapsed(durationMs: number): string {
        const seconds = Math.ceil(durationMs / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    // ─── TestRail API ────────────────────────────────────────

    private async apiRequest<T = unknown>(method: string, endpoint: string, body?: object): Promise<T> {
        const url = `${this.baseUrl}/index.php?/api/v2/${endpoint}`;
        const hasBody = body !== undefined && method !== 'GET';

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            const headers: Record<string, string> = {
                'Authorization': 'Basic ' + Buffer.from(`${this.email}:${this.apiKey}`).toString('base64'),
                'Content-Type': 'application/json',
            };

            const response = await fetch(url, {
                method,
                headers,
                body: hasBody ? JSON.stringify(body) : undefined,
            });

            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_DELAY_MS;
                console.warn(`[TestRail Reporter] ⏳ Rate limited. Waiting ${delay / 1000}s...`);
                await new Promise((r) => setTimeout(r, delay));
                continue;
            }

            if (response.status >= 500 && attempt < MAX_RETRIES) {
                const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
                console.warn(`[TestRail Reporter] ⚠️  Server error ${response.status}. Retrying...`);
                await new Promise((r) => setTimeout(r, delay));
                continue;
            }

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`TestRail API ${response.status}: ${errText}`);
            }

            const text = await response.text();
            return text ? JSON.parse(text) as T : (undefined as T);
        }

        throw new Error(`TestRail API failed after ${MAX_RETRIES} retries`);
    }

    // ─── Run Management ──────────────────────────────────────

    private async createRun(): Promise<number> {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const name = this.runName || `Automated Run — ${timestamp}`;

        const payload: Record<string, unknown> = {
            name,
            description: `Playwright automated test run\nGenerated: ${timestamp}`,
            include_all: false,
            case_ids: Array.from(this.caseIds),
        };

        if (this.suiteId) {
            payload.suite_id = parseInt(this.suiteId, 10);
        }

        const result = await this.apiRequest<TestRailRunResponse>(
            'POST',
            `add_run/${this.projectId}`,
            payload,
        );

        console.log(`[TestRail Reporter] 📋 Created Run #${result.id}: "${name}"`);
        return result.id;
    }

    private async addResults(runId: number): Promise<void> {
        await this.apiRequest(
            'POST',
            `add_results_for_cases/${runId}`,
            { results: this.results },
        );
    }

    private async closeRun(runId: number): Promise<void> {
        await this.apiRequest('POST', `close_run/${runId}`);
    }
}

export default TestRailReporter;
