/**
 * Database Helper — merged from db-helper.ts + db-utils.ts
 *
 * Placeholder: Replace with actual database driver when integration is ready.
 */

export interface DatabaseConnection {
    query(sql: string, params?: unknown[]): Promise<unknown[]>;
    close(): Promise<void>;
}

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

export async function connectToDatabase(): Promise<DatabaseConnection> {
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'petpals_user',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'petpals_db',
    };

    console.log(`[DB] Connecting to database at ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

    // TODO: Replace with actual database driver (e.g., pg, mysql2, prisma)
    return {
        async query(sql: string, params?: unknown[]): Promise<unknown[]> {
            console.log(`[DB] Executing query: ${sql}`, params);
            throw new Error('Database connection not configured. Replace with actual driver.');
        },
        async close(): Promise<void> {
            console.log('[DB] Connection closed');
        },
    };
}

export async function checkUserDataInDatabase(email: string): Promise<UserRow[]> {
    const connection = await connectToDatabase();
    try {
        const rows = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
        return rows as UserRow[];
    } finally {
        await connection.close();
    }
}

export async function getOrdersByUserEmail(email: string): Promise<OrderRow[]> {
    const connection = await connectToDatabase();
    try {
        const rows = await connection.query(
            'SELECT o.* FROM orders o JOIN users u ON o.user_id = u.id WHERE u.email = $1',
            [email]
        );
        return rows as OrderRow[];
    } finally {
        await connection.close();
    }
}
