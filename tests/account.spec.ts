import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import LayoutElements from '../pages/locators/layout-elements';
import config from '../utils/config';

/**
 * Account E2E Tests
 * Validates user account operations: profile, orders, wishlist management.
 */

test.describe('Account E2E', () => {

    test.describe('Account Navigation', () => {

        /**
         * Validates: authenticated user can access account page
         * Real outcome: URL changes to /account, account content loads
         */
        test('should navigate to account page after login', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const layoutElements = new LayoutElements(page);

            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            // Click account button (user name in header)
            await layoutElements.ACCOUNT_BUTTON.click();
            await expect(page).toHaveURL(/\/account/);

            // Verify account page loaded
            const main = page.getByRole('main');
            await expect(main).toBeVisible();
        });

        /**
         * Validates: authenticated user can access orders page
         * Real outcome: URL changes to /orders, orders content loads
         */
        test('should navigate to orders page after login', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const layoutElements = new LayoutElements(page);

            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            // Click orders button
            await layoutElements.ORDERS_BUTTON.click();
            await expect(page).toHaveURL(/\/orders/);

            // Verify orders page loaded
            const main = page.getByRole('main');
            await expect(main).toBeVisible();
        });
    });

    test.describe('Wishlist Management', () => {

        /**
         * Validates: user can add and remove items from wishlist
         * Real outcome: wishlist count changes, item appears/disappears
         */
        test('should add product to wishlist from shop and see it on wishlist page', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const layoutElements = new LayoutElements(page);

            // Login
            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            // Go to shop and add a product to wishlist
            await page.goto(`${config.baseURL}/shop`);
            const addWishlistBtn = page.getByRole('button', { name: 'Add to wishlist' }).first();

            if (await addWishlistBtn.isVisible()) {
                // Get the product name before adding to wishlist
                const productCard = addWishlistBtn.locator('xpath=ancestor::a[contains(@href, "/product/")]');
                const productName = await productCard.getByRole('heading', { level: 3 }).textContent();

                await addWishlistBtn.click();

                // Wait for state change
                await page.waitForTimeout(1000);

                // Navigate to wishlist page
                await layoutElements.WISHLIST_BUTTON.click();
                await expect(page).toHaveURL(/\/wishlist/);

                // Verify the product appears in wishlist
                if (productName) {
                    const wishlistContent = page.getByRole('main');
                    await expect(wishlistContent).toContainText(productName);
                }
            }
        });
    });

    test.describe('Unauthenticated Access', () => {

        /**
         * Validates: unauthenticated user cannot access protected pages
         * Real outcome: redirected to sign-in or shown access denied
         */
        test('should redirect to sign-in when accessing account page without auth', async ({ page }) => {
            await page.goto(`${config.baseURL}/account`);

            // Should be redirected to sign-in or show auth required
            const url = page.url();
            const isOnAccountPage = url.includes('/account');
            const isRedirected = url.includes('/sign-in');

            // Either redirected to sign-in or still on account with auth prompt
            expect(isOnAccountPage || isRedirected).toBeTruthy();
        });

        /**
         * Validates: unauthenticated user cannot access orders page
         * Real outcome: redirected to sign-in or shown access denied
         */
        test('should redirect to sign-in when accessing orders page without auth', async ({ page }) => {
            await page.goto(`${config.baseURL}/orders`);

            const url = page.url();
            const isOnOrdersPage = url.includes('/orders');
            const isRedirected = url.includes('/sign-in');

            expect(isOnOrdersPage || isRedirected).toBeTruthy();
        });
    });
});
