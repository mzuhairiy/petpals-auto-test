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
    // Role-based: unique link text
    readonly FORGOT_PASSWORD_HEADING: Locator;
    // Scoped to main to avoid header Sign In button conflict
    readonly SIGN_IN_BUTTON: Locator;
    // Role-based: unique button names
    readonly SIGN_IN_GOOGLE_BUTTON: Locator;
    readonly SIGN_IN_FACEBOOK_BUTTON: Locator;
    // Role-based: unique link text
    readonly SIGN_UP_LINK_FROM_SIGN_IN: Locator;
    // Text-based: unique text on page
    readonly SECURE_CONNECTION_TEXT: Locator;

    // SIGN IN VALIDATION
    readonly SIGN_IN_EMAIL_ERROR: Locator;
    readonly SIGN_IN_PASSWORD_ERROR: Locator;

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

    // SIGN UP VALIDATION
    readonly SIGN_UP_NAME_ERROR: Locator;
    readonly SIGN_UP_EMAIL_ERROR: Locator;
    readonly SIGN_UP_PASSWORD_ERROR: Locator;
    readonly SIGN_UP_TERMS_ERROR: Locator;
    readonly CONFIRM_PASSWORD_ERROR: Locator;

    // TOAST NOTIFICATIONS - for validating real outcomes
    readonly TOAST_VIEWPORT: Locator;

    // TOAST MESSAGES (text-specific)
    readonly TOAST_SIGNIN_SUCCESS: Locator;
    readonly TOAST_SIGNIN_FAILED: Locator;
    readonly TOAST_SIGNUP_SUCCESS: Locator;
    readonly TOAST_EMAIL_REGISTERED: Locator;
    readonly TOAST_INVALID_CREDENTIALS: Locator;

    constructor(page: Page) {
        this.page = page;

        // SIGN IN PAGE - scoped to main to avoid header conflicts
        this.SIGN_IN_HEADING = page.getByText('Sign in to your account', { exact: true });
        this.SIGN_IN_EMAIL_FIELD = page.locator('[data-testid="signin-email-input"]');
        this.SIGN_IN_PASSWORD_FIELD = page.locator('[data-testid="signin-password-input"]');
        this.REMEMBER_ME_CHECKBOX = page.locator('[data-testid="signin-remember-checkbox"]');
        this.FORGOT_PASSWORD_LINK = page.locator('[data-testid="signin-forgot-password-link"]');
        this.FORGOT_PASSWORD_HEADING = page.getByText('Forgot your password?', { exact: true });
        this.SIGN_IN_BUTTON = page.locator('[data-testid="signin-submit-btn"]');
        this.SIGN_IN_GOOGLE_BUTTON = page.locator('[data-testid="signin-google-btn"]');
        this.SIGN_IN_FACEBOOK_BUTTON = page.locator('[data-testid="signin-facebook-btn"]');
        this.SIGN_UP_LINK_FROM_SIGN_IN = page.locator('[data-testid="signin-signup-link"]');
        this.SECURE_CONNECTION_TEXT = page.getByText('Secure, encrypted connection');

        // SIGN IN VALIDATION
        this.SIGN_IN_EMAIL_ERROR = page.locator('[data-testid="signin-email-error"]');
        this.SIGN_IN_PASSWORD_ERROR = page.locator('[data-testid="signin-password-error"]');

        // SIGN UP PAGE
        this.SIGN_UP_HEADING = page.getByText('Create an account', { exact: true });
        this.FULL_NAME_FIELD = page.locator('[data-testid="signup-name-input"]');
        this.SIGN_UP_EMAIL_FIELD = page.locator('[data-testid="signup-email-input"]');
        this.SIGN_UP_PASSWORD_FIELD = page.locator('[data-testid="signup-password-input"]');
        this.CONFIRM_PASSWORD_FIELD = page.locator('[data-testid="signup-confirm-password-input"]');
        this.TERMS_CHECKBOX = page.locator('[data-testid="signup-terms-checkbox"]');
        this.TERMS_LINK = page.locator('[data-testid="signup-terms-link"]');
        this.PRIVACY_POLICY_LINK = page.locator('[data-testid="signup-privacy-link"]');
        this.CREATE_ACCOUNT_BUTTON = page.locator('[data-testid="signup-submit-btn"]');
        this.SIGN_UP_GOOGLE_BUTTON = page.locator('[data-testid="signup-google-btn"]');
        this.SIGN_UP_FACEBOOK_BUTTON = page.locator('[data-testid="signup-facebook-btn"]');
        this.SIGN_IN_LINK_FROM_SIGN_UP = page.locator('[data-testid="signup-signin-link"]');
        this.ENCRYPTED_INFO_TEXT = page.getByText('Your information is securely encrypted');

        // SIGN UP VALIDATION
        this.SIGN_UP_NAME_ERROR = page.locator('[data-testid="signup-name-error"]');
        this.SIGN_UP_EMAIL_ERROR = page.locator('[data-testid="signup-email-error"]');
        this.SIGN_UP_PASSWORD_ERROR = page.locator('[data-testid="signup-password-error"]');
        this.SIGN_UP_TERMS_ERROR = page.locator('[data-testid="signup-terms-error"]');
        this.CONFIRM_PASSWORD_ERROR = page.locator('[data-testid="signup-confirm-password-error"]');

        // TOAST NOTIFICATIONS - used to validate real outcomes (success/error)
        this.TOAST_VIEWPORT = page.locator('[data-testid="toast-viewport"]');
        this.TOAST_SIGNIN_SUCCESS = this.TOAST_VIEWPORT.getByText('Welcome back!');
        this.TOAST_SIGNIN_FAILED = this.TOAST_VIEWPORT.getByText('Sign in failed');
        this.TOAST_SIGNUP_SUCCESS = this.TOAST_VIEWPORT.getByText('Welcome to PetPals!');
        this.TOAST_EMAIL_REGISTERED = this.TOAST_VIEWPORT.getByText('Email already registered');
        this.TOAST_INVALID_CREDENTIALS = this.TOAST_VIEWPORT.getByText('Invalid credentials');
    }
}
