import { type Page, expect } from '@playwright/test';
import AuthElements from '../locators/auth-page-elements';
import { logger } from '../../utils/logger/logger';

export default class RegisterActions {
    readonly page: Page;
    readonly authElements: AuthElements;

    constructor(page: Page) {
        this.page = page;
        this.authElements = new AuthElements(page);
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async goToSignUpPage(): Promise<void> {
        try {
            await this.page.goto('/sign-up');
            logger.info('Navigated to Sign Up page');
        } catch (error) {
            throw new Error(`Failed to navigate to sign up page: ${(error as Error).message}`);
        }
    }

    async registerFunctions(data: {
        fullName: string;
        email: string;
        password: string;
        confirmPassword?: string;
    }): Promise<void> {
        try {
            await this.authElements.FULL_NAME_FIELD.fill(data.fullName);
            await this.authElements.SIGN_UP_EMAIL_FIELD.fill(data.email);
            await this.authElements.SIGN_UP_PASSWORD_FIELD.fill(data.password);
            await this.authElements.CONFIRM_PASSWORD_FIELD.fill(data.confirmPassword ?? data.password);
            await this.authElements.TERMS_CHECKBOX.check();
            logger.debug('Filled registration form');
            await this.authElements.CREATE_ACCOUNT_BUTTON.click();
            logger.info('Registration attempt completed');
            await this.page.waitForTimeout(500);
        } catch (error) {
            throw new Error(`Failed to register: ${(error as Error).message}`);
        }
    }

    async registerWithoutTerms(data: {
        fullName: string;
        email: string;
        password: string;
    }): Promise<void> {
        try {
            await this.authElements.FULL_NAME_FIELD.fill(data.fullName);
            await this.authElements.SIGN_UP_EMAIL_FIELD.fill(data.email);
            await this.authElements.SIGN_UP_PASSWORD_FIELD.fill(data.password);
            await this.authElements.CONFIRM_PASSWORD_FIELD.fill(data.password);
            await this.authElements.CREATE_ACCOUNT_BUTTON.click();
            logger.info('Registration without terms attempt completed');
        } catch (error) {
            throw new Error(`Failed to register without terms: ${(error as Error).message}`);
        }
    }

    async navigateToSignInFromSignUp(): Promise<void> {
        try {
            await this.authElements.SIGN_IN_LINK_FROM_SIGN_UP.click();
            logger.info('Navigated to Sign In page from Sign Up');
        } catch (error) {
            throw new Error(`Failed to navigate to sign in: ${(error as Error).message}`);
        }
    }

    async registerWithGoogle(): Promise<void> {
        await this.authElements.SIGN_UP_GOOGLE_BUTTON.click();
        logger.info('Clicked Google sign up button');
    }

    async registerWithFacebook(): Promise<void> {
        await this.authElements.SIGN_UP_FACEBOOK_BUTTON.click();
        logger.info('Clicked Facebook sign up button');
    }
}
