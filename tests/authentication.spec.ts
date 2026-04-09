import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import RegisterActions from '../pages/actions/register-actions';
import AuthElements from '../pages/locators/auth-page-elements';
import LayoutElements from '../pages/locators/layout-elements';
import HomeElements from '../pages/locators/home-page-elements';
import { generateUserCreds } from '../utils/user-data-generator';
import config from '../utils/config';

test.describe('Authentication E2E', () => {
        let loginActions: LoginActions;
        let authElements: AuthElements;
        let layoutElements: LayoutElements;
        let homeElements: HomeElements;
        let registerActions: RegisterActions;
        
        test.beforeEach(async ({ page }) => {
            loginActions = new LoginActions(page); 
            authElements = new AuthElements(page);
            layoutElements = new LayoutElements(page);
            homeElements = new HomeElements(page);
            registerActions = new RegisterActions(page);
            await page.goto(config.baseURL);
            await expect(homeElements.SIGN_IN_BUTTON).toBeVisible();
        });

    test.describe('Login Flow', () => {
        test('should login with valid credentials', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(authElements.TOAST_SIGNIN_SUCCESS).toBeVisible({ timeout: 15000 });
            await expect(layoutElements.SIGN_OUT_BUTTON).toBeVisible();
        });

        test('should show error toast with invalid credentials', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, 'wrongpassword');
            await expect(page).toHaveURL(/sign-in/);
            await expect(authElements.TOAST_SIGNIN_FAILED).toBeVisible({ timeout: 15000 });
        });

        test('should not submit with empty credentials', async ({ page }) => {
            await loginActions.loginFunctions('', '');
            await expect(page).toHaveURL(/sign-in/);
            await expect(authElements.SIGN_IN_EMAIL_ERROR).toBeVisible();
            await expect(authElements.SIGN_IN_PASSWORD_ERROR).toBeVisible();
        });

        test('should show validation for invalid email format', async ({}) => {
            await homeElements.SIGN_IN_BUTTON.click();
            await authElements.SIGN_IN_EMAIL_FIELD.fill('not-an-email');
            await authElements.SIGN_IN_PASSWORD_FIELD.fill('somepassword');
            await authElements.SIGN_IN_BUTTON.click();
            await expect(authElements.SIGN_IN_EMAIL_ERROR).toBeVisible();
        });

        test('should show error toast with unregistered email', async ({}) => {
            await homeElements.SIGN_IN_BUTTON.click();
            await authElements.SIGN_IN_EMAIL_FIELD.fill('unregistered@example.com');
            await authElements.SIGN_IN_PASSWORD_FIELD.fill('somepassword');
            await authElements.SIGN_IN_BUTTON.click();
            await expect(authElements.TOAST_INVALID_CREDENTIALS).toBeVisible();
        });

        test('should navigate to sign-up page from sign-in', async ({ page }) => {
            await loginActions.navigateToSignUpFromSignIn();
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should navigate to forgot password page', async ({ page }) => {
            await loginActions.navigateToForgotPassword();
            await expect(page).toHaveURL(/forgot-password/);
            await expect(authElements.FORGOT_PASSWORD_HEADING).toBeVisible();
        });
    });

    test.describe('Logout Flow', () => {
        test('should logout and return to unauthenticated state', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(authElements.TOAST_SIGNIN_SUCCESS).toBeVisible({ timeout: 15000 });
            await expect(layoutElements.SIGN_OUT_BUTTON).toBeVisible();
            await layoutElements.SIGN_OUT_BUTTON.click();
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
            await expect(layoutElements.SIGN_UP_BUTTON).toBeVisible();
            await expect(layoutElements.SIGN_OUT_BUTTON).not.toBeVisible();
        });
    });

    test.describe('Registration Flow', () => {

        test.beforeEach(async ({ page }) => {
            await expect(homeElements.SIGN_UP_BUTTON).toBeVisible();
            await homeElements.SIGN_UP_BUTTON.click();
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should register with valid data', async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions(userCreds);
            await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 10000 }).catch(() => {});
            const currentUrl = page.url();
            const redirected = !currentUrl.includes('/sign-up');

            if (redirected) {
                expect(currentUrl).toMatch(/sign-in|\/$/);
            } else {
                await expect(authElements.TOAST_SIGNUP_SUCCESS).toBeVisible({ timeout: 5000 });
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

            await expect(authElements.CONFIRM_PASSWORD_ERROR).toBeVisible();
        });

        test('should not register without accepting terms', async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerWithoutTerms(userCreds);
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_TERMS_ERROR).toBeVisible();
        });

        test('should navigate to sign-in page from sign-up', async ({ page }) => {
            await registerActions.navigateToSignInFromSignUp();
            await expect(page).toHaveURL(/sign-in/);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should not register with empty email' , async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions({
                fullName: userCreds.fullName,
                email: '',
                password: userCreds.password,
                confirmPassword: userCreds.password,
            });
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_EMAIL_ERROR).toBeVisible();
        });

        test('should not register with registered email format', async ({ page }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions({
                fullName: userCreds.fullName,
                email: 'garaga@petpals.co',
                password: userCreds.password,
                confirmPassword: userCreds.password,
            });
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.TOAST_EMAIL_REGISTERED).toBeVisible();
        });
    });
});
