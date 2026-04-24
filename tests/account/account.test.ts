import { test, expect } from '../../fixtures/base.fixture';
import config from '../../config/env.config';
import { URL_PATTERNS } from '../../constants/env.constants';

test.describe('Account E2E', () => {

    test.beforeEach(async ({ page, navbar }) => {
        await page.goto('/');
        await expect(navbar.signInButton).toBeVisible();
    });

    test.describe('Account Navigation', () => {

        test('should navigate to account page after login @smoke @account @navigation', async ({ page, navbar, loginPage, homePage, accountPage }) => {
            await navbar.navigateToSignIn();
            await loginPage.login(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homePage.heroCarousel).toBeVisible();

            await navbar.navigateToAccount();
            await expect(page).toHaveURL(URL_PATTERNS.account);
            await expect(accountPage.accountHeading).toBeVisible();
        });

        test('should navigate to orders page after login @smoke @account @navigation', async ({ page, navbar, loginPage, homePage, accountPage }) => {
            await navbar.navigateToSignIn();
            await loginPage.login(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homePage.heroCarousel).toBeVisible();

            await navbar.navigateToOrders();
            await expect(page).toHaveURL(URL_PATTERNS.orders);
            await expect(accountPage.ordersHeading).toBeVisible();
        });
    });
});
