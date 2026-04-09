import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import LayoutElements from '../pages/locators/layout-elements';
import HomeElements from '@locators/home-page-elements';
import ProductPageElements from '@locators/product-page-elements';
import ShopPageElements from '@locators/shop-page-elements';
import config from '../utils/config';
import { navigateToRandomProductDetailViaShop } from '../utils/product-helpers';

test.describe('Product E2E', () => {
    let loginActions: LoginActions;
    let layoutElements: LayoutElements;
    let homeElements: HomeElements;
    let productElements: ProductPageElements;
    let shopElements: ShopPageElements;

    test.beforeEach(async ({ page }) => {
        loginActions = new LoginActions(page);
        layoutElements = new LayoutElements(page);
        homeElements = new HomeElements(page);
        productElements = new ProductPageElements(page);
        shopElements = new ShopPageElements(page);

        await page.goto(config.baseURL);
        await expect(homeElements.SIGN_IN_BUTTON).toBeVisible();
    });

    test.describe('Product Detail Page', () => {

        test('should load product detail page with interactive elements', async ({ page }) => {
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

        test('should increase product quantity using controls', async ({ page }) => {
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

            // Prefer the explicit increment control; if UI changes, this will fail loudly.
            await productElements.INCREASE_QUANTITY_BUTTON.click();

            const afterValueRaw = await productElements.QUANTITY_INPUT.inputValue();
            const afterValue = Number.parseInt(afterValueRaw, 10);
            expect(
                Number.isFinite(afterValue),
                `Expected quantity input to be a number, got: "${afterValueRaw}"`
            ).toBeTruthy();

            expect(afterValue, 'Expected quantity to increment by 1').toBe(beforeValue + 1);
        });

        test('should switch between product tabs', async ({ page }) => {
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

        test('should add product to wishlist and verify it appears on wishlist page', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(homeElements.HERO_CAROUSEL).toBeVisible({ timeout: 15000 });

            await layoutElements.NAV_SHOP.click();
            await expect(page).toHaveURL(/\/shop/);
            await expect(shopElements.SHOP_HEADING).toBeVisible();

            const productCards = shopElements.PRODUCT_CARDS;
            const cardCount = await productCards.count();
            expect(cardCount, 'Expected at least one product card on the shop page').toBeGreaterThan(0);

            const randomIndex = Math.floor(Math.random() * cardCount);
            test.info().annotations.push({ type: 'randomProductIndex', description: String(randomIndex) });

            const selectedCard = productCards.nth(randomIndex);
            await expect(selectedCard, `Product card at index ${randomIndex} should be visible`).toBeVisible();

            const productName = (await selectedCard.getByRole('heading', { level: 3 }).textContent())?.trim();
            expect(productName, 'Expected selected product to have a name').toBeTruthy();

            // Scoped locator (wishlist button inside the selected product card)
            const wishlistButton = selectedCard.locator('[data-testid^="wishlist-btn-"]');
            await expect(wishlistButton).toBeVisible();
            await wishlistButton.click();

            await layoutElements.WISHLIST_BUTTON.click();
            await expect(page).toHaveURL(/\/wishlist/);

            const wishlistContent = page.getByRole('main');
            await expect(wishlistContent).toContainText(productName!);
        });
    });
});
