import { faker } from '@faker-js/faker';

/**
 * User data generator utilities for test data creation.
 * Generates random user credentials and checkout data for tests.
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

function randomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    return {
        fullName: creds.fullName,
        email: creds.email,
        address: `${randomNumber(100, 9999)} ${randomString(8).charAt(0).toUpperCase() + randomString(7)} Street`,
        city: `${randomString(6).charAt(0).toUpperCase() + randomString(5)}ville`,
        postcode: `${randomNumber(10000, 99999)}`,
        phone: `+62${randomNumber(800000000, 899999999)}`,
    };
}
