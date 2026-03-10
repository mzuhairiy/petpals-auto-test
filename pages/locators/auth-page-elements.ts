import { type Page, type Locator } from '@playwright/test';

export default class AuthElements {
    readonly page: Page;

    // SIGN IN PAGE
    readonly SIGN_IN_HEADING: Locator;
    readonly SIGN_IN_SUBTITLE: Locator;
    readonly SIGN_IN_EMAIL_FIELD: Locator;
    readonly SIGN_IN_PASSWORD_FIELD: Locator;
    readonly REMEMBER_ME_CHECKBOX: Locator;
    readonly FORGOT_PASSWORD_LINK: Locator;
    readonly SIGN_IN_BUTTON: Locator;
    readonly SIGN_IN_GOOGLE_BUTTON: Locator;
    readonly SIGN_IN_FACEBOOK_BUTTON: Locator;
    readonly SIGN_UP_LINK_FROM_SIGN_IN: Locator;
    readonly SECURE_CONNECTION_TEXT: Locator;

    // SIGN UP PAGE
    readonly SIGN_UP_HEADING: Locator;
    readonly SIGN_UP_SUBTITLE: Locator;
    readonly FULL_NAME_FIELD: Locator;
    readonly SIGN_UP_EMAIL_FIELD: Locator;
    readonly SIGN_UP_PASSWORD_FIELD: Locator;
    readonly CONFIRM_PASSWORD_FIELD: Locator;
    readonly TERMS_CHECKBOX: Locator;
    readonly TERMS_LINK: Locator;
    readonly PRIVACY_POLICY_LINK: Locator;
    readonly CREATE_ACCOUNT_BUTTON: Locator;
    readonly SIGN_UP_GOOGLE_BUTTON: Locator;
    readonly SIGN_UP_FACEBOOK_BUTTON: Locator;
    readonly SIGN_IN_LINK_FROM_SIGN_UP: Locator;
    readonly ENCRYPTED_INFO_TEXT: Locator;

    // SUCCESS / ERROR MESSAGES
    readonly ERROR_ALERT: Locator;
    readonly SUCCESS_ALERT: Locator;

    // NAVIGATION
    readonly PETPALS_LOGO: Locator;

    constructor(page: Page) {
        this.page = page;

        // SIGN IN PAGE
        this.SIGN_IN_HEADING = page.getByText('Sign in to your account');
        this.SIGN_IN_SUBTITLE = page.getByText('Enter your email and password to access your account');
        this.SIGN_IN_EMAIL_FIELD = page.getByRole('textbox', { name: 'Email' });
        this.SIGN_IN_PASSWORD_FIELD = page.getByRole('textbox', { name: 'Password' });
        this.REMEMBER_ME_CHECKBOX = page.getByRole('checkbox', { name: 'Remember me' });
        this.FORGOT_PASSWORD_LINK = page.getByRole('link', { name: 'Forgot password?' });
        this.SIGN_IN_BUTTON = page.getByRole('button', { name: 'Sign In' });
        this.SIGN_IN_GOOGLE_BUTTON = page.getByRole('button', { name: 'Google' });
        this.SIGN_IN_FACEBOOK_BUTTON = page.getByRole('button', { name: 'Facebook' });
        this.SIGN_UP_LINK_FROM_SIGN_IN = page.getByRole('link', { name: 'Sign up' });
        this.SECURE_CONNECTION_TEXT = page.getByText('Secure, encrypted connection');

        // SIGN UP PAGE
        this.SIGN_UP_HEADING = page.getByText('Create an account');
        this.SIGN_UP_SUBTITLE = page.getByText('Enter your information to create an account');
        this.FULL_NAME_FIELD = page.getByRole('textbox', { name: 'Full Name' });
        this.SIGN_UP_EMAIL_FIELD = page.getByRole('textbox', { name: 'Email' });
        this.SIGN_UP_PASSWORD_FIELD = page.getByRole('textbox', { name: 'Password', exact: true });
        this.CONFIRM_PASSWORD_FIELD = page.getByRole('textbox', { name: 'Confirm Password' });
        this.TERMS_CHECKBOX = page.getByRole('checkbox', { name: /Terms of Service/ });
        this.TERMS_LINK = page.getByRole('link', { name: 'Terms of Service' });
        this.PRIVACY_POLICY_LINK = page.getByRole('link', { name: 'Privacy Policy' });
        this.CREATE_ACCOUNT_BUTTON = page.getByRole('button', { name: 'Create Account' });
        this.SIGN_UP_GOOGLE_BUTTON = page.getByRole('button', { name: 'Google' });
        this.SIGN_UP_FACEBOOK_BUTTON = page.getByRole('button', { name: 'Facebook' });
        this.SIGN_IN_LINK_FROM_SIGN_UP = page.getByRole('link', { name: 'Sign in' });
        this.ENCRYPTED_INFO_TEXT = page.getByText('Your information is securely encrypted');

        // SUCCESS / ERROR MESSAGES
        this.ERROR_ALERT = page.locator('[role="alert"]');
        this.SUCCESS_ALERT = page.locator('[role="alert"]');

        // NAVIGATION
        this.PETPALS_LOGO = page.locator('header a[href="/"]');
    }
}
