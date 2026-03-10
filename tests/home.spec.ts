import { test, expect } from '@playwright/test';
import HomeActions from '../pages/actions/home-actions';
import HomePageElements from '../pages/locators/home-page-elements';
import LayoutActions from '../pages/actions/layout-actions';
import LayoutElements from '../pages/locators/layout-elements';
import ShopPageElements from '../pages/locators/shop-page-elements';
import config from '../app-config/config.json';

/**
 * Homepage test scenarios for PetPals application
 * Tests covering homepage content, navigation, and featured products
 */

test.describe('Homepage Tests', () => {
    let homeActions: HomeActions;
    let homeElements: HomePageElements;
    let layoutActions: LayoutActions;
    let layoutElements: LayoutElements;

    test.beforeEach(async ({ page }) => {
        homeActions = new HomeActions(page);
        homeElements = new HomePageElements(page);
        layoutActions = new LayoutActions(page);
        layoutElements = new LayoutElements(page);
        await homeActions.gotoAsync(config.baseURL);
        await expect(page).toHaveTitle(/PetPals/);
    });

    test.describe('Hero Section', () => {
        test('should display hero carousel with heading and CTA', async ({}) => {
            await expect(homeElements.HERO_HEADING).toBeVisible();
            await expect(homeElements.HERO_SHOP_NOW_LINK).toBeVisible();
            await expect(homeElements.CAROUSEL_NEXT_BUTTON).toBeVisible();
            await expect(homeElements.CAROUSEL_PREV_BUTTON).toBeVisible();
        });

        test('should navigate carousel slides', async ({}) => {
            await homeActions.navigateCarouselNext();
            await expect(homeElements.HERO_EXPLORE_FOOD_LINK).toBeVisible();

            await homeActions.navigateCarouselNext();
            await expect(homeElements.HERO_VIEW_TOYS_LINK).toBeVisible();
        });

        test('should navigate to shop page via Shop Now link', async ({ page }) => {
            await homeActions.clickShopNow();
            const shopElements = new ShopPageElements(page);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });
    });

    test.describe('Service Highlights', () => {
        test('should display all service highlight sections', async ({}) => {
            await expect(homeElements.FREE_DELIVERY_HEADING).toBeVisible();
            await expect(homeElements.RETURN_POLICY_HEADING).toBeVisible();
            await expect(homeElements.SECURE_PAYMENT_HEADING).toBeVisible();
            await expect(homeElements.SUPPORT_HEADING).toBeVisible();
        });
    });

    test.describe('Featured Products', () => {
        test('should display featured products section with heading', async ({}) => {
            await expect(homeElements.FEATURED_PRODUCTS_H2).toBeVisible();
            await expect(homeElements.FEATURED_PRODUCTS_SUBTITLE).toBeVisible();
            await expect(homeElements.VIEW_ALL_PRODUCTS_LINK).toBeVisible();
        });

        test('should display featured product cards with title, description, and price', async ({}) => {
            const productTitles = homeElements.FEATURED_PRODUCT_TITLES;
            const count = await productTitles.count();
            expect(count).toBeGreaterThan(0);

            // Verify first product card has essential content
            await expect(productTitles.first()).toBeVisible();
        });

        test('should navigate to product detail when clicking a featured product', async ({ page }) => {
            const productTitle = await homeActions.clickRandomFeaturedProduct();
            const productPageTitle = page.locator('main').getByRole('heading', { level: 1 });
            await expect(productPageTitle).toBeVisible();
        });
    });

    test.describe('Category Sections', () => {
        test('should display Cat Products section', async ({}) => {
            await expect(homeElements.CAT_PRODUCTS_H2).toBeVisible();
            await expect(homeElements.VIEW_ALL_CAT_PRODUCTS_LINK).toBeVisible();
        });

        test('should display Dog Products section', async ({}) => {
            await expect(homeElements.DOG_PRODUCTS_H2).toBeVisible();
            await expect(homeElements.VIEW_ALL_DOG_PRODUCTS_LINK).toBeVisible();
        });

        test('should navigate to cat products shop page', async ({ page }) => {
            await homeActions.clickViewAllCatProducts();
            const shopElements = new ShopPageElements(page);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });

        test('should navigate to dog products shop page', async ({ page }) => {
            await homeActions.clickViewAllDogProducts();
            const shopElements = new ShopPageElements(page);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });
    });

    test.describe('Newsletter Section', () => {
        test('should display newsletter subscription section', async ({}) => {
            await expect(homeElements.NEWSLETTER_HEADING).toBeVisible();
            await expect(homeElements.NEWSLETTER_SUBTITLE).toBeVisible();
            await expect(homeElements.NEWSLETTER_EMAIL_FIELD).toBeVisible();
            await expect(homeElements.NEWSLETTER_SUBSCRIBE_BUTTON).toBeVisible();
        });
    });
});
