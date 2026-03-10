import { test, expect } from '@playwright/test';
import ProductActions from '../pages/actions/product-actions';
import ProductPageElements from '../pages/locators/product-page-elements';
import ShopPageElements from '../pages/locators/shop-page-elements';
import config from '../app-config/config.json';

/**
 * Product detail page test scenarios for PetPals application
 * Tests covering product information display, cart actions, and navigation
 */

test.describe('Product Detail Page Tests', () => {
    let productActions: ProductActions;
    let productElements: ProductPageElements;

    test.beforeEach(async ({ page }) => {
        productActions = new ProductActions(page);
        productElements = new ProductPageElements(page);
        await productActions.gotoAsync(`${config.baseURL}/product/cat-water-fountain`);
        await expect(productElements.PRODUCT_TITLE).toBeVisible();
    });

    test.describe('Product Information', () => {
        test('should display product title', async ({}) => {
            await expect(productElements.PRODUCT_TITLE).toHaveText('Cat Water Fountain');
        });

        test('should display product main image', async ({}) => {
            await expect(productElements.PRODUCT_MAIN_IMAGE).toBeVisible();
        });

        test('should display product thumbnail images', async ({}) => {
            const thumbnailCount = await productElements.PRODUCT_THUMBNAIL_IMAGES.count();
            expect(thumbnailCount).toBeGreaterThan(0);
        });

        test('should display product rating and review count', async ({}) => {
            await expect(productElements.PRODUCT_RATING).toBeVisible();
            await expect(productElements.PRODUCT_REVIEW_COUNT).toBeVisible();
        });

        test('should display product price', async ({}) => {
            await expect(productElements.PRODUCT_CURRENT_PRICE).toBeVisible();
        });

        test('should display product description', async ({}) => {
            await expect(productElements.PRODUCT_DESCRIPTION).toBeVisible();
        });

        test('should display stock status', async ({}) => {
            await expect(productElements.PRODUCT_STOCK_STATUS).toBeVisible();
        });

        test('should display shipping information', async ({}) => {
            await expect(productElements.FREE_SHIPPING_INFO).toBeVisible();
        });
    });

    test.describe('Product Info Badges', () => {
        test('should display Free Delivery info', async ({}) => {
            await expect(productElements.FREE_DELIVERY_INFO).toBeVisible();
        });

        test('should display 30-Day Returns info', async ({}) => {
            await expect(productElements.RETURNS_INFO).toBeVisible();
        });

        test('should display Secure Checkout info', async ({}) => {
            await expect(productElements.SECURE_CHECKOUT_INFO).toBeVisible();
        });
    });

    test.describe('Quantity Controls', () => {
        test('should display quantity input with default value of 1', async ({}) => {
            await expect(productElements.QUANTITY_INPUT).toBeVisible();
            await expect(productElements.QUANTITY_INPUT).toHaveValue('1');
        });

        test('should increase quantity when clicking increase button', async ({}) => {
            await productActions.increaseQuantity();
            await expect(productElements.QUANTITY_INPUT).toHaveValue('2');
        });

        test('should display Add to Cart button', async ({}) => {
            await expect(productElements.ADD_TO_CART_BUTTON).toBeVisible();
        });

        test('should display Add to Wishlist button', async ({}) => {
            await expect(productElements.ADD_TO_WISHLIST_BUTTON).toBeVisible();
        });
    });

    test.describe('Product Tabs', () => {
        test('should display Description tab as selected by default', async ({}) => {
            await expect(productElements.DESCRIPTION_TAB).toBeVisible();
            await expect(productElements.TAB_CONTENT).toBeVisible();
        });

        test('should display description content with features list', async ({}) => {
            await expect(productElements.DESCRIPTION_TEXT.first()).toBeVisible();
            const featureCount = await productElements.DESCRIPTION_FEATURES.count();
            expect(featureCount).toBeGreaterThan(0);
        });

        test('should switch to Nutritional Details tab', async ({}) => {
            await productActions.switchToNutritionalDetailsTab();
            await expect(productElements.TAB_CONTENT).toBeVisible();
        });

        test('should switch to Reviews tab', async ({}) => {
            await productActions.switchToReviewsTab();
            await expect(productElements.TAB_CONTENT).toBeVisible();
        });
    });

    test.describe('Related Products', () => {
        test('should display Related Products section', async ({}) => {
            await expect(productElements.RELATED_PRODUCTS_HEADING).toBeVisible();
        });

        test('should display related product cards', async ({}) => {
            const relatedCount = await productActions.getRelatedProductCount();
            expect(relatedCount).toBeGreaterThan(0);
        });

        test('should navigate to related product when clicked', async ({ page }) => {
            const clickedTitle = await productActions.clickRandomRelatedProduct();
            await expect(productElements.PRODUCT_TITLE).toBeVisible();
        });
    });

    test.describe('Navigation', () => {
        test('should navigate back to shop page', async ({ page }) => {
            await productActions.navigateBackToShop();
            const shopElements = new ShopPageElements(page);
            await expect(shopElements.SHOP_HEADING).toBeVisible();
        });
    });
});
