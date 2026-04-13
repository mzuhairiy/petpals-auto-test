import { Page, expect } from '@playwright/test';

/**
 * NavigationHelper — page navigation utilities.
 */
export class NavigationHelper {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForNavigation(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(500);
    }

    async waitForUrlMatch(pattern: RegExp, timeout: number = 10000): Promise<void> {
        await this.page.waitForURL(pattern, { timeout });
    }

    async assertUrl(pattern: RegExp): Promise<void> {
        await expect(this.page).toHaveURL(pattern);
    }

    getCurrentUrl(): string {
        return this.page.url();
    }
}
