import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import LayoutElements from '../pages/locators/layout-elements';
import config from '../utils/config';

test.describe('Product E2E', () => {

    test.describe('Product Detail Page', () => {

        test('should load product detail page with interactive elements', async ({ page }) => {
            await page.goto(`${config.baseURL}/product/cat-water-fountain`);

            const main = page.getByRole('main');
            const title = main.getByRole('heading', { level: 1 });
            await expect(title).toBeVisible();
            await expect(title).not.toHaveText('');

            await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible();
            await expect(main.getByText(/Rp\s[\d.]+/)).toBeVisible();
        });

        test('should increase product quantity using controls', async ({ page }) => {
            await page.goto(`${config.baseURL}/product/cat-water-fountain`);

            const quantityInput = page.getByRole('spinbutton');
            await expect(quantityInput).toHaveValue('1');

            const increaseBtn = page.getByRole('button', { name: '+' }).or(
                page.locator('button:has-text("+")')
            );
            if (await increaseBtn.isVisible()) {
                await increaseBtn.click();
                await expect(quantityInput).toHaveValue('2');
            }
        });

        test('should switch between product tabs', async ({ page }) => {
            await page.goto(`${config.baseURL}/product/cat-water-fountain`);

            const reviewsTab = page.getByRole('tab', { name: /Reviews/i }).or(
                page.getByRole('button', { name: /Reviews/i })
            );
            if (await reviewsTab.isVisible()) {
                await reviewsTab.click();
                await page.waitForTimeout(500);
            }

            const descriptionTab = page.getByRole('tab', { name: /Description/i }).or(
                page.getByRole('button', { name: /Description/i })
            );
            if (await descriptionTab.isVisible()) {
                await descriptionTab.click();
            }
        });

        test('should navigate to related product when clicked', async ({ page }) => {
            await page.goto(`${config.baseURL}/product/cat-water-fountain`);

            const originalUrl = page.url();

            const relatedProducts = page.locator('a[href^="/product/"]').filter({
                has: page.getByRole('heading', { level: 3 })
            });

            const relatedCount = await relatedProducts.count();
            if (relatedCount > 0) {
                await relatedProducts.first().click();

                await expect(page).toHaveURL(/\/product\//);
                const newUrl = page.url();
                expect(newUrl).not.toBe(originalUrl);

                const newTitle = page.getByRole('main').getByRole('heading', { level: 1 });
                await expect(newTitle).toBeVisible();
            }
        });
    });

    test.describe('Wishlist Operations', () => {

        test('should add product to wishlist and verify button state changes', async ({ page }) => {
            const loginActions = new LoginActions(page);
            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            await page.goto(`${config.baseURL}/shop`);

            const addWishlistBtn = page.getByRole('button', { name: 'Add to wishlist' }).first();
            if (await addWishlistBtn.isVisible()) {
                await addWishlistBtn.click();

                const toast = page.getByRole('status');
                const removeBtn = page.getByRole('button', { name: 'Remove from wishlist' });

                const hasToast = await toast.isVisible().catch(() => false);
                const hasRemoveBtn = await removeBtn.first().isVisible().catch(() => false);
                expect(hasToast || hasRemoveBtn).toBeTruthy();
            }
        });

        test('should show wishlisted products on wishlist page', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const layoutElements = new LayoutElements(page);
            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            await layoutElements.WISHLIST_BUTTON.click();
            await expect(page).toHaveURL(/\/wishlist/);

            const main = page.getByRole('main');
            await expect(main).toBeVisible();
        });
    });
});
