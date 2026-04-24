import { faker } from '@faker-js/faker';

/**
 * Data helper — centralized test data generation.
 *
 * Consolidated from TestDataGenerator.ts and UserDataGenerator.ts
 * to eliminate duplicate interfaces and functions.
 */

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

export function generateUserCreds(): UserCreds {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
        fullName: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName, provider: 'testmail.com' }).toLowerCase(),
        password: faker.internet.password({ length: 12, prefix: 'T1!' }),
    };
}

export function generateUserCheckoutData(): UserCheckoutData {
    const creds = generateUserCreds();
    const streetNum = faker.number.int({ min: 100, max: 9999 });
    const streetName = faker.location.street();
    return {
        fullName: creds.fullName,
        email: creds.email,
        address: `${streetNum} ${streetName}`,
        city: faker.location.city(),
        postcode: '12720',
        phone: `+62${faker.number.int({ min: 800000000, max: 899999999 })}`,
    };
}

export function generateEmail(): string {
    return faker.internet.email({ provider: 'testmail.com' }).toLowerCase();
}

export function generateFullName(): string {
    return faker.person.fullName();
}

export function generatePhoneNumber(): string {
    return `+62${faker.number.int({ min: 800000000, max: 899999999 })}`;
}
