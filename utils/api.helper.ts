/**
 * Payment Gateway Sandbox Connector.
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

const defaultPaymentConfig: PaymentConfig = {
    apiKey: 'sandbox-api-key-placeholder',
    secretKey: 'sandbox-secret-key-placeholder',
    baseURL: 'https://api.sandbox.payment-gateway.com',
    environment: 'sandbox',
};

export class PaymentGatewayConnector {
    private config: PaymentConfig;

    constructor(config: Partial<PaymentConfig> = {}) {
        this.config = { ...defaultPaymentConfig, ...config };
    }

    async createPayment(amount: number, currency: string = 'IDR'): Promise<PaymentResult> {
        console.log(`[Payment] Creating payment: ${amount} ${currency}`);
        console.log(`[Payment] Using ${this.config.environment} environment at ${this.config.baseURL}`);
        throw new Error('Payment gateway not configured. Replace with actual SDK integration.');
    }

    async getPaymentStatus(transactionId: string): Promise<PaymentResult> {
        console.log(`[Payment] Checking status for transaction: ${transactionId}`);
        throw new Error('Payment gateway not configured. Replace with actual SDK integration.');
    }

    async refundPayment(transactionId: string, amount?: number): Promise<PaymentResult> {
        console.log(`[Payment] Refunding transaction: ${transactionId}, amount: ${amount ?? 'full'}`);
        throw new Error('Payment gateway not configured. Replace with actual SDK integration.');
    }
}

/**
 * Shipment Sandbox Connector.
 *
 * Placeholder: Replace with actual shipment provider SDK/API calls.
 */

export interface ShipmentConfig {
    apiKey: string;
    baseURL: string;
    environment: 'sandbox' | 'production';
}

export interface ShipmentRate {
    service: string;
    cost: number;
    estimatedDays: number;
    currency: string;
}

export interface ShipmentTracking {
    trackingNumber: string;
    status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'returned';
    lastUpdate: string;
    history: Array<{
        timestamp: string;
        status: string;
        location: string;
    }>;
}

export interface ShipmentOrder {
    trackingNumber: string;
    status: string;
    estimatedDelivery: string;
}

const defaultShipmentConfig: ShipmentConfig = {
    apiKey: 'sandbox-shipment-api-key-placeholder',
    baseURL: 'https://api.sandbox.shipment-provider.com',
    environment: 'sandbox',
};

export class ShipmentConnector {
    private config: ShipmentConfig;

    constructor(config: Partial<ShipmentConfig> = {}) {
        this.config = { ...defaultShipmentConfig, ...config };
    }

    async getShippingRates(origin: string, destination: string, weight: number): Promise<ShipmentRate[]> {
        console.log(`[Shipment] Getting rates: ${origin} -> ${destination}, weight: ${weight}kg`);
        throw new Error('Shipment connector not configured. Replace with actual SDK integration.');
    }

    async createShipment(data: {
        origin: string;
        destination: string;
        weight: number;
        service: string;
    }): Promise<ShipmentOrder> {
        console.log(`[Shipment] Creating shipment: ${data.origin} -> ${data.destination}`);
        throw new Error('Shipment connector not configured. Replace with actual SDK integration.');
    }

    async trackShipment(trackingNumber: string): Promise<ShipmentTracking> {
        console.log(`[Shipment] Tracking shipment: ${trackingNumber}`);
        throw new Error('Shipment connector not configured. Replace with actual SDK integration.');
    }

    async cancelShipment(trackingNumber: string): Promise<boolean> {
        console.log(`[Shipment] Cancelling shipment: ${trackingNumber}`);
        throw new Error('Shipment connector not configured. Replace with actual SDK integration.');
    }
}
