import { type Page, type Locator } from '@playwright/test';

export default class ProductPageElements {
    readonly page: Page;

    // NAVIGATION
    readonly BACK_TO_SHOP_LINK: Locator;

    // PRODUCT DETAILS
    readonly PRODUCT_TITLE: Locator;
    readonly PRODUCT_MAIN_IMAGE: Locator;
    readonly PRODUCT_THUMBNAIL_IMAGES: Locator;
    readonly PRODUCT_RATING: Locator;
    readonly PRODUCT_REVIEW_COUNT: Locator;
    readonly PRODUCT_CURRENT_PRICE: Locator;
    readonly PRODUCT_ORIGINAL_PRICE: Locator;
    readonly PRODUCT_SAVE_AMOUNT: Locator;
    readonly PRODUCT_DESCRIPTION: Locator;
    readonly PRODUCT_STOCK_STATUS: Locator;
    readonly FREE_SHIPPING_INFO: Locator;

    // QUANTITY & CART
    readonly QUANTITY_INPUT: Locator;
    readonly DECREASE_QUANTITY_BUTTON: Locator;
    readonly INCREASE_QUANTITY_BUTTON: Locator;
    readonly ADD_TO_CART_BUTTON: Locator;
    readonly ADD_TO_WISHLIST_BUTTON: Locator;

    // PRODUCT INFO BADGES
    readonly FREE_DELIVERY_INFO: Locator;
    readonly RETURNS_INFO: Locator;
    readonly SECURE_CHECKOUT_INFO: Locator;

    // TABS
    readonly DESCRIPTION_TAB: Locator;
    readonly NUTRITIONAL_DETAILS_TAB: Locator;
    readonly REVIEWS_TAB: Locator;
    readonly TAB_CONTENT: Locator;

    // DESCRIPTION TAB CONTENT
    readonly DESCRIPTION_TEXT: Locator;
    readonly DESCRIPTION_FEATURES: Locator;

    // RELATED PRODUCTS
    readonly RELATED_PRODUCTS_HEADING: Locator;
    readonly RELATED_PRODUCT_CARDS: Locator;
    readonly RELATED_PRODUCT_TITLES: Locator;

    constructor(page: Page) {
        this.page = page;

        // NAVIGATION
        this.BACK_TO_SHOP_LINK = page.locator('[data-testid="back-to-shop-link"]');

        // PRODUCT DETAILS
        this.PRODUCT_TITLE = page.locator('[data-testid^="product-title-"]');
        this.PRODUCT_MAIN_IMAGE = page.locator('[data-testid^="product-image-"]');
        this.PRODUCT_THUMBNAIL_IMAGES = page.locator('[data-testid^="product-thumb-"]');
        this.PRODUCT_RATING = page.locator('main').locator('text=/\\d\\.\\d/').first();
        this.PRODUCT_REVIEW_COUNT = page.locator('main').locator('text=/\\(\\d+ reviews\\)/');
        this.PRODUCT_CURRENT_PRICE = page.locator('[data-testid^="product-price-"]');
        this.PRODUCT_ORIGINAL_PRICE = page.locator('[data-testid^="product-original-price-"]');
        this.PRODUCT_SAVE_AMOUNT = page.locator('main').getByText(/Save Rp/);
        this.PRODUCT_DESCRIPTION = page.locator('main p').first();
        this.PRODUCT_STOCK_STATUS = page.locator('[data-testid^="product-stock-"]');
        this.FREE_SHIPPING_INFO = page.getByText(/Free shipping on orders over/);

        // QUANTITY & CART
        this.QUANTITY_INPUT = page.locator('[data-testid$="-qty-input"]');
        this.DECREASE_QUANTITY_BUTTON = page.locator('[data-testid$="-qty-decrement"]');
        this.INCREASE_QUANTITY_BUTTON = page.locator('[data-testid$="-qty-increment"]');
        this.ADD_TO_CART_BUTTON = page.locator('[data-testid$="-add-to-cart"]');
        this.ADD_TO_WISHLIST_BUTTON = page.locator('[data-testid^="wishlist-btn-"]');

        // PRODUCT INFO BADGES
        this.FREE_DELIVERY_INFO = page.getByText('Free Delivery');
        this.RETURNS_INFO = page.getByText('30-Day Returns');
        this.SECURE_CHECKOUT_INFO = page.getByText('Secure Checkout');

        // TABS
        this.DESCRIPTION_TAB = page.locator('[data-testid="product-tab-description"]');
        this.NUTRITIONAL_DETAILS_TAB = page.locator('[data-testid="product-tab-details"]');
        this.REVIEWS_TAB = page.locator('[data-testid="product-tab-reviews"]');
        this.TAB_CONTENT = page.getByRole('tabpanel');

        // DESCRIPTION TAB CONTENT
        this.DESCRIPTION_TEXT = page.getByRole('tabpanel').locator('p');
        this.DESCRIPTION_FEATURES = page.getByRole('tabpanel').locator('li');

        // RELATED PRODUCTS
        this.RELATED_PRODUCTS_HEADING = page.locator('[data-testid="related-products-section"]');
        this.RELATED_PRODUCT_CARDS = page.locator('[data-testid="related-products-grid"] a[data-testid^="product-card-link-"]');
        this.RELATED_PRODUCT_TITLES = page.locator('[data-testid="related-products-grid"] [data-testid^="product-card-"] h3');
    }
}
