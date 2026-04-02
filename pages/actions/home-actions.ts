import { type Page } from '@playwright/test';
import HomePageElements from '../locators/home-page-elements';
import BaseAction from './base-action';
import { logger } from '../../utils/logger/logger';

export default class HomeActions extends BaseAction {
    readonly homeElements: HomePageElements;

    constructor(page: Page) {
        super(page);
        this.homeElements = new HomePageElements(page);
    }

    async navigateCarouselNext(): Promise<void> {
        await this.homeElements.CAROUSEL_NEXT_BUTTON.click();
        logger.debug('Navigated to next carousel slide');
    }

    async navigateCarouselPrev(): Promise<void> {
        await this.homeElements.CAROUSEL_PREV_BUTTON.click();
        logger.debug('Navigated to previous carousel slide');
    }

    async goToSlide(slideNumber: number): Promise<void> {
        await this.page.getByRole('button', { name: `Go to slide ${slideNumber}` }).click();
        logger.debug(`Navigated to carousel slide ${slideNumber}`);
    }

    async clickShopNow(): Promise<void> {
        await this.homeElements.HERO_SHOP_NOW_LINK.click();
        logger.info('Clicked Shop Now link');
    }

    async clickExploreFood(): Promise<void> {
        await this.homeElements.HERO_EXPLORE_FOOD_LINK.click();
        logger.info('Clicked Explore Food link');
    }

    async clickViewToys(): Promise<void> {
        await this.homeElements.HERO_VIEW_TOYS_LINK.click();
        logger.info('Clicked View Toys link');
    }

    async clickViewAllProducts(): Promise<void> {
        await this.homeElements.VIEW_ALL_PRODUCTS_LINK.click();
        logger.info('Clicked View All Products link');
    }

    async clickViewAllCatProducts(): Promise<void> {
        await this.homeElements.VIEW_ALL_CAT_PRODUCTS_LINK.click();
        logger.info('Clicked View All Cat Products link');
    }

    async clickViewAllDogProducts(): Promise<void> {
        await this.homeElements.VIEW_ALL_DOG_PRODUCTS_LINK.click();
        logger.info('Clicked View All Dog Products link');
    }

    async clickRandomFeaturedProduct(): Promise<string> {
        const cards = this.homeElements.FEATURED_PRODUCT_CARDS;
        const count = await cards.count();

        if (count === 0) {
            throw new Error('No featured products found on homepage');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const card = cards.nth(randomIndex);
        const title = await card.locator('h3').textContent();

        await card.click();
        logger.info(`Clicked featured product: ${title}`);
        return title ?? '';
    }

    async addCatProductToCart(index: number = 0): Promise<void> {
        await this.homeElements.CAT_ADD_TO_CART_BUTTONS.nth(index).click();
        logger.info(`Added cat product at index ${index} to cart`);
    }

    async addDogProductToCart(index: number = 0): Promise<void> {
        await this.homeElements.DOG_ADD_TO_CART_BUTTONS.nth(index).click();
        logger.info(`Added dog product at index ${index} to cart`);
    }

    async subscribeToNewsletter(email: string): Promise<void> {
        await this.homeElements.NEWSLETTER_EMAIL_FIELD.fill(email);
        await this.homeElements.NEWSLETTER_SUBSCRIBE_BUTTON.click();
        logger.info(`Subscribed to newsletter with email: ${email}`);
    }
}
