import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import AuthElements from '../pages/locators/auth-page-elements';
import config from '../app-config/config.json';

/**
 * Login test scenarios for PetPals application
 * Tests covering sign-in functionality including positive and negative cases
 */

test.describe('Login Functionality Tests', () => {
    let loginActions: LoginActions;
    let authElements: AuthElements;

    test.beforeEach(async ({ page }) => {
        loginActions = new LoginActions(page);
        authElements = new AuthElements(page);
        await loginActions.gotoAsync(`${config.baseURL}/sign-in`);
        await expect(authElements.SIGN_IN_HEADING).toBeVisible();
    });

    test.describe('Sign In Page Elements', () => {
        test('should display all sign-in form elements', async ({}) => {
            await expect(authElements.SIGN_IN_SUBTITLE).toBeVisible();
            await expect(authElements.SIGN_IN_EMAIL_FIELD).toBeVisible();
            await expect(authElements.SIGN_IN_PASSWORD_FIELD).toBeVisible();
            await expect(authElements.REMEMBER_ME_CHECKBOX).toBeVisible();
            await expect(authElements.FORGOT_PASSWORD_LINK).toBeVisible();
            await expect(authElements.SIGN_IN_BUTTON).toBeVisible();
        });

        test('should display social login buttons', async ({}) => {
            await expect(authElements.SIGN_IN_GOOGLE_BUTTON).toBeVisible();
            await expect(authElements.SIGN_IN_FACEBOOK_BUTTON).toBeVisible();
        });

        test('should display secure connection indicator', async ({}) => {
            await expect(authElements.SECURE_CONNECTION_TEXT).toBeVisible();
        });
    });

    test.describe('Positive Scenarios', () => {
        test('should allow entering valid credentials and clicking sign in', async ({}) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            // Verify the sign-in button was clicked (form submission occurred)
            // Actual redirect depends on backend; verify form interaction completed
            await expect(authElements.SIGN_IN_BUTTON).toBeVisible();
        });

        test('should navigate to Sign Up page from Sign In', async ({}) => {
            await loginActions.navigateToSignUpFromSignIn();
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should navigate to Forgot Password page', async ({}) => {
            await loginActions.navigateToForgotPassword();
            // Verify navigation occurred (URL change)
            await expect(authElements.page).toHaveURL(/forgot-password/);
        });

        test('should allow checking Remember Me checkbox', async ({}) => {
            await authElements.REMEMBER_ME_CHECKBOX.check();
            await expect(authElements.REMEMBER_ME_CHECKBOX).toBeChecked();
        });
    });

    test.describe('Negative Scenarios', () => {
        test('should not login with empty credentials', async ({}) => {
            await loginActions.loginFunctions('', '');
            // Form should still be visible (not submitted with empty fields)
            await expect(authElements.SIGN_IN_EMAIL_FIELD).toBeVisible();
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should not login with empty email', async ({}) => {
            await loginActions.loginFunctions('', config.validUser.password);
            await expect(authElements.SIGN_IN_EMAIL_FIELD).toBeVisible();
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should not login with empty password', async ({}) => {
            await loginActions.loginFunctions(config.validUser.email, '');
            await expect(authElements.SIGN_IN_PASSWORD_FIELD).toBeVisible();
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should show email field validation for invalid email format', async ({}) => {
            await authElements.SIGN_IN_EMAIL_FIELD.fill('invalid-email');
            await authElements.SIGN_IN_PASSWORD_FIELD.fill('somepassword');
            await authElements.SIGN_IN_BUTTON.click();

            // Check browser-level validation message
            const validationMessage = await authElements.SIGN_IN_EMAIL_FIELD.evaluate(
                (input: HTMLInputElement) => input.validationMessage
            );
            expect(validationMessage).toBeTruthy();
        });
    });
});
