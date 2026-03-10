import { type Page, expect } from '@playwright/test';
import ShopPageElements from '../locators/shop-page-elements';
import { logger } from '../../utils/logger/logger';

export default class ShopActions {
    readonly page: Page;
    readonly shopElements: ShopPageElements;

    constructor(page: Page) {
        this.page = page;
        this.shopElements = new ShopPageElements(page);
    }

    async gotoAsync(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async goToShopPage(): Promise<void> {
        await this.page.goto('/shop');
        logger.info('Navigated to Shop page');
    }

    async filterByCategory(category: 'Toys' | 'Food' | 'Supplements'): Promise<void> {
        const checkboxMap = {
            Toys: this.shopElements.CATEGORY_TOYS_CHECKBOX,
            Food: this.shopElements.CATEGORY_FOOD_CHECKBOX,
            Supplements: this.shopElements.CATEGORY_SUPPLEMENTS_CHECKBOX,
        };
        await checkboxMap[category].click();
        await this.page.waitForTimeout(500);
        logger.info(`Filtered by category: ${category}`);
    }

    async filterByPetType(petType: 'Cats' | 'Dogs'): Promise<void> {
        const checkboxMap = {
            Cats: this.shopElements.PET_TYPE_CATS_CHECKBOX,
            Dogs: this.shopElements.PET_TYPE_DOGS_CHECKBOX,
        };
        await checkboxMap[petType].click();
        await this.page.waitForTimeout(500);
        logger.info(`Filtered by pet type: ${petType}`);
    }

    async sortBy(option: 'Price: Low to High' | 'Price: High to Low' | 'Highest Rated' | 'Newest First'): Promise<void> {
        const checkboxMap = {
            'Price: Low to High': this.shopElements.SORT_PRICE_LOW_HIGH,
            'Price: High to Low': this.shopElements.SORT_PRICE_HIGH_LOW,
            'Highest Rated': this.shopElements.SORT_HIGHEST_RATED,
            'Newest First': this.shopElements.SORT_NEWEST_FIRST,
        };
        await checkboxMap[option].click();
        await this.page.waitForTimeout(500);
        logger.info(`Sorted by: ${option}`);
    }

    async setPriceRange(min: number, max: number): Promise<void> {
        await this.shopElements.PRICE_MIN_INPUT.fill(String(min));
        await this.shopElements.PRICE_MAX_INPUT.fill(String(max));
        await this.page.waitForTimeout(500);
        logger.info(`Set price range: ${min} - ${max}`);
    }

    async clickRandomProduct(): Promise<string> {
        const cards = this.shopElements.PRODUCT_CARDS;
        const count = await cards.count();

        if (count === 0) {
            throw new Error('No products found on shop page');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const card = cards.nth(randomIndex);
        const title = await card.locator('h3').textContent();

        await card.click();
        logger.info(`Clicked product: ${title}`);
        return title ?? '';
    }

    async getProductCount(): Promise<number> {
        const count = await this.shopElements.PRODUCT_CARDS.count();
        logger.info(`Product count: ${count}`);
        return count;
    }

    async getAllProductTitles(): Promise<string[]> {
        const titles = await this.shopElements.PRODUCT_TITLES.allTextContents();
        return titles.map(t => t.trim());
    }

    async getAllProductPrices(): Promise<number[]> {
        const priceElements = this.shopElements.PRODUCT_CARDS.locator('div:has-text("Rp")');
        const priceTexts = await priceElements.allTextContents();
        return priceTexts
            .filter(p => p.match(/Rp\s[\d.]+/))
            .map(p => {
                const match = p.match(/Rp\s([\d.]+)/);
                return match ? parseFloat(match[1].replace(/\./g, '')) : 0;
            })
            .filter(p => p > 0);
    }

    isSortedAscending(values: number[]): boolean {
        return values.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
    }

    isSortedDescending(values: number[]): boolean {
        return values.every((val, i, arr) => i === 0 || arr[i - 1] >= val);
    }
}
