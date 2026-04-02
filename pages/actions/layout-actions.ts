import { type Page } from '@playwright/test';
import LayoutElements from '../locators/layout-elements';
import BaseAction from './base-action';

export default class LayoutActions extends BaseAction {
    readonly layoutElements: LayoutElements;

    constructor(page: Page) {
        super(page);
        this.layoutElements = new LayoutElements(page);
    }

    async clickLogo(): Promise<void> {
        await this.layoutElements.PETPALS_LOGO.click();
    }

    async navigateToHome(): Promise<void> {
        await this.layoutElements.NAV_HOME.click();
    }

    async navigateToShop(): Promise<void> {
        await this.layoutElements.NAV_SHOP.click();
    }

    async navigateToCats(): Promise<void> {
        await this.layoutElements.NAV_CATS.click();
    }

    async navigateToDogs(): Promise<void> {
        await this.layoutElements.NAV_DOGS.click();
    }

    async navigateToAbout(): Promise<void> {
        await this.layoutElements.NAV_ABOUT.click();
    }

    async navigateToSignIn(): Promise<void> {
        await this.layoutElements.SIGN_IN_BUTTON.click();
    }

    async navigateToSignUp(): Promise<void> {
        await this.layoutElements.SIGN_UP_BUTTON.click();
    }

    async navigateToCart(): Promise<void> {
        await this.layoutElements.CART_BUTTON.click();
    }

    async signOut(): Promise<void> {
        await this.layoutElements.SIGN_OUT_BUTTON.click();
    }
}
