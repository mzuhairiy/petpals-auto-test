import { test, expect } from '../../fixtures/base.fixture';
import config from '../../config/env.config';

test.describe('Admin Product Management', () => {

    test.beforeEach(async ({ page, navbar, loginPage, adminProductsPage }) => {
        await page.goto('/');
        await navbar.navigateToSignIn();
        await loginPage.login(config.profiles.adminUser.email, config.profiles.adminUser.password);
        await page.getByRole('navigation').getByRole('link', { name: 'Products' }).click();
        await expect(adminProductsPage.heading).toBeVisible();
    });

    test('should create product with valid fields @C111 @admin', async ({ adminProductsPage }) => {
        const productData = {
            name: 'Test Dog Toy',
            slug: 'test-dog-toy',
            description: 'A test dog toy for automated testing',
            price: 50000,
            stock: 10,
            imageUrl: 'https://example.com/test-dog-toy.jpg',
            category: 'TOYS',
            petType: 'DOG'
        };

        await adminProductsPage.createProduct(productData);
        await expect(adminProductsPage.productsTable).toContainText('Test Dog Toy');
    });

    test('should update existing product @C112 @admin', async ({ adminProductsPage }) => {
        // Assume 'Dog Probiotic Supplements' exists
        const originalPrice = '447.840';
        const updatedPrice = '50000';

        await adminProductsPage.editProduct('Dog Probiotic Supplements');
        await adminProductsPage.updateProduct({ price: parseInt(updatedPrice) });
        await expect(adminProductsPage.productsTable).toContainText(updatedPrice);
        // Optionally revert back, but for test simplicity, leave as is
    });

    test('should delete existing product @C113 @admin', async ({ adminProductsPage }) => {
        // Create a test product first to delete
        const productData = {
            name: 'Temp Product to Delete',
            slug: 'temp-product-delete',
            description: 'Temporary product for deletion test',
            price: 10000,
            stock: 1,
            imageUrl: 'https://example.com/temp.jpg',
            category: 'FOOD',
            petType: 'CAT'
        };

        await adminProductsPage.createProduct(productData);
        await expect(adminProductsPage.productsTable).toContainText('Temp Product to Delete');

        await adminProductsPage.deleteProduct('Temp Product to Delete');
        await expect(adminProductsPage.productsTable).not.toContainText('Temp Product to Delete');
    });
});