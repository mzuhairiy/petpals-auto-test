import { test, expect } from '../../fixtures/base.fixture';
import config from '../../config/env.config';
import testUsers from '../../test-data/users.json';
import { URL_PATTERNS } from '../../constants/env.constants';

test.describe('Login Flow', () => {

    test.beforeEach(async ({ page, navbar }) => {
        await page.goto('/');
        await expect(navbar.signInButton).toBeVisible();
    });

    test('should login with valid credentials @C79 @smoke @auth', async ({ navbar, loginPage, toast }) => {
        await navbar.navigateToSignIn();
        await loginPage.login(config.profiles.validUser.email, config.profiles.validUser.password);
        await toast.assertSignInSuccess();
        await expect(navbar.signOutButton).toBeVisible();
    });

    test('should show error toast with invalid credentials @C80 @auth', async ({ page, navbar, loginPage, toast }) => {
        await navbar.navigateToSignIn();
        await loginPage.login(config.profiles.validUser.email, 'wrongpassword');
        await expect(page).toHaveURL(URL_PATTERNS.signIn);
        await toast.assertSignInFailed();
    });

    test('should not submit with empty credentials @C81 @auth', async ({ page, navbar, loginPage }) => {
        await navbar.navigateToSignIn();
        await loginPage.login('', '');
        await expect(page).toHaveURL(URL_PATTERNS.signIn);
        await expect(loginPage.emailError).toBeVisible();
        await expect(loginPage.passwordError).toBeVisible();
    });

    test('should show validation for invalid email format @C82 @auth', async ({ navbar, loginPage }) => {
        await navbar.navigateToSignIn();
        await loginPage.emailField.fill('not-an-email');
        await loginPage.passwordField.fill('somepassword');
        await loginPage.signInButton.click();
        await expect(loginPage.emailError).toBeVisible();
    });

    test('should show error toast with unregistered email @C83 @auth', async ({ navbar, loginPage, toast }) => {
        await navbar.navigateToSignIn();
        await loginPage.login(testUsers.unregisteredEmail, 'somepassword');
        await toast.assertInvalidCredentials();
    });

    test('should navigate to sign-up page from sign-in @C84 @smoke @auth @navigation', async ({ page, navbar, loginPage, registerPage }) => {
        await navbar.navigateToSignIn();
        await loginPage.navigateToSignUp();
        await expect(page).toHaveURL(URL_PATTERNS.signUp);
        await expect(registerPage.heading).toBeVisible();
    });

    test('should navigate to forgot password page @C85 @auth @navigation', async ({ page, navbar, loginPage }) => {
        await navbar.navigateToSignIn();
        await loginPage.navigateToForgotPassword();
        await expect(page).toHaveURL(URL_PATTERNS.forgotPassword);
        await expect(loginPage.forgotPasswordHeading).toBeVisible();
    });
});

test.describe('Logout Flow', () => {

    test.beforeEach(async ({ page, navbar }) => {
        await page.goto('/');
        await expect(navbar.signInButton).toBeVisible();
    });

    test('should logout and return to unauthenticated state @C86 @smoke @auth', async ({ navbar, loginPage, toast }) => {
        await navbar.navigateToSignIn();
        await loginPage.login(config.profiles.validUser.email, config.profiles.validUser.password);
        await toast.assertSignInSuccess();
        await expect(navbar.signOutButton).toBeVisible();

        await navbar.signOut();
        await expect(loginPage.heading).toBeVisible();
        await expect(navbar.signUpButton).toBeVisible();
        await expect(navbar.signOutButton).not.toBeVisible();
    });
});
