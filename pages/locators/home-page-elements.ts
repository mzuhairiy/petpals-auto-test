import { type Page, type Locator } from '@playwright/test';

export default class HomePageElements {
    readonly page: Page;

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

        // HERO CAROUSEL
        this.HERO_CAROUSEL = page.locator('main').locator('div').first();
        this.HERO_HEADING = page.getByRole('heading', { name: 'What your pet needs, when they need it.' });
        this.HERO_SHOP_NOW_LINK = page.getByRole('link', { name: 'Shop Now' });
        this.HERO_EXPLORE_FOOD_LINK = page.getByRole('link', { name: 'Explore Food' });
        this.HERO_VIEW_TOYS_LINK = page.getByRole('link', { name: 'View Toys' });
        this.CAROUSEL_PREV_BUTTON = page.getByRole('button', { name: 'Previous slide' });
        this.CAROUSEL_NEXT_BUTTON = page.getByRole('button', { name: 'Next slide' });
        this.CAROUSEL_SLIDE_BUTTONS = page.getByRole('button', { name: /Go to slide/ });

        // SERVICE HIGHLIGHTS
        this.FREE_DELIVERY_HEADING = page.getByRole('heading', { name: 'Free Same-Day Delivery' });
        this.RETURN_POLICY_HEADING = page.getByRole('heading', { name: '30-Day Return' });
        this.SECURE_PAYMENT_HEADING = page.getByRole('heading', { name: 'Secure Payment' });
        this.SUPPORT_HEADING = page.getByRole('heading', { name: '24/7 Support' });

        // FEATURED PRODUCTS SECTION
        this.FEATURED_PRODUCTS_H2 = page.getByRole('heading', { name: 'Featured Products' });
        this.FEATURED_PRODUCTS_SUBTITLE = page.getByText('Handpicked products for your furry friends');
        this.VIEW_ALL_PRODUCTS_LINK = page.getByRole('link', { name: 'View All Products' });
        this.FEATURED_PRODUCT_CARDS = page.locator('main section, main > div > div').filter({ has: page.getByRole('heading', { name: 'Featured Products' }) }).locator('a[href^="/product/"]');
        this.FEATURED_PRODUCT_TITLES = page.locator('main').getByRole('heading', { level: 3 });
        this.FEATURED_PRODUCT_DESCRIPTIONS = page.locator('main a[href^="/product/"] p');
        this.FEATURED_PRODUCT_PRICES = page.locator('main a[href^="/product/"]').locator('div:has-text("Rp")');
        this.FEATURED_PRODUCT_RATINGS = page.locator('main a[href^="/product/"]').locator('text=/\\d\\.\\d/');
        this.FEATURED_WISHLIST_BUTTONS = page.getByRole('button', { name: 'Add to wishlist' });

        // CAT PRODUCTS SECTION
        this.CAT_PRODUCTS_H2 = page.getByRole('heading', { name: 'Cat Products' });
        this.CAT_PRODUCT_CARDS = page.locator('main').filter({ has: page.getByRole('heading', { name: 'Cat Products' }) }).locator('a[href^="/product/"]');
        this.CAT_ADD_TO_CART_BUTTONS = page.locator('main').getByRole('heading', { name: 'Cat Products' }).locator('..').locator('..').getByRole('button', { name: 'Add to cart' });
        this.VIEW_ALL_CAT_PRODUCTS_LINK = page.getByRole('link', { name: 'View All Cat Products' });

        // DOG PRODUCTS SECTION
        this.DOG_PRODUCTS_H2 = page.getByRole('heading', { name: 'Dog Products' });
        this.DOG_PRODUCT_CARDS = page.locator('main').filter({ has: page.getByRole('heading', { name: 'Dog Products' }) }).locator('a[href^="/product/"]');
        this.DOG_ADD_TO_CART_BUTTONS = page.locator('main').getByRole('heading', { name: 'Dog Products' }).locator('..').locator('..').getByRole('button', { name: 'Add to cart' });
        this.VIEW_ALL_DOG_PRODUCTS_LINK = page.getByRole('link', { name: 'View All Dog Products' });

        // NEWSLETTER SECTION
        this.NEWSLETTER_HEADING = page.getByRole('heading', { name: 'Join Our Pack' });
        this.NEWSLETTER_SUBTITLE = page.getByText('Subscribe to our newsletter for exclusive offers');
        this.NEWSLETTER_EMAIL_FIELD = page.getByPlaceholder('Your email address');
        this.NEWSLETTER_SUBSCRIBE_BUTTON = page.getByRole('button', { name: 'Subscribe' });
    }
}
