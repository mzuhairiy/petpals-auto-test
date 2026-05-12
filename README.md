# PetPals Automated Tests

End-to-end test automation for the [PetPals](https://petpals.vercel.app) pet products e-commerce application, built with Playwright and TypeScript using strict Page Object Model (POM) architecture.

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm v9 or higher

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Configure environment
cp .env.example .env.staging   # or .env.local for local dev
# Edit the file and fill in credentials
```

### Environment variables

| Variable | Description |
|---|---|
| `BASE_URL` | Application base URL |
| `VALID_USER_EMAIL` | Test user email |
| `VALID_USER_PASSWORD` | Test user password |
| `TESTRAIL_BASE_URL` | TestRail instance URL |
| `TESTRAIL_EMAIL` | TestRail account email |
| `TESTRAIL_API_KEY` | TestRail API key |
| `TESTRAIL_PROJECT_ID` | TestRail project ID |

Switch environments with the `TEST_ENV` variable (default: `staging`):

```bash
TEST_ENV=local npm test
TEST_ENV=staging npm test
```

## Running Tests

```bash
# All tests (staging)
npm test

# By environment
npm run test:local
npm run test:staging

# By domain
npm run test:auth
npm run test:shop
npm run test:navigation
npm run test:account

# Smoke tests only
npm run test:smoke

# By browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Headed mode (visible browser)
npm run test:headed

# View HTML report
npm run report
```

## Test Coverage

| Domain | File | Cases |
|---|---|---|
| Authentication | `tests/auth/login.test.ts` | Login, logout, validation errors, navigation |
| Authentication | `tests/auth/register.test.ts` | Registration, duplicate email, validation |
| Shop | `tests/shop/shopping.test.ts` | Browse, category filter, pet-type filter |
| Shop | `tests/shop/product.test.ts` | Product details, quantity controls, tabs, wishlist |
| Navigation | `tests/navigation/navigation.test.ts` | Header links, footer links |
| Account | `tests/account/account.test.ts` | Account page nav, orders page access |

### Test tags

| Tag | Description |
|---|---|
| `@smoke` | Critical path — run before full suite |
| `@auth` | Authentication flows |
| `@shop` | Shopping and product flows |
| `@navigation` | Navigation and link checks |
| `@product` | Product detail interactions |
| `@wishlist` | Wishlist operations |
| `@account` | Account management |
| `@C##` | TestRail case mapping (e.g., `@C79`) |

Run any tag directly:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @wishlist
```

## Project Structure

```
petpals-auto-test/
├── tests/                      # Test specs (assertions only)
│   ├── auth/
│   ├── shop/
│   ├── navigation/
│   └── account/
├── pages/                      # Page Object classes (interactions only)
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── register.page.ts
│   ├── home.page.ts
│   ├── shop.page.ts
│   ├── product.page.ts
│   ├── cart.page.ts
│   ├── account.page.ts
│   └── components/
│       ├── navbar.component.ts
│       ├── footer.component.ts
│       └── toast.component.ts
├── fixtures/
│   └── base.fixture.ts         # Page object injection
├── utils/
│   ├── data.helper.ts          # Faker-based test data
│   ├── api.helper.ts           # Payment & shipment API helpers
│   ├── logger.ts               # File and console logger
│   └── testrail-reporter.ts    # Custom Playwright reporter
├── test-data/
│   ├── users.json
│   └── products.json
├── constants/
│   └── env.constants.ts        # Timeouts, URL patterns, defaults
├── config/
│   └── env.config.ts           # Environment and credential loader
├── scripts/
│   └── testrail-pusher.ts      # CLI to push results to TestRail
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Architecture

Strict separation of concerns — each layer has one job:

| Layer | Responsibility | Must not contain |
|---|---|---|
| **Tests** | Assertions and test flow | Selectors, UI interactions |
| **Pages** | Locators and UI interaction methods | Assertions |
| **Components** | Reusable UI elements (navbar, footer, toast) | Page-specific logic |
| **Fixtures** | Page object instantiation | Business logic |
| **Utils** | Data generation, helpers, logging | UI interactions |

All page objects extend `BasePage`, which provides navigation helpers, wait utilities, and `data-testid` locator shortcuts. All locators use `data-testid` attributes for resilience.

## TestRail Integration

Tests map to TestRail cases via `@C##` tags in test titles. Two integration modes are available:

**Report during test run:**

```bash
npm run test:testrail
npm run test:testrail:auth
```

**Push existing results manually:**

```bash
npm run push:testrail
```

Requires `TESTRAIL_BASE_URL`, `TESTRAIL_EMAIL`, `TESTRAIL_API_KEY`, and `TESTRAIL_PROJECT_ID` to be set.

## CI/CD

Two GitHub Actions workflows are included:

| Workflow | Trigger | What it does |
|---|---|---|
| `playwright.yml` | Pull request to `main` | Runs Chromium tests, uploads HTML report |
| `run-tests.yml` | `repository_dispatch` event | Full suite, Discord notification, deploys report to GitHub Pages |

The `run-tests.yml` workflow requires the following repository secrets:

| Secret | Purpose |
|---|---|
| `PETPALS_STATUS_PAT` | Post commit status to source repo |
| `DISCORD_WEBHOOK_URL` | Send test result notifications |
| `VALID_USER_EMAIL` | Test credentials |
| `VALID_USER_PASSWORD` | Test credentials |

Test reports are published to the `gh-pages` branch and retained as artifacts for 30 days.
