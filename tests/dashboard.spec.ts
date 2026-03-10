import { test, expect } from '@playwright/test';
import LayoutActions from '../pages/actions/layout-actions';
import LayoutElements from '../pages/locators/layout-elements';
import ShopPageElements from '../pages/locators/shop-page-elements';
import HomePageElements from '../pages/locators/home-page-elements';
import AuthElements from '../pages/locators/auth-page-elements';
import config from '../app-config/config.json';

/**
 * Dashboard / Layout test scenarios for PetPals application
 * Tests covering navigation, footer links, and overall layout
 */

test.describe('Layout & Navigation Tests', () => {
    let layoutActions: LayoutActions;
    let layoutElements: LayoutElements;

    test.beforeEach(async ({ page }) => {
        layoutActions = new LayoutActions(page);
        layoutElements = new LayoutElements(page);
        await layoutActions.gotoAsync(config.baseURL);
        await expect(page).toHaveTitle(/PetPals/);
    });

    test.describe('Header Elements', () => {
        test('should display PetPals logo', async ({}) => {
            await expect(layoutElements.PETPALS_LOGO).toBeVisible();
        });

        test('should display navigation bar with all menu items', async ({}) => {
            await expect(layoutElements.NAV_HOME).toBeVisible();
            await expect(layoutElements.NAV_SHOP).toBeVisible();
            await expect(layoutElements.NAV_CATS).toBeVisible();
            await expect(layoutElements.NAV_DOGS).toBeVisible();
            await expect(layoutElements.NAV_ABOUT).toBeVisible();
        });

        test('should display header action buttons', async ({}) => {
            await expect(layoutElements.SEARCH_BUTTON).toBeVisible();
            await expect(layoutElements.CART_BUTTON).toBeVisible();
        });
    });

    test.describe('Navbar Navigation', () => {
        test('should navigate to Shop page from navbar', async ({ page }) => {
            await layoutActions.navigateToShop();
            const shopElements = new ShopPageElements(page);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });

        test('should navigate to Cats page from navbar', async ({ page }) => {
            await layoutActions.navigateToCats();
            const shopElements = new ShopPageElements(page);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });

        test('should navigate to Dogs page from navbar', async ({ page }) => {
            await layoutActions.navigateToDogs();
            const shopElements = new ShopPageElements(page);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });

        test('should navigate to Home page by clicking logo', async ({}) => {
            await layoutActions.navigateToShop();
            await layoutActions.clickLogo();
            const homeElements = new HomePageElements(layoutElements.page);
            await expect(homeElements.FEATURED_PRODUCTS_H2).toBeVisible();
        });

        test('should navigate to Sign In page', async ({ page }) => {
            await layoutActions.navigateToSignIn();
            const authElements = new AuthElements(page);
            await expect(authElements.SIGN_IN_HEADING).toBeVisible();
        });

        test('should navigate to Sign Up page', async ({ page }) => {
            await layoutActions.navigateToSignUp();
            const authElements = new AuthElements(page);
            await expect(authElements.SIGN_UP_HEADING).toBeVisible();
        });

        test('should navigate to Cart page', async ({ page }) => {
            await layoutActions.navigateToCart();
            const cartHeading = page.getByRole('heading', { name: /cart/i });
            await expect(cartHeading).toBeVisible();
        });
    });

    test.describe('Footer Elements', () => {
        test('should display footer with all sections', async ({}) => {
            await expect(layoutElements.FOOTER).toBeVisible();
            await expect(layoutElements.FOOTER_COPYRIGHT).toBeVisible();
        });

        test('should display footer Shop links', async ({}) => {
            await expect(layoutElements.FOOTER_PET_TOYS).toBeVisible();
            await expect(layoutElements.FOOTER_PET_FOOD).toBeVisible();
            await expect(layoutElements.FOOTER_SUPPLEMENTS).toBeVisible();
            await expect(layoutElements.FOOTER_CAT_PRODUCTS).toBeVisible();
            await expect(layoutElements.FOOTER_DOG_PRODUCTS).toBeVisible();
        });

        test('should display footer Company links', async ({}) => {
            await expect(layoutElements.FOOTER_ABOUT_US).toBeVisible();
            await expect(layoutElements.FOOTER_CAREERS).toBeVisible();
            await expect(layoutElements.FOOTER_BLOG).toBeVisible();
            await expect(layoutElements.FOOTER_CONTACT).toBeVisible();
        });

        test('should display footer Customer Service links', async ({}) => {
            await expect(layoutElements.FOOTER_HELP_CENTER).toBeVisible();
            await expect(layoutElements.FOOTER_SHIPPING).toBeVisible();
            await expect(layoutElements.FOOTER_RETURNS).toBeVisible();
            await expect(layoutElements.FOOTER_CONTACT_US).toBeVisible();
            await expect(layoutElements.FOOTER_WISHLIST).toBeVisible();
            await expect(layoutElements.FOOTER_PRIVACY_POLICY).toBeVisible();
            await expect(layoutElements.FOOTER_TERMS).toBeVisible();
        });

        test('should display social media links', async ({}) => {
            const socialCount = await layoutElements.FOOTER_SOCIAL_LINKS.count();
            expect(socialCount).toBe(4); // Facebook, Instagram, Twitter, YouTube
        });
    });

    test.describe('Footer Navigation', () => {
        test('should navigate to Pet Toys from footer', async ({ page }) => {
            await layoutElements.FOOTER_PET_TOYS.click();
            const shopElements = new ShopPageElements(page);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });

        test('should navigate to About Us from footer', async ({}) => {
            await layoutElements.FOOTER_ABOUT_US.click();
            await expect(layoutElements.page).toHaveURL(/about/);
        });

        test('should navigate to Help Center from footer', async ({}) => {
            await layoutElements.FOOTER_HELP_CENTER.click();
            await expect(layoutElements.page).toHaveURL(/help/);
        });
    });
});
