import { type Page, type Locator } from '@playwright/test';

/**
 * Auth Page Elements - Locators for Sign In and Sign Up pages
 *
 * LOCATOR STRATEGY: No data-testid attributes available.
 * Using role-based selectors with exact matching as primary strategy.
 * Each locator verified against live application for uniqueness.
 */
export default class AuthElements {
    readonly page: Page;

    // SIGN IN PAGE
    // Role-based: unique heading text on sign-in page
    readonly SIGN_IN_HEADING: Locator;
    // Role-based: only email textbox on sign-in page
    readonly SIGN_IN_EMAIL_FIELD: Locator;
    // Role-based: only password textbox on sign-in page
    readonly SIGN_IN_PASSWORD_FIELD: Locator;
    // Role-based: unique checkbox label
    readonly REMEMBER_ME_CHECKBOX: Locator;
    // Role-based: unique link text
    readonly FORGOT_PASSWORD_LINK: Locator;
    // Scoped to main to avoid header Sign In button conflict
    readonly SIGN_IN_BUTTON: Locator;
    // Role-based: unique button names
    readonly SIGN_IN_GOOGLE_BUTTON: Locator;
    readonly SIGN_IN_FACEBOOK_BUTTON: Locator;
    // Role-based: unique link text
    readonly SIGN_UP_LINK_FROM_SIGN_IN: Locator;
    // Text-based: unique text on page
    readonly SECURE_CONNECTION_TEXT: Locator;

    // SIGN UP PAGE
    // Text-based: unique heading on sign-up page
    readonly SIGN_UP_HEADING: Locator;
    // Role-based: unique field labels on sign-up page
    readonly FULL_NAME_FIELD: Locator;
    readonly SIGN_UP_EMAIL_FIELD: Locator;
    readonly SIGN_UP_PASSWORD_FIELD: Locator;
    readonly CONFIRM_PASSWORD_FIELD: Locator;
    // Role-based: unique checkbox with Terms text
    readonly TERMS_CHECKBOX: Locator;
    // Role-based: unique link texts
    readonly TERMS_LINK: Locator;
    readonly PRIVACY_POLICY_LINK: Locator;
    // Role-based: unique button text
    readonly CREATE_ACCOUNT_BUTTON: Locator;
    readonly SIGN_UP_GOOGLE_BUTTON: Locator;
    readonly SIGN_UP_FACEBOOK_BUTTON: Locator;
    // Role-based: unique link text
    readonly SIGN_IN_LINK_FROM_SIGN_UP: Locator;
    // Text-based: unique text on page
    readonly ENCRYPTED_INFO_TEXT: Locator;

    // TOAST NOTIFICATIONS - for validating real outcomes
    readonly TOAST_CONTAINER: Locator;
    readonly TOAST_TITLE: Locator;
    readonly TOAST_DESCRIPTION: Locator;

    constructor(page: Page) {
        this.page = page;

        // SIGN IN PAGE - scoped to main to avoid header conflicts
        this.SIGN_IN_HEADING = page.getByText('Sign in to your account');
        this.SIGN_IN_EMAIL_FIELD = page.getByRole('textbox', { name: 'Email' });
        this.SIGN_IN_PASSWORD_FIELD = page.getByRole('textbox', { name: 'Password' });
        this.REMEMBER_ME_CHECKBOX = page.getByRole('checkbox', { name: 'Remember me' });
        this.FORGOT_PASSWORD_LINK = page.getByRole('link', { name: 'Forgot password?' });
        this.SIGN_IN_BUTTON = page.getByRole('main').getByRole('button', { name: 'Sign In' });
        this.SIGN_IN_GOOGLE_BUTTON = page.getByRole('button', { name: 'Google' });
        this.SIGN_IN_FACEBOOK_BUTTON = page.getByRole('button', { name: 'Facebook' });
        this.SIGN_UP_LINK_FROM_SIGN_IN = page.getByRole('link', { name: 'Sign up' });
        this.SECURE_CONNECTION_TEXT = page.getByText('Secure, encrypted connection');

        // SIGN UP PAGE
        this.SIGN_UP_HEADING = page.getByText('Create an account');
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

        // TOAST NOTIFICATIONS - used to validate real outcomes (success/error)
        this.TOAST_CONTAINER = page.getByRole('status');
        this.TOAST_TITLE = page.getByRole('status').locator('div').first();
        this.TOAST_DESCRIPTION = page.getByRole('status').locator('div').nth(1);
    }
}
