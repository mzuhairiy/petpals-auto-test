import { expect, type Page, type TestInfo } from '@playwright/test';
import LayoutElements from '../pages/locators/layout-elements';
import ShopPageElements from '../pages/locators/shop-page-elements';
import ProductPageElements from '../pages/locators/product-page-elements';

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
    const { page, layoutElements, shopElements, productElements, testInfo } = params;

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

    const productName = (await selectedCard.getByRole('heading', { level: 3 }).textContent())?.trim() || undefined;
    if (productName) {
        testInfo?.annotations.push({ type: 'productName', description: productName });
    }

    await selectedCard.click();
    await expect(page).toHaveURL(/\/product\//);
    await expect(productElements.PRODUCT_TITLE).toBeVisible();

    return { randomIndex, productName };
}
