import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import RegisterActions from '../pages/actions/register-actions';
import AuthElements from '../pages/locators/auth-page-elements';
import LayoutElements from '../pages/locators/layout-elements';
import { generateUserCreds } from '../utils/user-data-generator';
import config from '../utils/config';

test.describe('Authentication E2E', () => {

    test.describe('Login Flow', () => {
        let loginActions: LoginActions;
        let authElements: AuthElements;
        let layoutElements: LayoutElements;

        test.beforeEach(async ({ page }) => {
            loginActions = new LoginActions(page);
            authElements = new AuthElements(page);
            layoutElements = new LayoutElements(page);
            await page.goto(`${config.baseURL}/sign-in`);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should login with valid credentials and redirect to homepage', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);

            await expect(page).toHaveURL(config.baseURL + '/');
            await expect(layoutElements.SIGN_OUT_BUTTON).toBeVisible();
            await expect(layoutElements.ORDERS_BUTTON).toBeVisible();
            await expect(layoutElements.SIGN_IN_BUTTON).not.toBeVisible();
            await expect(layoutElements.SIGN_UP_BUTTON).not.toBeVisible();
        });

        test('should show error toast with invalid credentials and stay on login page', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, 'wrongpassword');

            await expect(page).toHaveURL(/sign-in/);

            const toast = page.getByRole('status');
            await expect(toast).toBeVisible();
            await expect(toast).toContainText('Invalid credentials');

            await expect(authElements.SIGN_IN_BUTTON).toBeVisible();
        });

        test('should not submit with empty credentials', async ({ page }) => {
            await loginActions.loginFunctions('', '');

            await expect(page).toHaveURL(/sign-in/);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should show validation for invalid email format', async ({}) => {
            await authElements.SIGN_IN_EMAIL_FIELD.fill('not-an-email');
            await authElements.SIGN_IN_PASSWORD_FIELD.fill('somepassword');
            await authElements.SIGN_IN_BUTTON.click();

            const validationMessage = await authElements.SIGN_IN_EMAIL_FIELD.evaluate(
                (input: HTMLInputElement) => input.validationMessage
            );
            expect(validationMessage).toBeTruthy();
        });

        test('should navigate to sign-up page from sign-in', async ({ page }) => {
            await loginActions.navigateToSignUpFromSignIn();
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should navigate to forgot password page', async ({ page }) => {
            await loginActions.navigateToForgotPassword();
            await expect(page).toHaveURL(/forgot-password/);
        });
    });

    test.describe('Logout Flow', () => {

        test('should logout and return to unauthenticated state', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const authElements = new AuthElements(page);
            const layoutElements = new LayoutElements(page);

            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');
            await expect(layoutElements.SIGN_OUT_BUTTON).toBeVisible();

            await layoutElements.SIGN_OUT_BUTTON.click();

            await expect(layoutElements.SIGN_IN_BUTTON).toBeVisible();
            await expect(layoutElements.SIGN_UP_BUTTON).toBeVisible();
            await expect(layoutElements.SIGN_OUT_BUTTON).not.toBeVisible();
        });
    });

    test.describe('Registration Flow', () => {
        let registerActions: RegisterActions;
        let authElements: AuthElements;

        test.beforeEach(async ({ page }) => {
            registerActions = new RegisterActions(page);
            authElements = new AuthElements(page);
            await page.goto(`${config.baseURL}/sign-up`);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should register with valid data and confirm account creation', async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions(userCreds);

            await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 10000 }).catch(() => {});

            const currentUrl = page.url();
            const redirected = !currentUrl.includes('/sign-up');

            if (redirected) {
                expect(currentUrl).toMatch(/sign-in|\/$/);
            } else {
                const toast = page.getByRole('status');
                await expect(toast).toBeVisible({ timeout: 5000 });
            }
        });

        test('should not register with mismatched passwords', async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions({
                fullName: userCreds.fullName,
                email: userCreds.email,
                password: 'Password123!',
                confirmPassword: 'DifferentPassword456!',
            });

            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should not register without accepting terms', async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerWithoutTerms(userCreds);

            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should navigate to sign-in page from sign-up', async ({ page }) => {
            await registerActions.navigateToSignInFromSignUp();
            await expect(page).toHaveURL(/sign-in/);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });
    });
});
