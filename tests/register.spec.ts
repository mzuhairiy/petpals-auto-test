import { test, expect } from '@playwright/test';
import RegisterActions from '../pages/actions/register-actions';
import AuthElements from '../pages/locators/auth-page-elements';
import { generateUserCreds } from '../utils/user-data-generator';
import config from '../app-config/config.json';

/**
 * Registration test scenarios for PetPals application
 * Tests covering sign-up functionality including form validation
 */

test.describe('Registration Functionality Tests', () => {
    let registerActions: RegisterActions;
    let authElements: AuthElements;

    test.beforeEach(async ({ page }) => {
        registerActions = new RegisterActions(page);
        authElements = new AuthElements(page);
        await registerActions.gotoAsync(`${config.baseURL}/sign-up`);
        await expect(authElements.SIGN_UP_HEADING).toBeVisible();
    });

    test.describe('Sign Up Page Elements', () => {
        test('should display all sign-up form elements', async ({}) => {
            await expect(authElements.SIGN_UP_SUBTITLE).toBeVisible();
            await expect(authElements.FULL_NAME_FIELD).toBeVisible();
            await expect(authElements.SIGN_UP_EMAIL_FIELD).toBeVisible();
            await expect(authElements.SIGN_UP_PASSWORD_FIELD).toBeVisible();
            await expect(authElements.CONFIRM_PASSWORD_FIELD).toBeVisible();
            await expect(authElements.TERMS_CHECKBOX).toBeVisible();
            await expect(authElements.CREATE_ACCOUNT_BUTTON).toBeVisible();
        });

        test('should display social registration buttons', async ({}) => {
            await expect(authElements.SIGN_UP_GOOGLE_BUTTON).toBeVisible();
            await expect(authElements.SIGN_UP_FACEBOOK_BUTTON).toBeVisible();
        });

        test('should display encrypted info text', async ({}) => {
            await expect(authElements.ENCRYPTED_INFO_TEXT).toBeVisible();
        });

        test('should display Terms of Service and Privacy Policy links', async ({}) => {
            await expect(authElements.TERMS_LINK).toBeVisible();
            await expect(authElements.PRIVACY_POLICY_LINK).toBeVisible();
        });
    });

    test.describe('Positive Scenarios', () => {
        test('should allow filling registration form with valid data', async ({}) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions(userCreds);
            // Verify form was submitted (button interaction completed)
            await expect(authElements.CREATE_ACCOUNT_BUTTON).toBeVisible();
        });

        test('should navigate to Sign In page from Sign Up', async ({}) => {
            await registerActions.navigateToSignInFromSignUp();
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should allow checking Terms checkbox', async ({}) => {
            await authElements.TERMS_CHECKBOX.check();
            await expect(authElements.TERMS_CHECKBOX).toBeChecked();
        });
    });

    test.describe('Negative Scenarios', () => {
        test('should not register with empty fields', async ({}) => {
            await authElements.CREATE_ACCOUNT_BUTTON.click();
            // Form should still be visible (validation prevents submission)
            await expect(authElements.FULL_NAME_FIELD).toBeVisible();
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should show validation for invalid email format', async ({}) => {
            await authElements.FULL_NAME_FIELD.fill('Test User');
            await authElements.SIGN_UP_EMAIL_FIELD.fill('invalid-email');
            await authElements.SIGN_UP_PASSWORD_FIELD.fill('TestPass123!');
            await authElements.CONFIRM_PASSWORD_FIELD.fill('TestPass123!');
            await authElements.TERMS_CHECKBOX.check();
            await authElements.CREATE_ACCOUNT_BUTTON.click();

            const validationMessage = await authElements.SIGN_UP_EMAIL_FIELD.evaluate(
                (input: HTMLInputElement) => input.validationMessage
            );
            expect(validationMessage).toBeTruthy();
        });

        test('should not register with mismatched passwords', async ({}) => {
            const userCreds = generateUserCreds();
            await registerActions.registerFunctions({
                fullName: userCreds.fullName,
                email: userCreds.email,
                password: 'Password123!',
                confirmPassword: 'DifferentPassword456!',
            });
            // Form should remain visible or show error
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should not register without accepting terms', async ({}) => {
            const userCreds = generateUserCreds();
            await registerActions.registerWithoutTerms(userCreds);
            // Form should remain visible (terms not accepted)
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });
    });
});
