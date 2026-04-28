import { test, expect } from '../../fixtures/base.fixture';
import config from '../../config/env.config';
import testUsers from '../../test-data/users.json';
import { generateUserCreds } from '../../utils/data.helper';
import { URL_PATTERNS } from '../../constants/env.constants';

test.describe('Registration Flow', () => {

    test.beforeEach(async ({ page, navbar, registerPage }) => {
        await page.goto('/');
        await expect(navbar.signUpButton).toBeVisible();
        await navbar.navigateToSignUp();
        await expect(registerPage.heading).toBeVisible();
    });

    test('should register with valid data @TC87 @smoke @auth', async ({ page, registerPage, toast }) => {
        const userCreds = generateUserCreds();
        await registerPage.register(userCreds);
        await page.waitForURL(url => !url.toString().includes('/sign-up'), { timeout: 10000 }).catch(() => {});
        const currentUrl = page.url();
        const redirected = !currentUrl.includes('/sign-up');

        if (redirected) {
            expect(currentUrl).toMatch(/sign-in|\/$/);
        } else {
            await toast.assertSignUpSuccess();
        }
    });

    test('should not register with mismatched passwords @TC88 @auth', async ({ registerPage }) => {
        const userCreds = generateUserCreds();
        await registerPage.register({
            fullName: userCreds.fullName,
            email: userCreds.email,
            password: 'Password123!',
            confirmPassword: 'DifferentPassword456!',
        });
        await expect(registerPage.confirmPasswordError).toBeVisible();
    });

    test('should not register without accepting terms @TC89 @auth', async ({ page, registerPage }) => {
        const userCreds = generateUserCreds();
        await registerPage.registerWithoutTerms(userCreds);
        await expect(page).toHaveURL(URL_PATTERNS.signUp);
        await expect(registerPage.termsError).toBeVisible();
    });

    test('should navigate to sign-in page from sign-up @TC92 @auth @navigation', async ({ page, registerPage, loginPage }) => {
        await registerPage.navigateToSignIn();
        await expect(page).toHaveURL(URL_PATTERNS.signIn);
        await expect(loginPage.heading).toBeVisible();
    });

    test('should not register with empty email @TC90 @auth', async ({ page, registerPage }) => {
        const userCreds = generateUserCreds();
        await registerPage.register({
            fullName: userCreds.fullName,
            email: '',
            password: userCreds.password,
            confirmPassword: userCreds.password,
        });
        await expect(page).toHaveURL(URL_PATTERNS.signUp);
        await expect(registerPage.emailError).toBeVisible();
    });

    test('should not register with already registered email @TC91 @auth', async ({ page, registerPage, toast }) => {
        const userCreds = generateUserCreds();
        await registerPage.register({
            fullName: userCreds.fullName,
            email: testUsers.registeredEmail,
            password: userCreds.password,
            confirmPassword: userCreds.password,
        });
        await expect(page).toHaveURL(URL_PATTERNS.signUp);
        await toast.assertEmailRegistered();
    });
});
