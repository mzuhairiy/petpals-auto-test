import { type Page, type Locator } from '@playwright/test';

/**
 * Shop Page Elements - Locators for the shop/product listing page
 *
 * LOCATOR STRATEGY: No data-testid attributes available.
 * Filters use role-based selectors with exact checkbox/button names.
 * Product cards use href-based selectors for uniqueness.
 */
export default class ShopPageElements {
    readonly page: Page;

    // PAGE HEADING - unique h1 on shop page
    readonly SHOP_HEADING: Locator;

    // FILTER BUTTONS - unique accordion button names
    readonly CATEGORY_FILTER_BUTTON: Locator;
    readonly PET_TYPE_FILTER_BUTTON: Locator;
    readonly PRICE_RANGE_FILTER_BUTTON: Locator;
    readonly SORT_BY_FILTER_BUTTON: Locator;

    // CATEGORY CHECKBOXES - unique checkbox labels
    readonly CATEGORY_TOYS_CHECKBOX: Locator;
    readonly CATEGORY_FOOD_CHECKBOX: Locator;
    readonly CATEGORY_SUPPLEMENTS_CHECKBOX: Locator;

    // PET TYPE CHECKBOXES - unique checkbox labels
    readonly PET_TYPE_CATS_CHECKBOX: Locator;
    readonly PET_TYPE_DOGS_CHECKBOX: Locator;

    // PRICE RANGE - unique spinbutton labels
    readonly PRICE_MIN_INPUT: Locator;
    readonly PRICE_MAX_INPUT: Locator;

    // SORT OPTIONS - unique checkbox labels
    readonly SORT_PRICE_LOW_HIGH: Locator;
    readonly SORT_PRICE_HIGH_LOW: Locator;
    readonly SORT_HIGHEST_RATED: Locator;
    readonly SORT_NEWEST_FIRST: Locator;

    // PRODUCT CARDS - using href pattern for product links
    readonly PRODUCT_CARDS: Locator;
    readonly PRODUCT_TITLES: Locator;
    readonly PRODUCT_DISCOUNT_BADGES: Locator;

    constructor(page: Page) {
        this.page = page;

        const main = page.getByRole('main');

        // PAGE HEADING
        this.SHOP_HEADING = main.getByRole('heading', { level: 1 });

        // FILTER BUTTONS
        this.CATEGORY_FILTER_BUTTON = main.getByRole('button', { name: 'Category' });
        this.PET_TYPE_FILTER_BUTTON = main.getByRole('button', { name: 'Pet Type' });
        this.PRICE_RANGE_FILTER_BUTTON = main.getByRole('button', { name: 'Price Range' });
        this.SORT_BY_FILTER_BUTTON = main.getByRole('button', { name: 'Sort By' });

        // CATEGORY CHECKBOXES
        this.CATEGORY_TOYS_CHECKBOX = main.getByRole('checkbox', { name: 'Toys' });
        this.CATEGORY_FOOD_CHECKBOX = main.getByRole('checkbox', { name: 'Food' });
        this.CATEGORY_SUPPLEMENTS_CHECKBOX = main.getByRole('checkbox', { name: 'Supplements' });

        // PET TYPE CHECKBOXES
        this.PET_TYPE_CATS_CHECKBOX = main.getByRole('checkbox', { name: 'Cats' });
        this.PET_TYPE_DOGS_CHECKBOX = main.getByRole('checkbox', { name: 'Dogs' });

        // PRICE RANGE
        this.PRICE_MIN_INPUT = main.getByRole('spinbutton', { name: 'Min' });
        this.PRICE_MAX_INPUT = main.getByRole('spinbutton', { name: 'Max' });

        // SORT OPTIONS
        this.SORT_PRICE_LOW_HIGH = main.getByRole('checkbox', { name: 'Price: Low to High' });
        this.SORT_PRICE_HIGH_LOW = main.getByRole('checkbox', { name: 'Price: High to Low' });
        this.SORT_HIGHEST_RATED = main.getByRole('checkbox', { name: 'Highest Rated' });
        this.SORT_NEWEST_FIRST = main.getByRole('checkbox', { name: 'Newest First' });

        // PRODUCT CARDS - links with /product/ href pattern
        this.PRODUCT_CARDS = main.locator('a[href^="/product/"]');
        this.PRODUCT_TITLES = main.getByRole('heading', { level: 3 });
        this.PRODUCT_DISCOUNT_BADGES = main.getByText(/\d+% OFF/);
    }
}
