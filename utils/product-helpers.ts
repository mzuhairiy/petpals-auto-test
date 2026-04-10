import { expect, type Page, type Locator, type TestInfo } from '@playwright/test';
import LayoutElements from '../pages/locators/layout-elements';
import ShopPageElements from '../pages/locators/shop-page-elements';
import ProductPageElements from '../pages/locators/product-page-elements';
import HomePageElements from '../pages/locators/home-page-elements';
import { V } from 'node_modules/@faker-js/faker/dist/airline-eVQV6kbz';

/**
 * Removes all products from the wishlist page.
 * Navigates to the wishlist, clicks every remove button, then returns.
 * Safe to call when the wishlist is already empty (no-op).
 */
export async function clearWishlist(params: {
    page: Page;
    layoutElements: LayoutElements;
}): Promise<void> {
    const { page, layoutElements } = params;

    await layoutElements.WISHLIST_BUTTON.click();
    await expect(page).toHaveURL(/\/wishlist/);
    const continueShoppingBtn = page.locator('[data-testid="wishlist-continue-shopping-link"]');
    await expect(continueShoppingBtn).toBeVisible();
    const removeButtons = page.locator('[data-testid^="wishlist-remove-"]');
    let count = await removeButtons.count();

    while (count > 0) {
        await removeButtons.first().click();
        await page.waitForTimeout(300);
        count = await removeButtons.count();
    }
}

/**
 * Navigates to the Shop page, selects a random product card, and returns
 * the selected card locator and product name WITHOUT clicking into it.
 *
 * Use this when you need to interact with the card itself (e.g. wishlist button, add-to-cart).
 */
export async function selectRandomProductCardFromShop(params: {
    page: Page;
    layoutElements: LayoutElements;
    shopElements: ShopPageElements;
    testInfo?: TestInfo;
}): Promise<{ selectedCard: Locator; productName: string; randomIndex: number }> {
    const { page, layoutElements, shopElements, testInfo } = params;

    await layoutElements.NAV_SHOP.click();
    await expect(page).toHaveURL(/\/shop/);
    await expect(shopElements.SHOP_HEADING).toBeVisible();

    const productCards = shopElements.PRODUCT_CARDS;
    const cardCount = await productCards.count();
    expect(cardCount, 'Expected at least one product card on the shop page').toBeGreaterThan(0);

    const randomIndex = Math.floor(Math.random() * cardCount);
    testInfo?.annotations.push({ type: 'randomProductIndex', description: String(randomIndex) });

    const selectedCard = productCards.nth(randomIndex);
    await expect(selectedCard, `Product card at index ${randomIndex} should be visible`).toBeVisible();

    const productName = (await selectedCard.getByRole('heading', { level: 3 }).textContent())?.trim() ?? '';
    expect(productName, 'Expected selected product to have a name').toBeTruthy();

    if (productName) {
        testInfo?.annotations.push({ type: 'productName', description: productName });
    }

    return { selectedCard, productName, randomIndex };
}

/**
 * Navigates to the Shop page, selects a random product card, and opens its product detail page.
 *
 * Returns the selected product name (if available) and the random index used.
 */
export async function navigateToRandomProductDetailViaShop(params: {
    page: Page;
    layoutElements: LayoutElements;
    shopElements: ShopPageElements;
    productElements: ProductPageElements;
    testInfo?: TestInfo;
}): Promise<{ randomIndex: number; productName?: string }> {
    const { page, productElements } = params;

    const { selectedCard, productName, randomIndex } = await selectRandomProductCardFromShop(params);

    await selectedCard.click();
    await expect(page).toHaveURL(/\/product\//);
    await expect(productElements.PRODUCT_TITLE).toBeVisible();

    return { randomIndex, productName: productName || undefined };
}

/**
 * Picks a random "Add to cart" button from the homepage, clicks it,
 * and returns the product name from the parent card.
 */
export async function addRandomProductToCartFromHomepage(params: {
    page: Page;
    homeElements: HomePageElements;
    testInfo?: TestInfo;
}): Promise<{ productName: string; randomIndex: number }> {
    const { page, homeElements, testInfo } = params;

    const addToCartButtons = homeElements.CAT_ADD_TO_CART_BUTTONS;
    const buttonCount = await addToCartButtons.count();
    expect(buttonCount, 'Expected at least one Add to cart button on homepage').toBeGreaterThan(0);

    const randomIndex = Math.floor(Math.random() * buttonCount);
    testInfo?.annotations.push({ type: 'randomCartButtonIndex', description: String(randomIndex) });

    const selectedButton = addToCartButtons.nth(randomIndex);
    const productCard = selectedButton.locator('xpath=ancestor::*[contains(@data-testid, "product-card-")]');
    const productName = (await productCard.getByRole('heading', { level: 3 }).textContent())?.trim() ?? '';
    expect(productName, 'Expected product card to have a name').toBeTruthy();
    testInfo?.annotations.push({ type: 'productName', description: productName });

    await expect(selectedButton).toBeVisible();
    await selectedButton.click();

    return { productName, randomIndex };
}
