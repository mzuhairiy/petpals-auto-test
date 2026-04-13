import { test, expect } from './fixtures/testFixtures';
import { generateUserCreds } from '../src/helpers/TestDataGenerator';
import config from '../src/config/environment';

test.describe('Authentication E2E', () => {

    test.beforeEach(async ({ page, homeElements }) => {
        await page.goto(config.baseUrl);
        await expect(homeElements.SIGN_IN_BUTTON).toBeVisible();
    });

    test.describe('Login Flow', () => {
        test('should login with valid credentials @smoke @auth', async ({ loginActions, toast, layoutElements }) => {
            await loginActions.loginFunctions(config.profiles.validUser.email, config.profiles.validUser.password);
            await toast.assertSignInSuccess();
            await expect(layoutElements.SIGN_OUT_BUTTON).toBeVisible();
        });

        test('should show error toast with invalid credentials @auth', async ({ page, loginActions, toast }) => {
            await loginActions.loginFunctions(config.profiles.validUser.email, 'wrongpassword');
            await expect(page).toHaveURL(/sign-in/);
            await toast.assertSignInFailed();
        });

        test('should not submit with empty credentials @auth', async ({ page, loginActions, authElements }) => {
            await loginActions.loginFunctions('', '');
            await expect(page).toHaveURL(/sign-in/);
            await expect(authElements.SIGN_IN_EMAIL_ERROR).toBeVisible();
            await expect(authElements.SIGN_IN_PASSWORD_ERROR).toBeVisible();
        });

        test('should show validation for invalid email format @auth', async ({ homeElements, authElements }) => {
            await homeElements.SIGN_IN_BUTTON.click();
            await authElements.SIGN_IN_EMAIL_FIELD.fill('not-an-email');
            await authElements.SIGN_IN_PASSWORD_FIELD.fill('somepassword');
            await authElements.SIGN_IN_BUTTON.click();
            await expect(authElements.SIGN_IN_EMAIL_ERROR).toBeVisible();
        });

        test('should show error toast with unregistered email @auth', async ({ homeElements, authElements, toast }) => {
            await homeElements.SIGN_IN_BUTTON.click();
            await authElements.SIGN_IN_EMAIL_FIELD.fill('unregistered@example.com');
            await authElements.SIGN_IN_PASSWORD_FIELD.fill('somepassword');
            await authElements.SIGN_IN_BUTTON.click();
            await toast.assertInvalidCredentials();
        });

        test('should navigate to sign-up page from sign-in @smoke @auth @navigation', async ({ page, loginActions, authElements }) => {
            await loginActions.navigateToSignUpFromSignIn();
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should navigate to forgot password page @auth @navigation', async ({ page, loginActions, authElements }) => {
            await loginActions.navigateToForgotPassword();
            await expect(page).toHaveURL(/forgot-password/);
            await expect(authElements.FORGOT_PASSWORD_HEADING).toBeVisible();
        });
    });

    test.describe('Logout Flow', () => {
        test('should logout and return to unauthenticated state @smoke @auth', async ({ loginActions, toast, authElements, layoutElements }) => {
            await loginActions.loginFunctions(config.profiles.validUser.email, config.profiles.validUser.password);
            await toast.assertSignInSuccess();
            await expect(layoutElements.SIGN_OUT_BUTTON).toBeVisible();
            await layoutElements.SIGN_OUT_BUTTON.click();
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
            await expect(layoutElements.SIGN_UP_BUTTON).toBeVisible();
            await expect(layoutElements.SIGN_OUT_BUTTON).not.toBeVisible();
        });
    });

    test.describe('Registration Flow', () => {

        test.beforeEach(async ({ homeElements, authElements }) => {
            await expect(homeElements.SIGN_UP_BUTTON).toBeVisible();
            await homeElements.SIGN_UP_BUTTON.click();
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should register with valid data @smoke @auth', async ({ page, registerActions, toast }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions(userCreds);
            await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 10000 }).catch(() => {});
            const currentUrl = page.url();
            const redirected = !currentUrl.includes('/sign-up');

            if (redirected) {
                expect(currentUrl).toMatch(/sign-in|\/$/);
            } else {
                await toast.assertSignUpSuccess();
            }
        });

        test('should not register with mismatched passwords @auth', async ({ registerActions, authElements }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions({
                fullName: userCreds.fullName,
                email: userCreds.email,
                password: 'Password123!',
                confirmPassword: 'DifferentPassword456!',
            });

            await expect(authElements.CONFIRM_PASSWORD_ERROR).toBeVisible();
        });

        test('should not register without accepting terms @auth', async ({ page, registerActions, authElements }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerWithoutTerms(userCreds);
            await expect(page).toHaveURL(/sign-up/);
            await expect(authElements.SIGN_UP_TERMS_ERROR).toBeVisible();
        });

        test('should navigate to sign-in page from sign-up @auth @navigation', async ({ page, registerActions, authElements }) => {
            await registerActions.navigateToSignInFromSignUp();
            await expect(page).toHaveURL(/sign-in/);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should not register with empty email @auth', async ({ page, registerActions, authElements }) => {
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

        test('should not register with registered email format @auth', async ({ page, registerActions, toast }) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions({
                fullName: userCreds.fullName,
                email: 'garaga@petpals.co',
                password: userCreds.password,
                confirmPassword: userCreds.password,
            });
            await expect(page).toHaveURL(/sign-up/);
            await toast.assertEmailRegistered();
        });
    });
});
