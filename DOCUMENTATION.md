# OneUI Quote Playwright - Dokumentasi Komprehensif

## 📋 Daftar Isi

1. [Gambaran Umum](#gambaran-umum)
2. [Struktur Folder](#struktur-folder)
3. [Penjelasan Detail Setiap Folder](#penjelasan-detail-setiap-folder)
4. [Alur Kerja Framework](#alur-kerja-framework)
5. [Diagram Arsitektur](#diagram-arsitektur)
6. [Cara Menjalankan Test](#cara-menjalankan-test)
7. [Best Practices](#best-practices)

---

## Gambaran Umum

**OneUI Quote Playwright** adalah framework automation testing berbasis Playwright yang dirancang untuk menguji aplikasi OneUI Quote Management System. Framework ini mengimplementasikan **Page Object Model (POM)** pattern dengan dukungan multi-environment, TestRail integration, dan Docker containerization.

### Fitur Utama:
- ✅ Page Object Model (POM) Pattern
- ✅ Multi-environment support (Development, Lab, Production)
- ✅ TestRail Reporter Integration
- ✅ OIDC/OAuth2 Authentication Support
- ✅ gRPC-Web API Testing
- ✅ Docker & Docker Compose Support
- ✅ Test Data Generation dengan Faker.js
- ✅ Reusable Components & Helpers
- ✅ Test Filtering & Attributes System

---

## Struktur Folder

```
oneui-quote-playwright/
├── src/                          # Source code utama
│   ├── attributes/               # Test decorators & annotations
│   ├── components/               # Reusable UI components
│   ├── config/                   # Environment configurations
│   ├── helpers/                  # Utility helpers
│   ├── models/                   # Data models & interfaces
│   ├── pages/                    # Page Object classes
│   ├── reporters/                # Custom test reporters
│   ├── runner/                   # Test runner utilities
│   ├── selectors/                # Centralized selectors
│   └── utils/                    # Utility classes
├── tests/                        # Test specifications
│   └── fixtures/                 # Test fixtures
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── DockerFile                    # Docker image definition
└── docker-compose.yml            # Docker orchestration
```

---

## Penjelasan Detail Setiap Folder

### 1. 📁 `src/attributes/`

**Tujuan:** Menyediakan decorators untuk menandai test dengan metadata (TestCase ID, Environment Level, Test Level).

**File:**
- `decorators.ts` - Implementasi test attributes

**Fungsi Utama:**
```typescript
// Menandai test dengan TestRail case ID dan metadata
test('My test',
  attributes(
    TestCase('1580700'),           // TestRail Case ID
    TestEnvironmentLevel('Dev'),   // Environment: Dev, Lab, Prod
    TestLevel('Smoke')             // Level: Smoke, Regression
  ),
  async () => { /* test code */ }
);
```

**Kesinambungan:**
- Digunakan oleh `TestRailReporter` untuk mapping hasil test ke TestRail
- Digunakan oleh `FilterParser` untuk filtering test berdasarkan criteria

---

### 2. 📁 `src/components/`

**Tujuan:** Menyediakan reusable UI components yang dapat digunakan di berbagai page objects.

**Files:**
| File | Deskripsi |
|------|-----------|
| `BaseComponent.ts` | Base class untuk semua components |
| `FormComponent.ts` | Helper untuk interaksi form MUI |
| `TableComponent.ts` | Helper untuk interaksi table/grid |
| `ModalComponent.ts` | Helper untuk dialog/modal |
| `HeaderComponent.ts` | Header navigation component |
| `AddRemoveCountriesDialog.ts` | Dialog untuk add/remove countries |
| `ProductSummaryComponent.ts` | Product summary section |
| `SbcPackageSummaryComponent.ts` | SBC package summary |

**Contoh BaseComponent:**
```typescript
export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly root: Locator;

  // Common methods untuk semua components
  async isVisible(): Promise<boolean>;
  async waitForVisible(timeout?: number): Promise<void>;
  protected find(selector: string): Locator;
  protected async clickMuiButton(buttonText: string): Promise<void>;
}
```

**Kesinambungan:**
- Digunakan oleh Page Objects untuk compose UI interactions
- `FormComponent` digunakan di `LoginPage`, `NewQuotePage`, dll.

---

### 3. 📁 `src/config/`

**Tujuan:** Menyimpan konfigurasi per-environment dalam format JSON.

**Files:**
| File | Environment |
|------|-------------|
| `development.json` | Development (one.loopup.dev) |
| `lab.json` | Lab/Staging |
| `production.json` | Production |

**Struktur Konfigurasi:**
```json
{
  "environment": {
    "name": "Development",
    "baseUrl": "https://one.loopup.dev",
    "apiUrl": "https://ct-gateway.loopup.dev",
    "grpcUrl": "https://ct-gateway.engr.loopup.dev",
    "database": { /* DB config */ },
    "auth": { /* Auth config */ }
  },
  "oneUi": {
    "profiles": {
      "internal": { "username": "...", "password": "..." },
      "partner": { "username": "...", "password": "..." }
    },
    "identity": { /* OIDC config */ }
  },
  "playwright": {
    "server": { /* Playwright server config */ },
    "test": { "maxRetries": 1, "workers": 1, "timeout": 60000 }
  },
  "reporter": { /* Reporter config */ }
}
```

**Kesinambungan:**
- Dibaca oleh `ConfigReader` di `src/utils/`
- Digunakan oleh `AuthHelper`, `EnvironmentHelper`
- Environment dipilih via `TEST_ENVIRONMENT` env variable

---

### 4. 📁 `src/helpers/`

**Tujuan:** Menyediakan utility classes untuk berbagai keperluan testing.

**Files & Fungsi:**

| File | Fungsi |
|------|--------|
| `AuthHelper.ts` | Manajemen credentials & OIDC config |
| `ApiAuthHelper.ts` | OAuth2 token acquisition untuk API testing |
| `GrpcWebHelper.ts` | gRPC-Web API calls |
| `EnvironmentHelper.ts` | Akses environment settings |
| `NavigationHelper.ts` | Page navigation utilities |
| `TableHelper.ts` | Table data extraction & interaction |
| `TableDataExtractor.ts` | Raw table data extraction |
| `DropdownHelper.ts` | Dropdown/combobox interactions |
| `FormHelper.ts` | Form filling utilities |
| `DialogHelper.ts` | Dialog/modal handling |
| `TestDataGenerator.ts` | Random test data generation (Faker.js) |
| `ValidationHelper.ts` | Form validation helpers |
| `QuoteSetupHelper.ts` | Quote creation workflow helper |
| `filterParser.ts` | Test filter parsing |
| `attributeHelper.ts` | Test attribute reading |
| `CountryCacheHelper.ts` | Country data caching |

**Contoh TestDataGenerator:**
```typescript
// Generate random quote data
const quoteData = TestDataGenerator.generateQuoteData();

// Generate dengan specific currency
const usdQuote = TestDataGenerator.generateQuoteData({ currency: 'USD' });

// Generate customer info
const customer = TestDataGenerator.generatePreparedFor();
// Output: { name: "John Smith", company: "Acme Corporation Ltd" }
```

**Kesinambungan:**
- `AuthHelper` → digunakan oleh `LoginPage` untuk credentials
- `TestDataGenerator` → digunakan di test specs untuk random data
- `TableHelper` → digunakan oleh `QuotePage` untuk table operations

---

### 5. 📁 `src/models/`

**Tujuan:** Mendefinisikan TypeScript interfaces dan data models.

**Files:**

| File | Deskripsi |
|------|-----------|
| `ConfigModels.ts` | Interfaces untuk configuration files |
| `QuoteFormModel.ts` | Quote form data structure |
| `QuoteModel.ts` | Quote entity model |
| `TestAttributes.ts` | Test attribute types |
| `TestResult.ts` | Test result model untuk reporter |
| `PricingSectionModels.ts` | Pricing section data models |

**Contoh QuoteFormModel:**
```typescript
export interface QuoteFormModel {
  currency: CurrencyCode;        // 'GBP', 'EUR', 'USD', etc.
  validForDays: number;          // Default: 30
  volumeBand: VolumeBand;        // 'Band 1', 'Band 2', etc.
  validFrom: string;             // DD/MM/YYYY format
  preparedFor: PreparedFor;      // Customer info
  preparedBy: PreparedBy;        // Agent info
}
```

**Kesinambungan:**
- `ConfigModels` → digunakan oleh `ConfigReader`
- `QuoteFormModel` → digunakan oleh `NewQuotePage`, `TestDataGenerator`
- `TestResult` → digunakan oleh `TestRailReporter`

---

### 6. 📁 `src/pages/`

**Tujuan:** Implementasi Page Object Model - setiap page di aplikasi memiliki class tersendiri.

**Files:**

| File | Page/Feature |
|------|--------------|
| `BasePage.ts` | Abstract base class untuk semua pages |
| `LoginPage.ts` | Identity login page |
| `CustomersPage.ts` | Your Customers page |
| `QuotePage.ts` / `QuotePageV2.ts` | Quote Manager list page |
| `NewQuotePage.ts` / `NewQuotePageV2.ts` | New Quote form |
| `QuoteDetailPage.ts` / `QuoteDetailPageV2.ts` | Quote detail view |
| `EditQuotePage.ts` | Edit quote form |
| `CountrySummaryPage.ts` | Country summary section |
| `PricingSectionPage.ts` | Pricing sections |
| `GenerateQuotePage.ts` | Generate quote workflow |
| `MinuteBundlesPage.ts` | Minute bundles configuration |

**Contoh BasePage:**
```typescript
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  // Abstract methods yang harus diimplementasi
  abstract navigate(): Promise<void>;
  abstract waitForPageLoad(): Promise<void>;
  abstract isPageDisplayed(): Promise<boolean>;

  // Common methods
  protected async click(selector: string | Locator): Promise<void>;
  protected async fill(selector: string | Locator, value: string): Promise<void>;
  async pollUntil<T>(action, predicate, options): Promise<T>;
}
```

**Contoh LoginPage:**
```typescript
export class LoginPage extends BasePage {
  // Login as specific profile
  async loginAsPartner(): Promise<void> {
    await this.loginAsProfile('partner');
  }

  // Complete OIDC flow
  async completeOidcLogin(profile: ProfileType): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
    await this.loginAsProfile(profile);
    await this.waitForLoginComplete();
    await this.waitForPostLoginPageLoaded();
  }
}
```

**Kesinambungan:**
- Semua pages extend `BasePage`
- Pages menggunakan `Components` untuk UI interactions
- Pages menggunakan `Selectors` untuk element locators
- Pages di-inject ke tests via `testFixtures.ts`

---

### 7. 📁 `src/reporters/`

**Tujuan:** Custom test reporters untuk output dan integration.

**File:**
- `TestRailReporter.ts` - Reporter untuk TestRail integration

**Fungsi:**
```typescript
export default class TestRailReporter implements Reporter {
  // Lifecycle hooks
  onBegin(config, suite): void;
  onTestBegin(test, result): void;
  onTestEnd(test, result): void;
  onEnd(result): void;

  // Features:
  // - Reads TestCase attributes from tests
  // - Supports test filtering
  // - Handles retries
  // - Outputs JSON format for TestRail
}
```

**Output Format:**
```json
[
  {
    "TestcaseId": "1580700",
    "DisplayName": "New Quote form loads with all fields visible",
    "Status": "Passed",
    "Message": "Test passed successfully",
    "ExecutionTime": 12.5,
    "RetryCount": 0
  }
]
```

**Kesinambungan:**
- Dikonfigurasi di `playwright.config.ts`
- Membaca attributes dari `decorators.ts`
- Menggunakan `FilterParser` untuk test filtering

---

### 8. 📁 `src/selectors/`

**Tujuan:** Centralized selectors untuk semua UI elements.

**Files:**

| File | Deskripsi |
|------|-----------|
| `QuotePageSelectors.ts` | Quote Manager & Login selectors |
| `NewQuoteFormSelectors.ts` | New Quote form selectors |
| `QuoteDetailSelectorsV2.ts` | Quote detail page selectors |
| `EditQuoteSelectors.ts` | Edit quote form selectors |
| `PricingSectionSelectors.ts` | Pricing section selectors |
| `CountrySummaryV2Selectors.ts` | Country summary selectors |
| `AddRemoveCountriesDialogSelectors.ts` | Country dialog selectors |
| `CustomersPageSelectors.ts` | Customers page selectors |
| `GenerateQuoteSelectors.ts` | Generate quote selectors |
| `ProductSummarySelectors.ts` | Product summary selectors |
| `SbcPackageSummarySelectors.ts` | SBC package selectors |

**Contoh Selector Class:**
```typescript
export class QuotePageSelectors {
  // Table selectors
  public static readonly QuotesTable = '[role="grid"]';
  public static readonly QuoteTableRows = '[data-rowindex]';
  
  // Button selectors
  public static readonly NewQuoteButton = 'button:has-text("New Quote")';
  
  // Form selectors
  public static readonly CurrencyDropdown = '.MuiFormControl-root:has(label:text-is("Currency")) input';
  
  // Helper methods
  public static getRowCellSelector(rowIndex: number, field: string): string {
    return `[data-rowindex="${rowIndex}"] [data-field="${field}"]`;
  }
}
```

**Kesinambungan:**
- Digunakan oleh Page Objects untuk element locators
- Memudahkan maintenance saat UI berubah
- Single source of truth untuk selectors

---

### 9. 📁 `src/utils/`

**Tujuan:** Utility classes untuk configuration dan common operations.

**File:**
- `ConfigReader.ts` - Configuration file reader

**Fungsi:**
```typescript
export class ConfigReader {
  // Load config berdasarkan environment
  static load(environment?: string): AppConfig;
  
  // Getters
  static getBaseUrl(): string;
  static getApiUrl(): string;
  static getAuthConfig(): AuthConfig;
  static getMaxRetries(): number;
  static getWorkers(): number;
  static getTimeout(): number;
  static isHeadless(): boolean;
  
  // Environment variable replacement
  private static replaceEnvVariables(content: string): string;
}
```

**Kesinambungan:**
- Digunakan oleh `playwright.config.ts` untuk load settings
- Digunakan oleh semua Helpers untuk akses config
- Supports `${ENV_VAR}` replacement dalam config files

---

### 10. 📁 `tests/`

**Tujuan:** Test specifications (spec files).

**Struktur Naming Convention:**
- `partner-*.spec.ts` - Tests untuk Partner user role
- `internal-*.spec.ts` - Tests untuk Internal user role

**Files:**

| File | Test Coverage |
|------|---------------|
| `partner-login.spec.ts` | Partner login flow |
| `partner-new-quote.spec.ts` | Create new quote |
| `partner-edit-quote.spec.ts` | Edit existing quote |
| `partner-country-summary.spec.ts` | Country summary operations |
| `partner-pricing-sections.spec.ts` | Pricing section tests |
| `partner-generate-quote.spec.ts` | Generate quote workflow |
| `partner-minute-bundles.spec.ts` | Minute bundles config |
| `internal-new-quote.spec.ts` | Internal user quote creation |
| `internal-pricing-sections.spec.ts` | Internal pricing tests |
| `internal-volume-band.spec.ts` | Volume band tests |

**Contoh Test Structure:**
```typescript
import { test, expect } from './fixtures/testFixtures';
import { attributes, TestCase, TestEnvironmentLevel, TestLevel } from '../src/attributes/decorators';

test.describe('Partner New Quote - Form Structure', () => {

  test.beforeEach(async ({ loginPage, customersPage, quotePageV2 }) => {
    // Setup: Login → Navigate to Pricing → Ready for test
    await loginPage.navigateToAppLogin();
    await loginPage.loginAsPartner();
    await customersPage.navigateToPricing();
    await quotePageV2.waitForPageLoad();
  });

  test('New Quote form loads with all fields visible',
    attributes(
      TestCase('1580700'),
      TestEnvironmentLevel('Dev'),
      TestLevel('Smoke')
    ),
    async ({ quotePageV2, newQuotePageV2 }) => {
      await quotePageV2.clickNewQuote();
      await newQuotePageV2.waitForFormLoaded();
      await newQuotePageV2.assertFormLoaded();
    }
  );
});
```

---

### 11. 📁 `tests/fixtures/`

**Tujuan:** Playwright test fixtures untuk dependency injection.

**File:**
- `testFixtures.ts` - Custom fixtures definition

**Fungsi:**
```typescript
export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Page Objects - auto-instantiated
  quotePage: async ({ page }, use) => {
    await use(new QuotePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  
  // Auth Helpers
  apiAuth: async ({ request }, use) => {
    await use(new ApiAuthHelper(request));
  },
  authenticatedApi: async ({}, use) => {
    const context = await createAuthenticatedApiContext();
    await use(context);
    await context.dispose();
  },
  
  // gRPC Helper
  grpcWeb: async ({ request }, use) => {
    await use(new GrpcWebHelper(request));
  },
});

// Helper functions
export async function createAuthenticatedSession(loginPage, profile);
export async function loginAs(loginPage, profile);
export function getCredentials(profile);
```

**Kesinambungan:**
- Menyediakan Page Objects ke semua test specs
- Handles lifecycle (setup/teardown) otomatis
- Enables parallel test execution dengan isolated contexts

---

## Alur Kerja Framework

### 1. Test Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        TEST EXECUTION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. npm run test:dev
        │
        ▼
2. playwright.config.ts
   ├── Load ConfigReader
   ├── Read development.json
   └── Configure browser, viewport, timeout
        │
        ▼
3. TestRailReporter initialized
   └── Parse filter criteria (if any)
        │
        ▼
4. Test File Loaded (e.g., partner-new-quote.spec.ts)
   └── Import fixtures from testFixtures.ts
        │
        ▼
5. test.beforeEach()
   ├── Create Page Objects (LoginPage, QuotePage, etc.)
   ├── Login via OIDC flow
   └── Navigate to target page
        │
        ▼
6. Test Execution
   ├── Page Object methods called
   ├── Selectors used for element location
   ├── Helpers used for complex operations
   └── Assertions verified
        │
        ▼
7. test.afterEach() / Cleanup
   └── Browser context disposed
        │
        ▼
8. TestRailReporter.onTestEnd()
   ├── Read test attributes (TestCase ID)
   ├── Record result (Pass/Fail/Skip)
   └── Calculate execution time
        │
        ▼
9. TestRailReporter.onEnd()
   └── Output JSON results
```

### 2. Page Object Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAGE OBJECT INTERACTION                       │
└─────────────────────────────────────────────────────────────────┘

Test Spec
    │
    ▼
┌─────────────┐     uses      ┌─────────────┐
│  Page       │──────────────▶│  Selectors  │
│  Object     │               │  Class      │
└─────────────┘               └─────────────┘
    │                              │
    │ extends                      │ provides
    ▼                              ▼
┌─────────────┐              ┌─────────────┐
│  BasePage   │              │  Locator    │
│             │              │  Strings    │
└─────────────┘              └─────────────┘
    │
    │ uses
    ▼
┌─────────────┐     uses      ┌─────────────┐
│  Component  │──────────────▶│  Helpers    │
│  (Form,     │               │  (Table,    │
│   Table)    │               │   Dropdown) │
└─────────────┘               └─────────────┘
```

### 3. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      OIDC AUTHENTICATION FLOW                    │
└─────────────────────────────────────────────────────────────────┘

1. LoginPage.navigate()
   └── Go to AuthHelper.getAuthorizationUrl()
       └── https://identity.loopup.dev/connect/authorize?...
              │
              ▼
2. LoginPage.waitForPageLoad()
   └── Wait for email input visible
              │
              ▼
3. LoginPage.enterEmail(email)
   └── Fill email → Click Next
              │
              ▼
4. LoginPage.waitForPasswordPage()
   └── Wait for password input visible
              │
              ▼
5. LoginPage.enterPassword(password)
   └── Fill password → Click Sign In
              │
              ▼
6. LoginPage.waitForLoginComplete()
   └── Wait for redirect to /oidc-callback
              │
              ▼
7. LoginPage.waitForPostLoginPageLoaded()
   └── Wait for customer table visible
       └── User is now authenticated
```

---

## Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRAMEWORK ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────��────────────────────────────────────────────────────────────┐
│                              TEST LAYER                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ partner-login   │  │ partner-quote   │  │ internal-quote  │  ...        │
│  │ .spec.ts        │  │ .spec.ts        │  │ .spec.ts        │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                │                                            │
│                    ┌───────────▼───────────┐                               │
│                    │    testFixtures.ts    │                               │
│                    │   (Dependency Inject) │                               │
│                    └───────────┬───────────┘                               │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────────┐
│                         PAGE OBJECT LAYER                                    │
│                                │                                            │
│  ┌─────────────┐  ┌───────────▼───────────┐  ┌─────────────┐               │
│  │ LoginPage   │  │      BasePage         │  │ QuotePage   │               │
│  └──────┬──────┘  │  (Abstract Base)      │  └──────┬──────┘               │
│         │         └───────────────────────┘         │                       │
│         │                    ▲                      │                       │
│         └────────────────────┼──────────────────────┘                       │
│                              │                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ NewQuote    │  │ QuoteDetail │  │ Customers   │  │ EditQuote   │       │
│  │ Page        │  │ Page        │  │ Page        │  │ Page        │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
└──────────────────────────────��──────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT LAYER                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ FormComp    │  │ TableComp   │  │ ModalComp   │  │ HeaderComp  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│         │                    │                    │                        │
│         └────────────────────┼────────────────────┘                        │
│                              │                                              │
│                    ┌─────────▼─────────┐                                   │
│                    │   BaseComponent   │                                   │
│                    └───────────────────┘                                   │
└─────────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HELPER LAYER                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ AuthHelper  │  │ TableHelper │  │ Dropdown    │  │ TestData    │       │
│  │             │  │             │  │ Helper      │  │ Generator   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Navigation  │  │ Dialog      │  │ Form        │  │ Validation  │       │
│  │ Helper      │  │ Helper      │  │ Helper      │  │ Helper      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE LAYER                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Selectors                                    │   │
│  │  QuotePageSelectors │ LoginSelectors │ FormSelectors │ ...          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          Models                                      │   │
│  │  ConfigModels │ QuoteFormModel │ TestResult │ ...                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Config                                       │   │
│  │  ConfigReader ──▶ development.json │ lab.json │ production.json     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          REPORTER LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      TestRailReporter                                │   │
│  │  ├── Read test attributes (TestCase, TestLevel, Environment)        │   │
│  │  ├── Filter tests based on criteria                                 │   │
│  │  ├─��� Track retries and execution time                               │   │
│  │  └── Output JSON results for TestRail integration                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Cara Menjalankan Test

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all tests (default: development environment)
npm test

# Run tests for specific environment
npm run test:dev      # Development
npm run test:lab      # Lab/Staging
npm run test:prod     # Production

# Run with TestRail reporter
npm run test:ci
npm run test:ci:dev
npm run test:ci:lab

# Run in headed mode (visible browser)
npm run test:headed

# Run in debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/partner-login.spec.ts

# Run tests with filter
TEST_FILTER="TestLevel=Smoke" npm test
TEST_FILTER="TestCase=1580700" npm test
TEST_FILTER="TestEnvironmentLevel=Dev&TestLevel=Regression" npm test
```

### Docker Execution

```bash
# Build Docker image
npm run docker:build

# Run tests in Docker
npm run docker:run:dev
npm run docker:run:lab
npm run docker:run:prod

# Or using docker-compose directly
docker-compose up --abort-on-container-exit
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TEST_ENVIRONMENT` | Target environment | `development` |
| `HEADLESS` | Run headless | `true` |
| `MAX_RETRIES` | Max test retries | `1` |
| `TEST_WORKERS` | Parallel workers | `1` |
| `TEST_FILTER` | Test filter criteria | (none) |
| `VIEWPORT` | Browser viewport | `max` |
| `PLAYWRIGHT_SERVER_URL` | Remote Playwright server | (none) |

---

## Best Practices

### 1. Page Object Design
```typescript
// ✅ Good: Encapsulate selectors and actions
class QuotePage extends BasePage {
  async clickNewQuote(): Promise<void> {
    await this.click(QuotePageSelectors.NewQuoteButton);
  }
}

// ❌ Bad: Expose selectors directly in tests
test('...', async ({ page }) => {
  await page.click('button:has-text("New Quote")');
});
```

### 2. Test Data Generation
```typescript
// ✅ Good: Use TestDataGenerator for random data
const quoteData = TestDataGenerator.generateQuoteData();
await newQuotePage.fillForm(quoteData);

// ❌ Bad: Hardcode test data
await newQuotePage.fillForm({
  company: 'Test Company',
  currency: 'GBP'
});
```

### 3. Selector Strategy
```typescript
// ✅ Good: Use role-based or semantic selectors
public static readonly NewQuoteButton = 'button:has-text("New Quote")';
public static readonly CurrencyDropdown = '[role="combobox"][aria-label="Currency"]';

// ❌ Bad: Use fragile CSS selectors
public static readonly NewQuoteButton = '.MuiButton-root.css-1abc2de';
```

### 4. Wait Strategies
```typescript
// ✅ Good: Wait for specific conditions
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 30000 });

// ❌ Bad: Use fixed timeouts
await page.waitForTimeout(5000);
```

### 5. Test Independence
```typescript
// ✅ Good: Each test is independent
test.beforeEach(async ({ loginPage }) => {
  await loginPage.completeOidcLogin('partner');
});

// ❌ Bad: Tests depend on previous test state
test('test 1', async () => { /* creates data */ });
test('test 2', async () => { /* assumes data from test 1 */ });
```

---

## Kesimpulan

Framework **OneUI Quote Playwright** dirancang dengan arsitektur berlapis yang memisahkan concerns:

1. **Test Layer** - Fokus pada test scenarios dan assertions
2. **Page Object Layer** - Abstraksi UI interactions
3. **Component Layer** - Reusable UI components
4. **Helper Layer** - Utility functions
5. **Infrastructure Layer** - Selectors, Models, Config
6. **Reporter Layer** - Test result reporting

Setiap layer memiliki tanggung jawab yang jelas dan saling berkesinambungan melalui dependency injection dan composition patterns. Hal ini memudahkan maintenance, meningkatkan reusability, dan memungkinkan parallel development.
