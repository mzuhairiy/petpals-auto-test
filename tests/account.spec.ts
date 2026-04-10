import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import LayoutElements from '../pages/locators/layout-elements';
import config from '../utils/config';
import AuthElements from '@locators/auth-page-elements';
import HomeElements from '@locators/home-page-elements';
import ProductPageElements from '@locators/product-page-elements';
import ShopPageElements from '@locators/shop-page-elements';
import { clearWishlist, selectRandomProductCardFromShop } from '../utils/product-helpers';

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
            await expect(homeElements.HERO_CAROUSEL).toBeVisible();
            await layoutElements.ACCOUNT_BUTTON.click();
            await expect(page).toHaveURL(/\/account/);
            await expect(layoutElements.ACCOUNT_HEADING).toBeVisible();
        });

        test('should navigate to orders page after login', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(homeElements.HERO_CAROUSEL).toBeVisible();
            await layoutElements.ORDERS_BUTTON.click();
            await expect(page).toHaveURL(/\/orders/);
            await expect(layoutElements.ORDERS_HEADING).toBeVisible();
        });
    });

    test.describe('Wishlist Management', () => {

        test('should add product to wishlist from shop and see it on wishlist page', async ({ page }) => {
            await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
            await expect(homeElements.HERO_CAROUSEL).toBeVisible();

            await clearWishlist({ page, layoutElements });

            const { selectedCard, productName } = await selectRandomProductCardFromShop({
                page, layoutElements, shopElements, testInfo: test.info(),
            });

            const wishlistButton = selectedCard.locator('[data-testid^="wishlist-btn-"]');
            await expect(wishlistButton).toBeVisible();
            await wishlistButton.click();
            await expect(shopElements.TOAST_PRODUCT_ADDED).toBeVisible();

            await layoutElements.WISHLIST_BUTTON.click();
            await expect(page).toHaveURL(/\/wishlist/);
            await expect(page.getByRole('main')).toContainText(productName);
        });
    });
});
