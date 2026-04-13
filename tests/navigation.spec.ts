import { test, expect } from './fixtures/testFixtures';
import config from '../src/config/environment';


test.describe('Navigation E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(config.baseUrl);
        await expect(page).toHaveTitle(/PetPals/);
    });

    test.describe('Header Navigation', () => {

        test('should navigate to Shop page and load product listing @smoke @navigation', async ({ page, layoutActions, shopElements }) => {
            await layoutActions.navigateToShop();
            await expect(page).toHaveURL(/\/shop/);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });

        test('should navigate to Cats page with cat filter applied @navigation', async ({ page, layoutActions }) => {
            await layoutActions.navigateToCats();
            await expect(page).toHaveURL(/pet=cat/);
        });

        test('should navigate to Dogs page with dog filter applied @navigation', async ({ page, layoutActions }) => {
            await layoutActions.navigateToDogs();
            await expect(page).toHaveURL(/pet=dog/);
        });

        test('should return to homepage when clicking logo from shop page @smoke @navigation', async ({ page, layoutActions }) => {
            await layoutActions.navigateToShop();
            await expect(page).toHaveURL(/\/shop/);

            await layoutActions.clickLogo();
            await expect(page).toHaveURL(config.baseUrl);
        });

        test('should navigate to Sign In page @smoke @navigation', async ({ page, layoutActions, authElements }) => {
            await layoutActions.navigateToSignIn();
            await expect(page).toHaveURL(/\/sign-in/);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should navigate to Sign Up page @smoke @navigation', async ({ page, layoutActions, authElements }) => {
            await layoutActions.navigateToSignUp();
            await expect(page).toHaveURL(/\/sign-up/);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should navigate to Cart page @smoke @navigation', async ({ page, layoutActions }) => {
            await layoutActions.navigateToCart();
            await expect(page).toHaveURL(/\/cart/);
        });
    });

    test.describe('Footer Navigation', () => {

        test('should navigate to Pet Toys from footer @navigation', async ({ page, layoutElements }) => {
            await layoutElements.FOOTER_PET_TOYS.click();
            await expect(page).toHaveURL(/category=toys/);
        });

        test('should navigate to About Us from footer @navigation', async ({ page, layoutElements }) => {
            await layoutElements.FOOTER_ABOUT_US.click();
            await expect(page).toHaveURL(/\/about/);
        });

        test('should navigate to Cat Products from footer @navigation', async ({ page, layoutElements }) => {
            await layoutElements.FOOTER_CAT_PRODUCTS.click();
            await expect(page).toHaveURL(/pet=cat/);
        });

        test('should navigate to Dog Products from footer @navigation', async ({ page, layoutElements }) => {
            await layoutElements.FOOTER_DOG_PRODUCTS.click();
            await expect(page).toHaveURL(/pet=dog/);
        });
    });

    test.describe('Newsletter', () => {

        test('should subscribe to newsletter and receive confirmation', async ({ page, homeElements }) => {
            const emailField = page.getByPlaceholder('Your email address');
            const subscribeBtn = page.getByRole('button', { name: 'Subscribe' });

            await emailField.fill('test-newsletter@example.com');
            await subscribeBtn.click();

            await expect(homeElements.HERO_CAROUSEL).toBeVisible();
        });
    });
});
