import { test, expect } from './fixtures/testFixtures';
import config from '../src/config/environment';
import { navigateToRandomProductDetailViaShop, addRandomProductToCartFromHomepage } from '../src/helpers/ProductHelper';

test.describe('Shopping E2E', () => {

    test.beforeEach(async ({ page, homeElements }) => {
        await page.goto(config.baseUrl);
        await expect(homeElements.SIGN_IN_BUTTON).toBeVisible();
    });

    test.describe('Product Browsing & Filtering', () => {

        test.beforeEach(async ({ layoutElements, shopElements }) => {
            await layoutElements.NAV_SHOP.click();
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });

        test('should display all products on shop page @smoke @shop', async ({ shopActions }) => {
            const count = await shopActions.getProductCount();
            expect(count, 'Shop page should have at least one product').toBeGreaterThan(0);
        });

        test('should filter products by Toys category and update URL @shop', async ({ page, shopActions }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByCategory('Toys');

            await expect(page).toHaveURL(/category=toys/);
            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should filter products by Food category and update URL @shop', async ({ page, shopActions }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByCategory('Food');

            await expect(page).toHaveURL(/category=food/);
            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should filter products by Supplements category and update URL @shop', async ({ page, shopActions }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByCategory('Supplements');

            await expect(page).toHaveURL(/category=supplements/);
            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should filter products by Cats pet type @shop', async ({ page, shopActions }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByPetType('Cats');

            await expect(page).toHaveURL(/pet=cat/);
            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should filter products by Dogs pet type @shop', async ({ page, shopActions }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByPetType('Dogs');

            await expect(page).toHaveURL(/pet=dog/);
            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should sort products by highest rated @shop', async ({ shopActions }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.sortBy('Highest Rated');

            const count = await shopActions.getProductCount();
            expect(count, 'Sorting should not change product count').toBe(initialCount);
        });

        test('should sort products by newest first @shop', async ({ shopActions }) => {
            const initialCount = await shopActions.getProductCount();

            await shopActions.sortBy('Newest First');

            const count = await shopActions.getProductCount();
            expect(count, 'Sorting should not change product count').toBe(initialCount);
        });

        test('should filter products by price range @shop', async ({ page, shopActions }) => {
            const initialCount = await shopActions.getProductCount();

            const minPrice = 50000;
            const maxPrice = 200000;
            await shopActions.filterByPriceRange(minPrice, maxPrice);

            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount, 'Price range filter should return results').toBeGreaterThan(0);
            expect(filteredCount, 'Price range filter should narrow results').toBeLessThanOrEqual(initialCount);

            const prices = await shopActions.getAllProductPrices();
            for (const price of prices) {
                expect(price, `Price ${price} should be >= ${minPrice}`).toBeGreaterThanOrEqual(minPrice);
                expect(price, `Price ${price} should be <= ${maxPrice}`).toBeLessThanOrEqual(maxPrice);
            }
        });

        test('should combine category and pet type filters @shop', async ({ shopActions }) => {
            await shopActions.filterByCategory('Toys');
            const categoryCount = await shopActions.getProductCount();
            expect(categoryCount, 'Category filter should return results').toBeGreaterThan(0);

            await shopActions.filterByPetType('Cats');
            const combinedCount = await shopActions.getProductCount();
            expect(combinedCount, 'Combined filter should return results').toBeGreaterThan(0);
            expect(combinedCount, 'Combined filter should narrow results further').toBeLessThanOrEqual(categoryCount);
        });

        test('should clear filters and restore all products @shop', async ({ page, shopActions, shopElements }) => {
            await expect(shopElements.PRODUCT_CARDS.first()).toBeVisible();
            const initialCount = await shopActions.getProductCount();

            await shopActions.filterByCategory('Toys');
            const filteredCount = await shopActions.getProductCount();
            expect(filteredCount).toBeGreaterThan(0);
            expect(filteredCount).toBeLessThanOrEqual(initialCount);

            await page.locator('[data-testid="shop-filters-clear-all-btn"]').click();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(1000);

            const restoredCount = await shopActions.getProductCount();
            expect(restoredCount, 'All products should be restored after clearing filters').toBe(initialCount);
        });

        test('should persist filters on page reload @shop', async ({ page, shopActions, shopElements }) => {
            await shopActions.filterByCategory('Toys');
            await expect(page).toHaveURL(/category=toys/);
            const filteredCount = await shopActions.getProductCount();

            await page.reload();
            await expect(shopElements.SHOP_HEADING).toBeVisible();

            await expect(page).toHaveURL(/category=toys/);
            const reloadedCount = await shopActions.getProductCount();
            expect(reloadedCount, 'Product count should be the same after reload').toBe(filteredCount);
        });

        test('should navigate to correct product detail page when clicking a product @smoke @shop @product', async ({ page, shopActions, productElements }) => {
            const clickedProductName = await shopActions.clickFirstProduct();

            await expect(page).toHaveURL(/\/product\//);
            await expect(productElements.PRODUCT_TITLE).toBeVisible();

            const detailTitle = (await productElements.PRODUCT_TITLE.textContent())?.trim();
            expect(
                detailTitle,
                'Product detail title should match the clicked product name'
            ).toBe(clickedProductName.trim());
        });
    });

    test.describe('Cart Operations', () => {

        test('should add product to cart from homepage and verify in cart @smoke @cart', async ({ page, loginActions, homeElements, layoutElements }) => {
            await loginActions.loginFunctions(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homeElements.HERO_CAROUSEL).toBeVisible();

            const { productName } = await addRandomProductToCartFromHomepage({
                page, homeElements, testInfo: test.info(),
            });

            await layoutElements.CART_BUTTON.click();
            await expect(page).toHaveURL(/\/cart/);

            const cartContent = page.getByRole('main');
            await expect(cartContent).not.toContainText('Your cart is empty');
            await expect(cartContent).toContainText(productName);
        });

        test('should add product to cart from product detail page @cart', async ({ page, loginActions, homeElements, layoutElements, shopElements, productElements }) => {
            await loginActions.loginFunctions(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homeElements.HERO_CAROUSEL).toBeVisible();

            await navigateToRandomProductDetailViaShop({
                page,
                layoutElements,
                shopElements,
                productElements,
                testInfo: test.info(),
            });

            await expect(productElements.ADD_TO_CART_BUTTON).toBeVisible();
            await productElements.ADD_TO_CART_BUTTON.click();

            await layoutElements.CART_BUTTON.click();
            await expect(page).toHaveURL(/\/cart/);

            const cartContent = page.getByRole('main');
            await expect(cartContent).not.toContainText('Your cart is empty');
        });
    });

    test.describe('Checkout Flow (Phase 2 Placeholder)', () => {

        // TODO Phase 2: Payment gateway integration test
        test.skip('should complete checkout with valid payment', async () => {});

        // TODO Phase 2: Shipment tracking integration test
        test.skip('should track shipment after order placement', async () => {});
    });
});
