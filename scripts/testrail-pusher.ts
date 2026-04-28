const { logger } = require('../utils/logger');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// ─── Interfaces ──────────────────────────────────────────────

interface TestRailStep {
    content: string;
    expected: string;
}

interface TestRailCase {
    title: string;
    section_name: string;
    type_id: number;
    priority_id: number;
    template_id?: number;
    preconds?: string;
    steps_separated?: TestRailStep[];
    refs?: string;
    automation_type?: number;
    is_automated?: boolean;
}

interface TestRailSection {
    id: number;
    name: string;
}

interface TestRailCaseResponse {
    id: number;
    title: string;
    section_id: number;
    [key: string]: unknown;
}

// ─── Constants ───────────────────────────────────────────────

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RATE_LIMIT_DELAY_MS = 5000;

// ─── Main Class ──────────────────────────────────────────────

class TestRailPusher {
    private baseUrl: string;
    private projectId: string;
    private suiteId?: string;
    private email: string;
    private apiKey: string;
    private sectionCache: Map<string, number> = new Map();

    constructor() {
        this.baseUrl = (process.env.TESTRAIL_BASE_URL || '').replace(/\/+$/, '');
        this.projectId = process.env.TESTRAIL_PROJECT_ID || '';
        this.suiteId = process.env.TESTRAIL_SUITE_ID || undefined;
        this.email = process.env.TESTRAIL_EMAIL || '';
        this.apiKey = process.env.TESTRAIL_API_KEY || '';

        const missing: string[] = [];
        if (!this.baseUrl) missing.push('TESTRAIL_BASE_URL');
        if (!this.email) missing.push('TESTRAIL_EMAIL');
        if (!this.apiKey) missing.push('TESTRAIL_API_KEY');
        if (!this.projectId) missing.push('TESTRAIL_PROJECT_ID');

        if (missing.length > 0) {
            throw new Error(
                `Missing TestRail environment variables: ${missing.join(', ')}. ` +
                'Check your .env file.',
            );
        }
    }

    // ─── HTTP Layer ──────────────────────────────────────────

    private getHeaders(includeContentType: boolean = false): Record<string, string> {
        const headers: Record<string, string> = {
            'Authorization': 'Basic ' + Buffer.from(`${this.email}:${this.apiKey}`).toString('base64'),
        };
        if (includeContentType) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    }

    private async request<T = unknown>(
        method: string,
        endpoint: string,
        body?: object,
        retries: number = MAX_RETRIES,
    ): Promise<T> {
        // TestRail API uses index.php?/api/v2/ format for query parameter chaining
        const url = `${this.baseUrl}/index.php?/api/v2/${endpoint}`;
        logger.debug(`TestRail API: ${method} ${url}`);

        for (let attempt = 1; attempt <= retries; attempt++) {
            const hasBody = body !== undefined && method !== 'GET';

            const response = await fetch(url, {
                method,
                headers: this.getHeaders(hasBody),
                body: hasBody ? JSON.stringify(body) : undefined,
            });

            // Handle rate limiting (HTTP 429)
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const delay = retryAfter
                    ? parseInt(retryAfter, 10) * 1000
                    : RATE_LIMIT_DELAY_MS;
                logger.warn(
                    `Rate limited by TestRail. Retrying in ${delay / 1000}s (attempt ${attempt}/${retries})`,
                );
                await this.sleep(delay);
                continue;
            }

            // Handle server errors with retry
            if (response.status >= 500 && attempt < retries) {
                const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
                logger.warn(
                    `TestRail server error ${response.status}. Retrying in ${delay / 1000}s (attempt ${attempt}/${retries})`,
                );
                await this.sleep(delay);
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                logger.error(`TestRail API error: ${response.status} - ${errorText}`);
                throw new Error(`TestRail API error: ${response.status} - ${errorText}`);
            }

            // Some endpoints return empty body (e.g., DELETE)
            const text = await response.text();
            if (!text) return undefined as T;

            try {
                return JSON.parse(text) as T;
            } catch {
                logger.error(`Failed to parse TestRail response as JSON: ${text.substring(0, 200)}`);
                throw new Error('TestRail API returned non-JSON response');
            }
        }

        throw new Error(`TestRail API request failed after ${retries} retries: ${method} ${endpoint}`);
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ─── Sections ────────────────────────────────────────────

    async getSections(): Promise<TestRailSection[]> {
        const allSections: TestRailSection[] = [];
        let baseEndpoint = `get_sections/${this.projectId}`;

        if (this.suiteId) {
            baseEndpoint += `&suite_id=${this.suiteId}`;
        }

        // Handle pagination — TestRail returns max 250 items per page
        let hasMore = true;
        let offset = 0;

        while (hasMore) {
            const paginatedEndpoint = offset > 0 ? `${baseEndpoint}&offset=${offset}` : baseEndpoint;

            const result = await this.request<any>('GET', paginatedEndpoint);

            const sections: TestRailSection[] = result?.sections || (Array.isArray(result) ? result : []);
            allSections.push(...sections);

            // Check if there are more pages
            if (result?._links?.next) {
                offset += result.limit || 250;
            } else {
                hasMore = false;
            }
        }

        return allSections;
    }

    async createSection(sectionName: string): Promise<number> {
        const payload: Record<string, unknown> = { name: sectionName };
        if (this.suiteId) payload.suite_id = parseInt(this.suiteId);

        const result = await this.request<TestRailSection>('POST', `add_section/${this.projectId}`, payload);
        logger.info(`📁 Created section: "${sectionName}" (ID: ${result.id})`);
        this.sectionCache.set(sectionName.toLowerCase(), result.id);
        return result.id;
    }

    async resolveSectionId(sectionName: string): Promise<number> {
        // Check cache first to avoid redundant API calls
        const cacheKey = sectionName.toLowerCase();
        if (this.sectionCache.has(cacheKey)) {
            return this.sectionCache.get(cacheKey)!;
        }

        // Fetch and cache all sections on first call
        if (this.sectionCache.size === 0) {
            const sections = await this.getSections();
            for (const section of sections) {
                this.sectionCache.set(section.name.toLowerCase(), section.id);
            }
        }

        const sectionId = this.sectionCache.get(cacheKey);
        if (!sectionId) {
            logger.warn(`Section "${sectionName}" not found — creating it...`);
            return await this.createSection(sectionName);
        }

        return sectionId;
    }

    // ─── Cases ───────────────────────────────────────────────

    private validateCase(testCase: TestRailCase, index: number): void {
        const errors: string[] = [];

        if (!testCase.title?.trim()) {
            errors.push('title is required');
        }
        if (!testCase.section_name?.trim()) {
            errors.push('section_name is required');
        }
        if (!testCase.type_id || typeof testCase.type_id !== 'number') {
            errors.push('type_id must be a positive number');
        }
        if (!testCase.priority_id || typeof testCase.priority_id !== 'number') {
            errors.push('priority_id must be a positive number');
        }

        if (errors.length > 0) {
            throw new Error(
                `Validation failed for test case at index ${index} ("${testCase.title || 'untitled'}"): ${errors.join('; ')}`,
            );
        }
    }

    async getExistingCases(sectionId: number): Promise<TestRailCaseResponse[]> {
        let endpoint = `get_cases/${this.projectId}&section_id=${sectionId}`;
        if (this.suiteId) {
            endpoint += `&suite_id=${this.suiteId}`;
        }

        const result = await this.request<any>('GET', endpoint);

        if (Array.isArray(result)) return result;
        return result?.cases || [];
    }

    async pushCase(testCase: TestRailCase, skipDuplicates: boolean = true): Promise<number> {
        const sectionId = await this.resolveSectionId(testCase.section_name);

        // Check for existing case with same title to avoid duplicates
        if (skipDuplicates) {
            const existingCases = await this.getExistingCases(sectionId);
            const duplicate = existingCases.find(
                (c) => c.title.toLowerCase() === testCase.title.toLowerCase(),
            );

            if (duplicate) {
                logger.info(
                    `⏭️  Skipping duplicate: "${testCase.title}" already exists (Case ID: ${duplicate.id})`,
                );
                return duplicate.id;
            }
        }

        const payload: Record<string, unknown> = {
            title: testCase.title,
            type_id: testCase.type_id,
            priority_id: testCase.priority_id,
        };

        // Use "Test Case (Steps)" template when steps are provided
        // Template IDs: 1 = Test Case (Text), 2 = Test Case (Steps), 3 = Exploratory
        if (testCase.template_id) {
            payload.template_id = testCase.template_id;
        } else if (testCase.steps_separated?.length) {
            payload.template_id = 2; // Default to "Test Case (Steps)"
        }

        // Only include optional fields if they have values
        if (testCase.preconds) payload.custom_preconds = testCase.preconds;
        if (testCase.steps_separated?.length) payload.custom_steps_separated = testCase.steps_separated;
        if (testCase.refs) payload.refs = testCase.refs;
        if (testCase.automation_type !== undefined) payload.custom_automation_type = testCase.automation_type;
        if (testCase.is_automated !== undefined) payload.custom_case_is_automated = testCase.is_automated;

        const result = await this.request<TestRailCaseResponse>('POST', `add_case/${sectionId}`, payload);
        logger.info(
            `✅ Pushed case: "${testCase.title}" → Section "${testCase.section_name}" (Case ID: ${result.id})`,
        );
        return result.id;
    }

    async pushFromFile(filePath: string, skipDuplicates: boolean = true): Promise<void> {
        const absolutePath = path.resolve(process.cwd(), filePath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File not found: ${absolutePath}`);
        }

        let raw: string;
        try {
            raw = fs.readFileSync(absolutePath, 'utf-8');
        } catch (err: any) {
            throw new Error(`Failed to read file: ${absolutePath} — ${err.message}`);
        }

        let cases: TestRailCase[];
        try {
            cases = JSON.parse(raw);
        } catch {
            throw new Error(`Invalid JSON in file: ${absolutePath}`);
        }

        if (!Array.isArray(cases) || cases.length === 0) {
            throw new Error('JSON file must contain a non-empty array of test cases');
        }

        // Validate all cases before pushing any
        cases.forEach((testCase, index) => this.validateCase(testCase, index));

        logger.info(`Pushing ${cases.length} case(s) from ${filePath}`);

        const results: { title: string; caseId: number; skipped: boolean }[] = [];

        for (const testCase of cases) {
            const caseId = await this.pushCase(testCase, skipDuplicates);
            results.push({ title: testCase.title, caseId, skipped: false });
        }

        const pushed = results.filter((r) => !r.skipped).length;
        logger.info(`\n✅ Done — ${pushed}/${results.length} case(s) pushed:`);
        results.forEach((r) =>
            logger.info(`  - "${r.title}" → Case ID: ${r.caseId}`),
        );
    }
}

// ─── CLI Entry Point ─────────────────────────────────────────

if (require.main === module) {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error('Usage: npx ts-node scripts/testrail-pusher.ts <path-to-json>');
        console.error('Example: npx ts-node scripts/testrail-pusher.ts test-data/testrail-cases.json');
        process.exit(1);
    }

    const pusher = new TestRailPusher();
    pusher
        .pushFromFile(filePath)
        .then(() => process.exit(0))
        .catch((err) => {
            logger.error(err.message);
            process.exit(1);
        });
}

module.exports = { TestRailPusher };
