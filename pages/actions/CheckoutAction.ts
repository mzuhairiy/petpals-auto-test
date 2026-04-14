import { type Page, expect } from '@playwright/test';
import BaseAction from './BaseAction';
import CartPageElements from '../locators/CartPageElements';
import { generateUserCheckoutData, type UserCheckoutData } from '../../src/helpers/TestDataGenerator';

/**
 * Checkout Action — handles checkout form filling and Midtrans payment flow.
 */
export default class CheckoutAction extends BaseAction {
    private readonly cartElements: CartPageElements;

    constructor(page: Page) {
        super(page);
        this.cartElements = new CartPageElements(page);
    }

    /**
     * Fill the checkout shipping form.
     * First name, last name, email, and country are pre-filled by the app.
     * Generates random data if none provided.
     */
    async fillCheckoutForm(data?: Partial<UserCheckoutData>): Promise<void> {
        const checkoutData = { ...generateUserCheckoutData(), ...data };

        await this.cartElements.CHECKOUT_PHONE.fill(checkoutData.phone);
        await this.cartElements.CHECKOUT_ADDRESS.fill(checkoutData.address);
        await this.cartElements.CHECKOUT_CITY.fill(checkoutData.city);
        await this.cartElements.CHECKOUT_STATE.fill('DKI Jakarta');
        await this.cartElements.CHECKOUT_ZIP.fill(checkoutData.postcode);
        await this.cartElements.CHECKOUT_TERMS_CHECKBOX.check();
    }

    /**
     * Complete payment via Midtrans Snap with test credit card.
     * Clicks Pay Now, waits for Snap iframe, fills card details, and waits for success redirect.
     */
    async payWithTestCreditCard(options?: {
        cardNumber?: string;
        expiry?: string;
        cvv?: string;
    }): Promise<void> {
        const cardNumber = options?.cardNumber ?? '4811 1111 1111 1114';
        const expiry = options?.expiry ?? '02/27';
        const cvv = options?.cvv ?? '123';

        // Click Pay Now and wait for Midtrans Snap iframe to appear
        await this.cartElements.PAYMENT_PAY_NOW_BUTTON.click();
        await this.page.waitForFunction(
            () => document.querySelector('iframe[name^="popup_"]') !== null,
            { timeout: 30_000 }
        );

        // Interact with Snap iframe
        const snapFrame = this.cartElements.SNAP_IFRAME.contentFrame();

        // Select Credit/debit card payment method
        await snapFrame.getByRole('link', { name: /Credit\/debit card/ }).click();

        // Fill card details
        await snapFrame.getByRole('textbox', { name: /1234 1234 1234/ }).fill(cardNumber);
        await snapFrame.getByRole('textbox', { name: 'MM/YY' }).fill(expiry);
        await snapFrame.locator('#card-cvv').fill(cvv);

        // Submit payment
        await snapFrame.getByRole('button', { name: 'Pay now' }).click();

        // Wait for Midtrans success screen, then app redirect
        await expect(snapFrame.getByText('Payment successful')).toBeVisible({ timeout: 30_000 });
        await expect(this.cartElements.ORDER_SUCCESS_HEADING).toBeVisible({ timeout: 30_000 });
    }
}
