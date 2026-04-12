# 🔄 Migration Plan: PetPals → Struktur OneUI

## Daftar Isi

1. [Analisis Perbandingan](#analisis-perbandingan)
2. [Identifikasi Overkill dari OneUI](#identifikasi-overkill-dari-oneui)
3. [Struktur Target Setelah Migrasi](#struktur-target-setelah-migrasi)
4. [Mapping Migrasi](#mapping-migrasi)
5. [Langkah-Langkah Migrasi](#langkah-langkah-migrasi)
6. [Detail Implementasi](#detail-implementasi)
7. [Checklist Migrasi](#checklist-migrasi)

---

## Analisis Perbandingan

### Struktur Saat Ini (PetPals)

```
petpals-auto-test/
├── pages/
│   ├── actions/          ← Business logic (login, shop, product)
│   └── locators/         ← Element locators per page
├── tests/                ← Test specs
├── utils/                ← Config, logger, data generator, db, dll.
├── playwright.config.ts
└── package.json
```

### Struktur OneUI (Referensi)

```
oneui-quote-playwright/
├── src/
│   ├── attributes/       ← Test decorators (TestCase, TestLevel)
│   ├── components/       ← Reusable UI components
│   ├── config/           ← Multi-env JSON configs
│   ├── helpers/          ← 17+ helper files
│   ├── models/           ← TypeScript interfaces
│   ├── pages/            ← Page Objects
│   ├── reporters/        ← Custom TestRail reporter
│   ├── runner/           ← Test runner
│   ├── selectors/        ← Centralized selectors
│   └── utils/            ← ConfigReader (complex)
├── tests/
│   └── fixtures/         ← Playwright fixtures
├── playwright.config.ts
└── package.json
```

---

## Identifikasi Overkill dari OneUI

### ❌ TIDAK DIBUTUHKAN (Overkill)

| Komponen OneUI | Alasan Overkill untuk PetPals |
|---|---|
| **`src/config/` folder + `ConfigReader.ts`** | PetPals hanya butuh 1 baseUrl + user profiles. Cukup pakai `.env` + config sederhana. Tidak perlu multi-file JSON per environment dengan `${ENV_VAR}` replacement engine. |
| **`src/reporters/TestRailReporter.ts`** | PetPals tidak pakai TestRail. Playwright built-in HTML/JSON reporter sudah cukup. |
| **`src/attributes/decorators.ts`** | Decorator `TestCase()`, `TestEnvironmentLevel()`, `TestLevel()` hanya berguna jika ada TestRail integration. PetPals tidak butuh ini. |
| **`src/helpers/filterParser.ts`** | Filter parser untuk TestRail attributes. Tidak relevan tanpa TestRail. |
| **`src/helpers/attributeHelper.ts`** | Pembaca test attributes untuk reporter. Tidak relevan tanpa custom reporter. |
| **`src/helpers/GrpcWebHelper.ts`** | PetPals tidak pakai gRPC. Ini spesifik OneUI. |
| **`src/helpers/ApiAuthHelper.ts`** | OAuth2/OIDC client credentials flow. PetPals pakai simple email/password login, bukan OIDC. |
| **`src/helpers/CountryCacheHelper.ts`** | Spesifik domain OneUI (country management). |
| **`src/helpers/QuoteSetupHelper.ts`** | Spesifik domain OneUI (quote creation). |
| **`src/runner/TestRunner.ts`** | Custom test runner. Playwright CLI sudah cukup. |
| **`src/models/ConfigModels.ts`** (versi penuh) | 100+ baris interfaces untuk config yang kompleks. PetPals butuh interface sederhana saja. |
| **`src/models/PricingSectionModels.ts`** | Spesifik domain OneUI. |
| **`src/models/QuoteFormModel.ts`** | Spesifik domain OneUI. |
| **`src/models/TestAttributes.ts`** | Untuk TestRail integration. |
| **Docker setup** (`DockerFile`, `docker-compose.yml`) | Nice-to-have tapi bukan prioritas migrasi. Bisa ditambah nanti. |

### ✅ DIAMBIL & DIADAPTASI

| Komponen OneUI | Adaptasi untuk PetPals |
|---|---|
| **`src/pages/BasePage.ts`** | Adaptasi sebagai base class → menggantikan `base-action.ts` |
| **`src/components/BaseComponent.ts`** | Ambil konsepnya untuk reusable components |
| **`src/selectors/` (folder terpisah)** | Pindahkan locators ke folder `selectors/` |
| **`src/pages/` (Page Objects)** | Gabungkan actions + locators jadi satu Page Object |
| **`src/helpers/` (yang relevan)** | Ambil `NavigationHelper`, `FormHelper`, `DialogHelper` |
| **`src/models/` (yang relevan)** | Buat models sederhana untuk PetPals |
| **`tests/fixtures/testFixtures.ts`** | Implementasi Playwright fixtures untuk DI |
| **Config sederhana** | Buat config ringan tanpa ConfigReader yang berat |

### ⚠️ OPSIONAL (Bisa Ditambah Nanti)

| Komponen | Catatan |
|---|---|
| `src/helpers/TableHelper.ts` | Berguna jika PetPals punya tabel data (product list, order history) |
| `src/helpers/DropdownHelper.ts` | Berguna jika ada banyak dropdown interactions |
| `src/helpers/TestDataGenerator.ts` | PetPals sudah punya `user-data-generator.ts`, tinggal diperluas |
| Docker setup | Bisa ditambah untuk CI/CD nanti |

---

## Struktur Target Setelah Migrasi

```
petpals-auto-test/
├── src/
│   ├── components/                    # Reusable UI components
│   │   ├── BaseComponent.ts
│   │   ├── NavbarComponent.ts         # Header/navbar interactions
│   │   ├── ToastComponent.ts          # Toast notification handler
│   │   ├── ProductCardComponent.ts    # Product card interactions
│   │   └── index.ts
│   │
│   ├── config/                        # Config SEDERHANA (bukan multi-file JSON)
│   │   └── environment.ts             # Single file: baseUrl, profiles, db
│   │
│   ├── helpers/                       # Utility helpers
│   │   ├── AuthHelper.ts              # Login credentials manager
│   │   ├── NavigationHelper.ts        # Page navigation utilities
│   │   ├── TestDataGenerator.ts       # Random data (dari user-data-generator)
│   │   └── index.ts
│   │
│   ├── models/                        # TypeScript interfaces
│   │   ├── ConfigModels.ts            # Config interfaces (SEDERHANA)
│   │   ├── UserModels.ts              # User/checkout data interfaces
│   │   ├── ProductModels.ts           # Product data interfaces
│   │   └── index.ts
│   │
│   ├── pages/                         # Page Objects (gabungan actions + locators)
│   │   ├── BasePage.ts                # Abstract base page
│   │   ├── HomePage.ts                # Home page
│   │   ├── LoginPage.ts               # Sign in page
│   │   ├── RegisterPage.ts            # Sign up page
│   │   ├── ShopPage.ts                # Shop/catalog page
│   │   ├── ProductDetailPage.ts       # Product detail page
│   │   ├── CartPage.ts                # Cart page
│   │   ├── WishlistPage.ts            # Wishlist page
│   │   ├── CheckoutPage.ts            # Checkout page (future)
│   │   └── index.ts
│   │
│   ├── selectors/                     # Centralized selectors
│   │   ├── AuthSelectors.ts           # dari auth-page-elements.ts
│   │   ├── HomeSelectors.ts           # dari home-page-elements.ts
│   │   ├── LayoutSelectors.ts         # dari layout-elements.ts
│   │   ├── ShopSelectors.ts           # dari shop-page-elements.ts
│   │   ├── ProductSelectors.ts        # dari product-page-elements.ts
│   │   ├── CartSelectors.ts           # dari cart-page-elements.ts
│   │   └── index.ts
│   │
│   └── utils/                         # Utilities
│       ├── Logger.ts                  # dari utils/logger/logger.ts
│       ├── DbHelper.ts               # dari utils/db-helper.ts + db-utils.ts
│       └── TestData.json              # dari utils/data.json
│
├── tests/
│   ├── fixtures/
│   │   └── testFixtures.ts            # Playwright fixtures (DI)
│   ├── authentication.spec.ts
│   ├── navigation.spec.ts
��   ├── product.spec.ts
│   ├── shopping.spec.ts
│   └── account.spec.ts
│
├── .env                               # Environment variables
├── .env.example
├── playwright.config.ts               # Simplified config
├── tsconfig.json
└── package.json
```

---

## Mapping Migrasi

### File-by-File Mapping

| File Lama (PetPals) | File Baru | Aksi |
|---|---|---|
| `pages/actions/base-action.ts` | `src/pages/BasePage.ts` | **Rewrite** - Gabungkan dengan pattern OneUI BasePage |
| `pages/actions/login-actions.ts` | `src/pages/LoginPage.ts` | **Merge** - Gabung dengan auth-page-elements |
| `pages/actions/register-actions.ts` | `src/pages/RegisterPage.ts` | **Merge** - Gabung dengan auth-page-elements |
| `pages/actions/home-actions.ts` | `src/pages/HomePage.ts` | **Merge** - Gabung dengan home-page-elements |
| `pages/actions/shop-actions.ts` | `src/pages/ShopPage.ts` | **Merge** - Gabung dengan shop-page-elements |
| `pages/actions/product-actions.ts` | `src/pages/ProductDetailPage.ts` | **Merge** - Gabung dengan product-page-elements |
| `pages/actions/layout-actions.ts` | `src/components/NavbarComponent.ts` | **Move** - Jadi reusable component |
| `pages/locators/auth-page-elements.ts` | `src/selectors/AuthSelectors.ts` | **Refactor** - Ubah ke static selector strings |
| `pages/locators/home-page-elements.ts` | `src/selectors/HomeSelectors.ts` | **Refactor** |
| `pages/locators/layout-elements.ts` | `src/selectors/LayoutSelectors.ts` | **Refactor** |
| `pages/locators/shop-page-elements.ts` | `src/selectors/ShopSelectors.ts` | **Refactor** |
| `pages/locators/product-page-elements.ts` | `src/selectors/ProductSelectors.ts` | **Refactor** |
| `pages/locators/cart-page-elements.ts` | `src/selectors/CartSelectors.ts` | **Refactor** |
| `utils/config.ts` | `src/config/environment.ts` | **Rewrite** - Config sederhana |
| `utils/user-data-generator.ts` | `src/helpers/TestDataGenerator.ts` | **Enhance** - Perluas dengan pattern OneUI |
| `utils/logger/logger.ts` | `src/utils/Logger.ts` | **Move** |
| `utils/db-helper.ts` + `utils/db-utils.ts` | `src/utils/DbHelper.ts` | **Merge** |
| `utils/product-helpers.ts` | Diserap ke Page Objects | **Dissolve** - Logic masuk ke ShopPage/ProductDetailPage |
| `utils/data.json` | `src/utils/TestData.json` | **Move** |
| `utils/payment-gateway.ts` | `src/utils/PaymentGateway.ts` | **Move** (placeholder, nanti) |
| `utils/shipment-connector.ts` | `src/utils/ShipmentConnector.ts` | **Move** (placeholder, nanti) |
| _(baru)_ | `tests/fixtures/testFixtures.ts` | **Create** - Playwright fixtures |

---

## Langkah-Langkah Migrasi

### Phase 1: Foundation (Infrastruktur)

> Buat fondasi tanpa mengubah test yang ada. Test lama tetap jalan.

#### Step 1.1 — Buat Config Sederhana

Buat `src/config/environment.ts` sebagai pengganti `ConfigReader.ts` + folder `config/`:

```typescript
// src/config/environment.ts
import dotenv from 'dotenv';
dotenv.config();

export interface UserProfile {
  email: string;
  password: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  username: string;
  password: string;
}

export interface AppConfig {
  baseUrl: string;
  profiles: {
    validUser: UserProfile;
    // tambah profile lain jika perlu (admin, guest, dll.)
  };
  database: DatabaseConfig;
}

const config: AppConfig = {
  baseUrl: process.env.BASE_URL || 'https://staging.petpals-demo.shop',
  profiles: {
    validUser: {
      email: process.env.TEST_USER_EMAIL || 'garaga@petpals.com',
      password: process.env.TEST_USER_PASSWORD || '@admin123',
    },
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'petpals_db',
    username: process.env.DB_USER || 'petpals_user',
    password: process.env.DB_PASSWORD || '',
  },
};

export default config;
```

**Kenapa ini lebih baik dari OneUI:**
- OneUI punya `ConfigReader.ts` (170+ baris) + 3 JSON files + `ConfigModels.ts` (100+ baris) = **~300 baris** untuk config
- PetPals cukup **~40 baris** dalam 1 file karena:
  - Tidak perlu multi-environment JSON switching
  - Tidak perlu `${ENV_VAR}` replacement engine
  - Tidak perlu Playwright server config
  - Tidak perlu reporter config
  - Cukup `.env` untuk secrets

#### Step 1.2 — Buat Models Sederhana

```
src/models/
├── ConfigModels.ts    # Re-export dari environment.ts (UserProfile, DatabaseConfig, AppConfig)
├── UserModels.ts      # UserCreds, UserCheckoutData (dari user-data-generator)
├── ProductModels.ts   # Product interfaces (jika perlu)
└── index.ts           # Barrel exports
```

#### Step 1.3 — Buat BasePage

Adaptasi `BasePage.ts` dari OneUI, tapi lebih ringan:

```typescript
// src/pages/BasePage.ts
import { Page, Locator, expect } from '@playwright/test';
import config from '../config/environment';

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = config.baseUrl;
  }

  abstract waitForPageLoad(): Promise<void>;

  protected async click(selector: string | Locator): Promise<void> { /* ... */ }
  protected async fill(selector: string | Locator, value: string): Promise<void> { /* ... */ }
  protected async getText(selector: string | Locator): Promise<string | null> { /* ... */ }
  protected async waitForVisible(selector: string | Locator, timeout?: number): Promise<void> { /* ... */ }
  protected async waitForHidden(selector: string | Locator, timeout?: number): Promise<void> { /* ... */ }

  async takeScreenshot(name: string): Promise<void> { /* ... */ }
  getCurrentUrl(): string { return this.page.url(); }
}
```

**Perbedaan dengan OneUI BasePage:**
- Tidak perlu `abstract navigate()` — tidak semua page butuh direct navigation
- Tidak perlu `pollUntil()` — PetPals tidak punya polling use case (belum)
- Tidak perlu `EnvironmentHelper` — langsung import config

#### Step 1.4 — Buat BaseComponent

```typescript
// src/components/BaseComponent.ts
import { Page, Locator, expect } from '@playwright/test';

export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly root: Locator;

  constructor(page: Page, rootSelector: string | Locator) {
    this.page = page;
    this.root = typeof rootSelector === 'string' ? page.locator(rootSelector) : rootSelector;
  }

  async isVisible(): Promise<boolean> { return this.root.isVisible(); }
  async waitForVisible(timeout?: number): Promise<void> { /* ... */ }
  protected find(selector: string): Locator { return this.root.locator(selector); }
}
```

**Perbedaan dengan OneUI BaseComponent:**
- Tidak perlu MUI-specific methods (`clickMuiButton`, `fillMuiTextField`, `selectMuiOption`)
- PetPals pakai `data-testid` selectors, bukan MUI class selectors

---

### Phase 2: Selectors Migration

> Refactor locators dari class instances ke static selector strings.

#### Step 2.1 — Ubah Pattern Locator

**Sebelum (PetPals saat ini):**
```typescript
// pages/locators/auth-page-elements.ts
export default class AuthElements {
  readonly SIGN_IN_EMAIL_FIELD: Locator;
  constructor(page: Page) {
    this.SIGN_IN_EMAIL_FIELD = page.locator('[data-testid="signin-email-input"]');
  }
}
```

**Sesudah (Pattern OneUI):**
```typescript
// src/selectors/AuthSelectors.ts
export class AuthSelectors {
  // Sign In
  static readonly SignInHeading = 'text=Sign in to your account';
  static readonly SignInEmailInput = '[data-testid="signin-email-input"]';
  static readonly SignInPasswordInput = '[data-testid="signin-password-input"]';
  static readonly SignInSubmitButton = '[data-testid="signin-submit-btn"]';
  static readonly RememberMeCheckbox = '[data-testid="signin-remember-checkbox"]';
  static readonly ForgotPasswordLink = '[data-testid="signin-forgot-password-link"]';
  // ... dst

  // Sign Up
  static readonly SignUpHeading = 'text=Create an account';
  static readonly SignUpNameInput = '[data-testid="signup-name-input"]';
  // ... dst

  // Toast Messages
  static readonly ToastViewport = '[data-testid="toast-viewport"]';
  // ... dst
}
```

**Keuntungan:**
- Selector strings bisa dipakai di Page Object manapun tanpa instantiate class
- Satu sumber kebenaran (single source of truth)
- Lebih mudah di-maintain saat UI berubah

#### Step 2.2 — Migrate Semua Locator Files

| Lama | Baru |
|---|---|
| `auth-page-elements.ts` (class + constructor) | `AuthSelectors.ts` (static strings) |
| `home-page-elements.ts` | `HomeSelectors.ts` |
| `layout-elements.ts` | `LayoutSelectors.ts` |
| `shop-page-elements.ts` | `ShopSelectors.ts` |
| `product-page-elements.ts` | `ProductSelectors.ts` |
| `cart-page-elements.ts` | `CartSelectors.ts` |

---

### Phase 3: Page Objects Migration

> Gabungkan actions + locators menjadi Page Objects.

#### Step 3.1 — Contoh: LoginPage

**Sebelum (2 file terpisah):**
```
pages/actions/login-actions.ts     → business logic
pages/locators/auth-page-elements.ts → locators
```

**Sesudah (1 Page Object):**
```typescript
// src/pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { AuthSelectors } from '../selectors/AuthSelectors';
import { LayoutSelectors } from '../selectors/LayoutSelectors';
import config from '../config/environment';

export class LoginPage extends BasePage {

  // ── Locator Getters ──
  get emailInput(): Locator { return this.page.locator(AuthSelectors.SignInEmailInput); }
  get passwordInput(): Locator { return this.page.locator(AuthSelectors.SignInPasswordInput); }
  get signInButton(): Locator { return this.page.locator(AuthSelectors.SignInSubmitButton); }
  get toastSuccess(): Locator { return this.page.locator(AuthSelectors.ToastSignInSuccess); }

  // ── Actions ──
  async waitForPageLoad(): Promise<void> {
    await this.waitForVisible(AuthSelectors.SignInEmailInput);
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.locator(LayoutSelectors.SignInButton).click();
    await this.fill(AuthSelectors.SignInEmailInput, email);
    await this.fill(AuthSelectors.SignInPasswordInput, password);
    await this.click(AuthSelectors.SignInSubmitButton);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async loginAsValidUser(): Promise<void> {
    const { email, password } = config.profiles.validUser;
    await this.login(email, password);
  }

  // ── Assertions ──
  async assertLoginSuccess(): Promise<void> {
    await expect(this.toastSuccess).toBeVisible();
  }

  async assertLoginFailed(): Promise<void> {
    await expect(this.page.locator(AuthSelectors.ToastSignInFailed)).toBeVisible();
  }
}
```

#### Step 3.2 — Migrate Semua Pages

| Actions + Locators | Page Object Baru |
|---|---|
| `login-actions.ts` + `auth-page-elements.ts` (sign in part) | `LoginPage.ts` |
| `register-actions.ts` + `auth-page-elements.ts` (sign up part) | `RegisterPage.ts` |
| `home-actions.ts` + `home-page-elements.ts` | `HomePage.ts` |
| `shop-actions.ts` + `shop-page-elements.ts` | `ShopPage.ts` |
| `product-actions.ts` + `product-page-elements.ts` | `ProductDetailPage.ts` |
| `layout-actions.ts` + `layout-elements.ts` | `NavbarComponent.ts` (component, bukan page) |
| _(baru)_ + `cart-page-elements.ts` | `CartPage.ts` |

#### Step 3.3 — Pindahkan Product Helpers ke Page Objects

`utils/product-helpers.ts` berisi fungsi-fungsi yang seharusnya jadi method di Page Objects:

| Fungsi di product-helpers.ts | Pindah ke |
|---|---|
| `clearWishlist()` | `WishlistPage.clearAll()` |
| `selectRandomProductCardFromShop()` | `ShopPage.selectRandomProduct()` |
| `navigateToRandomProductDetailViaShop()` | `ShopPage.navigateToRandomProduct()` |
| `addRandomProductToCartFromHomepage()` | `HomePage.addRandomProductToCart()` |

---

### Phase 4: Fixtures & Helpers

#### Step 4.1 — Buat Test Fixtures

```typescript
// tests/fixtures/testFixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage, RegisterPage, HomePage, ShopPage, ProductDetailPage, CartPage } from '../../src/pages';
import { NavbarComponent } from '../../src/components';

type TestFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  homePage: HomePage;
  shopPage: ShopPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  navbar: NavbarComponent;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  registerPage: async ({ page }, use) => { await use(new RegisterPage(page)); },
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  shopPage: async ({ page }, use) => { await use(new ShopPage(page)); },
  productDetailPage: async ({ page }, use) => { await use(new ProductDetailPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  navbar: async ({ page }, use) => { await use(new NavbarComponent(page)); },
});

export { expect } from '@playwright/test';
```

#### Step 4.2 — Buat AuthHelper Sederhana

```typescript
// src/helpers/AuthHelper.ts
import config, { UserProfile } from '../config/environment';

export class AuthHelper {
  static getValidUser(): UserProfile {
    return config.profiles.validUser;
  }

  // Tambah profile lain jika perlu
  // static getAdminUser(): UserProfile { ... }
}
```

**Perbedaan dengan OneUI AuthHelper:**
- OneUI: 120+ baris, OIDC authorization URL builder, token endpoint, 4 profile types
- PetPals: ~15 baris, simple credential getter

#### Step 4.3 — Enhance TestDataGenerator

Perluas `user-data-generator.ts` menjadi `TestDataGenerator.ts` dengan pattern OneUI:

```typescript
// src/helpers/TestDataGenerator.ts
import { faker } from '@faker-js/faker';

export class TestDataGenerator {
  static generateUserCreds() { /* existing logic */ }
  static generateCheckoutData() { /* existing logic */ }
  static generateEmail(): string { return faker.internet.email(); }
  static generateFullName(): string { return faker.person.fullName(); }
  static generatePhoneNumber(): string { return `+62${faker.number.int({min:800000000, max:899999999})}`; }
  // ... dst
}

// Shorthand exports
export const generateUserCreds = () => TestDataGenerator.generateUserCreds();
```

---

### Phase 5: Test Migration

> Update test specs untuk menggunakan fixtures dan Page Objects baru.

#### Contoh: authentication.spec.ts

**Sebelum:**
```typescript
import { test, expect } from '@playwright/test';
import LoginActions from '../pages/actions/login-actions';
import AuthElements from '../pages/locators/auth-page-elements';
import config from '../utils/config';

test.describe('Login Flow', () => {
  let loginActions: LoginActions;
  let authElements: AuthElements;

  test.beforeEach(async ({ page }) => {
    loginActions = new LoginActions(page);
    authElements = new AuthElements(page);
    await page.goto(config.baseURL);
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginActions.loginFunctions(config.validUser.email, config.validUser.password);
    await expect(authElements.TOAST_SIGNIN_SUCCESS).toBeVisible();
  });
});
```

**Sesudah:**
```typescript
import { test, expect } from './fixtures/testFixtures';

test.describe('Login Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should login with valid credentials', async ({ loginPage }) => {
    await loginPage.loginAsValidUser();
    await loginPage.assertLoginSuccess();
  });
});
```

**Keuntungan:**
- Tidak perlu manual instantiate 5-6 class di setiap `beforeEach`
- Page Objects di-inject otomatis via fixtures
- Test code lebih bersih dan readable
- Assertions encapsulated di Page Object

---

### Phase 6: Cleanup

#### Step 6.1 — Hapus File Lama

Setelah semua test berhasil dengan struktur baru:

```bash
# Hapus folder lama
rm -rf pages/actions/
rm -rf pages/locators/
rm -rf utils/config.ts
rm -rf utils/user-data-generator.ts
rm -rf utils/logger/
rm -rf utils/product-helpers.ts
rm -rf utils/db-helper.ts
rm -rf utils/db-utils.ts

# Pindahkan yang tersisa
mv utils/data.json src/utils/TestData.json
mv utils/payment-gateway.ts src/utils/PaymentGateway.ts
mv utils/shipment-connector.ts src/utils/ShipmentConnector.ts
```

#### Step 6.2 — Update tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["src/pages/*"],
      "@components/*": ["src/components/*"],
      "@selectors/*": ["src/selectors/*"],
      "@helpers/*": ["src/helpers/*"],
      "@models/*": ["src/models/*"],
      "@config/*": ["src/config/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "tests/**/*.ts",
    "playwright.config.ts"
  ]
}
```

#### Step 6.3 — Update playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';
import config from './src/config/environment';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html'], ['json', { outputFile: 'playwright-report/results.json' }]],
  use: {
    baseURL: config.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

---

## Detail Implementasi

### Perbandingan Kompleksitas Config

| Aspek | OneUI (Overkill) | PetPals (Target) |
|---|---|---|
| File config | 3 JSON + ConfigReader + ConfigModels | 1 file `environment.ts` |
| Total baris | ~400 baris | ~40 baris |
| Environment switching | `TEST_ENVIRONMENT=lab` → load `lab.json` | `.env` file swap |
| Secret management | `${ENV_VAR}` replacement engine | `process.env.X` langsung |
| Playwright server config | ✅ (ws endpoint, Docker) | ❌ Tidak perlu |
| Reporter config | ✅ (SMTP, markers, format) | ❌ Tidak perlu |
| gRPC config | ✅ | ❌ Tidak perlu |
| OIDC config | ✅ (clientId, clientSecret, redirectUrl) | ❌ Tidak perlu |

### Perbandingan Helpers

| OneUI Helper | PetPals Equivalent | Status |
|---|---|---|
| `AuthHelper.ts` (120 baris, OIDC) | `AuthHelper.ts` (~15 baris, simple) | ✅ Simplified |
| `ApiAuthHelper.ts` (OAuth2 tokens) | — | ❌ Tidak perlu |
| `GrpcWebHelper.ts` | — | ❌ Tidak perlu |
| `NavigationHelper.ts` | `NavigationHelper.ts` (adaptasi) | ✅ Ambil |
| `TestDataGenerator.ts` | `TestDataGenerator.ts` (enhance existing) | ✅ Enhance |
| `TableHelper.ts` | — | ⚠️ Opsional |
| `DropdownHelper.ts` | — | ⚠️ Opsional |
| `FormHelper.ts` | — | ⚠️ Opsional |
| `DialogHelper.ts` | — | ⚠️ Opsional |
| `ValidationHelper.ts` | — | ⚠️ Opsional |
| `CountryCacheHelper.ts` | — | ❌ Domain-specific |
| `QuoteSetupHelper.ts` | — | ❌ Domain-specific |
| `filterParser.ts` | — | ❌ TestRail-specific |
| `attributeHelper.ts` | — | ❌ TestRail-specific |
| `EnvironmentHelper.ts` | Inline di config | ❌ Overkill |
| `TableDataExtractor.ts` | — | ⚠️ Opsional |
| `fieldAssertionHelper.ts` | — | ⚠️ Opsional |

---

## Checklist Migrasi

### Phase 1: Foundation ⬜
- [ ] Buat `src/config/environment.ts`
- [ ] Buat `src/models/` (ConfigModels, UserModels, ProductModels)
- [ ] Buat `src/pages/BasePage.ts`
- [ ] Buat `src/components/BaseComponent.ts`
- [ ] Update `tsconfig.json` paths

### Phase 2: Selectors ⬜
- [ ] Migrate `auth-page-elements.ts` → `src/selectors/AuthSelectors.ts`
- [ ] Migrate `home-page-elements.ts` → `src/selectors/HomeSelectors.ts`
- [ ] Migrate `layout-elements.ts` → `src/selectors/LayoutSelectors.ts`
- [ ] Migrate `shop-page-elements.ts` → `src/selectors/ShopSelectors.ts`
- [ ] Migrate `product-page-elements.ts` → `src/selectors/ProductSelectors.ts`
- [ ] Migrate `cart-page-elements.ts` → `src/selectors/CartSelectors.ts`
- [ ] Buat `src/selectors/index.ts`

### Phase 3: Page Objects ⬜
- [ ] Buat `src/pages/LoginPage.ts` (merge login-actions + auth selectors)
- [ ] Buat `src/pages/RegisterPage.ts` (merge register-actions + auth selectors)
- [ ] Buat `src/pages/HomePage.ts` (merge home-actions + home selectors)
- [ ] Buat `src/pages/ShopPage.ts` (merge shop-actions + shop selectors)
- [ ] Buat `src/pages/ProductDetailPage.ts` (merge product-actions + product selectors)
- [ ] Buat `src/pages/CartPage.ts`
- [ ] Buat `src/pages/WishlistPage.ts`
- [ ] Buat `src/components/NavbarComponent.ts` (dari layout-actions)
- [ ] Buat `src/components/ToastComponent.ts`
- [ ] Buat `src/pages/index.ts` & `src/components/index.ts`

### Phase 4: Fixtures & Helpers ⬜
- [ ] Buat `tests/fixtures/testFixtures.ts`
- [ ] Buat `src/helpers/AuthHelper.ts`
- [ ] Migrate `user-data-generator.ts` → `src/helpers/TestDataGenerator.ts`
- [ ] Move `logger.ts` → `src/utils/Logger.ts`
- [ ] Merge `db-helper.ts` + `db-utils.ts` → `src/utils/DbHelper.ts`
- [ ] Buat `src/helpers/index.ts`

### Phase 5: Test Migration ⬜
- [ ] Migrate `authentication.spec.ts`
- [ ] Migrate `navigation.spec.ts`
- [ ] Migrate `product.spec.ts`
- [ ] Migrate `shopping.spec.ts`
- [ ] Migrate `account.spec.ts`
- [ ] Verify semua test PASS

### Phase 6: Cleanup ⬜
- [ ] Hapus `pages/actions/` folder
- [ ] Hapus `pages/locators/` folder
- [ ] Hapus `utils/config.ts` (replaced by `src/config/environment.ts`)
- [ ] Hapus `utils/user-data-generator.ts` (replaced by `src/helpers/TestDataGenerator.ts`)
- [ ] Hapus `utils/logger/` (replaced by `src/utils/Logger.ts`)
- [ ] Hapus `utils/db-helper.ts` & `utils/db-utils.ts` (replaced by `src/utils/DbHelper.ts`)
- [ ] Hapus `utils/product-helpers.ts` (dissolved into Page Objects)
- [ ] Move remaining utils (`data.json`, `payment-gateway.ts`, `shipment-connector.ts`)
- [ ] Update `playwright.config.ts`
- [ ] Update `package.json` scripts jika perlu
- [ ] Final test run — semua PASS ✅

---

## Ringkasan

| Metrik | OneUI (Original) | PetPals (Target) | Pengurangan |
|---|---|---|---|
| Config files | 5 files (~400 baris) | 1 file (~40 baris) | **-90%** |
| Helper files | 17 files | 3-4 files | **-76%** |
| Model files | 6 files | 3 files | **-50%** |
| Selector pattern | Static class strings | Static class strings | **Same** ✅ |
| Page Object pattern | BasePage + Pages | BasePage + Pages | **Same** ✅ |
| Component pattern | BaseComponent + Components | BaseComponent + Components | **Same** ✅ |
| Fixtures pattern | testFixtures.ts | testFixtures.ts | **Same** ✅ |
| Reporter | Custom TestRail | Playwright built-in | **Simpler** |
| Docker | DockerFile + compose | — (nanti) | **Deferred** |

**Prinsip migrasi: Ambil arsitektur & pattern-nya, buang kompleksitas domain-specific-nya.**
