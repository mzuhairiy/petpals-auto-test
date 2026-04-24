import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

/**
 * ShopPage — Shop/product listing page object.
 *
 * Contains locators and interactions for the shop page including
 * filters, sorting, and product grid.
 * NO assertions — tests handle all verification.
 */
export default class ShopPage extends BasePage {
    // Page heading
    readonly heading: Locator;

    // Filter buttons
    readonly categoryFilterButton: Locator;
    readonly petTypeFilterButton: Locator;
    readonly priceRangeFilterButton: Locator;
    readonly sortByFilterButton: Locator;
    readonly clearAllFiltersButton: Locator;

    // Category checkboxes
    readonly categoryToysCheckbox: Locator;
    readonly categoryFoodCheckbox: Locator;
    readonly categorySupplementsCheckbox: Locator;

    // Pet type checkboxes
    readonly petTypeCatsCheckbox: Locator;
    readonly petTypeDogsCheckbox: Locator;

    // Price range
    readonly priceMinInput: Locator;
    readonly priceMaxInput: Locator;

    // Sort options
    readonly sortPriceLowHigh: Locator;
    readonly sortPriceHighLow: Locator;
    readonly sortHighestRated: Locator;
    readonly sortNewestFirst: Locator;

    // Product grid
    readonly productCards: Locator;
    readonly productTitles: Locator;
    readonly productPrices: Locator;
    readonly productDiscountBadges: Locator;

    // Empty state
    readonly emptyStateMessage: Locator;

    constructor(page: Page) {
        super(page);

        const main = page.getByRole('main');

        // Page heading
        this.heading = this.byTestId('shop-page-title');

        // Filter buttons
        this.categoryFilterButton = main.getByRole('button', { name: 'Category' });
        this.petTypeFilterButton = main.getByRole('button', { name: 'Pet Type' });
        this.priceRangeFilterButton = main.getByRole('button', { name: 'Price Range' });
        this.sortByFilterButton = main.getByRole('button', { name: 'Sort By' });
        this.clearAllFiltersButton = this.byTestId('shop-filters-clear-all-btn');

        // Category checkboxes
        this.categoryToysCheckbox = this.byTestId('filter-category-toys');
        this.categoryFoodCheckbox = this.byTestId('filter-category-food');
        this.categorySupplementsCheckbox = this.byTestId('filter-category-supplements');

        // Pet type checkboxes
        this.petTypeCatsCheckbox = this.byTestId('filter-pet-cat');
        this.petTypeDogsCheckbox = this.byTestId('filter-pet-dog');

        // Price range
        this.priceMinInput = main.getByRole('spinbutton', { name: 'Min' });
        this.priceMaxInput = main.getByRole('spinbutton', { name: 'Max' });

        // Sort options
        this.sortPriceLowHigh = this.byTestId('filter-sort-price-asc');
        this.sortPriceHighLow = this.byTestId('filter-sort-price-desc');
        this.sortHighestRated = this.byTestId('filter-sort-rating');
        this.sortNewestFirst = this.byTestId('filter-sort-newest');

        // Product grid
        this.productCards = page.locator('[data-testid="product-grid"] a[data-testid^="product-card-link-"]');
        this.productTitles = page.locator('[data-testid="product-grid"] [data-testid^="product-card-"] h3');
        this.productPrices = page.locator('[data-testid="product-grid"] [data-testid^="product-card-"] [data-testid^="product-price-"]');
        this.productDiscountBadges = this.byTestIdPrefix('badge-discount-');

        // Empty state
        this.emptyStateMessage = main.getByText(/no products found/i);
    }

    // ── Filter interactions ──

    async filterByCategory(category: 'Toys' | 'Food' | 'Supplements'): Promise<void> {
        const checkboxMap = {
            Toys: this.categoryToysCheckbox,
            Food: this.categoryFoodCheckbox,
            Supplements: this.categorySupplementsCheckbox,
        };
        await checkboxMap[category].click();
        await this.waitForDomReady();
    }

    async filterByPetType(petType: 'Cats' | 'Dogs'): Promise<void> {
        const checkboxMap = {
            Cats: this.petTypeCatsCheckbox,
            Dogs: this.petTypeDogsCheckbox,
        };
        await checkboxMap[petType].click();
        await this.waitForDomReady();
    }

    async sortBy(option: 'Price: Low to High' | 'Price: High to Low' | 'Highest Rated' | 'Newest First'): Promise<void> {
        const checkboxMap = {
            'Price: Low to High': this.sortPriceLowHigh,
            'Price: High to Low': this.sortPriceHighLow,
            'Highest Rated': this.sortHighestRated,
            'Newest First': this.sortNewestFirst,
        };
        await checkboxMap[option].click();
        await this.waitForDomReady();
    }

    async filterByPriceRange(min: number, max: number): Promise<void> {
        await this.priceMinInput.fill(String(min));
        await this.priceMaxInput.fill(String(max));
        await this.priceMaxInput.press('Enter');
        await this.waitForDomReady();
    }

    async clearAllFilters(): Promise<void> {
        await this.clearAllFiltersButton.click();
        await this.waitForDomReady();
    }

    // ── Product grid interactions ──

    async getProductCount(): Promise<number> {
        await this.waitForDomReady();
        return await this.productCards.count();
    }

    async getAllProductTitles(): Promise<string[]> {
        const titles = await this.productTitles.allTextContents();
        return titles.map(t => t.trim());
    }

    async getAllProductPrices(): Promise<number[]> {
        const priceTexts = await this.productPrices.allTextContents();
        return priceTexts.map(text => {
            const cleaned = text.replace(/[^\d]/g, '');
            return Number.parseInt(cleaned, 10);
        }).filter(n => Number.isFinite(n));
    }

    async clickProductByName(name: string): Promise<void> {
        await this.page.getByRole('link', { name: new RegExp(name) }).first().click();
    }

    async clickFirstProduct(): Promise<string> {
        const firstCard = this.productCards.first();
        const title = await firstCard.getByRole('heading', { level: 3 }).textContent();
        await firstCard.click();
        return title ?? '';
    }

    /**
     * Selects a random product card from the shop grid.
     * Returns the card locator, product name, and index WITHOUT clicking into it.
     */
    async selectRandomProductCard(): Promise<{ selectedCard: Locator; productName: string; randomIndex: number }> {
        const cardCount = await this.productCards.count();

        if (cardCount === 0) {
            throw new Error('No product cards found on the shop page');
        }

        const randomIndex = Math.floor(Math.random() * cardCount);
        const selectedCard = this.productCards.nth(randomIndex);
        const productName = (await selectedCard.getByRole('heading', { level: 3 }).textContent())?.trim() ?? '';

        return { selectedCard, productName, randomIndex };
    }

    /**
     * Clicks the wishlist button on a specific product card.
     */
    async clickWishlistOnCard(card: Locator): Promise<void> {
        const wishlistButton = card.locator('[data-testid^="wishlist-btn-"]');
        await wishlistButton.click();
    }
}
