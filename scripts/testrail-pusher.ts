const { logger } = require('../utils/logger');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface TestRailStep {
    content: string;
    expected: string;
}

interface TestRailCase {
    title: string;
    section_name: string;
    type_id: number;
    priority_id: number;
    preconds?: string;
    steps_separated: TestRailStep[];
    refs?: string;
    automation_type?: number;
    is_automated?: boolean;
}

interface TestRailSection {
    id: number;
    name: string;
}

class TestRailPusher {
    private baseUrl: string;
    private headers: HeadersInit;
    private projectId: string;

    constructor() {
        this.baseUrl = process.env.TESTRAIL_BASE_URL || '';
        this.projectId = process.env.TESTRAIL_PROJECT_ID || '';
        const email = process.env.TESTRAIL_EMAIL || '';
        const apiKey = process.env.TESTRAIL_API_KEY || '';

        if (!this.baseUrl || !email || !apiKey || !this.projectId) {
            throw new Error('Missing TestRail environment variables. Check TESTRAIL_BASE_URL, TESTRAIL_EMAIL, TESTRAIL_API_KEY, TESTRAIL_PROJECT_ID in .env');
        }

        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${email}:${apiKey}`).toString('base64'),
        };
    }

    private async request(method: string, endpoint: string, body?: object): Promise<any> {
        const url = `${this.baseUrl}/index.php?/api/v2/${endpoint}`;
        logger.debug(`TestRail API: ${method} ${endpoint}`);

        const response = await fetch(url, {
            method,
            headers: this.headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const error = await response.text();
            logger.error(`TestRail API error: ${response.status} - ${error}`);
            throw new Error(`TestRail API error: ${response.status} - ${error}`);
        }

        return response.json();
    }

    async getSections(): Promise<TestRailSection[]> {
        const result = await this.request('GET', `get_sections/${this.projectId}`);
        return result.sections || result;
    }

    async resolveSectionId(sectionName: string): Promise<number> {
        const sections = await this.getSections();
        const match = sections.find(
            (s: TestRailSection) => s.name.toLowerCase() === sectionName.toLowerCase(),
        );

        if (!match) {
            const available = sections.map((s: TestRailSection) => s.name).join(', ');
            throw new Error(`Section "${sectionName}" not found in TestRail. Available sections: ${available}`);
        }

        return match.id;
    }

    async pushCase(testCase: TestRailCase): Promise<number> {
        const sectionId = await this.resolveSectionId(testCase.section_name);

        const payload = {
            title: testCase.title,
            type_id: testCase.type_id,
            priority_id: testCase.priority_id,
            custom_preconds: testCase.preconds,
            custom_steps_separated: testCase.steps_separated,
            refs: testCase.refs,
            custom_automation_type: testCase.automation_type,
            custom_is_automated: testCase.is_automated,
        };

        const result = await this.request('POST', `add_case/${sectionId}`, payload);
        logger.info(`✅ Pushed case: "${testCase.title}" → Section "${testCase.section_name}" (Case ID: ${result.id})`);
        return result.id;
    }

    async pushFromFile(filePath: string): Promise<void> {
        const absolutePath = path.resolve(process.cwd(), filePath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File not found: ${absolutePath}`);
        }

        const raw = fs.readFileSync(absolutePath, 'utf-8');
        const cases: TestRailCase[] = JSON.parse(raw);

        if (!Array.isArray(cases) || cases.length === 0) {
            throw new Error('JSON file must contain a non-empty array of test cases');
        }

        logger.info(`Pushing ${cases.length} case(s) from ${filePath}`);

        const results: { title: string; caseId: number }[] = [];

        for (const testCase of cases) {
            const caseId = await this.pushCase(testCase);
            results.push({ title: testCase.title, caseId });
        }

        logger.info(`\n✅ All ${results.length} case(s) pushed successfully:`);
        results.forEach((r) => logger.info(`  - "${r.title}" → Case ID: ${r.caseId}`));
    }
}

// CLI entry point
if (require.main === module) {
    const filePath = process.argv[2];

    if (!filePath) {
        console.error('Usage: npx ts-node scripts/testrail-pusher.ts <path-to-json>');
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
