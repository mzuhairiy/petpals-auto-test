import { test, expect } from '../../fixtures/base.fixture';
import config from '../../config/env.config';
import productsData from '../../test-data/products.json';
import { generateUserCheckoutData } from '../../utils/data.helper';
import { URL_PATTERNS, DEFAULT_CHECKOUT_STATE } from '../../constants/env.constants';

test.describe('Shopping E2E', () => {

    test.beforeEach(async ({ page, navbar }) => {
        await page.goto('/');
        await expect(navbar.signInButton).toBeVisible();
    });

    test.describe('Product Browsing & Filtering', () => {

        test.beforeEach(async ({ navbar, shopPage }) => {
            await navbar.navigateToShop();
            await expect(shopPage.heading).toBeVisible();
        });

        test('should display all products on shop page @smoke @shop', async ({ shopPage }) => {
            const count = await shopPage.getProductCount();
            expect(count, 'Shop page should have at least one product').toBeGreaterThan(0);
        });

        test('should filter products by Toys category and update URL @shop', async ({ page, shopPage }) => {
            const initialCount = await shopPage.getProductCount();

            await shopPage.filterByCategory('Toys');

            await expect(page).toHaveURL(URL_PATTERNS.categoryToys);
            const filteredCount = await shopPage.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should filter products by Food category and update URL @shop', async ({ page, shopPage }) => {
            const initialCount = await shopPage.getProductCount();

            await shopPage.filterByCategory('Food');

            await expect(page).toHaveURL(URL_PATTERNS.categoryFood);
            const filteredCount = await shopPage.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should filter products by Supplements category and update URL @shop', async ({ page, shopPage }) => {
            const initialCount = await shopPage.getProductCount();

            await shopPage.filterByCategory('Supplements');

            await expect(page).toHaveURL(URL_PATTERNS.categorySupplements);
            const filteredCount = await shopPage.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should filter products by Cats pet type @shop', async ({ page, shopPage }) => {
            const initialCount = await shopPage.getProductCount();

            await shopPage.filterByPetType('Cats');

            await expect(page).toHaveURL(URL_PATTERNS.catFilter);
            const filteredCount = await shopPage.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should filter products by Dogs pet type @shop', async ({ page, shopPage }) => {
            const initialCount = await shopPage.getProductCount();

            await shopPage.filterByPetType('Dogs');

            await expect(page).toHaveURL(URL_PATTERNS.dogFilter);
            const filteredCount = await shopPage.getProductCount();
            expect(filteredCount, 'Filtered results should not be empty').toBeGreaterThan(0);
            expect(filteredCount, 'Filtered count should be less than initial').toBeLessThanOrEqual(initialCount);
        });

        test('should sort products by highest rated @shop', async ({ shopPage }) => {
            const initialCount = await shopPage.getProductCount();

            await shopPage.sortBy('Highest Rated');

            const count = await shopPage.getProductCount();
            expect(count, 'Sorting should not change product count').toBe(initialCount);
        });

        test('should sort products by newest first @shop', async ({ shopPage }) => {
            const initialCount = await shopPage.getProductCount();

            await shopPage.sortBy('Newest First');

            const count = await shopPage.getProductCount();
            expect(count, 'Sorting should not change product count').toBe(initialCount);
        });

        test('should filter products by price range @shop', async ({ shopPage }) => {
            const initialCount = await shopPage.getProductCount();

            const { min, max } = productsData.priceFilter;
            await shopPage.filterByPriceRange(min, max);

            const filteredCount = await shopPage.getProductCount();
            expect(filteredCount, 'Price range filter should return results').toBeGreaterThan(0);
            expect(filteredCount, 'Price range filter should narrow results').toBeLessThanOrEqual(initialCount);

            const prices = await shopPage.getAllProductPrices();
            for (const price of prices) {
                expect(price, `Price ${price} should be >= ${min}`).toBeGreaterThanOrEqual(min);
                expect(price, `Price ${price} should be <= ${max}`).toBeLessThanOrEqual(max);
            }
        });

        test('should combine category and pet type filters @shop', async ({ shopPage }) => {
            await shopPage.filterByCategory('Toys');
            const categoryCount = await shopPage.getProductCount();
            expect(categoryCount, 'Category filter should return results').toBeGreaterThan(0);

            await shopPage.filterByPetType('Cats');
            const combinedCount = await shopPage.getProductCount();
            expect(combinedCount, 'Combined filter should return results').toBeGreaterThan(0);
            expect(combinedCount, 'Combined filter should narrow results further').toBeLessThanOrEqual(categoryCount);
        });

        test('should clear filters and restore all products @shop', async ({ page, shopPage }) => {
            await expect(shopPage.productCards.first()).toBeVisible();
            const initialCount = await shopPage.getProductCount();

            await shopPage.filterByCategory('Toys');
            const filteredCount = await shopPage.getProductCount();
            expect(filteredCount).toBeGreaterThan(0);
            expect(filteredCount).toBeLessThanOrEqual(initialCount);

            await shopPage.clearAllFilters();
            await page.waitForLoadState('domcontentloaded');

            const restoredCount = await shopPage.getProductCount();
            expect(restoredCount, 'All products should be restored after clearing filters').toBe(initialCount);
        });

        test('should persist filters on page reload @shop', async ({ page, shopPage }) => {
            await shopPage.filterByCategory('Toys');
            await expect(page).toHaveURL(URL_PATTERNS.categoryToys);
            const filteredCount = await shopPage.getProductCount();

            await page.reload();
            await expect(shopPage.heading).toBeVisible();

            await expect(page).toHaveURL(URL_PATTERNS.categoryToys);
            const reloadedCount = await shopPage.getProductCount();
            expect(reloadedCount, 'Product count should be the same after reload').toBe(filteredCount);
        });

        test('should navigate to correct product detail page when clicking a product @smoke @shop @product', async ({ page, shopPage, productPage }) => {
            const clickedProductName = await shopPage.clickFirstProduct();

            await expect(page).toHaveURL(URL_PATTERNS.product);
            await expect(productPage.productTitle).toBeVisible();

            const detailTitle = (await productPage.productTitle.textContent())?.trim();
            expect(
                detailTitle,
                'Product detail title should match the clicked product name',
            ).toBe(clickedProductName.trim());
        });
    });

    test.describe('Cart Operations', () => {

        test('should add product to cart from homepage and verify in cart @smoke @cart', async ({ page, navbar, loginPage, homePage }) => {
            await navbar.navigateToSignIn();
            await loginPage.login(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homePage.heroCarousel).toBeVisible();

            const { productName } = await homePage.addRandomCatProductToCart();
            test.info().annotations.push({ type: 'productName', description: productName });

            await navbar.navigateToCart();
            await expect(page).toHaveURL(URL_PATTERNS.cart);

            const cartContent = page.getByRole('main');
            await expect(cartContent).not.toContainText('Your cart is empty');
            await expect(cartContent).toContainText(productName);
        });

        test('should add product to cart from product detail page @cart', async ({ page, navbar, loginPage, homePage, shopPage, productPage }) => {
            await navbar.navigateToSignIn();
            await loginPage.login(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homePage.heroCarousel).toBeVisible();

            // Navigate to shop and open random product
            await navbar.navigateToShop();
            await expect(shopPage.heading).toBeVisible();

            const { selectedCard, productName, randomIndex } = await shopPage.selectRandomProductCard();
            test.info().annotations.push({ type: 'randomProductIndex', description: String(randomIndex) });

            await selectedCard.click();
            await expect(page).toHaveURL(URL_PATTERNS.product);
            await expect(productPage.addToCartButton).toBeVisible();
            await productPage.addToCart();

            await navbar.navigateToCart();
            await expect(page).toHaveURL(URL_PATTERNS.cart);

            const cartContent = page.getByRole('main');
            await expect(cartContent).not.toContainText('Your cart is empty');
        });
    });

    test.describe('Checkout', () => {

        test('should complete full checkout flow with Midtrans credit card payment @smoke @checkout', async ({ page, navbar, loginPage, homePage, cartPage, toast }) => {
            // Login & add product to cart
            await navbar.navigateToSignIn();
            await loginPage.login(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homePage.heroCarousel).toBeVisible();

            const { productName } = await homePage.addRandomCatProductToCart();
            test.info().annotations.push({ type: 'productName', description: productName });

            // Assert add-to-cart success
            await toast.assertToastMessage('added to cart');
            await expect(navbar.cartButton).toContainText(/\d+/);

            // Navigate to cart and verify product
            await navbar.navigateToCart();
            await expect(page).toHaveURL(URL_PATTERNS.cart);
            await expect(page.getByRole('main')).toContainText(productName);

            // Proceed to checkout and fill form
            await cartPage.proceedToCheckout();
            await expect(cartPage.checkoutHeading).toBeVisible();

            const checkoutData = generateUserCheckoutData();
            await cartPage.fillCheckoutForm({
                phone: checkoutData.phone,
                address: checkoutData.address,
                city: checkoutData.city,
                state: DEFAULT_CHECKOUT_STATE,
                postcode: checkoutData.postcode,
            });

            // Submit checkout and complete payment
            await cartPage.submitCheckout();
            await expect(cartPage.paymentHeading).toBeVisible();
            await cartPage.payWithTestCreditCard();

            // Verify order success
            await expect(cartPage.orderSuccessMessage).toBeVisible();
            await expect(navbar.cartButton).not.toContainText(/\d+/);
            await expect(cartPage.orderContinueShopping).toBeVisible();
            await expect(cartPage.orderViewHistory).toBeVisible();
        });
    });
});
