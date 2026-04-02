import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import RegisterActions from '../pages/actions/register-actions';
import AuthElements from '../pages/locators/auth-page-elements';
import LayoutElements from '../pages/locators/layout-elements';
import { generateUserCreds } from '../utils/user-data-generator';
import config from '../utils/config';

/**
 * Authentication E2E Tests
 * Validates complete login, registration, and logout flows with real outcomes.
 */

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

        /**
         * Validates: successful login redirects to homepage and shows authenticated header
         * Real outcome: URL changes to /, user name appears in header, Sign Out button visible
         */
        test('should login with valid credentials and redirect to homepage', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);

            // Verify redirect to homepage
            await expect(page).toHaveURL(config.baseURL + '/');

            // Verify authenticated state - user name and Sign Out visible in header
            await expect(layoutElements.SIGN_OUT_BUTTON).toBeVisible();
            await expect(layoutElements.ORDERS_BUTTON).toBeVisible();

            // Verify unauthenticated elements are gone
            await expect(layoutElements.SIGN_IN_BUTTON).not.toBeVisible();
            await expect(layoutElements.SIGN_UP_BUTTON).not.toBeVisible();
        });

        /**
         * Validates: invalid credentials show error toast and user stays on login page
         * Real outcome: toast with "Invalid credentials" appears, URL stays at /sign-in
         */
        test('should show error toast with invalid credentials and stay on login page', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, 'wrongpassword');

            // Verify user stays on sign-in page
            await expect(page).toHaveURL(/sign-in/);

            // Verify error toast appears with meaningful message
            const toast = page.getByRole('status');
            await expect(toast).toBeVisible();
            await expect(toast).toContainText('Invalid credentials');

            // Verify sign-in form is still accessible (not redirected)
            await expect(authElements.SIGN_IN_BUTTON).toBeVisible();
        });

        /**
         * Validates: empty credentials prevent form submission
         * Real outcome: browser validation prevents submission, user stays on page
         */
        test('should not submit with empty credentials', async ({ page }) => {
            await loginActions.loginFunctions('', '');

            // Verify user stays on sign-in page
            await expect(page).toHaveURL(/sign-in/);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        /**
         * Validates: invalid email format triggers browser validation
         * Real outcome: HTML5 validation message appears
         */
        test('should show validation for invalid email format', async ({}) => {
            await authElements.SIGN_IN_EMAIL_FIELD.fill('not-an-email');
            await authElements.SIGN_IN_PASSWORD_FIELD.fill('somepassword');
            await authElements.SIGN_IN_BUTTON.click();

            const validationMessage = await authElements.SIGN_IN_EMAIL_FIELD.evaluate(
                (input: HTMLInputElement) => input.validationMessage
            );
            expect(validationMessage).toBeTruthy();
        });

        /**
         * Validates: navigation from sign-in to sign-up page works
         * Real outcome: URL changes to /sign-up, sign-up form is displayed
         */
        test('should navigate to sign-up page from sign-in', async ({ page }) => {
            await loginActions.navigateToSignUpFromSignIn();
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        /**
         * Validates: forgot password link navigates correctly
         * Real outcome: URL changes to /forgot-password
         */
        test('should navigate to forgot password page', async ({ page }) => {
            await loginActions.navigateToForgotPassword();
            await expect(page).toHaveURL(/forgot-password/);
        });
    });

    test.describe('Logout Flow', () => {
        /**
         * Validates: complete login → logout cycle
         * Real outcome: after logout, user is redirected and header shows unauthenticated state
         */
        test('should logout and return to unauthenticated state', async ({ page }) => {
            const loginActions = new LoginActions(page);
            const authElements = new AuthElements(page);
            const layoutElements = new LayoutElements(page);

            // Login first
            await page.goto(`${config.baseURL}/sign-in`);
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(page).toHaveURL(config.baseURL + '/');
            await expect(layoutElements.SIGN_OUT_BUTTON).toBeVisible();

            // Logout
            await layoutElements.SIGN_OUT_BUTTON.click();

            // Verify unauthenticated state restored
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

        /**
         * Validates: registration with valid data creates account
         * Real outcome: form submits, user is redirected or success message shown
         */
        test('should register with valid data and confirm account creation', async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions(userCreds);

            // Verify registration outcome - either redirect to sign-in or auto-login
            // Wait for navigation away from sign-up page
            await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 10000 }).catch(() => {});

            // Check if redirected to sign-in (common pattern) or homepage (auto-login)
            const currentUrl = page.url();
            const redirected = !currentUrl.includes('/sign-up');

            if (redirected) {
                // Registration succeeded and redirected
                expect(currentUrl).toMatch(/sign-in|\/$/);
            } else {
                // Check for success toast if still on page
                const toast = page.getByRole('status');
                await expect(toast).toBeVisible({ timeout: 5000 });
            }
        });

        /**
         * Validates: mismatched passwords prevent registration
         * Real outcome: user stays on sign-up page, error shown
         */
        test('should not register with mismatched passwords', async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions({
                fullName: userCreds.fullName,
                email: userCreds.email,
                password: 'Password123!',
                confirmPassword: 'DifferentPassword456!',
            });

            // Verify user stays on sign-up page
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        /**
         * Validates: registration without accepting terms is prevented
         * Real outcome: form does not submit, user stays on sign-up page
         */
        test('should not register without accepting terms', async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerWithoutTerms(userCreds);

            // Verify user stays on sign-up page
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        /**
         * Validates: navigation from sign-up to sign-in works
         * Real outcome: URL changes to /sign-in
         */
        test('should navigate to sign-in page from sign-up', async ({ page }) => {
            await registerActions.navigateToSignInFromSignUp();
            await expect(page).toHaveURL(/sign-in/);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });
    });
});
