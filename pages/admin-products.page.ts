import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

/**
 * AdminProductsPage — Admin products management page object.
 *
 * Contains locators and interactions for managing products in admin panel.
 * NO assertions — tests handle all verification.
 */
export default class AdminProductsPage extends BasePage {
    // ── Page elements ──

    readonly heading: Locator;
    readonly addProductButton: Locator;
    readonly productsTable: Locator;

    // ── Add product dialog ──

    readonly addProductDialog: Locator;
    readonly nameField: Locator;
    readonly slugField: Locator;
    readonly descriptionField: Locator;
    readonly priceField: Locator;
    readonly originalPriceField: Locator;
    readonly stockField: Locator;
    readonly imageUrlField: Locator;
    readonly discountField: Locator;
    readonly categoryCombobox: Locator;
    readonly petTypeCombobox: Locator;
    readonly tagsField: Locator;
    readonly markAsNewCheckbox: Locator;
    readonly featuredCheckbox: Locator;
    readonly cancelButton: Locator;
    readonly createButton: Locator;

    // ── Update product dialog (similar to add) ──

    readonly updateButton: Locator;

    constructor(page: Page) {
        super(page);

        // Page elements
        this.heading = page.getByRole('heading', { name: 'Products' });
        this.addProductButton = page.getByRole('button', { name: 'Add Product' });
        this.productsTable = page.getByRole('table');

        // Add product dialog
        this.addProductDialog = page.getByRole('dialog', { name: 'Add New Product' });
        this.nameField = this.addProductDialog.getByRole('textbox', { name: 'Name' });
        this.slugField = this.addProductDialog.getByRole('textbox', { name: 'Slug' });
        this.descriptionField = this.addProductDialog.getByRole('textbox', { name: 'Description' });
        this.priceField = this.byTestId('admin-product-price-input');
        this.originalPriceField = this.byTestId('admin-product-original-price-input');
        this.stockField = this.byTestId('admin-product-stock-input');
        this.imageUrlField = this.addProductDialog.getByRole('textbox', { name: 'Image URL' });
        this.discountField = this.byTestId('admin-product-discount-input');
        this.categoryCombobox = this.addProductDialog
            .getByRole('combobox')
            .filter({ hasText: /category/i });
        this.petTypeCombobox = this.addProductDialog.getByRole('combobox', { name: /pet type/i });
        this.tagsField = this.addProductDialog.getByRole('textbox', { name: /tags \(comma separated\)/i });
        this.markAsNewCheckbox = this.byTestId('admin-product-mark-as-new-checkbox');
        this.featuredCheckbox = this.byTestId('admin-product-featured-checkbox');
        this.cancelButton = this.byTestId('admin-product-cancel-btn');
        this.createButton = this.byTestId('admin-product-create-btn');

        // Update dialog (assumes same structure, button name changes)
        this.updateButton = page.getByRole('button', { name: 'Update' });
    }

    // ── Interactions ──

    async openAddProductForm(): Promise<void> {
        await this.addProductButton.click();
        await this.addProductDialog.waitFor();
    }

    async createProduct(productData: {
        name: string;
        slug: string;
        description: string;
        price: number;
        originalPrice?: number;
        stock: number;
        imageUrl: string;
        discount?: number;
        category: string;
        petType: string;
        tags?: string;
        markAsNew?: boolean;
        featured?: boolean;
    }): Promise<void> {
        await this.openAddProductForm();
        await this.nameField.fill(productData.name);
        await this.slugField.fill(productData.slug);
        await this.descriptionField.fill(productData.description);
        await this.priceField.fill(productData.price.toString());
        if (productData.originalPrice) {
            await this.originalPriceField.fill(productData.originalPrice.toString());
        }
        await this.stockField.fill(productData.stock.toString());
        await this.imageUrlField.fill(productData.imageUrl);
        if (productData.discount) {
            await this.discountField.fill(productData.discount.toString());
        }
        await this.categoryCombobox.selectOption(productData.category);
        await this.petTypeCombobox.selectOption(productData.petType);
        if (productData.tags) {
            await this.tagsField.fill(productData.tags);
        }
        if (productData.markAsNew) {
            await this.markAsNewCheckbox.check();
        }
        if (productData.featured) {
            await this.featuredCheckbox.check();
        }
        await this.createButton.click();
        await this.waitForDomReady();
    }

    async editProduct(productName: string): Promise<void> {
        const row = this.productsTable.getByRole('row').filter({ hasText: productName });
        const editButton = row.getByRole('button').first();
        await editButton.click();
        await this.addProductDialog.waitFor();
    }

    async updateProduct(productData: Partial<{
        name: string;
        slug: string;
        description: string;
        price: number;
        originalPrice: number;
        stock: number;
        imageUrl: string;
        discount: number;
        category: string;
        petType: string;
        tags: string;
        markAsNew: boolean;
        featured: boolean;
    }>): Promise<void> {
        // Update fields if provided
        if (productData.name) await this.nameField.fill(productData.name);
        if (productData.slug) await this.slugField.fill(productData.slug);
        if (productData.description) await this.descriptionField.fill(productData.description);
        if (productData.price) await this.priceField.fill(productData.price.toString());
        if (productData.originalPrice) await this.originalPriceField.fill(productData.originalPrice.toString());
        if (productData.stock) await this.stockField.fill(productData.stock.toString());
        if (productData.imageUrl) await this.imageUrlField.fill(productData.imageUrl);
        if (productData.discount) await this.discountField.fill(productData.discount.toString());
        if (productData.category) await this.categoryCombobox.selectOption(productData.category);
        if (productData.petType) await this.petTypeCombobox.selectOption(productData.petType);
        if (productData.tags) await this.tagsField.fill(productData.tags);
        if (productData.markAsNew !== undefined) {
            if (productData.markAsNew) await this.markAsNewCheckbox.check();
            else await this.markAsNewCheckbox.uncheck();
        }
        if (productData.featured !== undefined) {
            if (productData.featured) await this.featuredCheckbox.check();
            else await this.featuredCheckbox.uncheck();
        }
        await this.updateButton.click();
        await this.waitForDomReady();
    }

    async deleteProduct(productName: string): Promise<void> {
        const row = this.productsTable.getByRole('row').filter({ hasText: productName });
        const deleteButton = row.getByRole('button').last();
        await deleteButton.click();
        // Assume confirmation dialog appears
        await this.page.getByRole('button', { name: 'Confirm' }).click();
        await this.waitForDomReady();
    }
}