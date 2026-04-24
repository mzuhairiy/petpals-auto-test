import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

/**
 * HomePage — Homepage page object.
 *
 * Contains locators and interactions for the homepage.
 * Navbar/footer locators are in their respective components.
 * NO assertions — tests handle all verification.
 */
export default class HomePage extends BasePage {
    // Hero carousel
    readonly heroCarousel: Locator;
    readonly heroHeading: Locator;
    readonly heroShopNowLink: Locator;
    readonly heroExploreFoodLink: Locator;
    readonly heroViewToysLink: Locator;
    readonly carouselPrevButton: Locator;
    readonly carouselNextButton: Locator;
    readonly carouselSlideButtons: Locator;

    // Service highlights
    readonly freeDeliveryHeading: Locator;
    readonly returnPolicyHeading: Locator;
    readonly securePaymentHeading: Locator;
    readonly supportHeading: Locator;

    // Featured products section
    readonly featuredProductsTitle: Locator;
    readonly featuredProductsSubtitle: Locator;
    readonly viewAllProductsLink: Locator;
    readonly featuredProductCards: Locator;
    readonly featuredProductTitles: Locator;
    readonly featuredProductPrices: Locator;
    readonly featuredWishlistButtons: Locator;

    // Cat products section
    readonly catProductsTitle: Locator;
    readonly catProductCards: Locator;
    readonly catAddToCartButtons: Locator;
    readonly viewAllCatProductsLink: Locator;

    // Dog products section
    readonly dogProductsTitle: Locator;
    readonly dogProductCards: Locator;
    readonly dogAddToCartButtons: Locator;
    readonly viewAllDogProductsLink: Locator;

    // Newsletter section
    readonly newsletterHeading: Locator;
    readonly newsletterSubtitle: Locator;
    readonly newsletterEmailField: Locator;
    readonly newsletterSubscribeButton: Locator;

    constructor(page: Page) {
        super(page);

        // Hero carousel
        this.heroCarousel = this.byTestId('hero-slider');
        this.heroHeading = page.getByRole('heading', { name: 'What your pet needs, when they need it.' });
        this.heroShopNowLink = this.byTestId('hero-cta-0');
        this.heroExploreFoodLink = this.byTestId('hero-cta-1');
        this.heroViewToysLink = this.byTestId('hero-cta-2');
        this.carouselPrevButton = this.byTestId('hero-prev');
        this.carouselNextButton = this.byTestId('hero-next');
        this.carouselSlideButtons = this.byTestIdPrefix('hero-dot-');

        // Service highlights
        this.freeDeliveryHeading = page.getByRole('heading', { name: 'Free Same-Day Delivery' });
        this.returnPolicyHeading = page.getByRole('heading', { name: '30-Day Return' });
        this.securePaymentHeading = page.getByRole('heading', { name: 'Secure Payment' });
        this.supportHeading = page.getByRole('heading', { name: '24/7 Support' });

        // Featured products section
        this.featuredProductsTitle = this.byTestId('featured-products-title');
        this.featuredProductsSubtitle = page.getByText('Handpicked products for your furry friends');
        this.viewAllProductsLink = this.byTestId('view-all-products-link');
        this.featuredProductCards = page.locator('[data-testid="featured-products-grid"] a[data-testid^="product-card-link-"]');
        this.featuredProductTitles = page.locator('[data-testid="featured-products-grid"] [data-testid^="product-card-"] h3');
        this.featuredProductPrices = page.locator('[data-testid="featured-products-grid"] [data-testid^="product-card-"] div:has-text("Rp")');
        this.featuredWishlistButtons = this.byTestIdPrefix('wishlist-btn-');

        // Cat products section
        this.catProductsTitle = this.byTestId('cat-products-title');
        this.catProductCards = page.locator('[data-testid="cat-products-grid"] a[data-testid^="product-card-link-"]');
        this.catAddToCartButtons = this.byTestIdPrefix('add-to-cart-');
        this.viewAllCatProductsLink = this.byTestId('view-all-cat-products-btn');

        // Dog products section
        this.dogProductsTitle = this.byTestId('dog-products-title');
        this.dogProductCards = page.locator('[data-testid="dog-products-grid"] a[data-testid^="product-card-link-"]');
        this.dogAddToCartButtons = this.byTestIdPrefix('add-to-cart-');
        this.viewAllDogProductsLink = this.byTestId('view-all-dog-products-btn');

        // Newsletter section
        this.newsletterHeading = this.byTestId('newsletter-title');
        this.newsletterSubtitle = page.getByText('Subscribe to our newsletter for exclusive offers');
        this.newsletterEmailField = this.byTestId('newsletter-email-input');
        this.newsletterSubscribeButton = this.byTestId('newsletter-subscribe-btn');
    }

    // ── Carousel interactions ──

    async navigateCarouselNext(): Promise<void> {
        await this.carouselNextButton.click();
    }

    async navigateCarouselPrev(): Promise<void> {
        await this.carouselPrevButton.click();
    }

    async goToSlide(slideNumber: number): Promise<void> {
        await this.page.getByRole('button', { name: `Go to slide ${slideNumber}` }).click();
    }

    // ── Hero CTA interactions ──

    async clickShopNow(): Promise<void> {
        await this.heroShopNowLink.click();
    }

    async clickExploreFood(): Promise<void> {
        await this.heroExploreFoodLink.click();
    }

    async clickViewToys(): Promise<void> {
        await this.heroViewToysLink.click();
    }

    // ── Product section interactions ──

    async clickViewAllProducts(): Promise<void> {
        await this.viewAllProductsLink.click();
    }

    async clickViewAllCatProducts(): Promise<void> {
        await this.viewAllCatProductsLink.click();
    }

    async clickViewAllDogProducts(): Promise<void> {
        await this.viewAllDogProductsLink.click();
    }

    async clickRandomFeaturedProduct(): Promise<string> {
        const cards = this.featuredProductCards;
        const count = await cards.count();

        if (count === 0) {
            throw new Error('No featured products found on homepage');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const card = cards.nth(randomIndex);
        const title = await card.locator('h3').textContent();

        await card.click();
        return title ?? '';
    }

    async addCatProductToCart(index: number = 0): Promise<void> {
        await this.catAddToCartButtons.nth(index).click();
    }

    async addDogProductToCart(index: number = 0): Promise<void> {
        await this.dogAddToCartButtons.nth(index).click();
    }

    /**
     * Picks a random "Add to cart" button from the homepage cat section,
     * clicks it, and returns the product name from the parent card.
     */
    async addRandomCatProductToCart(): Promise<{ productName: string; randomIndex: number }> {
        const buttons = this.catAddToCartButtons;
        const buttonCount = await buttons.count();

        if (buttonCount === 0) {
            throw new Error('No Add to cart buttons found on homepage');
        }

        const randomIndex = Math.floor(Math.random() * buttonCount);
        const selectedButton = buttons.nth(randomIndex);
        const productCard = selectedButton.locator('xpath=ancestor::*[contains(@data-testid, "product-card-")]');
        const productName = (await productCard.getByRole('heading', { level: 3 }).textContent())?.trim() ?? '';

        await selectedButton.click();
        return { productName, randomIndex };
    }

    // ── Newsletter interactions ──

    async subscribeToNewsletter(email: string): Promise<void> {
        await this.newsletterEmailField.fill(email);
        await this.newsletterSubscribeButton.click();
    }
}
