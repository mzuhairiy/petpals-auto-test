import { type Page, expect } from '@playwright/test';
import AuthElements from '../locators/auth-page-elements';
import { logger } from '../../utils/logger/logger';

export default class LoginActions {
    readonly page: Page;
    readonly authElements: AuthElements;

    constructor(page: Page) {
        this.page = page;
        this.authElements = new AuthElements(page);
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async goToSignInPage(): Promise<void> {
        try {
            await this.page.goto('/sign-in');
            logger.info('Navigated to Sign In page');
        } catch (error) {
            throw new Error(`Failed to navigate to sign in page: ${(error as Error).message}`);
        }
    }

    async loginFunctions(email: string, password: string): Promise<void> {
        try {
            await this.authElements.SIGN_IN_EMAIL_FIELD.fill(email);
            await this.authElements.SIGN_IN_PASSWORD_FIELD.fill(password);
            logger.debug('Filled login credentials');
            await this.authElements.SIGN_IN_BUTTON.click();
            logger.info('Login attempt completed');
        } catch (error) {
            throw new Error(`Failed to login: ${(error as Error).message}`);
        }
    }

    async loginWithRememberMe(email: string, password: string): Promise<void> {
        try {
            await this.authElements.SIGN_IN_EMAIL_FIELD.fill(email);
            await this.authElements.SIGN_IN_PASSWORD_FIELD.fill(password);
            await this.authElements.REMEMBER_ME_CHECKBOX.check();
            await this.authElements.SIGN_IN_BUTTON.click();
            logger.info('Login with Remember Me completed');
        } catch (error) {
            throw new Error(`Failed to login with remember me: ${(error as Error).message}`);
        }
    }

    async navigateToForgotPassword(): Promise<void> {
        try {
            await this.authElements.FORGOT_PASSWORD_LINK.click();
            logger.info('Navigated to Forgot Password page');
        } catch (error) {
            throw new Error(`Failed to navigate to forgot password: ${(error as Error).message}`);
        }
    }

    async navigateToSignUpFromSignIn(): Promise<void> {
        try {
            await this.authElements.SIGN_UP_LINK_FROM_SIGN_IN.click();
            logger.info('Navigated to Sign Up page from Sign In');
        } catch (error) {
            throw new Error(`Failed to navigate to sign up: ${(error as Error).message}`);
        }
    }

    async loginWithGoogle(): Promise<void> {
        await this.authElements.SIGN_IN_GOOGLE_BUTTON.click();
        logger.info('Clicked Google sign in button');
    }

    async loginWithFacebook(): Promise<void> {
        await this.authElements.SIGN_IN_FACEBOOK_BUTTON.click();
        logger.info('Clicked Facebook sign in button');
    }
}
