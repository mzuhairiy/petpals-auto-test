import { test, expect } from '../../fixtures/base.fixture';
import config from '../../config/env.config';
import testUsers from '../../test-data/users.json';
import { URL_PATTERNS } from '../../constants/env.constants';

test.describe('Navigation E2E', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/PetPals/);
    });

    test.describe('Header Navigation', () => {

        test('should navigate to Shop page and load product listing @smoke @navigation', async ({ page, navbar, shopPage }) => {
            await navbar.navigateToShop();
            await expect(page).toHaveURL(URL_PATTERNS.shop);
            await expect(shopPage.heading).toBeVisible();
        });

        test('should navigate to Cats page with cat filter applied @navigation', async ({ page, navbar }) => {
            await navbar.navigateToCats();
            await expect(page).toHaveURL(URL_PATTERNS.catFilter);
        });

        test('should navigate to Dogs page with dog filter applied @navigation', async ({ page, navbar }) => {
            await navbar.navigateToDogs();
            await expect(page).toHaveURL(URL_PATTERNS.dogFilter);
        });

        test('should return to homepage when clicking logo from shop page @smoke @navigation', async ({ page, navbar }) => {
            await navbar.navigateToShop();
            await expect(page).toHaveURL(URL_PATTERNS.shop);

            await navbar.clickLogo();
            await expect(page).toHaveURL(config.baseUrl);
        });

        test('should navigate to Sign In page @smoke @navigation', async ({ page, navbar, loginPage }) => {
            await navbar.navigateToSignIn();
            await expect(page).toHaveURL(URL_PATTERNS.signIn);
            await expect(loginPage.heading).toBeVisible();
        });

        test('should navigate to Sign Up page @smoke @navigation', async ({ page, navbar, registerPage }) => {
            await navbar.navigateToSignUp();
            await expect(page).toHaveURL(URL_PATTERNS.signUp);
            await expect(registerPage.heading).toBeVisible();
        });

        test('should navigate to Cart page @smoke @navigation', async ({ page, navbar }) => {
            await navbar.navigateToCart();
            await expect(page).toHaveURL(URL_PATTERNS.cart);
        });
    });

    test.describe('Footer Navigation', () => {

        test('should navigate to Pet Toys from footer @navigation', async ({ page, footer }) => {
            await footer.clickPetToys();
            await expect(page).toHaveURL(URL_PATTERNS.categoryToys);
        });

        test('should navigate to About Us from footer @navigation', async ({ page, footer }) => {
            await footer.clickAboutUs();
            await expect(page).toHaveURL(/\/about/);
        });

        test('should navigate to Cat Products from footer @navigation', async ({ page, footer }) => {
            await footer.clickCatProducts();
            await expect(page).toHaveURL(URL_PATTERNS.catFilter);
        });

        test('should navigate to Dog Products from footer @navigation', async ({ page, footer }) => {
            await footer.clickDogProducts();
            await expect(page).toHaveURL(URL_PATTERNS.dogFilter);
        });
    });

    test.describe('Newsletter', () => {

        test('should subscribe to newsletter and receive confirmation', async ({ homePage }) => {
            await homePage.subscribeToNewsletter(testUsers.newsletterTestEmail);
            await expect(homePage.heroCarousel).toBeVisible();
        });
    });
});
