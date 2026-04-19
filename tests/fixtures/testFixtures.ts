import { test as base } from '@playwright/test';
import LoginActions from '../../page-objects/actions/LoginAction';
import RegisterActions from '../../page-objects/actions/RegisterAction';
import HomeActions from '../../page-objects/actions/HomeAction';
import ShopActions from '../../page-objects/actions/ShopAction';
import ProductActions from '../../page-objects/actions/ProductAction';
import LayoutActions from '../../page-objects/actions/LayoutAction';
import CheckoutActions from '../../page-objects/actions/CheckoutAction';
import AuthElements from '../../page-objects/locators/AuthPageElements';
import HomePageElements from '../../page-objects/locators/HomePageElements';
import LayoutElements from '../../page-objects/locators/LayoutElements';
import ShopPageElements from '../../page-objects/locators/ShopPageElements';
import ProductPageElements from '../../page-objects/locators/ProductPageElements';
import CartPageElements from '../../page-objects/locators/CartPageElements';
import { ToastComponent } from '../../src/components';

type TestFixtures = {
    // Actions
    loginActions: LoginActions;
    registerActions: RegisterActions;
    homeActions: HomeActions;
    shopActions: ShopActions;
    productActions: ProductActions;
    layoutActions: LayoutActions;
    checkoutActions: CheckoutActions;

    // Locators
    authElements: AuthElements;
    homeElements: HomePageElements;
    layoutElements: LayoutElements;
    shopElements: ShopPageElements;
    productElements: ProductPageElements;
    cartElements: CartPageElements;

    // Components
    toast: ToastComponent;
};

export const test = base.extend<TestFixtures>({
    // Actions
    loginActions: async ({ page }, use) => { await use(new LoginActions(page)); },
    registerActions: async ({ page }, use) => { await use(new RegisterActions(page)); },
    homeActions: async ({ page }, use) => { await use(new HomeActions(page)); },
    shopActions: async ({ page }, use) => { await use(new ShopActions(page)); },
    productActions: async ({ page }, use) => { await use(new ProductActions(page)); },
    layoutActions: async ({ page }, use) => { await use(new LayoutActions(page)); },
    checkoutActions: async ({ page }, use) => { await use(new CheckoutActions(page)); },

    // Locators
    authElements: async ({ page }, use) => { await use(new AuthElements(page)); },
    homeElements: async ({ page }, use) => { await use(new HomePageElements(page)); },
    layoutElements: async ({ page }, use) => { await use(new LayoutElements(page)); },
    shopElements: async ({ page }, use) => { await use(new ShopPageElements(page)); },
    productElements: async ({ page }, use) => { await use(new ProductPageElements(page)); },
    cartElements: async ({ page }, use) => { await use(new CartPageElements(page)); },

    // Components
    toast: async ({ page }, use) => { await use(new ToastComponent(page)); },
});

export { expect } from '@playwright/test';
