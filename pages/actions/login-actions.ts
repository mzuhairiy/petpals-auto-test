import { type Page } from '@playwright/test';
import AuthElements from '../locators/auth-page-elements';
import HomePageElements from '@locators/home-page-elements';
import BaseAction from './base-action';

export default class LoginActions extends BaseAction {
    readonly authElements: AuthElements;
    readonly homePageElements: HomePageElements;

    constructor(page: Page) {
        super(page);
        this.authElements = new AuthElements(page);
        this.homePageElements = new HomePageElements(page);
    }

    async loginFunctions(email: string, password: string): Promise<void> {
        await this.homePageElements.SIGN_IN_BUTTON.click();
        await this.authElements.SIGN_IN_EMAIL_FIELD.fill(email);
        await this.authElements.SIGN_IN_PASSWORD_FIELD.fill(password);
        await this.authElements.SIGN_IN_BUTTON.click();
    }

    async loginWithRememberMe(email: string, password: string): Promise<void> {
        await this.authElements.SIGN_IN_EMAIL_FIELD.fill(email);
        await this.authElements.SIGN_IN_PASSWORD_FIELD.fill(password);
        await this.authElements.REMEMBER_ME_CHECKBOX.check();
        await this.authElements.SIGN_IN_BUTTON.click();
    }

    async navigateToForgotPassword(): Promise<void> {
        await this.homePageElements.SIGN_IN_BUTTON.click();
        await this.authElements.FORGOT_PASSWORD_LINK.click();
    }

    async navigateToSignUpFromSignIn(): Promise<void> {
        await this.homePageElements.SIGN_IN_BUTTON.click();
        await this.authElements.SIGN_UP_LINK_FROM_SIGN_IN.click();
    }
}
