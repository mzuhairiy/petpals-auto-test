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
     *
     * Handles two scenarios:
     * 1. Snap popup appears as iframe → interact inside iframe
     * 2. Snap popup fails to load → app shows "Payment popup could not load"
     *    warning with "Open Payment Page" button → redirects to Midtrans in new tab
     */
    async payWithTestCreditCard(options?: {
        cardNumber?: string;
        expiry?: string;
        cvv?: string;
    }): Promise<void> {
        const cardNumber = options?.cardNumber ?? '4811 1111 1111 1114';
        const expiry = options?.expiry ?? '02/27';
        const cvv = options?.cvv ?? '123';

        // Click Pay Now
        await this.cartElements.PAYMENT_PAY_NOW_BUTTON.click();

        // Race: either Snap iframe appears OR fallback warning appears
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

    /**
     * Pay via Snap iframe (happy path — popup appeared inline).
     */
    private async payViaSnapIframe(
        snapIframe: ReturnType<Page['locator']>,
        cardNumber: string, expiry: string, cvv: string,
    ): Promise<void> {
        const snapFrame = snapIframe.contentFrame();

        await snapFrame.getByRole('link', { name: /Credit\/debit card/ }).click();

        await snapFrame.getByRole('textbox', { name: /1234 1234 1234/ }).fill(cardNumber);
        await snapFrame.getByRole('textbox', { name: 'MM/YY' }).fill(expiry);
        await snapFrame.locator('#card-cvv').fill(cvv);

        await this.page.waitForTimeout(5000); // Small delay to ensure fields are processed before submitting
        await snapFrame.getByRole('button', { name: 'Pay now' }).click();

        await expect(snapFrame.getByText('Payment successful')).toBeVisible({ timeout: 30_000 });
        await expect(this.cartElements.ORDER_SUCCESS_HEADING).toBeVisible({ timeout: 30_000 });
    }

    /**
     * Pay via redirect (fallback — popup failed, "Open Payment Page" opens new tab).
     */
    private async payViaRedirect(
        cardNumber: string, expiry: string, cvv: string,
    ): Promise<void> {
        // Click "Open Payment Page" → opens Midtrans in a new tab
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.page.getByTestId('payment-redirect-link').click(),
        ]);

        await newPage.waitForLoadState('domcontentloaded');

        // Midtrans payment page in new tab — select Credit/debit card
        await newPage.getByRole('link', { name: /Credit\/debit card/ }).click();

        // Fill card details
        await newPage.getByRole('textbox', { name: /1234 1234 1234/ }).fill(cardNumber);
        await newPage.getByRole('textbox', { name: 'MM/YY' }).fill(expiry);
        await newPage.locator('#card-cvv').fill(cvv);

        // Submit payment
        await newPage.getByRole('button', { name: 'Pay now' }).click();

        // Wait for success in new tab
        await expect(newPage.getByText('Payment successful')).toBeVisible({ timeout: 30_000 });

        // Midtrans redirects back to app — success page loads in original tab
        await expect(this.cartElements.ORDER_SUCCESS_HEADING).toBeVisible({ timeout: 30_000 });
    }
}
