import { type Page, type Locator } from '@playwright/test';

/**
 * Layout Elements - Header, Footer, and Navigation locators
 *
 * LOCATOR STRATEGY: No data-testid attributes available.
 * Using role-based selectors scoped to banner/contentinfo landmarks.
 * Navigation links use exact name matching for uniqueness.
 */
export default class LayoutElements {
    readonly page: Page;

    // HEADER - scoped to banner landmark for uniqueness
    readonly PETPALS_LOGO: Locator;
    readonly NAV_HOME: Locator;
    readonly NAV_SHOP: Locator;
    readonly NAV_CATS: Locator;
    readonly NAV_DOGS: Locator;
    readonly NAV_ABOUT: Locator;
    readonly NAVBAR_LINKS: Locator;

    // HEADER ACTIONS - unauthenticated state
    readonly SEARCH_BUTTON: Locator;
    readonly SIGN_IN_BUTTON: Locator;
    readonly SIGN_UP_BUTTON: Locator;
    readonly CART_BUTTON: Locator;

    // HEADER ACTIONS - authenticated state (visible after login)
    readonly WISHLIST_BUTTON: Locator;
    readonly ORDERS_BUTTON: Locator;
    readonly ACCOUNT_BUTTON: Locator;
    readonly SIGN_OUT_BUTTON: Locator;

    // FOOTER - scoped to contentinfo landmark
    readonly FOOTER: Locator;
    readonly FOOTER_COPYRIGHT: Locator;

    // FOOTER SHOP LINKS
    readonly FOOTER_SHOP_LINKS: Locator;
    readonly FOOTER_PET_TOYS: Locator;
    readonly FOOTER_PET_FOOD: Locator;
    readonly FOOTER_SUPPLEMENTS: Locator;
    readonly FOOTER_CAT_PRODUCTS: Locator;
    readonly FOOTER_DOG_PRODUCTS: Locator;

    // FOOTER COMPANY LINKS
    readonly FOOTER_COMPANY_LINKS: Locator;
    readonly FOOTER_ABOUT_US: Locator;
    readonly FOOTER_CAREERS: Locator;
    readonly FOOTER_BLOG: Locator;
    readonly FOOTER_CONTACT: Locator;

    // FOOTER CUSTOMER SERVICE LINKS
    readonly FOOTER_CUSTOMER_SERVICE_LINKS: Locator;
    readonly FOOTER_HELP_CENTER: Locator;
    readonly FOOTER_SHIPPING: Locator;
    readonly FOOTER_RETURNS: Locator;
    readonly FOOTER_CONTACT_US: Locator;
    readonly FOOTER_WISHLIST: Locator;
    readonly FOOTER_PRIVACY_POLICY: Locator;
    readonly FOOTER_TERMS: Locator;

    // FOOTER SOCIAL LINKS
    readonly FOOTER_SOCIAL_LINKS: Locator;

    // ACCOUNT PAGE
    readonly ACCOUNT_HEADING: Locator;

    // ORDERS PAGE
    readonly ORDERS_HEADING: Locator;

    constructor(page: Page) {
        this.page = page;

        const header = page.getByRole('banner');
        const footer = page.getByRole('contentinfo');

        // HEADER - using banner landmark scope
        this.PETPALS_LOGO = page.locator('[data-testid="header-logo"]');
        this.NAV_HOME = page.locator('[data-testid="nav-home-link"]');
        this.NAV_SHOP = page.locator('[data-testid="nav-shop-link"]');
        this.NAV_CATS = page.locator('[data-testid="nav-cats-link"]');
        this.NAV_DOGS = page.locator('[data-testid="nav-dogs-link"]');
        this.NAV_ABOUT = page.locator('[data-testid="nav-about-link"]');
        this.NAVBAR_LINKS = header.getByRole('navigation').getByRole('link');

        // HEADER ACTIONS - unauthenticated
        this.SEARCH_BUTTON = page.locator('[data-testid="header-search-open"]');
        this.SIGN_IN_BUTTON = header.getByRole('link', { name: 'Sign In' });
        this.SIGN_UP_BUTTON = header.getByRole('link', { name: 'Sign Up' });
        this.CART_BUTTON = page.locator('[data-testid="header-cart-link"]');

        // HEADER ACTIONS - authenticated (appear after login)
        this.WISHLIST_BUTTON = page.locator('[data-testid="header-wishlist-link"]');
        this.ORDERS_BUTTON = page.locator('[data-testid="header-orders-link"]');
        this.ACCOUNT_BUTTON = page.locator('[data-testid="header-account-link"]');
        this.SIGN_OUT_BUTTON = page.locator('[data-testid="header-signout-btn"]');

        // FOOTER
        this.FOOTER = page.locator('[data-testid="footer"]');
        this.FOOTER_COPYRIGHT = footer.getByText(/© \d{4} PetPals/);

        // FOOTER SHOP LINKS - scoped to Shop heading section
        this.FOOTER_SHOP_LINKS = footer.getByRole('list').first().getByRole('link');
        this.FOOTER_PET_TOYS = page.locator('[data-testid="footer-link-toys"]');
        this.FOOTER_PET_FOOD = page.locator('[data-testid="footer-link-food"]');
        this.FOOTER_SUPPLEMENTS = page.locator('[data-testid="footer-link-supplements"]');
        this.FOOTER_CAT_PRODUCTS = page.locator('[data-testid="footer-link-cat-products"]');
        this.FOOTER_DOG_PRODUCTS = page.locator('[data-testid="footer-link-dog-products"]');

        // FOOTER COMPANY LINKS
        this.FOOTER_COMPANY_LINKS = footer.getByRole('list').nth(1).getByRole('link');
        this.FOOTER_ABOUT_US = page.locator('[data-testid="footer-link-about"]');
        this.FOOTER_CAREERS = page.locator('[data-testid="footer-link-careers"]');
        this.FOOTER_BLOG = page.locator('[data-testid="footer-link-blog"]');
        this.FOOTER_CONTACT = page.locator('[data-testid="footer-link-contact"]');

        // FOOTER CUSTOMER SERVICE LINKS
        this.FOOTER_CUSTOMER_SERVICE_LINKS = footer.getByRole('list').nth(2).getByRole('link');
        this.FOOTER_HELP_CENTER = page.locator('[data-testid="footer-link-help"]');
        this.FOOTER_SHIPPING = page.locator('[data-testid="footer-link-shipping"]');
        this.FOOTER_RETURNS = page.locator('[data-testid="footer-link-returns"]');
        this.FOOTER_CONTACT_US = page.locator('[data-testid="footer-link-contact-us"]');
        this.FOOTER_WISHLIST = page.locator('[data-testid="footer-link-wishlist"]');
        this.FOOTER_PRIVACY_POLICY = page.locator('[data-testid="footer-link-privacy"]');
        this.FOOTER_TERMS = page.locator('[data-testid="footer-link-terms"]');

        // FOOTER SOCIAL LINKS
        this.FOOTER_SOCIAL_LINKS = footer.getByRole('link', { name: /Facebook|Instagram|Twitter|YouTube/ });

        // ACCOUNT PAGE
        this.ACCOUNT_HEADING = page.locator('.tracking-tight.text-2xl.font-bold.flex.items-center.gap-2');

        // ORDERS PAGE
        this.ORDERS_HEADING = page.getByRole('heading', { name: 'Order History', level: 1 });
    }
}
