import { type Page, type Locator } from '@playwright/test';

/**
 * Base Action class providing common functionality for all action classes.
 * Includes error handling, logging, and navigation helpers.
 */
export default class BaseAction {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async waitForNavigation(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    async waitForUrlChange(urlPattern: RegExp, timeout: number = 10000): Promise<void> {
        await this.page.waitForURL(urlPattern, { timeout });
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }
}
