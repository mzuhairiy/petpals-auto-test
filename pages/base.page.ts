import { type Page, type Locator } from '@playwright/test';

/**
 * BasePage — abstract base class for all Page Objects.
 *
 * Provides:
 * - Common navigation methods
 * - URL helpers
 * - Wait utilities (no hardcoded sleeps)
 *
 * All page objects MUST extend this class.
 * Page objects MUST NOT contain assertions — only locators and interactions.
 */
export default class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ── Navigation ──

    async goto(path: string = '/'): Promise<void> {
        await this.page.goto(path);
    }

    async waitForDomReady(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async waitForNetworkIdle(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    async waitForUrlMatch(urlPattern: RegExp, timeout: number = 10_000): Promise<void> {
        await this.page.waitForURL(urlPattern, { timeout });
    }

    getCurrentUrl(): string {
        return this.page.url();
    }

    // ── Locator helpers ──

    protected byTestId(testId: string): Locator {
        return this.page.locator(`[data-testid="${testId}"]`);
    }

    protected byTestIdPrefix(prefix: string): Locator {
        return this.page.locator(`[data-testid^="${prefix}"]`);
    }

    protected byTestIdSuffix(suffix: string): Locator {
        return this.page.locator(`[data-testid$="${suffix}"]`);
    }
}
