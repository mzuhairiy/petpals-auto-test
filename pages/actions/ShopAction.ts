import { type Page } from '@playwright/test';
import ShopPageElements from '../locators/ShopPageElements';
import BaseAction from './BaseAction';

export default class ShopActions extends BaseAction {
    readonly shopElements: ShopPageElements;

    constructor(page: Page) {
        super(page);
        this.shopElements = new ShopPageElements(page);
    }

    async filterByCategory(category: 'Toys' | 'Food' | 'Supplements'): Promise<void> {
        const checkboxMap = {
            Toys: this.shopElements.CATEGORY_TOYS_CHECKBOX,
            Food: this.shopElements.CATEGORY_FOOD_CHECKBOX,
            Supplements: this.shopElements.CATEGORY_SUPPLEMENTS_CHECKBOX,
        };
        await checkboxMap[category].click();
        await this.waitForNavigation();
    }

    async filterByPetType(petType: 'Cats' | 'Dogs'): Promise<void> {
        const checkboxMap = {
            Cats: this.shopElements.PET_TYPE_CATS_CHECKBOX,
            Dogs: this.shopElements.PET_TYPE_DOGS_CHECKBOX,
        };
        await checkboxMap[petType].click();
        await this.waitForNavigation();
    }

    async sortBy(option: 'Price: Low to High' | 'Price: High to Low' | 'Highest Rated' | 'Newest First'): Promise<void> {
        const checkboxMap = {
            'Price: Low to High': this.shopElements.SORT_PRICE_LOW_HIGH,
            'Price: High to Low': this.shopElements.SORT_PRICE_HIGH_LOW,
            'Highest Rated': this.shopElements.SORT_HIGHEST_RATED,
            'Newest First': this.shopElements.SORT_NEWEST_FIRST,
        };
        await checkboxMap[option].click();
        await this.waitForNavigation();
    }

    async getProductCount(): Promise<number> {
        await this.page.waitForLoadState('domcontentloaded');
        return await this.shopElements.PRODUCT_CARDS.count();
    }

    async getAllProductTitles(): Promise<string[]> {
        const titles = await this.shopElements.PRODUCT_TITLES.allTextContents();
        return titles.map(t => t.trim());
    }

    async clickProductByName(name: string): Promise<void> {
        await this.page.getByRole('link', { name: new RegExp(name) }).first().click();
    }

    async clickFirstProduct(): Promise<string> {
        const firstCard = this.shopElements.PRODUCT_CARDS.first();
        const title = await firstCard.getByRole('heading', { level: 3 }).textContent();
        await firstCard.click();
        return title ?? '';
    }

    async getAllProductPrices(): Promise<number[]> {
        const priceTexts = await this.shopElements.PRODUCT_PRICES.allTextContents();
        return priceTexts.map(text => {
            const cleaned = text.replace(/[^\d]/g, '');
            return Number.parseInt(cleaned, 10);
        }).filter(n => Number.isFinite(n));
    }

    async filterByPriceRange(min: number, max: number): Promise<void> {
        await this.shopElements.PRICE_MIN_INPUT.fill(String(min));
        await this.shopElements.PRICE_MAX_INPUT.fill(String(max));
        await this.shopElements.PRICE_MAX_INPUT.press('Enter');
        await this.waitForNavigation();
    }
}
