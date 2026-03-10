import { type Page, type Locator } from '@playwright/test';

export default class ShopPageElements {
    readonly page: Page;

    // PAGE HEADING
    readonly SHOP_HEADING: Locator;

    // FILTER - CATEGORY
    readonly CATEGORY_FILTER_BUTTON: Locator;
    readonly CATEGORY_TOYS_CHECKBOX: Locator;
    readonly CATEGORY_FOOD_CHECKBOX: Locator;
    readonly CATEGORY_SUPPLEMENTS_CHECKBOX: Locator;

    // FILTER - PET TYPE
    readonly PET_TYPE_FILTER_BUTTON: Locator;
    readonly PET_TYPE_CATS_CHECKBOX: Locator;
    readonly PET_TYPE_DOGS_CHECKBOX: Locator;

    // FILTER - PRICE RANGE
    readonly PRICE_RANGE_FILTER_BUTTON: Locator;
    readonly PRICE_MIN_INPUT: Locator;
    readonly PRICE_MAX_INPUT: Locator;

    // FILTER - SORT BY
    readonly SORT_BY_FILTER_BUTTON: Locator;
    readonly SORT_PRICE_LOW_HIGH: Locator;
    readonly SORT_PRICE_HIGH_LOW: Locator;
    readonly SORT_HIGHEST_RATED: Locator;
    readonly SORT_NEWEST_FIRST: Locator;

    // PRODUCT LISTING
    readonly PRODUCT_CARDS: Locator;
    readonly PRODUCT_TITLES: Locator;
    readonly PRODUCT_DESCRIPTIONS: Locator;
    readonly PRODUCT_PRICES: Locator;
    readonly PRODUCT_RATINGS: Locator;
    readonly PRODUCT_REVIEW_COUNTS: Locator;
    readonly PRODUCT_WISHLIST_BUTTONS: Locator;
    readonly PRODUCT_DISCOUNT_BADGES: Locator;
    readonly PRODUCT_NEW_BADGES: Locator;

    constructor(page: Page) {
        this.page = page;

        // PAGE HEADING
        this.SHOP_HEADING = page.getByRole('heading', { name: 'Shop Pet Products' });

        // FILTER - CATEGORY
        this.CATEGORY_FILTER_BUTTON = page.getByRole('button', { name: 'Category' });
        this.CATEGORY_TOYS_CHECKBOX = page.getByRole('checkbox', { name: 'Toys' });
        this.CATEGORY_FOOD_CHECKBOX = page.getByRole('checkbox', { name: 'Food' });
        this.CATEGORY_SUPPLEMENTS_CHECKBOX = page.getByRole('checkbox', { name: 'Supplements' });

        // FILTER - PET TYPE
        this.PET_TYPE_FILTER_BUTTON = page.getByRole('button', { name: 'Pet Type' });
        this.PET_TYPE_CATS_CHECKBOX = page.getByRole('checkbox', { name: 'Cats' });
        this.PET_TYPE_DOGS_CHECKBOX = page.getByRole('checkbox', { name: 'Dogs' });

        // FILTER - PRICE RANGE
        this.PRICE_RANGE_FILTER_BUTTON = page.getByRole('button', { name: 'Price Range' });
        this.PRICE_MIN_INPUT = page.getByRole('spinbutton', { name: 'Min' });
        this.PRICE_MAX_INPUT = page.getByRole('spinbutton', { name: 'Max' });

        // FILTER - SORT BY
        this.SORT_BY_FILTER_BUTTON = page.getByRole('button', { name: 'Sort By' });
        this.SORT_PRICE_LOW_HIGH = page.getByRole('checkbox', { name: 'Price: Low to High' });
        this.SORT_PRICE_HIGH_LOW = page.getByRole('checkbox', { name: 'Price: High to Low' });
        this.SORT_HIGHEST_RATED = page.getByRole('checkbox', { name: 'Highest Rated' });
        this.SORT_NEWEST_FIRST = page.getByRole('checkbox', { name: 'Newest First' });

        // PRODUCT LISTING
        this.PRODUCT_CARDS = page.locator('main a[href^="/product/"]');
        this.PRODUCT_TITLES = page.locator('main a[href^="/product/"] h3');
        this.PRODUCT_DESCRIPTIONS = page.locator('main a[href^="/product/"] p');
        this.PRODUCT_PRICES = page.locator('main a[href^="/product/"]').locator('div:has-text("Rp")').first();
        this.PRODUCT_RATINGS = page.locator('main a[href^="/product/"]').locator('text=/\\d\\.\\d/');
        this.PRODUCT_REVIEW_COUNTS = page.locator('main a[href^="/product/"]').locator('text=/\\(\\d+ Reviews\\)/');
        this.PRODUCT_WISHLIST_BUTTONS = page.getByRole('button', { name: 'Add to wishlist' });
        this.PRODUCT_DISCOUNT_BADGES = page.locator('main a[href^="/product/"]').locator('text=/\\d+% OFF/');
        this.PRODUCT_NEW_BADGES = page.locator('main a[href^="/product/"]').locator('text="New"');
    }
}
