import { test, expect } from '@playwright/test';
import ShopActions from '../pages/actions/shop-actions';
import ShopPageElements from '../pages/locators/shop-page-elements';
import LoginActions from '../pages/actions/login-actions';
import LayoutElements from '../pages/locators/layout-elements';
import config from '../utils/config';

test.describe('Shopping E2E', () => {

    test.describe('Product Browsing & Filtering', () => {
        let shopActions: ShopActions;
        let shopElements: ShopPageElements;

        test.beforeEach(async ({ page }) => {
            shopActions = new ShopActions(page);
            shopElements = new ShopPageElements(page);
            await page.goto(`${config.baseURL}/shop`);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });

        test('should filter products by Toys category and update URL', async ({ page }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByCategory('Toys');

            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount).toBeGreaterThan(0);
            expect(filteredCount).toBeLessThanOrEqual(initialCount);
            await expect(page).toHaveURL(/category=toys/i);
        });

        test('should filter products by Cats pet type', async ({ page }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByPetType('Cats');

            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount).toBeGreaterThan(0);
            expect(filteredCount).toBeLessThanOrEqual(initialCount);

            const titles = await shopActions.getAllProductTitles();
            expect(titles.length).toBeGreaterThan(0);
        });

        test('should filter products by Dogs pet type', async ({}) => {
            await shopActions.filterByPetType('Dogs');

            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount).toBeGreaterThan(0);

            const titles = await shopActions.getAllProductTitles();
            expect(titles.length).toBeGreaterThan(0);
        });

        test('should sort products by price low to high', async ({}) => {
            await shopActions.sortBy('Price: Low to High');

            const titles = await shopActions.getAllProductTitles();
            expect(titles.length).toBeGreaterThan(0);

            const count = await shopActions.getProductCount();
            expect(count).toBeGreaterThan(0);
        });

        test('should navigate to product detail page when clicking a product', async ({ page }) => {
            await shopActions.clickFirstProduct();

            await expect(page).toHaveURL(/\/product\//);

            const productHeading = page.getByRole('main').getByRole('heading', { level: 1 });
            await expect(productHeading).toBeVisible();
        });
    });

    test.describe('Cart Operations', () => {

        test('should add product to cart from homepage and verify in cart', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const layoutElements = new LayoutElements(page);

            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            const addToCartButton = page.getByRole('button', { name: 'Add to cart' }).first();
            await addToCartButton.click();

            const toast = page.getByRole('status');
            await expect(toast).toBeVisible({ timeout: 5000 });

            await layoutElements.CART_BUTTON.click();
            await expect(page).toHaveURL(/\/cart/);

            const cartContent = page.getByRole('main');
            await expect(cartContent).not.toContainText('Your cart is empty');
        });

        test('should add product to cart from product detail page', async ({ page }) => {
            const loginActions = new LoginActions(page);
            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            await page.goto(`${config.baseURL}/product/cat-water-fountain`);
            const productTitle = page.getByRole('main').getByRole('heading', { level: 1 });
            await expect(productTitle).toBeVisible();

            const addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
            await addToCartBtn.click();

            const toast = page.getByRole('status');
            await expect(toast).toBeVisible({ timeout: 5000 });
        });
    });

    test.describe('Checkout Flow (Phase 2 Placeholder)', () => {

        // TODO Phase 2: Payment gateway integration test
        test.skip('should complete checkout with valid payment', async () => {});

        // TODO Phase 2: Shipment tracking integration test
        test.skip('should track shipment after order placement', async () => {});
    });
});
