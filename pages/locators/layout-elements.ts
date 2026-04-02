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

    constructor(page: Page) {
        this.page = page;

        const header = page.getByRole('banner');
        const footer = page.getByRole('contentinfo');

        // HEADER - using banner landmark scope
        this.PETPALS_LOGO = header.getByRole('link', { name: 'PetPals' });
        this.NAV_HOME = header.getByRole('link', { name: 'Home', exact: true });
        this.NAV_SHOP = header.getByRole('link', { name: 'Shop', exact: true });
        this.NAV_CATS = header.getByRole('link', { name: 'Cats', exact: true });
        this.NAV_DOGS = header.getByRole('link', { name: 'Dogs', exact: true });
        this.NAV_ABOUT = header.getByRole('link', { name: 'About Us', exact: true });
        this.NAVBAR_LINKS = header.getByRole('navigation').getByRole('link');

        // HEADER ACTIONS - unauthenticated
        this.SEARCH_BUTTON = header.getByRole('button', { name: 'Search' });
        this.SIGN_IN_BUTTON = header.getByRole('link', { name: 'Sign In' });
        this.SIGN_UP_BUTTON = header.getByRole('link', { name: 'Sign Up' });
        this.CART_BUTTON = header.getByRole('link', { name: 'Cart' });

        // HEADER ACTIONS - authenticated (appear after login)
        this.WISHLIST_BUTTON = header.getByRole('link', { name: 'Wishlist' });
        this.ORDERS_BUTTON = header.getByRole('link', { name: 'Orders' });
        this.ACCOUNT_BUTTON = header.getByRole('link', { name: /^[A-Z]/ }); // Matches user name like "Garaga Ra"
        this.SIGN_OUT_BUTTON = header.getByRole('button', { name: 'Sign Out' });

        // FOOTER
        this.FOOTER = footer;
        this.FOOTER_COPYRIGHT = footer.getByText(/© \d{4} PetPals/);

        // FOOTER SHOP LINKS - scoped to Shop heading section
        this.FOOTER_SHOP_LINKS = footer.getByRole('list').first().getByRole('link');
        this.FOOTER_PET_TOYS = footer.getByRole('link', { name: 'Pet Toys' });
        this.FOOTER_PET_FOOD = footer.getByRole('link', { name: 'Pet Food' });
        this.FOOTER_SUPPLEMENTS = footer.getByRole('link', { name: 'Supplements' });
        this.FOOTER_CAT_PRODUCTS = footer.getByRole('link', { name: 'Cat Products' });
        this.FOOTER_DOG_PRODUCTS = footer.getByRole('link', { name: 'Dog Products' });

        // FOOTER COMPANY LINKS
        this.FOOTER_COMPANY_LINKS = footer.getByRole('list').nth(1).getByRole('link');
        this.FOOTER_ABOUT_US = footer.getByRole('link', { name: 'About Us' });
        this.FOOTER_CAREERS = footer.getByRole('link', { name: 'Careers' });
        this.FOOTER_BLOG = footer.getByRole('link', { name: 'Blog' });
        this.FOOTER_CONTACT = footer.getByRole('link', { name: 'Contact', exact: true });

        // FOOTER CUSTOMER SERVICE LINKS
        this.FOOTER_CUSTOMER_SERVICE_LINKS = footer.getByRole('list').nth(2).getByRole('link');
        this.FOOTER_HELP_CENTER = footer.getByRole('link', { name: 'Help Center' });
        this.FOOTER_SHIPPING = footer.getByRole('link', { name: 'Shipping & Delivery' });
        this.FOOTER_RETURNS = footer.getByRole('link', { name: 'Returns & Refunds' });
        this.FOOTER_CONTACT_US = footer.getByRole('link', { name: 'Contact Us' });
        this.FOOTER_WISHLIST = footer.getByRole('link', { name: 'Wishlist' });
        this.FOOTER_PRIVACY_POLICY = footer.getByRole('link', { name: 'Privacy Policy' });
        this.FOOTER_TERMS = footer.getByRole('link', { name: 'Terms & Conditions' });

        // FOOTER SOCIAL LINKS
        this.FOOTER_SOCIAL_LINKS = footer.getByRole('link', { name: /Facebook|Instagram|Twitter|YouTube/ });
    }
}
