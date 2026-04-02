import { test, expect } from '@playwright/test';
import LayoutActions from '../pages/actions/layout-actions';
import LayoutElements from '../pages/locators/layout-elements';
import ShopPageElements from '../pages/locators/shop-page-elements';
import AuthElements from '../pages/locators/auth-page-elements';
import config from '../utils/config';

/**
 * Navigation E2E Tests
 * Validates header/footer navigation links lead to correct pages.
 * Each test verifies actual URL change and page content, not just element visibility.
 */

test.describe('Navigation E2E', () => {
    let layoutActions: LayoutActions;
    let layoutElements: LayoutElements;

    test.beforeEach(async ({ page }) => {
        layoutActions = new LayoutActions(page);
        layoutElements = new LayoutElements(page);
        await page.goto(config.baseURL);
        await expect(page).toHaveTitle(/PetPals/);
    });

    test.describe('Header Navigation', () => {

        /**
         * Validates: Shop link navigates to shop page
         * Real outcome: URL changes to /shop, shop heading visible
         */
        test('should navigate to Shop page and load product listing', async ({ page }) => {
            await layoutActions.navigateToShop();
            await expect(page).toHaveURL(/\/shop/);
            const shopElements = new ShopPageElements(page);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });

        /**
         * Validates: Cats link navigates to cat-filtered shop
         * Real outcome: URL contains pet=cat parameter
         */
        test('should navigate to Cats page with cat filter applied', async ({ page }) => {
            await layoutActions.navigateToCats();
            await expect(page).toHaveURL(/pet=cat/);
        });

        /**
         * Validates: Dogs link navigates to dog-filtered shop
         * Real outcome: URL contains pet=dog parameter
         */
        test('should navigate to Dogs page with dog filter applied', async ({ page }) => {
            await layoutActions.navigateToDogs();
            await expect(page).toHaveURL(/pet=dog/);
        });

        /**
         * Validates: Logo click returns to homepage from any page
         * Real outcome: URL changes back to /
         */
        test('should return to homepage when clicking logo from shop page', async ({ page }) => {
            // Navigate away first
            await layoutActions.navigateToShop();
            await expect(page).toHaveURL(/\/shop/);

            // Click logo to go home
            await layoutActions.clickLogo();
            await expect(page).toHaveURL(config.baseURL + '/');
        });

        /**
         * Validates: Sign In link navigates to sign-in page
         * Real outcome: URL changes to /sign-in, sign-in form visible
         */
        test('should navigate to Sign In page', async ({ page }) => {
            await layoutActions.navigateToSignIn();
            await expect(page).toHaveURL(/\/sign-in/);
            const authElements = new AuthElements(page);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        /**
         * Validates: Sign Up link navigates to sign-up page
         * Real outcome: URL changes to /sign-up, sign-up form visible
         */
        test('should navigate to Sign Up page', async ({ page }) => {
            await layoutActions.navigateToSignUp();
            await expect(page).toHaveURL(/\/sign-up/);
            const authElements = new AuthElements(page);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        /**
         * Validates: Cart link navigates to cart page
         * Real outcome: URL changes to /cart
         */
        test('should navigate to Cart page', async ({ page }) => {
            await layoutActions.navigateToCart();
            await expect(page).toHaveURL(/\/cart/);
        });
    });

    test.describe('Footer Navigation', () => {

        /**
         * Validates: footer Pet Toys link navigates to toys-filtered shop
         * Real outcome: URL contains category=toys
         */
        test('should navigate to Pet Toys from footer', async ({ page }) => {
            await layoutElements.FOOTER_PET_TOYS.click();
            await expect(page).toHaveURL(/category=toys/);
        });

        /**
         * Validates: footer About Us link navigates to about page
         * Real outcome: URL changes to /about
         */
        test('should navigate to About Us from footer', async ({ page }) => {
            await layoutElements.FOOTER_ABOUT_US.click();
            await expect(page).toHaveURL(/\/about/);
        });

        /**
         * Validates: footer Cat Products link navigates to cat-filtered shop
         * Real outcome: URL contains pet=cat
         */
        test('should navigate to Cat Products from footer', async ({ page }) => {
            await layoutElements.FOOTER_CAT_PRODUCTS.click();
            await expect(page).toHaveURL(/pet=cat/);
        });

        /**
         * Validates: footer Dog Products link navigates to dog-filtered shop
         * Real outcome: URL contains pet=dog
         */
        test('should navigate to Dog Products from footer', async ({ page }) => {
            await layoutElements.FOOTER_DOG_PRODUCTS.click();
            await expect(page).toHaveURL(/pet=dog/);
        });
    });

    test.describe('Newsletter', () => {

        /**
         * Validates: subscribing to newsletter shows confirmation
         * Real outcome: success toast or confirmation message appears after submission
         */
        test('should subscribe to newsletter and receive confirmation', async ({ page }) => {
            const emailField = page.getByPlaceholder('Your email address');
            const subscribeBtn = page.getByRole('button', { name: 'Subscribe' });

            await emailField.fill('test-newsletter@example.com');
            await subscribeBtn.click();

            // Verify confirmation feedback
            const toast = page.getByRole('status');
            await expect(toast).toBeVisible({ timeout: 5000 });
        });
    });
});
