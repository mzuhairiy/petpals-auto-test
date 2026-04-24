import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

/**
 * LoginPage — Sign In page object.
 *
 * Contains locators and interactions for the sign-in form.
 * NO assertions — tests handle all verification.
 */
export default class LoginPage extends BasePage {
    // Page heading
    readonly heading: Locator;

    // Form fields
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly rememberMeCheckbox: Locator;

    // Actions
    readonly signInButton: Locator;
    readonly forgotPasswordLink: Locator;
    readonly signUpLink: Locator;

    // Social login
    readonly googleButton: Locator;
    readonly facebookButton: Locator;

    // Validation errors
    readonly emailError: Locator;
    readonly passwordError: Locator;

    // Info text
    readonly secureConnectionText: Locator;

    // Forgot password page
    readonly forgotPasswordHeading: Locator;

    constructor(page: Page) {
        super(page);

        // Page heading
        this.heading = page.getByText('Sign in to your account', { exact: true });

        // Form fields
        this.emailField = this.byTestId('signin-email-input');
        this.passwordField = this.byTestId('signin-password-input');
        this.rememberMeCheckbox = this.byTestId('signin-remember-checkbox');

        // Actions
        this.signInButton = this.byTestId('signin-submit-btn');
        this.forgotPasswordLink = this.byTestId('signin-forgot-password-link');
        this.signUpLink = this.byTestId('signin-signup-link');

        // Social login
        this.googleButton = this.byTestId('signin-google-btn');
        this.facebookButton = this.byTestId('signin-facebook-btn');

        // Validation errors
        this.emailError = this.byTestId('signin-email-error');
        this.passwordError = this.byTestId('signin-password-error');

        // Info text
        this.secureConnectionText = page.getByText('Secure, encrypted connection');

        // Forgot password page
        this.forgotPasswordHeading = page.getByText('Forgot your password?', { exact: true });
    }

    // ── Interactions ──

    async login(email: string, password: string): Promise<void> {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.signInButton.click();
        await this.waitForDomReady();
    }

    async loginWithRememberMe(email: string, password: string): Promise<void> {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.rememberMeCheckbox.check();
        await this.signInButton.click();
    }

    async navigateToForgotPassword(): Promise<void> {
        await this.forgotPasswordLink.click();
    }

    async navigateToSignUp(): Promise<void> {
        await this.signUpLink.click();
    }
}
