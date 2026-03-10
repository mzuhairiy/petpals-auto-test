import { type Page, type Locator } from '@playwright/test';

export default class LayoutElements {
    readonly page: Page;

    // HEADER / LOGO
    readonly PETPALS_LOGO: Locator;

    // NAVBAR
    readonly NAVBAR: Locator;
    readonly NAVBAR_LINKS: Locator;
    readonly NAV_HOME: Locator;
    readonly NAV_SHOP: Locator;
    readonly NAV_CATS: Locator;
    readonly NAV_DOGS: Locator;
    readonly NAV_ABOUT: Locator;

    // HEADER ACTIONS
    readonly SEARCH_BUTTON: Locator;
    readonly SIGN_IN_BUTTON: Locator;
    readonly SIGN_UP_BUTTON: Locator;
    readonly CART_BUTTON: Locator;
    readonly MOBILE_MENU_BUTTON: Locator;

    // FOOTER
    readonly FOOTER: Locator;
    readonly FOOTER_SHOP_LINKS: Locator;
    readonly FOOTER_COMPANY_LINKS: Locator;
    readonly FOOTER_CUSTOMER_SERVICE_LINKS: Locator;
    readonly FOOTER_SOCIAL_LINKS: Locator;
    readonly FOOTER_COPYRIGHT: Locator;

    // FOOTER SHOP SECTION
    readonly FOOTER_PET_TOYS: Locator;
    readonly FOOTER_PET_FOOD: Locator;
    readonly FOOTER_SUPPLEMENTS: Locator;
    readonly FOOTER_CAT_PRODUCTS: Locator;
    readonly FOOTER_DOG_PRODUCTS: Locator;

    // FOOTER COMPANY SECTION
    readonly FOOTER_ABOUT_US: Locator;
    readonly FOOTER_CAREERS: Locator;
    readonly FOOTER_BLOG: Locator;
    readonly FOOTER_CONTACT: Locator;

    // FOOTER CUSTOMER SERVICE SECTION
    readonly FOOTER_HELP_CENTER: Locator;
    readonly FOOTER_SHIPPING: Locator;
    readonly FOOTER_RETURNS: Locator;
    readonly FOOTER_CONTACT_US: Locator;
    readonly FOOTER_WISHLIST: Locator;
    readonly FOOTER_PRIVACY_POLICY: Locator;
    readonly FOOTER_TERMS: Locator;

    constructor(page: Page) {
        this.page = page;

        // HEADER / LOGO
        this.PETPALS_LOGO = page.locator('header a[href="/"]');

        // NAVBAR
        this.NAVBAR = page.locator('header nav');
        this.NAVBAR_LINKS = page.locator('header nav a');
        this.NAV_HOME = page.locator('header nav a[href="/"]');
        this.NAV_SHOP = page.locator('header nav a[href="/shop"]');
        this.NAV_CATS = page.locator('header nav a[href="/shop?pet=cat"]');
        this.NAV_DOGS = page.locator('header nav a[href="/shop?pet=dog"]');
        this.NAV_ABOUT = page.locator('header nav a[href="/about"]');

        // HEADER ACTIONS
        this.SEARCH_BUTTON = page.getByRole('button', { name: 'Search' });
        this.SIGN_IN_BUTTON = page.locator('header').getByRole('link', { name: 'Sign In' }).or(page.locator('header a[href="/sign-in"] button'));
        this.SIGN_UP_BUTTON = page.locator('header').getByRole('link', { name: 'Sign Up' }).or(page.locator('header a[href="/sign-up"] button'));
        this.CART_BUTTON = page.locator('header a[href="/cart"] button');
        this.MOBILE_MENU_BUTTON = page.getByRole('button', { name: 'Toggle menu' });

        // FOOTER
        this.FOOTER = page.locator('footer');
        this.FOOTER_SHOP_LINKS = page.locator('footer').getByRole('heading', { name: 'Shop' }).locator('..').locator('ul a');
        this.FOOTER_COMPANY_LINKS = page.locator('footer').getByRole('heading', { name: 'Company' }).locator('..').locator('ul a');
        this.FOOTER_CUSTOMER_SERVICE_LINKS = page.locator('footer').getByRole('heading', { name: 'Customer Service' }).locator('..').locator('ul a');
        this.FOOTER_SOCIAL_LINKS = page.locator('footer a[href="#"]');
        this.FOOTER_COPYRIGHT = page.locator('footer').getByText('© — PetPals. All rights reserved.');

        // FOOTER SHOP SECTION
        this.FOOTER_PET_TOYS = page.locator('footer a[href="/shop?category=toys"]');
        this.FOOTER_PET_FOOD = page.locator('footer a[href="/shop?category=food"]');
        this.FOOTER_SUPPLEMENTS = page.locator('footer a[href="/shop?category=supplements"]');
        this.FOOTER_CAT_PRODUCTS = page.locator('footer a[href="/shop?pet=cat"]');
        this.FOOTER_DOG_PRODUCTS = page.locator('footer a[href="/shop?pet=dog"]');

        // FOOTER COMPANY SECTION
        this.FOOTER_ABOUT_US = page.locator('footer a[href="/about"]');
        this.FOOTER_CAREERS = page.locator('footer a[href="/careers"]');
        this.FOOTER_BLOG = page.locator('footer a[href="/blog"]');
        this.FOOTER_CONTACT = page.locator('footer').getByRole('heading', { name: 'Company' }).locator('..').locator('a[href="/contact"]');

        // FOOTER CUSTOMER SERVICE SECTION
        this.FOOTER_HELP_CENTER = page.locator('footer a[href="/help"]');
        this.FOOTER_SHIPPING = page.locator('footer a[href="/shipping"]');
        this.FOOTER_RETURNS = page.locator('footer a[href="/returns"]');
        this.FOOTER_CONTACT_US = page.locator('footer').getByRole('heading', { name: 'Customer Service' }).locator('..').locator('a[href="/contact"]');
        this.FOOTER_WISHLIST = page.locator('footer a[href="/wishlist"]');
        this.FOOTER_PRIVACY_POLICY = page.locator('footer a[href="/privacy"]');
        this.FOOTER_TERMS = page.locator('footer a[href="/terms"]');
    }
}
