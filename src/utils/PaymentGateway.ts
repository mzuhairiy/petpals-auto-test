/**
 * Payment Gateway Sandbox Connector
 * Skeleton module for integrating with a payment gateway sandbox environment.
 *
 * Placeholder: Replace with actual payment gateway SDK/API calls
 * when the integration is ready (e.g., Stripe, Midtrans, PayPal sandbox).
 */

export interface PaymentConfig {
    apiKey: string;
    secretKey: string;
    baseURL: string;
    environment: 'sandbox' | 'production';
}

export interface PaymentResult {
    transactionId: string;
    status: 'success' | 'pending' | 'failed';
    amount: number;
    currency: string;
}

const defaultConfig: PaymentConfig = {
    apiKey: 'sandbox-api-key-placeholder',
    secretKey: 'sandbox-secret-key-placeholder',
    baseURL: 'https://api.sandbox.payment-gateway.com',
    environment: 'sandbox',
};

export class PaymentGatewayConnector {
    private config: PaymentConfig;

    constructor(config: Partial<PaymentConfig> = {}) {
        this.config = { ...defaultConfig, ...config };
    }

    async createPayment(amount: number, currency: string = 'IDR'): Promise<PaymentResult> {
        console.log(`[Payment] Creating payment: ${amount} ${currency}`);
        console.log(`[Payment] Using ${this.config.environment} environment at ${this.config.baseURL}`);

        // TODO: Implement actual payment gateway API call
        throw new Error('Payment gateway not configured. Replace with actual SDK integration.');
    }

    async getPaymentStatus(transactionId: string): Promise<PaymentResult> {
        console.log(`[Payment] Checking status for transaction: ${transactionId}`);

        // TODO: Implement actual status check
        throw new Error('Payment gateway not configured. Replace with actual SDK integration.');
    }

    async refundPayment(transactionId: string, amount?: number): Promise<PaymentResult> {
        console.log(`[Payment] Refunding transaction: ${transactionId}, amount: ${amount ?? 'full'}`);

        // TODO: Implement actual refund
        throw new Error('Payment gateway not configured. Replace with actual SDK integration.');
    }
}
