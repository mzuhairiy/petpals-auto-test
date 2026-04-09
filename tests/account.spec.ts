import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import LayoutElements from '../pages/locators/layout-elements';
import config from '../utils/config';
import AuthElements from '@locators/auth-page-elements';
import HomeElements from '@locators/home-page-elements';
import ProductPageElements from '@locators/product-page-elements';
import ShopPageElements from '@locators/shop-page-elements';

test.describe('Account E2E', () => {
    let loginActions: LoginActions;
    let authElements: AuthElements;
    let layoutElements: LayoutElements;
    let homeElements: HomeElements;
    let productElements: ProductPageElements;
    let shopElements: ShopPageElements;

    test.beforeEach(async ({ page }) => {
            loginActions = new LoginActions(page); 
            authElements = new AuthElements(page);
            layoutElements = new LayoutElements(page);
            homeElements = new HomeElements(page);
            productElements = new ProductPageElements(page);
            shopElements = new ShopPageElements(page);
            await page.goto(config.baseURL);
            await expect(homeElements.SIGN_IN_BUTTON).toBeVisible();
        });

    test.describe('Account Navigation', () => {

        test('should navigate to account page after login', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await homeElements.HERO_CAROUSEL.click();
            await layoutElements.ACCOUNT_BUTTON.click();
            await expect(page).toHaveURL(/\/account/);
            await expect(layoutElements.ACCOUNT_HEADING).toBeVisible();
        });

        test('should navigate to orders page after login', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(homeElements.HERO_CAROUSEL).toBeVisible({ timeout: 15000 });
            await layoutElements.ORDERS_BUTTON.click();
            await expect(page).toHaveURL(/\/orders/);
            await expect(layoutElements.ORDERS_HEADING).toBeVisible();
        });
    });

test.describe('Wishlist Management', () => {
    test.beforeEach(async ({ page, request }) => {
        await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
        await expect(homeElements.HERO_CAROUSEL).toBeVisible({ timeout: 15000 });

        const deleteResponse = await request.delete('/api/wishlist/items', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (deleteResponse.ok()) {
            test.info().annotations.push({ 
                type: 'cleanup', 
                description: 'Wishlist cleared successfully before test' 
            });
        }
    });

    test.afterAll(async ({ request }) => {
        try {
            await request.delete('/api/wishlist/items');
        } catch (e) {
        }
    });

    test('should add product to wishlist from shop and see it on wishlist page', async ({ page }) => {
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

        const wishlistButton = selectedCard.locator('[data-testid^="wishlist-btn-"]');
        await expect(wishlistButton, 'Wishlist button should be visible inside selected product card').toBeVisible();
        await wishlistButton.click();
        await expect(shopElements.TOAST_PRODUCT_ADDED).toBeVisible();

        await layoutElements.WISHLIST_BUTTON.click();
        await expect(page).toHaveURL(/\/wishlist/);

        const wishlistContent = page.getByRole('main');
        await expect(wishlistContent).toContainText(productName!);
        test.info().annotations.push({ type: 'productName', description: String(productName) });
    });

    test('wishlist should be empty after cleanup', async ({ page }) => {
        await layoutElements.WISHLIST_BUTTON.click();
        await expect(page).toHaveURL(/\/wishlist/);
        
        const wishlistContent = page.getByRole('main');
        await expect(wishlistContent).toContainText('Wishlist is empty');
    });
});
});
