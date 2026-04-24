# PetPals Automated Tests

Production-grade Playwright test automation framework using strict Page Object Model (POM) architecture.

## Project Structure

```
petpals-auto-test/
│
├── tests/                          # Test specs (test cases only)
│   ├── auth/
│   │   ├── login.test.ts           # Login & logout tests
│   │   └── register.test.ts        # Registration tests
│   ├── navigation/
│   │   └── navigation.test.ts      # Header, footer, newsletter tests
│   ├── shop/
│   │   ├── product.test.ts         # Product detail & wishlist tests
│   │   └── shopping.test.ts        # Filtering, cart, checkout tests
│   └── account/
│       └── account.test.ts         # Account & orders page tests
│
├── pages/                          # Page Object classes (UI abstraction)
│   ├── base.page.ts                # Base page (common methods)
│   ├── login.page.ts               # Sign-in page
│   ├── register.page.ts            # Sign-up page
│   ├── home.page.ts                # Homepage
│   ├── shop.page.ts                # Shop/product listing page
│   ├── product.page.ts             # Product detail page
│   ├── cart.page.ts                # Cart, checkout, payment pages
│   ├── account.page.ts             # Account, orders, wishlist pages
│   └── components/                 # Reusable UI components
│       ├── navbar.component.ts     # Header navigation
│       ├── footer.component.ts     # Footer links
│       └── toast.component.ts      # Toast notifications
│
├── fixtures/                       # Test setup & reusable fixtures
│   └── base.fixture.ts             # All page objects & components
│
├── utils/                          # Helper functions
│   ├── api.helper.ts               # Payment & shipment connectors
│   ├── data.helper.ts              # Test data generation (faker)
│   ├── db.helper.ts                # Database helper (placeholder)
│   └── logger.ts                   # File & console logger
│
├── test-data/                      # Static test data
│   ├── users.json                  # User emails for tests
│   └── products.json               # Product search & filter data
│
├── constants/                      # Global constants
│   └── env.constants.ts            # Timeouts, URL patterns, defaults
│
├── config/                         # Configuration files
│   ├── env.config.ts               # Environment & credentials loader
│   └── playwright.config.ts        # Playwright config (reference copy)
│
├── scripts/                        # Custom scripts
│   ├── run-tests.sh                # CI test runner
│   └── testrail-pusher.ts          # TestRail integration
│
├── playwright.config.ts            # Root Playwright config
├── package.json
├── tsconfig.json
└── README.md
```

## Architecture Rules

### Separation of Concerns

| Layer | Contains | Does NOT contain |
|-------|----------|-----------------|
| **Tests** | Test logic, assertions, test flow | Selectors, locators, UI interactions |
| **Pages** | Locators, UI interaction methods | Assertions, test logic |
| **Components** | Reusable UI parts (navbar, footer, toast) | Page-specific logic |
| **Fixtures** | Page object instantiation, setup/teardown | Business logic |
| **Utils** | Data generation, API helpers, logging | UI interactions |

### Naming Conventions

- Pages: `{name}.page.ts`
- Components: `{name}.component.ts`
- Tests: `{name}.test.ts`
- Helpers: `{name}.helper.ts`
- Constants: `{name}.constants.ts`
- Config: `{name}.config.ts`

## Running Tests

```bash
# All tests
npm test

# By environment
npm run test:local
npm run test:staging

# By domain
npm run test:auth
npm run test:shop
npm run test:navigation
npm run test:account

# By tag
npm run test:smoke

# By browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Headed mode
npm run test:headed

# View report
npm run report
```

## Environment Setup

1. Copy `.env.example` to `.env` (or `.env.local` / `.env.staging`)
2. Fill in credentials
3. Run `npm install`
4. Run `npx playwright install`

Switch environments with `TEST_ENV`:
```bash
TEST_ENV=local npm test
TEST_ENV=staging npm test   # default
```
