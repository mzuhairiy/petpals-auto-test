import dotenv from 'dotenv';
import path from 'path';

/**
 * Environment configuration loader.
 *
 * Loads environment-specific .env file based on TEST_ENV variable.
 * Usage:
 *   TEST_ENV=local npx playwright test
 *   TEST_ENV=staging npx playwright test  (default)
 */
const testEnv = process.env.TEST_ENV || 'staging';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${testEnv}`) });
dotenv.config(); // fallback to base .env

export interface UserProfile {
    email: string;
    password: string;
}

export interface AppConfig {
    env: string;
    baseUrl: string;
    profiles: {
        validUser: UserProfile;
        adminUser: UserProfile;
    };
}

const config: AppConfig = {
    env: testEnv,
    baseUrl: process.env.BASE_URL || 'https://staging.petpals-demo.shop',
    profiles: {
        validUser: {
            email: process.env.TEST_USER_EMAIL || 'garaga@petpals.com',
            password: process.env.TEST_USER_PASSWORD || '@admin123',
        },
        adminUser: {
            email: process.env.ADMIN_USER_EMAIL || 'admin@petpals.com',
            password: process.env.ADMIN_USER_PASSWORD || 'admin123',
        },
    },
};

export default config;
