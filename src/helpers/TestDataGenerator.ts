import { faker } from '@faker-js/faker';

export interface UserCreds {
    fullName: string;
    email: string;
    password: string;
}

export interface UserCheckoutData {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postcode: string;
    phone: string;
}

/**
 * TestDataGenerator — random test data generation.
 * Enhanced from user-data-generator.ts with class-based pattern.
 */
export class TestDataGenerator {
    static generateUserCreds(): UserCreds {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        return {
            fullName: `${firstName} ${lastName}`,
            email: faker.internet.email({ firstName, lastName, provider: 'testmail.com' }).toLowerCase(),
            password: faker.internet.password({ length: 12, prefix: 'T1!' }),
        };
    }

    static generateUserCheckoutData(): UserCheckoutData {
        const creds = TestDataGenerator.generateUserCreds();
        const streetNum = faker.number.int({ min: 100, max: 9999 });
        const streetName = faker.location.street();
        return {
            fullName: creds.fullName,
            email: creds.email,
            address: `${streetNum} ${streetName}`,
            city: faker.location.city(),
            postcode: `${faker.number.int({ min: 10000, max: 99999 })}`,
            phone: `+62${faker.number.int({ min: 800000000, max: 899999999 })}`,
        };
    }

    static generateEmail(): string {
        return faker.internet.email({ provider: 'testmail.com' }).toLowerCase();
    }

    static generateFullName(): string {
        return faker.person.fullName();
    }

    static generatePhoneNumber(): string {
        return `+62${faker.number.int({ min: 800000000, max: 899999999 })}`;
    }
}

// Shorthand exports for backward compatibility
export const generateUserCreds = () => TestDataGenerator.generateUserCreds();
export const generateUserCheckoutData = () => TestDataGenerator.generateUserCheckoutData();
