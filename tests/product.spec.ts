import { test, expect } from './fixtures/testFixtures';
import config from '../src/config/environment';
import { navigateToRandomProductDetailViaShop, addProductToWishlistFromShop, clearWishlist } from '../src/helpers/ProductHelper';

test.describe('Product E2E', () => {

    test.beforeEach(async ({ page, homeElements }) => {
        await page.goto(config.baseUrl);
        await expect(homeElements.SIGN_IN_BUTTON).toBeVisible();
    });

    test.describe('Product Detail Page', () => {

        test('should load product detail page with interactive elements @smoke @product', async ({ page, layoutElements, shopElements, productElements }) => {
            await navigateToRandomProductDetailViaShop({
                page,
                layoutElements,
                shopElements,
                productElements,
                testInfo: test.info(),
            });

            await expect(productElements.PRODUCT_TITLE).toBeVisible();
            await expect(productElements.PRODUCT_TITLE).not.toHaveText('');

            await expect(productElements.ADD_TO_CART_BUTTON).toBeVisible();
            await expect(productElements.PRODUCT_CURRENT_PRICE).toBeVisible();
        });

        test('should increase product quantity using controls @product', async ({ page, layoutElements, shopElements, productElements }) => {
            await navigateToRandomProductDetailViaShop({
                page,
                layoutElements,
                shopElements,
                productElements,
                testInfo: test.info(),
            });

            const beforeValueRaw = await productElements.QUANTITY_INPUT.inputValue();
            const beforeValue = Number.parseInt(beforeValueRaw, 10);
            expect(
                Number.isFinite(beforeValue),
                `Expected quantity input to be a number, got: "${beforeValueRaw}"`
            ).toBeTruthy();

            await productElements.INCREASE_QUANTITY_BUTTON.click();

            const afterValueRaw = await productElements.QUANTITY_INPUT.inputValue();
            const afterValue = Number.parseInt(afterValueRaw, 10);
            expect(
                Number.isFinite(afterValue),
                `Expected quantity input to be a number, got: "${afterValueRaw}"`
            ).toBeTruthy();

            expect(afterValue, 'Expected quantity to increment by 1').toBe(beforeValue + 1);
        });

        test('should switch between product tabs @product', async ({ page, layoutElements, shopElements, productElements }) => {
            await navigateToRandomProductDetailViaShop({
                page,
                layoutElements,
                shopElements,
                productElements,
                testInfo: test.info(),
            });

            await expect(productElements.DESCRIPTION_TAB).toBeVisible();

            await productElements.REVIEWS_TAB.click();
            await expect(productElements.TAB_CONTENT).toBeVisible();

            await productElements.DESCRIPTION_TAB.click();
            await expect(productElements.TAB_CONTENT).toBeVisible();
        });
    });

    test.describe('Wishlist Operations', () => {

        test('should add product to wishlist and verify it appears on wishlist page @smoke @wishlist', async ({ page, loginActions, homeElements, layoutElements, shopElements, toast }) => {
            await loginActions.loginFunctions(config.profiles.validUser.email, config.profiles.validUser.password);
            await expect(homeElements.HERO_CAROUSEL).toBeVisible();

            await clearWishlist({ page, layoutElements });
            // Action: add random product to wishlist
            const { productName } = await addProductToWishlistFromShop({
                page, layoutElements, shopElements, testInfo: test.info(),
            });

            // Assert: toast confirmation
            await toast.assertAddedToWishlist();

            // Assert: product appears on wishlist page
            await layoutElements.WISHLIST_BUTTON.click();
            await expect(page).toHaveURL(/\/wishlist/);
            await page.waitForLoadState('domcontentloaded');
            await expect(page.locator('[data-testid^="wishlist-item-"]', { hasText: productName }).first()).toBeVisible();
        });
    });
});
