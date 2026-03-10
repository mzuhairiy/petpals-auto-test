/**
 * Database helper module.
 * Provides reusable database query functions for test verification.
 *
 * Placeholder: Implement actual queries when database integration is ready.
 */

import { connectToDatabase } from './db-utils';

export interface UserRow {
    id: number;
    full_name: string;
    email: string;
}

export interface OrderRow {
    id: number;
    user_id: number;
    total: number;
    status: string;
}

export async function checkUserDataInDatabase(email: string): Promise<UserRow[]> {
    try {
        const connection = await connectToDatabase();
        const rows = await connection.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        await connection.close();
        return rows as UserRow[];
    } catch (error) {
        console.error('[DB Helper] Error querying user data:', error);
        throw error;
    }
}

export async function getOrdersByUserEmail(email: string): Promise<OrderRow[]> {
    try {
        const connection = await connectToDatabase();
        const rows = await connection.query(
            'SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email = $1',
            [email]
        );
        await connection.close();
        return rows as OrderRow[];
    } catch (error) {
        console.error('[DB Helper] Error querying orders:', error);
        throw error;
    }
}
