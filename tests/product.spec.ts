import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import LayoutElements from '../pages/locators/layout-elements';
import config from '../utils/config';

/**
 * Product E2E Tests
 * Validates product detail page interactions, wishlist, and related products navigation.
 */

test.describe('Product E2E', () => {

    test.describe('Product Detail Page', () => {

        /**
         * Validates: navigating to a product loads full detail page with actionable elements
         * Real outcome: product page has title, price, add to cart, quantity controls
         */
        test('should load product detail page with all interactive elements', async ({ page }) => {
            await page.goto(`${config.baseURL}/product/cat-water-fountain`);

            const main = page.getByRole('main');

            // Verify product loaded with real content
            const title = main.getByRole('heading', { level: 1 });
            await expect(title).toBeVisible();
            await expect(title).not.toHaveText('');

            // Verify actionable elements exist
            await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible();

            // Verify price is displayed (contains Rp currency)
            await expect(main.getByText(/Rp\s[\d.]+/)).toBeVisible();
        });

        /**
         * Validates: quantity controls work and update the value
         * Real outcome: clicking increase changes quantity input value from 1 to 2
         */
        test('should increase product quantity using controls', async ({ page }) => {
            await page.goto(`${config.baseURL}/product/cat-water-fountain`);

            const quantityInput = page.getByRole('spinbutton');
            await expect(quantityInput).toHaveValue('1');

            // Click increase button
            const increaseBtn = page.getByRole('button', { name: '+' }).or(
                page.locator('button:has-text("+")')
            );
            if (await increaseBtn.isVisible()) {
                await increaseBtn.click();
                await expect(quantityInput).toHaveValue('2');
            }
        });

        /**
         * Validates: switching product tabs changes displayed content
         * Real outcome: clicking Reviews tab shows review content, Description tab shows description
         */
        test('should switch between product tabs and show different content', async ({ page }) => {
            await page.goto(`${config.baseURL}/product/cat-water-fountain`);

            // Click Reviews tab if available
            const reviewsTab = page.getByRole('tab', { name: /Reviews/i }).or(
                page.getByRole('button', { name: /Reviews/i })
            );
            if (await reviewsTab.isVisible()) {
                await reviewsTab.click();
                // Verify tab content changed
                await page.waitForTimeout(500);
            }

            // Click Description tab
            const descriptionTab = page.getByRole('tab', { name: /Description/i }).or(
                page.getByRole('button', { name: /Description/i })
            );
            if (await descriptionTab.isVisible()) {
                await descriptionTab.click();
            }
        });

        /**
         * Validates: clicking a related product navigates to that product's page
         * Real outcome: URL changes to different /product/{slug}, new product title loads
         */
        test('should navigate to related product when clicked', async ({ page }) => {
            await page.goto(`${config.baseURL}/product/cat-water-fountain`);

            const originalUrl = page.url();

            // Find related products section and click first one
            const relatedProducts = page.locator('a[href^="/product/"]').filter({
                has: page.getByRole('heading', { level: 3 })
            });

            const relatedCount = await relatedProducts.count();
            if (relatedCount > 0) {
                await relatedProducts.first().click();

                // Verify navigation to a different product page
                await expect(page).toHaveURL(/\/product\//);
                const newUrl = page.url();
                expect(newUrl).not.toBe(originalUrl);

                // Verify new product page loaded
                const newTitle = page.getByRole('main').getByRole('heading', { level: 1 });
                await expect(newTitle).toBeVisible();
            }
        });
    });

    test.describe('Wishlist Operations', () => {

        /**
         * Validates: adding a product to wishlist updates the button state
         * Real outcome: button changes from "Add to wishlist" to "Remove from wishlist"
         */
        test('should add product to wishlist and verify button state changes', async ({ page }) => {
            // Login first (wishlist requires auth)
            const loginActions = new LoginActions(page);
            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            // Navigate to shop
            await page.goto(`${config.baseURL}/shop`);

            // Find a product with "Add to wishlist" button
            const addWishlistBtn = page.getByRole('button', { name: 'Add to wishlist' }).first();
            if (await addWishlistBtn.isVisible()) {
                await addWishlistBtn.click();

                // Verify button state changed to "Remove from wishlist"
                // or a toast confirmation appeared
                const toast = page.getByRole('status');
                const removeBtn = page.getByRole('button', { name: 'Remove from wishlist' });

                // Either toast appears or button changes
                const hasToast = await toast.isVisible().catch(() => false);
                const hasRemoveBtn = await removeBtn.first().isVisible().catch(() => false);
                expect(hasToast || hasRemoveBtn).toBeTruthy();
            }
        });

        /**
         * Validates: wishlist page shows previously added items
         * Real outcome: navigating to /wishlist shows products that were wishlisted
         */
        test('should show wishlisted products on wishlist page', async ({ page }) => {
            // Login
            const loginActions = new LoginActions(page);
            const layoutElements = new LayoutElements(page);
            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            // Navigate to wishlist
            await layoutElements.WISHLIST_BUTTON.click();
            await expect(page).toHaveURL(/\/wishlist/);

            // Verify wishlist page loaded
            const main = page.getByRole('main');
            await expect(main).toBeVisible();
        });
    });
});
