import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

/**
 * AccountPage — Account and Orders page object.
 *
 * Contains locators for account profile and order history pages.
 * NO assertions — tests handle all verification.
 */
export default class AccountPage extends BasePage {
    // Account page
    readonly accountHeading: Locator;

    // Orders page
    readonly ordersHeading: Locator;

    // Wishlist page
    readonly wishlistItems: Locator;
    readonly wishlistRemoveButtons: Locator;
    readonly wishlistContinueShoppingLink: Locator;

    constructor(page: Page) {
        super(page);

        // Account page
        this.accountHeading = page.locator('.tracking-tight.text-2xl.font-bold.flex.items-center.gap-2');

        // Orders page
        this.ordersHeading = page.getByRole('heading', { name: 'Order History', level: 1 });

        // Wishlist page
        this.wishlistItems = this.byTestIdPrefix('wishlist-item-');
        this.wishlistRemoveButtons = this.byTestIdPrefix('wishlist-remove-');
        this.wishlistContinueShoppingLink = this.byTestId('wishlist-continue-shopping-link');
    }

    // ── Interactions ──

    /**
     * Removes all products from the wishlist page.
     * Safe to call when the wishlist is already empty (no-op).
     */
    async clearWishlist(): Promise<void> {
        const removeButtons = this.wishlistRemoveButtons;
        let count = await removeButtons.count();

        while (count > 0) {
            await removeButtons.first().click();
            await this.waitForDomReady();
            count = await removeButtons.count();
        }
    }

    getWishlistItemByName(productName: string): Locator {
        return this.page.locator('[data-testid^="wishlist-item-"]', { hasText: productName }).first();
    }
}
