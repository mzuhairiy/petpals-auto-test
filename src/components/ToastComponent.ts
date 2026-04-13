import { Page, Locator, expect } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * ToastComponent — reusable toast notification handler.
 *
 * Toast notifications are ephemeral — they appear briefly then auto-dismiss.
 * This component uses page-level locators (not scoped to root) to avoid
 * race conditions where the toast viewport is removed from DOM before
 * the assertion runs.
 */
export class ToastComponent extends BaseComponent {

    /** Default timeout for toast assertions (toast may take a moment to appear) */
    private static readonly TOAST_TIMEOUT = 10_000;

    constructor(page: Page) {
        super(page, page.locator('[data-testid="toast-viewport"]'));
    }

    /** Wait for any toast to appear */
    async waitForToast(timeout?: number): Promise<void> {
        await this.waitForVisible(timeout ?? ToastComponent.TOAST_TIMEOUT);
    }

    /**
     * Assert toast contains specific text.
     * Uses page-level locator with getByText to avoid scoping issues
     * when toast viewport is lazily rendered.
     */
    async assertToastMessage(text: string, timeout?: number): Promise<void> {
        const effectiveTimeout = timeout ?? ToastComponent.TOAST_TIMEOUT;

        // Use page-level locator — more resilient than scoping to root
        // because some UI frameworks only mount toast-viewport when a toast is active
        const toastLocator = this.page.locator('[data-testid="toast-viewport"]').getByText(text);

        await expect(toastLocator).toBeVisible({ timeout: effectiveTimeout });
    }

    /** Get toast by text */
    getByText(text: string): Locator {
        return this.page.locator('[data-testid="toast-viewport"]').getByText(text);
    }

    // ── Common toast assertions ──

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

    async assertAddedToWishlist(): Promise<void> {
        await this.assertToastMessage('Added to wishlist');
    }

    async assertAddedToCart(): Promise<void> {
        await this.assertToastMessage('Added to cart');
    }
}
