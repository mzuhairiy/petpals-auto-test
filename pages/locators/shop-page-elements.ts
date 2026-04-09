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
    readonly PRODUCT_PRICES: Locator;
    readonly PRODUCT_DISCOUNT_BADGES: Locator;

    // EMPTY STATE
    readonly EMPTY_STATE_MESSAGE: Locator;

    // TOAST NOTIFICATIONS - for validating real outcomes of filter/sort actions
    readonly TOAST_VIEWPORT: Locator;
    readonly TOAST_PRODUCT_ADDED: Locator;

    constructor(page: Page) {
        this.page = page;

        const main = page.getByRole('main');

        // PAGE HEADING
        this.SHOP_HEADING = page.locator('[data-testid="shop-page-title"]');

        // FILTER BUTTONS
        this.CATEGORY_FILTER_BUTTON = main.getByRole('button', { name: 'Category' });
        this.PET_TYPE_FILTER_BUTTON = main.getByRole('button', { name: 'Pet Type' });
        this.PRICE_RANGE_FILTER_BUTTON = main.getByRole('button', { name: 'Price Range' });
        this.SORT_BY_FILTER_BUTTON = main.getByRole('button', { name: 'Sort By' });

        // CATEGORY CHECKBOXES
        this.CATEGORY_TOYS_CHECKBOX = page.locator('[data-testid="filter-category-toys"]');
        this.CATEGORY_FOOD_CHECKBOX = page.locator('[data-testid="filter-category-food"]');
        this.CATEGORY_SUPPLEMENTS_CHECKBOX = page.locator('[data-testid="filter-category-supplements"]');

        // PET TYPE CHECKBOXES
        this.PET_TYPE_CATS_CHECKBOX = page.locator('[data-testid="filter-pet-cat"]');
        this.PET_TYPE_DOGS_CHECKBOX = page.locator('[data-testid="filter-pet-dog"]');

        // PRICE RANGE
        this.PRICE_MIN_INPUT = main.getByRole('spinbutton', { name: 'Min' });
        this.PRICE_MAX_INPUT = main.getByRole('spinbutton', { name: 'Max' });

        // SORT OPTIONS
        this.SORT_PRICE_LOW_HIGH = page.locator('[data-testid="filter-sort-price-asc"]');
        this.SORT_PRICE_HIGH_LOW = page.locator('[data-testid="filter-sort-price-desc"]');
        this.SORT_HIGHEST_RATED = page.locator('[data-testid="filter-sort-rating"]');
        this.SORT_NEWEST_FIRST = page.locator('[data-testid="filter-sort-newest"]');

        // PRODUCT CARDS - links with /product/ href pattern
        this.PRODUCT_CARDS = page.locator('[data-testid="product-grid"] a[data-testid^="product-card-link-"]');
        this.PRODUCT_TITLES = page.locator('[data-testid="product-grid"] [data-testid^="product-card-"] h3');
        this.PRODUCT_PRICES = page.locator('[data-testid="product-grid"] [data-testid^="product-card-"] [data-testid^="product-price-"]');
        this.PRODUCT_DISCOUNT_BADGES = page.locator('[data-testid^="badge-discount-"]');

        // EMPTY STATE
        this.EMPTY_STATE_MESSAGE = main.getByText(/no products found/i);

        // TOAST NOTIFICATIONS - for validating real outcomes of filter/sort actions
        this.TOAST_VIEWPORT = page.locator('[data-testid="toast-viewport"]');
        this.TOAST_PRODUCT_ADDED = this.TOAST_VIEWPORT.getByText('Added to wishlist');
    }
}
