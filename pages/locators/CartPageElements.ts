import { type Page, type Locator } from '@playwright/test';

export default class CartPageElements {
    readonly page: Page;

    // EMPTY CART
    readonly EMPTY_CART_HEADING: Locator;
    readonly EMPTY_CART_MESSAGE: Locator;
    readonly CONTINUE_SHOPPING_LINK: Locator;

    // CART WITH ITEMS
    readonly CART_HEADING: Locator;
    readonly CART_ITEMS: Locator;
    readonly CART_ITEM_TITLES: Locator;
    readonly CART_ITEM_PRICES: Locator;
    readonly CART_ITEM_QUANTITIES: Locator;
    readonly CART_ITEM_REMOVE_BUTTONS: Locator;

    // CART SUMMARY
    readonly CART_SUBTOTAL: Locator;
    readonly CART_TOTAL: Locator;
    readonly CHECKOUT_BUTTON: Locator;

    constructor(page: Page) {
        this.page = page;

        // EMPTY CART
        this.EMPTY_CART_HEADING = page.getByRole('heading', { name: 'Your cart is empty' });
        this.EMPTY_CART_MESSAGE = page.getByText("Looks like you haven't added anything to your cart yet.");
        this.CONTINUE_SHOPPING_LINK = page.getByRole('link', { name: 'Continue Shopping' });

        // CART WITH ITEMS
        this.CART_HEADING = page.getByRole('heading', { name: /Cart|Shopping/ });
        this.CART_ITEMS = page.locator('main').locator('[class*="cart-item"], tr, [class*="item"]');
        this.CART_ITEM_TITLES = page.locator('main h3, main h4');
        this.CART_ITEM_PRICES = page.locator('main').locator('text=/Rp \\d/');
        this.CART_ITEM_QUANTITIES = page.locator('main').getByRole('spinbutton');
        this.CART_ITEM_REMOVE_BUTTONS = page.locator('main').getByRole('button', { name: /Remove|Delete/ });

        // CART SUMMARY
        this.CART_SUBTOTAL = page.getByText(/Subtotal/);
        this.CART_TOTAL = page.getByText(/Total/);
        this.CHECKOUT_BUTTON = page.getByRole('button', { name: /Checkout|Proceed/ }).or(page.getByRole('link', { name: /Checkout|Proceed/ }));
    }
}
