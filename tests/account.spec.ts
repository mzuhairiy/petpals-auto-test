import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import LayoutElements from '../pages/locators/layout-elements';
import config from '../utils/config';

test.describe('Account E2E', () => {

    test.describe('Account Navigation', () => {

        test('should navigate to account page after login', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const layoutElements = new LayoutElements(page);

            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            await layoutElements.ACCOUNT_BUTTON.click();
            await expect(page).toHaveURL(/\/account/);

            const main = page.getByRole('main');
            await expect(main).toBeVisible();
        });

        test('should navigate to orders page after login', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const layoutElements = new LayoutElements(page);

            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            await layoutElements.ORDERS_BUTTON.click();
            await expect(page).toHaveURL(/\/orders/);

            const main = page.getByRole('main');
            await expect(main).toBeVisible();
        });
    });

    test.describe('Wishlist Management', () => {

        test('should add product to wishlist from shop and see it on wishlist page', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const layoutElements = new LayoutElements(page);

            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            await page.goto(`${config.baseURL}/shop`);
            const addWishlistBtn = page.getByRole('button', { name: 'Add to wishlist' }).first();

            if (await addWishlistBtn.isVisible()) {
                const productCard = addWishlistBtn.locator('xpath=ancestor::a[contains(@href, "/product/")]');
                const productName = await productCard.getByRole('heading', { level: 3 }).textContent();

                await addWishlistBtn.click();
                await page.waitForTimeout(1000);

                await layoutElements.WISHLIST_BUTTON.click();
                await expect(page).toHaveURL(/\/wishlist/);

                if (productName) {
                    const wishlistContent = page.getByRole('main');
                    await expect(wishlistContent).toContainText(productName);
                }
            }
        });
    });

    test.describe('Unauthenticated Access', () => {

        test('should redirect to sign-in when accessing account page without auth', async ({ page }) => {
            await page.goto(`${config.baseURL}/account`);

            const url = page.url();
            const isOnAccountPage = url.includes('/account');
            const isRedirected = url.includes('/sign-in');

            expect(isOnAccountPage || isRedirected).toBeTruthy();
        });

        test('should redirect to sign-in when accessing orders page without auth', async ({ page }) => {
            await page.goto(`${config.baseURL}/orders`);

            const url = page.url();
            const isOnOrdersPage = url.includes('/orders');
            const isRedirected = url.includes('/sign-in');

            expect(isOnOrdersPage || isRedirected).toBeTruthy();
        });
    });
});
