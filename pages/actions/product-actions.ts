import { type Page } from '@playwright/test';
import ProductPageElements from '../locators/product-page-elements';
import BaseAction from './base-action';
import { logger } from '../../utils/logger/logger';

export default class ProductActions extends BaseAction {
    readonly productElements: ProductPageElements;

    constructor(page: Page) {
        super(page);
        this.productElements = new ProductPageElements(page);
    }

    async goToProductPage(productSlug: string): Promise<void> {
        await this.gotoAsync(`/product/${productSlug}`);
        logger.info(`Navigated to product page: ${productSlug}`);
    }

    async getProductTitle(): Promise<string> {
        const title = await this.productElements.PRODUCT_TITLE.textContent();
        logger.info(`Product title: ${title}`);
        return title ?? '';
    }

    async addToCart(): Promise<void> {
        await this.productElements.ADD_TO_CART_BUTTON.click();
        logger.info('Added product to cart');
    }

    async addToWishlist(): Promise<void> {
        await this.productElements.ADD_TO_WISHLIST_BUTTON.click();
        logger.info('Added product to wishlist');
    }

    async setQuantity(quantity: number): Promise<void> {
        await this.productElements.QUANTITY_INPUT.fill(String(quantity));
        logger.info(`Set quantity to: ${quantity}`);
    }

    async increaseQuantity(times: number = 1): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.productElements.INCREASE_QUANTITY_BUTTON.click();
        }
        logger.info(`Increased quantity ${times} time(s)`);
    }

    async decreaseQuantity(times: number = 1): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.productElements.DECREASE_QUANTITY_BUTTON.click();
        }
        logger.info(`Decreased quantity ${times} time(s)`);
    }

    async navigateBackToShop(): Promise<void> {
        await this.productElements.BACK_TO_SHOP_LINK.click();
        logger.info('Navigated back to shop');
    }

    async switchToDescriptionTab(): Promise<void> {
        await this.productElements.DESCRIPTION_TAB.click();
        logger.info('Switched to Description tab');
    }

    async switchToNutritionalDetailsTab(): Promise<void> {
        await this.productElements.NUTRITIONAL_DETAILS_TAB.click();
        logger.info('Switched to Nutritional Details tab');
    }

    async switchToReviewsTab(): Promise<void> {
        await this.productElements.REVIEWS_TAB.click();
        logger.info('Switched to Reviews tab');
    }

    async clickRandomRelatedProduct(): Promise<string> {
        const cards = this.productElements.RELATED_PRODUCT_CARDS;
        const count = await cards.count();

        if (count === 0) {
            throw new Error('No related products found');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const card = cards.nth(randomIndex);
        const title = await card.locator('h3').textContent();

        await card.click();
        logger.info(`Clicked related product: ${title}`);
        return title ?? '';
    }

    async getRelatedProductCount(): Promise<number> {
        const count = await this.productElements.RELATED_PRODUCT_CARDS.count();
        logger.info(`Related product count: ${count}`);
        return count;
    }
}
