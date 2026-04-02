import { type Page } from '@playwright/test';
import AuthElements from '../locators/auth-page-elements';
import BaseAction from './base-action';

export default class RegisterActions extends BaseAction {
    readonly authElements: AuthElements;

    constructor(page: Page) {
        super(page);
        this.authElements = new AuthElements(page);
    }

    async registerFunctions(data: {
        fullName: string;
        email: string;
        password: string;
        confirmPassword?: string;
    }): Promise<void> {
        await this.authElements.FULL_NAME_FIELD.fill(data.fullName);
        await this.authElements.SIGN_UP_EMAIL_FIELD.fill(data.email);
        await this.authElements.SIGN_UP_PASSWORD_FIELD.fill(data.password);
        await this.authElements.CONFIRM_PASSWORD_FIELD.fill(data.confirmPassword ?? data.password);
        await this.authElements.TERMS_CHECKBOX.check();
        await this.authElements.CREATE_ACCOUNT_BUTTON.click();
    }

    async registerWithoutTerms(data: {
        fullName: string;
        email: string;
        password: string;
    }): Promise<void> {
        await this.authElements.FULL_NAME_FIELD.fill(data.fullName);
        await this.authElements.SIGN_UP_EMAIL_FIELD.fill(data.email);
        await this.authElements.SIGN_UP_PASSWORD_FIELD.fill(data.password);
        await this.authElements.CONFIRM_PASSWORD_FIELD.fill(data.password);
        await this.authElements.CREATE_ACCOUNT_BUTTON.click();
    }

    async navigateToSignInFromSignUp(): Promise<void> {
        await this.authElements.SIGN_IN_LINK_FROM_SIGN_UP.click();
    }
}
