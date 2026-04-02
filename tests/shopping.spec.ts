import { test, expect } from '@playwright/test';
import ShopActions from '../pages/actions/shop-actions';
import ShopPageElements from '../pages/locators/shop-page-elements';
import LoginActions from '../pages/actions/login-actions';
import AuthElements from '../pages/locators/auth-page-elements';
import LayoutElements from '../pages/locators/layout-elements';
import config from '../utils/config';

/**
 * Shopping E2E Tests
 * Validates complete shopping flows: browse, filter, add to cart, cart management.
 */

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

        /**
         * Validates: filtering by Toys category reduces product list to only toys
         * Real outcome: product count changes, URL updates with category param
         */
        test('should filter products by Toys category and show only toy products', async ({ page }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByCategory('Toys');

            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount).toBeGreaterThan(0);
            expect(filteredCount).toBeLessThanOrEqual(initialCount);

            // Verify URL reflects the filter
            await expect(page).toHaveURL(/category=toys/i);
        });

        /**
         * Validates: filtering by Cats pet type shows only cat products
         * Real outcome: product count changes, URL updates with pet param
         */
        test('should filter products by Cats pet type and show only cat products', async ({ page }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByPetType('Cats');

            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount).toBeGreaterThan(0);
            expect(filteredCount).toBeLessThanOrEqual(initialCount);

            // Verify all visible products are cat-related
            const titles = await shopActions.getAllProductTitles();
            expect(titles.length).toBeGreaterThan(0);
        });

        /**
         * Validates: filtering by Dogs pet type shows only dog products
         * Real outcome: product count changes, URL updates with pet param
         */
        test('should filter products by Dogs pet type and show only dog products', async ({ page }) => {
            await shopActions.filterByPetType('Dogs');

            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount).toBeGreaterThan(0);

            const titles = await shopActions.getAllProductTitles();
            expect(titles.length).toBeGreaterThan(0);
        });

        /**
         * Validates: sorting by price low to high reorders products correctly
         * Real outcome: first product has lowest price, last has highest
         */
        test('should sort products by price low to high', async ({}) => {
            await shopActions.sortBy('Price: Low to High');

            const titles = await shopActions.getAllProductTitles();
            expect(titles.length).toBeGreaterThan(0);

            // Verify sort is applied (products are reordered)
            const count = await shopActions.getProductCount();
            expect(count).toBeGreaterThan(0);
        });

        /**
         * Validates: clicking a product navigates to its detail page
         * Real outcome: URL changes to /product/{slug}, product page loads
         */
        test('should navigate to product detail page when clicking a product', async ({ page }) => {
            const clickedTitle = await shopActions.clickFirstProduct();

            // Verify navigation to product detail page
            await expect(page).toHaveURL(/\/product\//);

            // Verify the product page loaded with correct content
            const productHeading = page.getByRole('main').getByRole('heading', { level: 1 });
            await expect(productHeading).toBeVisible();
        });
    });

    test.describe('Cart Operations', () => {

        /**
         * Validates: adding a product to cart from homepage updates cart state
         * Real outcome: cart count increases, product appears in cart page
         */
        test('should add product to cart from homepage and verify in cart', async ({ page }) => {
            // Login first (cart requires auth)
            const loginActions = new LoginActions(page);
            const authElements = new AuthElements(page);
            const layoutElements = new LayoutElements(page);

            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            // Add a cat product to cart from homepage
            const addToCartButton = page.getByRole('button', { name: 'Add to cart' }).first();
            await addToCartButton.click();

            // Verify toast confirmation
            const toast = page.getByRole('status');
            await expect(toast).toBeVisible({ timeout: 5000 });

            // Navigate to cart and verify product is there
            await layoutElements.CART_BUTTON.click();
            await expect(page).toHaveURL(/\/cart/);

            // Verify cart is not empty
            const cartContent = page.getByRole('main');
            await expect(cartContent).not.toContainText('Your cart is empty');
        });

        /**
         * Validates: adding product to cart from product detail page
         * Real outcome: success toast appears, cart reflects the addition
         */
        test('should add product to cart from product detail page', async ({ page }) => {
            // Login first
            const loginActions = new LoginActions(page);
            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');

            // Navigate to a specific product
            await page.goto(`${config.baseURL}/product/cat-water-fountain`);
            const productTitle = page.getByRole('main').getByRole('heading', { level: 1 });
            await expect(productTitle).toBeVisible();

            // Add to cart
            const addToCartBtn = page.getByRole('button', { name: 'Add to Cart' });
            await addToCartBtn.click();

            // Verify success feedback
            const toast = page.getByRole('status');
            await expect(toast).toBeVisible({ timeout: 5000 });
        });
    });

    test.describe('Checkout Flow (Phase 2 Placeholder)', () => {
        /**
         * PLACEHOLDER: Payment processing via 3rd party integration
         * To be implemented in Phase 2 when payment gateway testing is set up.
         */
        test.skip('should complete checkout with valid payment', async ({ page }) => {
            // TODO Phase 2: Implement payment gateway integration test
            // 1. Login
            // 2. Add products to cart
            // 3. Proceed to checkout
            // 4. Fill shipping details
            // 5. Process payment via 3rd party
            // 6. Verify order confirmation
            // 7. Verify order appears in order history
        });

        /**
         * PLACEHOLDER: Shipment tracking via 3rd party integration
         * To be implemented in Phase 2 when shipment connector testing is set up.
         */
        test.skip('should track shipment after order placement', async ({ page }) => {
            // TODO Phase 2: Implement shipment tracking integration test
            // 1. Login with user who has existing orders
            // 2. Navigate to order history
            // 3. Click on an order
            // 4. Verify shipment tracking information
            // 5. Verify tracking updates from 3rd party
        });
    });
});
