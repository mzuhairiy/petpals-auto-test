import { test, expect } from '../../fixtures/base.fixture';
import config from '../../config/env.config';
import { URL_PATTERNS } from '../../constants/env.constants';
import type { Page, TestInfo } from '@playwright/test';
import type { NavbarComponent } from '../../pages/components/navbar.component';
import type ShopPage from '../../pages/shop.page';
import type ProductPage from '../../pages/product.page';

test.describe('Product E2E', () => {

    test.beforeEach(async ({ page, navbar }) => {
        await page.goto('/');
        await expect(navbar.signInButton).toBeVisible();
    });

    /** Helper: navigate to shop, pick random product, open detail page */
    async function navigateToRandomProductDetail(
        navbar: NavbarComponent,
        shopPage: ShopPage,
        productPage: ProductPage,
        page: Page,
        testInfo: TestInfo,
    ) {
        await navbar.navigateToShop();
        await expect(shopPage.heading).toBeVisible();

        const { selectedCard, productName, randomIndex } = await shopPage.selectRandomProductCard();
        testInfo.annotations.push({ type: 'randomProductIndex', description: String(randomIndex) });
        if (productName) {
            testInfo.annotations.push({ type: 'productName', description: productName });
        }

        await expect(selectedCard).toBeVisible();
        await selectedCard.click();
        await expect(page).toHaveURL(URL_PATTERNS.product);
        await expect(productPage.productTitle).toBeVisible();

        return { productName, randomIndex };
    }

    test.describe('Product Detail Page', () => {

        test('should load product detail page with interactive elements @smoke @product', async ({ page, navbar, shopPage, productPage }) => {
            await navigateToRandomProductDetail(navbar, shopPage, productPage, page, test.info());

            await expect(productPage.productTitle).toBeVisible();
            await expect(productPage.productTitle).not.toHaveText('');
            await expect(productPage.addToCartButton).toBeVisible();
            await expect(productPage.currentPrice).toBeVisible();
        });

        test('should increase product quantity using controls @product', async ({ page, navbar, shopPage, productPage }) => {
            await navigateToRandomProductDetail(navbar, shopPage, productPage, page, test.info());

            const beforeValueRaw = await productPage.quantityInput.inputValue();
            const beforeValue = Number.parseInt(beforeValueRaw, 10);
            expect(
                Number.isFinite(beforeValue),
                `Expected quantity input to be a number, got: "${beforeValueRaw}"`,
            ).toBeTruthy();

            await productPage.increaseQuantity();

            const afterValueRaw = await productPage.quantityInput.inputValue();
            const afterValue = Number.parseInt(afterValueRaw, 10);
            expect(
                Number.isFinite(afterValue),
                `Expected quantity input to be a number, got: "${afterValueRaw}"`,
            ).toBeTruthy();

            expect(afterValue, 'Expected quantity to increment by 1').toBe(beforeValue + 1);
        });

        test('should switch between product tabs @product', async ({ page, navbar, shopPage, productPage }) => {
            await navigateToRandomProductDetail(navbar, shopPage, productPage, page, test.info());

            await expect(productPage.descriptionTab).toBeVisible();

            await productPage.switchToReviewsTab();
            await expect(productPage.tabContent).toBeVisible();

            await productPage.switchToDescriptionTab();
            await expect(productPage.tabContent).toBeVisible();
        });
    });

    test.describe('Wishlist Operations', () => {

        test('should add product to wishlist and verify it appears on wishlist page @smoke @wishlist', async ({ page, navbar, loginPage, homePage, shopPage, accountPage, toast }) => {
            // Login
            await navbar.navigateToSignIn();
            await loginPage.login(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homePage.heroCarousel).toBeVisible();

            // Clear existing wishlist
            await navbar.navigateToWishlist();
            await expect(page).toHaveURL(URL_PATTERNS.wishlist);
            await page.waitForLoadState('domcontentloaded');
            await accountPage.clearWishlist();

            // Navigate to shop and add random product to wishlist
            await navbar.navigateToShop();
            await expect(shopPage.heading).toBeVisible();

            const { selectedCard, productName, randomIndex } = await shopPage.selectRandomProductCard();
            test.info().annotations.push({ type: 'randomProductIndex', description: String(randomIndex) });
            test.info().annotations.push({ type: 'productName', description: productName });

            await shopPage.clickWishlistOnCard(selectedCard);

            // Assert: toast confirmation
            await toast.assertAddedToWishlist();

            // Assert: product appears on wishlist page
            await navbar.navigateToWishlist();
            await expect(page).toHaveURL(URL_PATTERNS.wishlist);
            await page.waitForLoadState('domcontentloaded');

            const wishlistItem = accountPage.getWishlistItemByName(productName);
            await expect(wishlistItem).toBeVisible();
        });
    });
});
