import config from '../config/environment';
import type { UserProfile } from '../config/environment';

/**
 * AuthHelper — simple credential manager for test profiles.
 */
export class AuthHelper {
    static getValidUser(): UserProfile {
        return config.profiles.validUser;
    }

    static getValidEmail(): string {
        return config.profiles.validUser.email;
    }

    static getValidPassword(): string {
        return config.profiles.validUser.password;
    }
}
