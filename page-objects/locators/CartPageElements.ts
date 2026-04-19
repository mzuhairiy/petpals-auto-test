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

    // CHECKOUT FORM
    readonly CHECKOUT_HEADING: Locator;
    readonly CHECKOUT_FIRST_NAME: Locator;
    readonly CHECKOUT_LAST_NAME: Locator;
    readonly CHECKOUT_EMAIL: Locator;
    readonly CHECKOUT_PHONE: Locator;
    readonly CHECKOUT_ADDRESS: Locator;
    readonly CHECKOUT_CITY: Locator;
    readonly CHECKOUT_STATE: Locator;
    readonly CHECKOUT_ZIP: Locator;
    readonly CHECKOUT_COUNTRY: Locator;
    readonly CHECKOUT_NOTES: Locator;
    readonly CHECKOUT_TERMS_CHECKBOX: Locator;
    readonly CHECKOUT_SUBMIT_BUTTON: Locator;

    // PAYMENT PAGE
    readonly PAYMENT_HEADING: Locator;
    readonly PAYMENT_ORDER_ID: Locator;
    readonly PAYMENT_TOTAL: Locator;
    readonly PAYMENT_PAY_NOW_BUTTON: Locator;
    readonly PAYMENT_BACK_BUTTON: Locator;

    // MIDTRANS SNAP IFRAME
    readonly SNAP_IFRAME: Locator;

    // ORDER SUCCESS PAGE
    readonly ORDER_SUCCESS_HEADING: Locator;
    readonly ORDER_SUCCESS_MESSAGE: Locator;
    readonly ORDER_CONTINUE_SHOPPING: Locator;
    readonly ORDER_VIEW_HISTORY: Locator;

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
        this.CHECKOUT_BUTTON = page.locator('[data-testid="checkout-btn"]');

        // CHECKOUT FORM
        this.CHECKOUT_HEADING = page.getByRole('heading', { name: 'Checkout', level: 1 });
        this.CHECKOUT_FIRST_NAME = page.locator('[data-testid="checkout-first-name-input"]');
        this.CHECKOUT_LAST_NAME = page.locator('[data-testid="checkout-last-name-input"]');
        this.CHECKOUT_EMAIL = page.locator('[data-testid="checkout-email-input"]');
        this.CHECKOUT_PHONE = page.locator('[data-testid="checkout-phone-input"]');
        this.CHECKOUT_ADDRESS = page.locator('[data-testid="checkout-address-input"]');
        this.CHECKOUT_CITY = page.locator('[data-testid="checkout-city-input"]');
        this.CHECKOUT_STATE = page.locator('[data-testid="checkout-state-input"]');
        this.CHECKOUT_ZIP = page.locator('[data-testid="checkout-zip-code-input"]');
        this.CHECKOUT_COUNTRY = page.locator('[data-testid="checkout-country-input"]');
        this.CHECKOUT_NOTES = page.locator('[data-testid="checkout-notes-input"]');
        this.CHECKOUT_TERMS_CHECKBOX = page.locator('[data-testid="checkout-terms-checkbox"]');
        this.CHECKOUT_SUBMIT_BUTTON = page.locator('[data-testid="checkout-submit-btn"]');

        // PAYMENT PAGE
        this.PAYMENT_HEADING = page.getByRole('heading', { name: 'Complete Your Payment', level: 1 });
        this.PAYMENT_ORDER_ID = page.locator('[data-testid="payment-order-id"]').or(page.getByText(/Order ID/));
        this.PAYMENT_TOTAL = page.locator('[data-testid="payment-total"]').or(page.getByText(/Rp.*\d/));
        this.PAYMENT_PAY_NOW_BUTTON = page.locator('[data-testid="payment-pay-now-btn"]');
        this.PAYMENT_BACK_BUTTON = page.getByRole('button', { name: 'Back to Checkout' });

        // MIDTRANS SNAP IFRAME
        this.SNAP_IFRAME = page.locator('iframe[name^="popup_"]');

        // ORDER SUCCESS PAGE
        this.ORDER_SUCCESS_HEADING = page.getByRole('heading', { name: 'Order Placed Successfully!', level: 1 });
        this.ORDER_SUCCESS_MESSAGE = page.getByText('Thank you for your order');
        this.ORDER_CONTINUE_SHOPPING = page.getByRole('link', { name: 'Continue Shopping' });
        this.ORDER_VIEW_HISTORY = page.getByRole('link', { name: 'View Order History' });
    }
}
