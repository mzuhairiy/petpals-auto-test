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
        this.BACK_TO_SHOP_LINK = page.getByRole('link', { name: 'Back to Shop' });

        // PRODUCT DETAILS
        this.PRODUCT_TITLE = page.locator('main').getByRole('heading', { level: 1 });
        this.PRODUCT_MAIN_IMAGE = page.locator('main img').first();
        this.PRODUCT_THUMBNAIL_IMAGES = page.locator('main img[alt^="Product view"]');
        this.PRODUCT_RATING = page.locator('main').locator('text=/\\d\\.\\d/').first();
        this.PRODUCT_REVIEW_COUNT = page.locator('main').locator('text=/\\(\\d+ reviews\\)/');
        this.PRODUCT_CURRENT_PRICE = page.locator('main').locator('text=/Rp \\d/').first();
        this.PRODUCT_ORIGINAL_PRICE = page.locator('main').locator('text=/Rp \\d/').nth(1);
        this.PRODUCT_SAVE_AMOUNT = page.locator('main').getByText(/Save Rp/);
        this.PRODUCT_DESCRIPTION = page.locator('main p').first();
        this.PRODUCT_STOCK_STATUS = page.locator('main').getByText(/Stock|left/);
        this.FREE_SHIPPING_INFO = page.getByText(/Free shipping on orders over/);

        // QUANTITY & CART
        this.QUANTITY_INPUT = page.getByRole('spinbutton');
        this.DECREASE_QUANTITY_BUTTON = page.getByRole('button', { name: 'Decrease quantity' });
        this.INCREASE_QUANTITY_BUTTON = page.getByRole('button', { name: 'Increase quantity' });
        this.ADD_TO_CART_BUTTON = page.getByRole('button', { name: 'Add to Cart' });
        this.ADD_TO_WISHLIST_BUTTON = page.locator('main').getByRole('button', { name: 'Add to wishlist' }).first();

        // PRODUCT INFO BADGES
        this.FREE_DELIVERY_INFO = page.getByText('Free Delivery');
        this.RETURNS_INFO = page.getByText('30-Day Returns');
        this.SECURE_CHECKOUT_INFO = page.getByText('Secure Checkout');

        // TABS
        this.DESCRIPTION_TAB = page.getByRole('tab', { name: 'Description' });
        this.NUTRITIONAL_DETAILS_TAB = page.getByRole('tab', { name: 'Nutritional Details' });
        this.REVIEWS_TAB = page.getByRole('tab', { name: /Reviews/ });
        this.TAB_CONTENT = page.getByRole('tabpanel');

        // DESCRIPTION TAB CONTENT
        this.DESCRIPTION_TEXT = page.getByRole('tabpanel').locator('p');
        this.DESCRIPTION_FEATURES = page.getByRole('tabpanel').locator('li');

        // RELATED PRODUCTS
        this.RELATED_PRODUCTS_HEADING = page.getByRole('heading', { name: 'Related Products' });
        this.RELATED_PRODUCT_CARDS = page.locator('main').getByRole('heading', { name: 'Related Products' }).locator('..').locator('a[href^="/product/"]');
        this.RELATED_PRODUCT_TITLES = page.locator('main').getByRole('heading', { name: 'Related Products' }).locator('..').locator('a[href^="/product/"] h3');
    }
}
