import { type Page, type Locator, expect } from '@playwright/test';
import { TOAST_TIMEOUT } from '../../constants/env.constants';

/**
 * ToastComponent — reusable toast notification handler.
 *
 * Toast notifications are ephemeral — they appear briefly then auto-dismiss.
 * Uses page-level locators to avoid race conditions where the toast viewport
 * is removed from DOM before the assertion runs.
 *
 * NOTE: This component contains assertion methods because toast verification
 * is inherently an assertion operation. This is the ONE exception to the
 * "no assertions in page objects" rule — components that exist solely
 * for verification purposes.
 */
export class ToastComponent {
    private readonly page: Page;
    // Root locator
    readonly viewport: Locator;

    constructor(page: Page) {
        this.page = page;
        this.viewport = page.locator('[data-testid="toast-viewport"]');
    }

    // ── Generic assertions ──

    async assertToastMessage(text: string, timeout?: number): Promise<void> {
        await expect(this.viewport.getByText(text)).toBeVisible({ timeout: timeout ?? TOAST_TIMEOUT });
    }

    getByText(text: string): Locator {
        return this.viewport.getByText(text);
    }

    // ── Auth toasts ──

    async assertSignInSuccess(): Promise<void> {
        await this.assertToastMessage('Welcome back!');
    }

    async assertSignInFailed(): Promise<void> {
        await this.assertToastMessage('Sign in failed');
    }

    async assertSignUpSuccess(): Promise<void> {
        await this.assertToastMessage('Welcome to PetPals!');
    }

    async assertEmailRegistered(): Promise<void> {
        await this.assertToastMessage('Email already registered');
    }

    async assertInvalidCredentials(): Promise<void> {
        await this.assertToastMessage('Invalid credentials');
    }

    // ── Shopping toasts ──

    async assertAddedToWishlist(): Promise<void> {
        await this.assertToastMessage('has been added to your wishlist');
    }

    async assertAddedToCart(): Promise<void> {
        await this.assertToastMessage('Added to cart');
    }
}
