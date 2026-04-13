import { type Page, type Locator } from '@playwright/test';

export default class HomePageElements {
    readonly page: Page;

    // NAVBAR
    readonly LOGO: Locator;
    readonly HOME_LINK: Locator;
    readonly SHOP_LINK: Locator;
    readonly CATS_MENU: Locator;
    readonly DOGS_MENU: Locator
    readonly ABOUT_US_LINK: Locator;
    readonly SIGN_IN_BUTTON: Locator;
    readonly SIGN_UP_BUTTON: Locator;
    readonly CART_ICON: Locator;
    readonly SEARCH_ICON: Locator;
    readonly SEARCH_INPUT: Locator;
    readonly ACCOUNT_BUTTON: Locator;

    // HERO CAROUSEL
    readonly HERO_CAROUSEL: Locator;
    readonly HERO_HEADING: Locator;
    readonly HERO_SHOP_NOW_LINK: Locator;
    readonly HERO_EXPLORE_FOOD_LINK: Locator;
    readonly HERO_VIEW_TOYS_LINK: Locator;
    readonly CAROUSEL_PREV_BUTTON: Locator;
    readonly CAROUSEL_NEXT_BUTTON: Locator;
    readonly CAROUSEL_SLIDE_BUTTONS: Locator;

    // SERVICE HIGHLIGHTS
    readonly FREE_DELIVERY_HEADING: Locator;
    readonly RETURN_POLICY_HEADING: Locator;
    readonly SECURE_PAYMENT_HEADING: Locator;
    readonly SUPPORT_HEADING: Locator;

    // FEATURED PRODUCTS SECTION
    readonly FEATURED_PRODUCTS_H2: Locator;
    readonly FEATURED_PRODUCTS_SUBTITLE: Locator;
    readonly VIEW_ALL_PRODUCTS_LINK: Locator;
    readonly FEATURED_PRODUCT_CARDS: Locator;
    readonly FEATURED_PRODUCT_TITLES: Locator;
    readonly FEATURED_PRODUCT_DESCRIPTIONS: Locator;
    readonly FEATURED_PRODUCT_PRICES: Locator;
    readonly FEATURED_PRODUCT_RATINGS: Locator;
    readonly FEATURED_WISHLIST_BUTTONS: Locator;

    // CAT PRODUCTS SECTION
    readonly CAT_PRODUCTS_H2: Locator;
    readonly CAT_PRODUCT_CARDS: Locator;
    readonly CAT_ADD_TO_CART_BUTTONS: Locator;
    readonly VIEW_ALL_CAT_PRODUCTS_LINK: Locator;

    // DOG PRODUCTS SECTION
    readonly DOG_PRODUCTS_H2: Locator;
    readonly DOG_PRODUCT_CARDS: Locator;
    readonly DOG_ADD_TO_CART_BUTTONS: Locator;
    readonly VIEW_ALL_DOG_PRODUCTS_LINK: Locator;

    // NEWSLETTER SECTION
    readonly NEWSLETTER_HEADING: Locator;
    readonly NEWSLETTER_SUBTITLE: Locator;
    readonly NEWSLETTER_EMAIL_FIELD: Locator;
    readonly NEWSLETTER_SUBSCRIBE_BUTTON: Locator;

    constructor(page: Page) {
        this.page = page;

        // NAVBAR
        this.LOGO = page.locator('[data-testid="header-logo"]');
        this.HOME_LINK = page.locator('[data-testid="nav-home-link"]');
        this.SHOP_LINK = page.locator('[data-testid="nav-shop-link"]');
        this.CATS_MENU = page.locator('[data-testid="nav-cats-link"]');
        this.DOGS_MENU = page.locator('[data-testid="nav-dogs-link"]');
        this.ABOUT_US_LINK = page.locator('[data-testid="nav-about-link"]');
        this.SIGN_IN_BUTTON = page.locator('[data-testid="header-signin-btn"]');
        this.SIGN_UP_BUTTON = page.locator('[data-testid="header-signup-btn"]');
        this.CART_ICON = page.locator('[data-testid="header-cart-btn"]');
        this.SEARCH_ICON = page.locator('[data-testid="header-search-open"]');
        this.SEARCH_INPUT = page.locator('[data-testid="header-search-input"]');
        this.ACCOUNT_BUTTON = page.locator('[data-testid="header-account-btn"]');

        // HERO CAROUSEL
        this.HERO_CAROUSEL = page.locator('[data-testid="hero-slider"]');
        this.HERO_HEADING = page.getByRole('heading', { name: 'What your pet needs, when they need it.' });
        this.HERO_SHOP_NOW_LINK = page.locator('[data-testid="hero-cta-0"]');
        this.HERO_EXPLORE_FOOD_LINK = page.locator('[data-testid="hero-cta-1"]');
        this.HERO_VIEW_TOYS_LINK = page.locator('[data-testid="hero-cta-2"]');
        this.CAROUSEL_PREV_BUTTON = page.locator('[data-testid="hero-prev"]');
        this.CAROUSEL_NEXT_BUTTON = page.locator('[data-testid="hero-next"]');
        this.CAROUSEL_SLIDE_BUTTONS = page.locator('[data-testid^="hero-dot-"]');

        // SERVICE HIGHLIGHTS
        this.FREE_DELIVERY_HEADING = page.getByRole('heading', { name: 'Free Same-Day Delivery' });
        this.RETURN_POLICY_HEADING = page.getByRole('heading', { name: '30-Day Return' });
        this.SECURE_PAYMENT_HEADING = page.getByRole('heading', { name: 'Secure Payment' });
        this.SUPPORT_HEADING = page.getByRole('heading', { name: '24/7 Support' });

        // FEATURED PRODUCTS SECTION
        this.FEATURED_PRODUCTS_H2 = page.locator('[data-testid="featured-products-title"]');
        this.FEATURED_PRODUCTS_SUBTITLE = page.getByText('Handpicked products for your furry friends');
        this.VIEW_ALL_PRODUCTS_LINK = page.locator('[data-testid="view-all-products-link"]');
        this.FEATURED_PRODUCT_CARDS = page.locator('[data-testid="featured-products-grid"] a[data-testid^="product-card-link-"]');
        this.FEATURED_PRODUCT_TITLES = page.locator('[data-testid="featured-products-grid"] [data-testid^="product-card-"] h3');
        this.FEATURED_PRODUCT_DESCRIPTIONS = page.locator('[data-testid="featured-products-grid"] [data-testid^="product-card-"] p');
        this.FEATURED_PRODUCT_PRICES = page.locator('[data-testid="featured-products-grid"] [data-testid^="product-card-"] div:has-text("Rp")');
        this.FEATURED_PRODUCT_RATINGS = page.locator('[data-testid="featured-products-grid"] [data-testid^="product-card-"]');
        this.FEATURED_WISHLIST_BUTTONS = page.locator('[data-testid^="wishlist-btn-"]');

        // CAT PRODUCTS SECTION
        this.CAT_PRODUCTS_H2 = page.locator('[data-testid="cat-products-title"]');
        this.CAT_PRODUCT_CARDS = page.locator('[data-testid="cat-products-grid"] a[data-testid^="product-card-link-"]');
        this.CAT_ADD_TO_CART_BUTTONS = page.locator('[data-testid^="add-to-cart-"]');
        this.VIEW_ALL_CAT_PRODUCTS_LINK = page.locator('[data-testid="view-all-cat-products-btn"]');

        // DOG PRODUCTS SECTION
        this.DOG_PRODUCTS_H2 = page.locator('[data-testid="dog-products-title"]');
        this.DOG_PRODUCT_CARDS = page.locator('[data-testid="dog-products-grid"] a[data-testid^="product-card-link-"]');
        this.DOG_ADD_TO_CART_BUTTONS = page.locator('[data-testid^="add-to-cart-"]');
        this.VIEW_ALL_DOG_PRODUCTS_LINK = page.locator('[data-testid="view-all-dog-products-btn"]');

        // NEWSLETTER SECTION
        this.NEWSLETTER_HEADING = page.locator('[data-testid="newsletter-title"]');
        this.NEWSLETTER_SUBTITLE = page.getByText('Subscribe to our newsletter for exclusive offers');
        this.NEWSLETTER_EMAIL_FIELD = page.locator('[data-testid="newsletter-email-input"]');
        this.NEWSLETTER_SUBSCRIBE_BUTTON = page.locator('[data-testid="newsletter-subscribe-btn"]');
    }
}
