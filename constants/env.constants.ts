/**
 * Global constants for the test framework.
 *
 * Centralized location for all magic numbers, timeouts,
 * and string constants used across the test suite.
 */

// ── Timeouts ──
export const TOAST_TIMEOUT = 10_000;
export const NAVIGATION_TIMEOUT = 30_000;
export const PAYMENT_TIMEOUT = 30_000;
export const SNAP_IFRAME_TIMEOUT = 20_000;

// ── Test Credit Card (Midtrans Sandbox) ──
export const TEST_CREDIT_CARD = {
    number: '4811 1111 1111 1114',
    expiry: '02/27',
    cvv: '123',
} as const;

// ── URL Patterns ──
export const URL_PATTERNS = {
    signIn: /sign-in/,
    signUp: /sign-up/,
    forgotPassword: /forgot-password/,
    shop: /\/shop/,
    product: /\/product\//,
    cart: /\/cart/,
    checkout: /\/checkout/,
    account: /\/account/,
    orders: /\/orders/,
    wishlist: /\/wishlist/,
    catFilter: /pet=cat/,
    dogFilter: /pet=dog/,
    categoryToys: /category=toys/,
    categoryFood: /category=food/,
    categorySupplements: /category=supplements/,
} as const;

// ── Checkout defaults ──
export const DEFAULT_CHECKOUT_STATE = 'DKI Jakarta';
