import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

/**
 * RegisterPage — Sign Up page object.
 *
 * Contains locators and interactions for the registration form.
 * NO assertions — tests handle all verification.
 */
export default class RegisterPage extends BasePage {
    // Page heading
    readonly heading: Locator;

    // Form fields
    readonly fullNameField: Locator;
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly confirmPasswordField: Locator;
    readonly termsCheckbox: Locator;

    // Actions
    readonly createAccountButton: Locator;
    readonly signInLink: Locator;

    // Links
    readonly termsLink: Locator;
    readonly privacyPolicyLink: Locator;

    // Social signup
    readonly googleButton: Locator;
    readonly facebookButton: Locator;

    // Validation errors
    readonly nameError: Locator;
    readonly emailError: Locator;
    readonly passwordError: Locator;
    readonly confirmPasswordError: Locator;
    readonly termsError: Locator;

    // Info text
    readonly encryptedInfoText: Locator;

    constructor(page: Page) {
        super(page);

        // Page heading
        this.heading = page.getByText('Create an account', { exact: true });

        // Form fields
        this.fullNameField = this.byTestId('signup-name-input');
        this.emailField = this.byTestId('signup-email-input');
        this.passwordField = this.byTestId('signup-password-input');
        this.confirmPasswordField = this.byTestId('signup-confirm-password-input');
        this.termsCheckbox = this.byTestId('signup-terms-checkbox');

        // Actions
        this.createAccountButton = this.byTestId('signup-submit-btn');
        this.signInLink = this.byTestId('signup-signin-link');

        // Links
        this.termsLink = this.byTestId('signup-terms-link');
        this.privacyPolicyLink = this.byTestId('signup-privacy-link');

        // Social signup
        this.googleButton = this.byTestId('signup-google-btn');
        this.facebookButton = this.byTestId('signup-facebook-btn');

        // Validation errors
        this.nameError = this.byTestId('signup-name-error');
        this.emailError = this.byTestId('signup-email-error');
        this.passwordError = this.byTestId('signup-password-error');
        this.confirmPasswordError = this.byTestId('signup-confirm-password-error');
        this.termsError = this.byTestId('signup-terms-error');

        // Info text
        this.encryptedInfoText = page.getByText('Your information is securely encrypted');
    }

    // ── Interactions ──

    async register(data: {
        fullName: string;
        email: string;
        password: string;
        confirmPassword?: string;
    }): Promise<void> {
        await this.fullNameField.fill(data.fullName);
        await this.emailField.fill(data.email);
        await this.passwordField.fill(data.password);
        await this.confirmPasswordField.fill(data.confirmPassword ?? data.password);
        await this.termsCheckbox.click();
        await this.createAccountButton.click();
    }

    async registerWithoutTerms(data: {
        fullName: string;
        email: string;
        password: string;
    }): Promise<void> {
        await this.fullNameField.fill(data.fullName);
        await this.emailField.fill(data.email);
        await this.passwordField.fill(data.password);
        await this.confirmPasswordField.fill(data.password);
        await this.createAccountButton.click();
    }

    async navigateToSignIn(): Promise<void> {
        await this.signInLink.click();
    }
}
