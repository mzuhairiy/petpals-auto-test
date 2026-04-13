import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file based on TEST_ENV
// Usage: TEST_ENV=local npx playwright test
//        TEST_ENV=staging npx playwright test  (default)
const testEnv = process.env.TEST_ENV || 'staging';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${testEnv}`) });
// Also load base .env as fallback (lower priority)
dotenv.config();

export interface UserProfile {
    email: string;
    password: string;
}

export interface AppConfig {
    env: string;
    baseUrl: string;
    profiles: {
        validUser: UserProfile;
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
    },
};

export default config;
