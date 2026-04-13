import { Page, Locator, expect } from '@playwright/test';

/**
 * Base component for reusable UI components.
 * Components are scoped to a root element and provide
 * interactions within that scope.
 */
export class BaseComponent {
    protected readonly page: Page;
    protected readonly root: Locator;

    constructor(page: Page, rootSelector: string | Locator) {
        this.page = page;
        this.root = typeof rootSelector === 'string' ? page.locator(rootSelector) : rootSelector;
    }

    async isVisible(): Promise<boolean> {
        return this.root.isVisible();
    }

    async waitForVisible(timeout?: number): Promise<void> {
        await expect(this.root).toBeVisible({ timeout });
    }

    async waitForHidden(timeout?: number): Promise<void> {
        await expect(this.root).not.toBeVisible({ timeout });
    }

    protected find(selector: string): Locator {
        return this.root.locator(selector);
    }
}
