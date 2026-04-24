import { type Page, type Locator } from '@playwright/test';

/**
 * FooterComponent — reusable footer component.
 *
 * Extracted from LayoutElements to isolate footer locators and interactions.
 */
export class FooterComponent {
    readonly page: Page;

    // Footer root
    readonly footer: Locator;
    readonly copyright: Locator;

    // Shop links
    readonly petToys: Locator;
    readonly petFood: Locator;
    readonly supplements: Locator;
    readonly catProducts: Locator;
    readonly dogProducts: Locator;

    // Company links
    readonly aboutUs: Locator;
    readonly careers: Locator;
    readonly blog: Locator;
    readonly contact: Locator;

    // Customer service links
    readonly helpCenter: Locator;
    readonly shipping: Locator;
    readonly returns: Locator;
    readonly contactUs: Locator;
    readonly wishlist: Locator;
    readonly privacyPolicy: Locator;
    readonly terms: Locator;

    // Social links
    readonly socialLinks: Locator;

    constructor(page: Page) {
        this.page = page;

        const footerRegion = page.getByRole('contentinfo');

        // Footer root
        this.footer = page.locator('[data-testid="footer"]');
        this.copyright = footerRegion.getByText(/© \d{4} PetPals/);

        // Shop links
        this.petToys = page.locator('[data-testid="footer-link-toys"]');
        this.petFood = page.locator('[data-testid="footer-link-food"]');
        this.supplements = page.locator('[data-testid="footer-link-supplements"]');
        this.catProducts = page.locator('[data-testid="footer-link-cat-products"]');
        this.dogProducts = page.locator('[data-testid="footer-link-dog-products"]');

        // Company links
        this.aboutUs = page.locator('[data-testid="footer-link-about"]');
        this.careers = page.locator('[data-testid="footer-link-careers"]');
        this.blog = page.locator('[data-testid="footer-link-blog"]');
        this.contact = page.locator('[data-testid="footer-link-contact"]');

        // Customer service links
        this.helpCenter = page.locator('[data-testid="footer-link-help"]');
        this.shipping = page.locator('[data-testid="footer-link-shipping"]');
        this.returns = page.locator('[data-testid="footer-link-returns"]');
        this.contactUs = page.locator('[data-testid="footer-link-contact-us"]');
        this.wishlist = page.locator('[data-testid="footer-link-wishlist"]');
        this.privacyPolicy = page.locator('[data-testid="footer-link-privacy"]');
        this.terms = page.locator('[data-testid="footer-link-terms"]');

        // Social links
        this.socialLinks = footerRegion.getByRole('link', { name: /Facebook|Instagram|Twitter|YouTube/ });
    }

    // ── Interactions ──

    async clickPetToys(): Promise<void> {
        await this.petToys.click();
    }

    async clickPetFood(): Promise<void> {
        await this.petFood.click();
    }

    async clickSupplements(): Promise<void> {
        await this.supplements.click();
    }

    async clickCatProducts(): Promise<void> {
        await this.catProducts.click();
    }

    async clickDogProducts(): Promise<void> {
        await this.dogProducts.click();
    }

    async clickAboutUs(): Promise<void> {
        await this.aboutUs.click();
    }

    async clickCareers(): Promise<void> {
        await this.careers.click();
    }

    async clickBlog(): Promise<void> {
        await this.blog.click();
    }

    async clickContact(): Promise<void> {
        await this.contact.click();
    }

    async clickHelpCenter(): Promise<void> {
        await this.helpCenter.click();
    }

    async clickShipping(): Promise<void> {
        await this.shipping.click();
    }

    async clickReturns(): Promise<void> {
        await this.returns.click();
    }

    async clickContactUs(): Promise<void> {
        await this.contactUs.click();
    }

    async clickPrivacyPolicy(): Promise<void> {
        await this.privacyPolicy.click();
    }

    async clickTerms(): Promise<void> {
        await this.terms.click();
    }
}
