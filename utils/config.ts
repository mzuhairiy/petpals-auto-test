import dotenv from 'dotenv';

dotenv.config();

interface Config {
    baseURL: string;
    validUser: {
        email: string;
        password: string;
    };
}

const config: Config = {
    baseURL: process.env.BASE_URL || 'https://staging.petpals-demo.shop',
    validUser: {
        email: process.env.TEST_USER_EMAIL || 'garaga@petpals.com',
        password: process.env.TEST_USER_PASSWORD || '@admin123',
    },
};

export default config;
