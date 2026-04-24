import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

/**
 * CartPage — Cart and checkout page object.
 *
 * Contains locators and interactions for the cart, checkout form,
 * payment, and order success pages.
 * NO assertions — tests handle all verification.
 */
export default class CartPage extends BasePage {
    // Empty cart
    readonly emptyCartHeading: Locator;
    readonly emptyCartMessage: Locator;
    readonly continueShoppingLink: Locator;

    // Cart with items
    readonly cartHeading: Locator;
    readonly cartItems: Locator;
    readonly cartItemTitles: Locator;
    readonly cartItemPrices: Locator;
    readonly cartItemQuantities: Locator;
    readonly cartItemRemoveButtons: Locator;

    // Cart summary
    readonly cartSubtotal: Locator;
    readonly cartTotal: Locator;
    readonly checkoutButton: Locator;

    // Checkout form
    readonly checkoutHeading: Locator;
    readonly checkoutFirstName: Locator;
    readonly checkoutLastName: Locator;
    readonly checkoutEmail: Locator;
    readonly checkoutPhone: Locator;
    readonly checkoutAddress: Locator;
    readonly checkoutCity: Locator;
    readonly checkoutState: Locator;
    readonly checkoutZip: Locator;
    readonly checkoutCountry: Locator;
    readonly checkoutNotes: Locator;
    readonly checkoutTermsCheckbox: Locator;
    readonly checkoutSubmitButton: Locator;

    // Payment page
    readonly paymentHeading: Locator;
    readonly paymentOrderId: Locator;
    readonly paymentTotal: Locator;
    readonly paymentPayNowButton: Locator;
    readonly paymentBackButton: Locator;

    // Midtrans snap iframe
    readonly snapIframe: Locator;

    // Order success page
    readonly orderSuccessHeading: Locator;
    readonly orderSuccessMessage: Locator;
    readonly orderContinueShopping: Locator;
    readonly orderViewHistory: Locator;

    constructor(page: Page) {
        super(page);

        // Empty cart
        this.emptyCartHeading = page.getByRole('heading', { name: 'Your cart is empty' });
        this.emptyCartMessage = page.getByText("Looks like you haven't added anything to your cart yet.");
        this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' });

        // Cart with items
        this.cartHeading = page.getByRole('heading', { name: /Cart|Shopping/ });
        this.cartItems = page.locator('main').locator('[class*="cart-item"], tr, [class*="item"]');
        this.cartItemTitles = page.locator('main h3, main h4');
        this.cartItemPrices = page.locator('main').locator('text=/Rp \\d/');
        this.cartItemQuantities = page.locator('main').getByRole('spinbutton');
        this.cartItemRemoveButtons = page.locator('main').getByRole('button', { name: /Remove|Delete/ });

        // Cart summary
        this.cartSubtotal = page.getByText(/Subtotal/);
        this.cartTotal = page.getByText(/Total/);
        this.checkoutButton = this.byTestId('checkout-btn');

        // Checkout form
        this.checkoutHeading = page.getByRole('heading', { name: 'Checkout', level: 1 });
        this.checkoutFirstName = this.byTestId('checkout-first-name-input');
        this.checkoutLastName = this.byTestId('checkout-last-name-input');
        this.checkoutEmail = this.byTestId('checkout-email-input');
        this.checkoutPhone = this.byTestId('checkout-phone-input');
        this.checkoutAddress = this.byTestId('checkout-address-input');
        this.checkoutCity = this.byTestId('checkout-city-input');
        this.checkoutState = this.byTestId('checkout-state-input');
        this.checkoutZip = this.byTestId('checkout-zip-code-input');
        this.checkoutCountry = this.byTestId('checkout-country-input');
        this.checkoutNotes = this.byTestId('checkout-notes-input');
        this.checkoutTermsCheckbox = this.byTestId('checkout-terms-checkbox');
        this.checkoutSubmitButton = this.byTestId('checkout-submit-btn');

        // Payment page
        this.paymentHeading = page.getByRole('heading', { name: 'Complete Your Payment', level: 1 });
        this.paymentOrderId = this.byTestId('payment-order-id').or(page.getByText(/Order ID/));
        this.paymentTotal = this.byTestId('payment-total').or(page.getByText(/Rp.*\d/));
        this.paymentPayNowButton = this.byTestId('payment-pay-now-btn');
        this.paymentBackButton = page.getByRole('button', { name: 'Back to Checkout' });

        // Midtrans snap iframe
        this.snapIframe = page.locator('iframe[name^="popup_"]');

        // Order success page
        this.orderSuccessHeading = page.getByRole('heading', { name: 'Order Placed Successfully!', level: 1 });
        this.orderSuccessMessage = page.getByText('Thank you for your order');
        this.orderContinueShopping = page.getByRole('link', { name: 'Continue Shopping' });
        this.orderViewHistory = page.getByRole('link', { name: 'View Order History' });
    }

    // ── Cart interactions ──

    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    async removeCartItem(index: number = 0): Promise<void> {
        await this.cartItemRemoveButtons.nth(index).click();
    }

    // ── Checkout form interactions ──

    async fillCheckoutForm(data: {
        phone: string;
        address: string;
        city: string;
        state: string;
        postcode: string;
    }): Promise<void> {
        await this.checkoutPhone.fill(data.phone);
        await this.checkoutAddress.fill(data.address);
        await this.checkoutCity.fill(data.city);
        await this.checkoutState.fill(data.state);
        await this.checkoutZip.fill(data.postcode);
        await this.checkoutTermsCheckbox.check();
    }

    async submitCheckout(): Promise<void> {
        await this.checkoutSubmitButton.click();
    }

    // ── Payment interactions ──

    async clickPayNow(): Promise<void> {
        await this.paymentPayNowButton.click();
    }

    /**
     * Complete payment via Midtrans Snap with test credit card.
     *
     * Handles two scenarios:
     * 1. Snap popup appears as iframe → interact inside iframe
     * 2. Snap popup fails to load → "Open Payment Page" button → new tab
     */
    async payWithTestCreditCard(options?: {
        cardNumber?: string;
        expiry?: string;
        cvv?: string;
    }): Promise<void> {
        const cardNumber = options?.cardNumber ?? '4811 1111 1111 1114';
        const expiry = options?.expiry ?? '02/27';
        const cvv = options?.cvv ?? '123';

        await this.clickPayNow();

        const snapIframe = this.page.locator('iframe[name^="popup_"]');
        const fallbackWarning = this.page.getByText('Payment popup could not load');

        const winner = await Promise.race([
            snapIframe.waitFor({ state: 'attached', timeout: 20_000 }).then(() => 'iframe' as const),
            fallbackWarning.waitFor({ state: 'visible', timeout: 20_000 }).then(() => 'fallback' as const),
        ]);

        if (winner === 'iframe') {
            await this.payViaSnapIframe(snapIframe, cardNumber, expiry, cvv);
        } else {
            await this.payViaRedirect(cardNumber, expiry, cvv);
        }
    }

    private async payViaSnapIframe(
        snapIframe: Locator,
        cardNumber: string, expiry: string, cvv: string,
    ): Promise<void> {
        // Wait for iframe to be fully visible (not just attached to DOM)
        await snapIframe.waitFor({ state: 'visible', timeout: 30_000 });

        const snapFrame = snapIframe.contentFrame();

        // Wait for the Midtrans payment form to render inside the iframe
        const creditCardLink = snapFrame.getByRole('link', { name: /Credit\/debit card/ });
        await creditCardLink.waitFor({ state: 'visible', timeout: 30_000 });
        await creditCardLink.click();

        await snapFrame.getByRole('textbox', { name: /1234 1234 1234/ }).fill(cardNumber);
        await snapFrame.getByRole('textbox', { name: 'MM/YY' }).fill(expiry);
        await snapFrame.locator('#card-cvv').fill(cvv);

        // Wait for Midtrans to process card fields before submitting
        const payButton = snapFrame.getByRole('button', { name: 'Pay now' });
        await payButton.waitFor({ state: 'visible', timeout: 10_000 });
        await payButton.click({ delay: 5000 });
    }

    private async payViaRedirect(
        cardNumber: string, expiry: string, cvv: string,
    ): Promise<void> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.page.getByTestId('payment-redirect-link').click(),
        ]);

        await newPage.waitForLoadState('domcontentloaded');

        await newPage.getByRole('link', { name: /Credit\/debit card/ }).click();
        await newPage.getByRole('textbox', { name: /1234 1234 1234/ }).fill(cardNumber);
        await newPage.getByRole('textbox', { name: 'MM/YY' }).fill(expiry);
        await newPage.locator('#card-cvv').fill(cvv);
        await newPage.getByRole('button', { name: 'Pay now' }).click();
    }
}
