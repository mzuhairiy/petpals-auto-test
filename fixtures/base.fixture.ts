import { test as base } from '@playwright/test';

// Pages
import LoginPage from '../pages/login.page';
import RegisterPage from '../pages/register.page';
import HomePage from '../pages/home.page';
import ShopPage from '../pages/shop.page';
import ProductPage from '../pages/product.page';
import CartPage from '../pages/cart.page';
import AccountPage from '../pages/account.page';

// Components
import { NavbarComponent } from '../pages/components/navbar.component';
import { FooterComponent } from '../pages/components/footer.component';
import { ToastComponent } from '../pages/components/toast.component';

/**
 * Base fixture — provides all page objects and components to tests.
 *
 * Tests destructure only what they need from the fixture.
 * This is the SINGLE source of truth for test dependencies.
 */
type TestFixtures = {
    // Page Objects
    loginPage: LoginPage;
    registerPage: RegisterPage;
    homePage: HomePage;
    shopPage: ShopPage;
    productPage: ProductPage;
    cartPage: CartPage;
    accountPage: AccountPage;

    // Components
    navbar: NavbarComponent;
    footer: FooterComponent;
    toast: ToastComponent;
};

export const test = base.extend<TestFixtures>({
    // Page Objects
    loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
    registerPage: async ({ page }, use) => { await use(new RegisterPage(page)); },
    homePage: async ({ page }, use) => { await use(new HomePage(page)); },
    shopPage: async ({ page }, use) => { await use(new ShopPage(page)); },
    productPage: async ({ page }, use) => { await use(new ProductPage(page)); },
    cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
    accountPage: async ({ page }, use) => { await use(new AccountPage(page)); },

    // Components
    navbar: async ({ page }, use) => { await use(new NavbarComponent(page)); },
    footer: async ({ page }, use) => { await use(new FooterComponent(page)); },
    toast: async ({ page }, use) => { await use(new ToastComponent(page)); },
});

export { expect } from '@playwright/test';
