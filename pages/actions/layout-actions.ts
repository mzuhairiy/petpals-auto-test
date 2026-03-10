import { type Page, expect } from '@playwright/test';
import LayoutElements from '../locators/layout-elements';
import { logger } from '../../utils/logger/logger';

export default class LayoutActions {
    readonly page: Page;
    readonly layoutElements: LayoutElements;

    constructor(page: Page) {
        this.page = page;
        this.layoutElements = new LayoutElements(page);
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
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

    async accessAllNavbarMenus(): Promise<void> {
        const links = this.layoutElements.NAVBAR_LINKS;
        const total = await links.count();
        logger.info(`Total Navbar Links: ${total}`);
        expect(total).toBeGreaterThan(0);

        for (let i = 0; i < total; i++) {
            const link = links.nth(i);
            const linkText = (await link.innerText()).trim();

            await link.click();
            await this.page.waitForLoadState('load');

            logger.info(`✅ Accessed Navbar Menu: ${linkText}`);
        }
    }

    async accessAllFooterShopLinks(): Promise<void> {
        const links = this.layoutElements.FOOTER_SHOP_LINKS;
        const count = await links.count();
        logger.info(`Total Footer Shop Links: ${count}`);

        for (let i = 0; i < count; i++) {
            const link = links.nth(i);
            const text = (await link.textContent())?.trim();

            await link.click();
            await this.page.waitForLoadState('load');

            logger.info(`✅ Accessed Footer Shop Link: ${text}`);
            await this.page.goBack();
            await this.page.waitForLoadState('load');
        }
    }

    async accessAllFooterCompanyLinks(): Promise<void> {
        const links = this.layoutElements.FOOTER_COMPANY_LINKS;
        const count = await links.count();
        logger.info(`Total Footer Company Links: ${count}`);

        for (let i = 0; i < count; i++) {
            const link = links.nth(i);
            const text = (await link.textContent())?.trim();

            await link.click();
            await this.page.waitForLoadState('load');

            logger.info(`✅ Accessed Footer Company Link: ${text}`);
            await this.page.goBack();
            await this.page.waitForLoadState('load');
        }
    }

    async accessAllFooterCustomerServiceLinks(): Promise<void> {
        const links = this.layoutElements.FOOTER_CUSTOMER_SERVICE_LINKS;
        const count = await links.count();
        logger.info(`Total Footer Customer Service Links: ${count}`);

        for (let i = 0; i < count; i++) {
            const link = links.nth(i);
            const text = (await link.textContent())?.trim();

            await link.click();
            await this.page.waitForLoadState('load');

            logger.info(`✅ Accessed Footer Customer Service Link: ${text}`);
            await this.page.goBack();
            await this.page.waitForLoadState('load');
        }
    }
}
