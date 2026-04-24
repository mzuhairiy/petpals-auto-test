import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

/**
 * ProductPage — Product detail page object.
 *
 * Contains locators and interactions for a single product detail page.
 * NO assertions — tests handle all verification.
 */
export default class ProductPage extends BasePage {
    // Navigation
    readonly backToShopLink: Locator;

    // Product details
    readonly productTitle: Locator;
    readonly productMainImage: Locator;
    readonly productThumbnailImages: Locator;
    readonly productRating: Locator;
    readonly productReviewCount: Locator;
    readonly currentPrice: Locator;
    readonly originalPrice: Locator;
    readonly saveAmount: Locator;
    readonly description: Locator;
    readonly stockStatus: Locator;
    readonly freeShippingInfo: Locator;

    // Quantity & cart
    readonly quantityInput: Locator;
    readonly decreaseQuantityButton: Locator;
    readonly increaseQuantityButton: Locator;
    readonly addToCartButton: Locator;
    readonly addToWishlistButton: Locator;

    // Product info badges
    readonly freeDeliveryInfo: Locator;
    readonly returnsInfo: Locator;
    readonly secureCheckoutInfo: Locator;

    // Tabs
    readonly descriptionTab: Locator;
    readonly nutritionalDetailsTab: Locator;
    readonly reviewsTab: Locator;
    readonly tabContent: Locator;

    // Description tab content
    readonly descriptionText: Locator;
    readonly descriptionFeatures: Locator;

    // Related products
    readonly relatedProductsHeading: Locator;
    readonly relatedProductCards: Locator;
    readonly relatedProductTitles: Locator;

    constructor(page: Page) {
        super(page);

        // Navigation
        this.backToShopLink = this.byTestId('back-to-shop-link');

        // Product details
        this.productTitle = this.byTestIdPrefix('product-title-');
        this.productMainImage = this.byTestIdPrefix('product-image-');
        this.productThumbnailImages = this.byTestIdPrefix('product-thumb-');
        this.productRating = page.locator('main').locator('text=/\\d\\.\\d/').first();
        this.productReviewCount = page.locator('main').locator('text=/\\(\\d+ reviews\\)/');
        this.currentPrice = this.byTestIdPrefix('product-price-');
        this.originalPrice = this.byTestIdPrefix('product-original-price-');
        this.saveAmount = page.locator('main').getByText(/Save Rp/);
        this.description = page.locator('main p').first();
        this.stockStatus = this.byTestIdPrefix('product-stock-');
        this.freeShippingInfo = page.getByText(/Free shipping on orders over/);

        // Quantity & cart
        this.quantityInput = this.byTestIdSuffix('-qty-input');
        this.decreaseQuantityButton = this.byTestIdSuffix('-qty-decrement');
        this.increaseQuantityButton = this.byTestIdSuffix('-qty-increment');
        this.addToCartButton = this.byTestIdSuffix('-add-to-cart');
        this.addToWishlistButton = this.byTestIdPrefix('wishlist-btn-');

        // Product info badges
        this.freeDeliveryInfo = page.getByText('Free Delivery');
        this.returnsInfo = page.getByText('30-Day Returns');
        this.secureCheckoutInfo = page.getByText('Secure Checkout');

        // Tabs
        this.descriptionTab = this.byTestId('product-tab-description');
        this.nutritionalDetailsTab = this.byTestId('product-tab-details');
        this.reviewsTab = this.byTestId('product-tab-reviews');
        this.tabContent = page.getByRole('tabpanel');

        // Description tab content
        this.descriptionText = page.getByRole('tabpanel').locator('p');
        this.descriptionFeatures = page.getByRole('tabpanel').locator('li');

        // Related products
        this.relatedProductsHeading = this.byTestId('related-products-section');
        this.relatedProductCards = page.locator('[data-testid="related-products-grid"] a[data-testid^="product-card-link-"]');
        this.relatedProductTitles = page.locator('[data-testid="related-products-grid"] [data-testid^="product-card-"] h3');
    }

    // ── Interactions ──

    async goToProductPage(productSlug: string): Promise<void> {
        await this.goto(`/product/${productSlug}`);
    }

    async getProductTitle(): Promise<string> {
        const title = await this.productTitle.textContent();
        return title ?? '';
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }

    async addToWishlist(): Promise<void> {
        await this.addToWishlistButton.click();
    }

    async setQuantity(quantity: number): Promise<void> {
        await this.quantityInput.fill(String(quantity));
    }

    async increaseQuantity(times: number = 1): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.increaseQuantityButton.click();
        }
    }

    async decreaseQuantity(times: number = 1): Promise<void> {
        for (let i = 0; i < times; i++) {
            await this.decreaseQuantityButton.click();
        }
    }

    async navigateBackToShop(): Promise<void> {
        await this.backToShopLink.click();
    }

    async switchToDescriptionTab(): Promise<void> {
        await this.descriptionTab.click();
    }

    async switchToNutritionalDetailsTab(): Promise<void> {
        await this.nutritionalDetailsTab.click();
    }

    async switchToReviewsTab(): Promise<void> {
        await this.reviewsTab.click();
    }

    async clickRandomRelatedProduct(): Promise<string> {
        const cards = this.relatedProductCards;
        const count = await cards.count();

        if (count === 0) {
            throw new Error('No related products found');
        }

        const randomIndex = Math.floor(Math.random() * count);
        const card = cards.nth(randomIndex);
        const title = await card.locator('h3').textContent();

        await card.click();
        return title ?? '';
    }

    async getRelatedProductCount(): Promise<number> {
        return await this.relatedProductCards.count();
    }
}
