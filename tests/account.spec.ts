import { test, expect } from './fixtures/testFixtures';
import config from '../src/config/environment';

test.describe('Account E2E', () => {

    test.beforeEach(async ({ page, homeElements }) => {
        await page.goto(config.baseUrl);
        await expect(homeElements.SIGN_IN_BUTTON).toBeVisible();
    });

    test.describe('Account Navigation', () => {

        test('should navigate to account page after login @smoke @account @navigation', async ({ page, loginActions, homeElements, layoutElements }) => {
            await loginActions.loginFunctions(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homeElements.HERO_CAROUSEL).toBeVisible();
            await layoutElements.ACCOUNT_BUTTON.click();
            await expect(page).toHaveURL(/\/account/);
            await expect(layoutElements.ACCOUNT_HEADING).toBeVisible();
        });

        test('should navigate to orders page after login @smoke @account @navigation', async ({ page, loginActions, homeElements, layoutElements }) => {
            await loginActions.loginFunctions(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homeElements.HERO_CAROUSEL).toBeVisible();
            await layoutElements.ORDERS_BUTTON.click();
            await expect(page).toHaveURL(/\/orders/);
            await expect(layoutElements.ORDERS_HEADING).toBeVisible();
        });
    });
});
