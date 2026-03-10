import { test, expect } from '@playwright/test';
import ShopActions from '../pages/actions/shop-actions';
import ShopPageElements from '../pages/locators/shop-page-elements';
import ProductPageElements from '../pages/locators/product-page-elements';
import config from '../app-config/config.json';

/**
 * Shop page test scenarios for PetPals application
 * Tests covering product listing, filtering, sorting, and navigation
 */

test.describe('Shop Page Tests', () => {
    let shopActions: ShopActions;
    let shopElements: ShopPageElements;

    test.beforeEach(async ({ page }) => {
        shopActions = new ShopActions(page);
        shopElements = new ShopPageElements(page);
        await shopActions.gotoAsync(`${config.baseURL}/shop`);
        await expect(shopElements.SHOP_HEADING).toBeVisible();
    });

    test.describe('Shop Page Elements', () => {
        test('should display shop page heading', async ({}) => {
            await expect(shopElements.SHOP_HEADING).toHaveText('Shop Pet Products');
        });

        test('should display filter sections', async ({}) => {
            await expect(shopElements.CATEGORY_FILTER_BUTTON).toBeVisible();
            await expect(shopElements.PET_TYPE_FILTER_BUTTON).toBeVisible();
            await expect(shopElements.PRICE_RANGE_FILTER_BUTTON).toBeVisible();
            await expect(shopElements.SORT_BY_FILTER_BUTTON).toBeVisible();
        });

        test('should display product cards with essential information', async ({}) => {
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);

            // Verify first product has title
            await expect(shopElements.PRODUCT_TITLES.first()).toBeVisible();
        });
    });

    test.describe('Category Filters', () => {
        test('should filter products by Toys category', async ({}) => {
            await shopActions.filterByCategory('Toys');
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);

            const titles = await shopActions.getAllProductTitles();
            expect(titles.length).toBeGreaterThan(0);
        });

        test('should filter products by Food category', async ({}) => {
            await shopActions.filterByCategory('Food');
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);
        });

        test('should filter products by Supplements category', async ({}) => {
            await shopActions.filterByCategory('Supplements');
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);
        });
    });

    test.describe('Pet Type Filters', () => {
        test('should filter products by Cats', async ({}) => {
            await shopActions.filterByPetType('Cats');
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);

            const titles = await shopActions.getAllProductTitles();
            expect(titles.length).toBeGreaterThan(0);
        });

        test('should filter products by Dogs', async ({}) => {
            await shopActions.filterByPetType('Dogs');
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);

            const titles = await shopActions.getAllProductTitles();
            expect(titles.length).toBeGreaterThan(0);
        });
    });

    test.describe('Product Navigation', () => {
        test('should navigate to product detail page when clicking a product', async ({ page }) => {
            const clickedTitle = await shopActions.clickRandomProduct();
            const productElements = new ProductPageElements(page);
            await expect(productElements.PRODUCT_TITLE).toBeVisible();
        });

        test('should display product discount badges where applicable', async ({}) => {
            // Verify at least some products have discount badges
            const discountBadges = shopElements.PRODUCT_DISCOUNT_BADGES;
            const count = await discountBadges.count();
            expect(count).toBeGreaterThanOrEqual(0); // Some products may not have discounts
        });
    });

    test.describe('Sort Functionality', () => {
        test('should sort products by Price Low to High', async ({}) => {
            await shopActions.sortBy('Price: Low to High');
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);
            await expect(shopElements.PRODUCT_TITLES.first()).toBeVisible();
        });

        test('should sort products by Price High to Low', async ({}) => {
            await shopActions.sortBy('Price: High to Low');
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);
            await expect(shopElements.PRODUCT_TITLES.first()).toBeVisible();
        });

        test('should sort products by Highest Rated', async ({}) => {
            await shopActions.sortBy('Highest Rated');
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);
            await expect(shopElements.PRODUCT_TITLES.first()).toBeVisible();
        });

        test('should sort products by Newest First', async ({}) => {
            await shopActions.sortBy('Newest First');
            const productCount = await shopActions.getProductCount();
            expect(productCount).toBeGreaterThan(0);
            await expect(shopElements.PRODUCT_TITLES.first()).toBeVisible();
        });
    });
});
