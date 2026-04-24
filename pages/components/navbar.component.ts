import { type Page, type Locator } from '@playwright/test';

/**
 * NavbarComponent — reusable header/navigation component.
 *
 * Extracted from LayoutElements + HomePageElements to eliminate
 * duplicate navbar locators. Used by any page that has the header.
 */
export class NavbarComponent {
    readonly page: Page;

    // Logo
    readonly logo: Locator;

    // Navigation links
    readonly navHome: Locator;
    readonly navShop: Locator;
    readonly navCats: Locator;
    readonly navDogs: Locator;
    readonly navAbout: Locator;
    readonly allNavLinks: Locator;

    // Header actions — unauthenticated
    readonly searchButton: Locator;
    readonly searchInput: Locator;
    readonly signInButton: Locator;
    readonly signUpButton: Locator;
    readonly cartButton: Locator;

    // Header actions — authenticated
    readonly accountButton: Locator;
    readonly wishlistButton: Locator;
    readonly ordersButton: Locator;
    readonly signOutButton: Locator;

    constructor(page: Page) {
        this.page = page;

        const header = page.getByRole('banner');

        // Logo
        this.logo = page.locator('[data-testid="header-logo"]');

        // Navigation links
        this.navHome = page.locator('[data-testid="nav-home-link"]');
        this.navShop = page.locator('[data-testid="nav-shop-link"]');
        this.navCats = page.locator('[data-testid="nav-cats-link"]');
        this.navDogs = page.locator('[data-testid="nav-dogs-link"]');
        this.navAbout = page.locator('[data-testid="nav-about-link"]');
        this.allNavLinks = header.getByRole('navigation').getByRole('link');

        // Header actions — unauthenticated
        this.searchButton = page.locator('[data-testid="header-search-open"]');
        this.searchInput = page.locator('[data-testid="header-search-input"]');
        this.signInButton = page.locator('[data-testid="header-signin-btn"]');
        this.signUpButton = page.locator('[data-testid="header-signup-btn"]');
        this.cartButton = page.locator('[data-testid="header-cart-link"]');

        // Header actions — authenticated
        this.accountButton = page.locator('[data-testid="header-account-link"]');
        this.wishlistButton = page.locator('[data-testid="header-wishlist-link"]');
        this.ordersButton = page.locator('[data-testid="header-orders-link"]');
        this.signOutButton = page.locator('[data-testid="header-signout-btn"]');
    }

    // ── Interactions ──

    async clickLogo(): Promise<void> {
        await this.logo.click();
    }

    async navigateToHome(): Promise<void> {
        await this.navHome.click();
    }

    async navigateToShop(): Promise<void> {
        await this.navShop.click();
    }

    async navigateToCats(): Promise<void> {
        await this.navCats.click();
    }

    async navigateToDogs(): Promise<void> {
        await this.navDogs.click();
    }

    async navigateToAbout(): Promise<void> {
        await this.navAbout.click();
    }

    async navigateToSignIn(): Promise<void> {
        await this.signInButton.click();
    }

    async navigateToSignUp(): Promise<void> {
        await this.signUpButton.click();
    }

    async navigateToCart(): Promise<void> {
        await this.cartButton.click();
    }

    async navigateToAccount(): Promise<void> {
        await this.accountButton.click();
    }

    async navigateToWishlist(): Promise<void> {
        await this.wishlistButton.click();
    }

    async navigateToOrders(): Promise<void> {
        await this.ordersButton.click();
    }

    async signOut(): Promise<void> {
        await this.signOutButton.click();
    }
}
