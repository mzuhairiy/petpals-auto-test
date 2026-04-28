---
description: Generate POM-based automated tests from TestRail test cases
agent: test-engineer
---

You are an expert Automation Engineer specializing in Playwright and the Page Object Model (POM).

## Task
Create Playwright automated tests using POM pattern, based on TestRail test cases and existing codebase patterns.

## Core Rules
- Do NOT put selectors or logic inside test files → always use Page Objects
- Do NOT create new Page Objects without approval
- Do NOT duplicate existing logic
- All interaction logic must live in Page Objects
- Follow exact folder structure and import style
- Prefer `data-testid`, `getByRole` and `getByTestId`
- Avoid XPath and long CSS selectors
- Use Playwright auto-waiting (no `waitForTimeout`)
- Stop and ask before destructive operations (overwriting files, deleting)
- Use Playwright MCP for element inspection and autonomous testing ONLY with approval

---

## Step 1 — Analyze Test Case

Input sources:
1. TestRail Case ID (e.g., `C456`)
2. JSON file from `generate-test-case.md` workflow
3. Manual test case description

Extract:
- Test case title and steps
- Expected results for each step
- Preconditions
- Feature area (determines which page objects to use/create)

Example:
```
Test Case: C456 — US-20 — Login with valid credentials

Steps:
  1. Navigate to the Sign In page
     Expected: Sign In page is displayed
  
  2. Enter valid email address
     Expected: Email field accepts input
  
  3. Enter valid password
     Expected: Password field accepts input (masked)
  
  4. Click 'Sign In' button
     Expected: User authenticated, redirected to home
  
  5. Verify authentication state
     Expected: Sign Out button visible in navbar
```

---

## Step 2 — Scan Codebase for POM Patterns

Analyze existing structure:
```
/pages/           — Page Object classes
/pages/components/ — Reusable component objects
/fixtures/        — Test fixtures
/tests/           — Existing test specs
/constants/       — URL patterns and constants
```

Identify patterns from existing files (e.g., `login.page.ts`):

**Page Object Pattern:**
```typescript
import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

export default class LoginPage extends BasePage {
    // Locators (readonly)
    readonly heading: Locator;
    readonly emailField: Locator;
    readonly signInButton: Locator;
    
    constructor(page: Page) {
        super(page);
        this.heading = page.getByText('Sign in to your account', { exact: true });
        this.emailField = this.byTestId('signin-email-input');
        this.signInButton = this.byTestId('signin-submit-btn');
    }
    
    // Interaction methods (NO assertions)
    async login(email: string, password: string): Promise<void> {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.signInButton.click();
        await this.waitForDomReady();
    }
}
```

**Key Patterns:**
1. ✅ Extend `BasePage`
2. ✅ Use `readonly` for locators
3. ✅ Prefer `data-testid` via `this.byTestId()`
4. ✅ NO assertions in page objects
5. ✅ Call `this.waitForDomReady()` after navigation
6. ✅ Group locators by category

**Test Pattern:**
```typescript
import { test, expect } from '../../fixtures/base.fixture';
import config from '../../config/env.config';

test.describe('Login Flow', () => {
    test.beforeEach(async ({ page, navbar }) => {
        await page.goto('/');
        await expect(navbar.signInButton).toBeVisible();
    });

    test('should login with valid credentials @C79 @smoke @auth', async ({ 
        navbar, loginPage, toast 
    }) => {
        await navbar.navigateToSignIn();
        await loginPage.login(
            config.profiles.validUser.email, 
            config.profiles.validUser.password
        );
        await toast.assertSignInSuccess();
        await expect(navbar.signOutButton).toBeVisible();
    });
});
```

**Key Test Patterns:**
1. ✅ Use fixtures from `base.fixture.ts`
2. ✅ Tag tests with `@C{id}` for TestRail
3. ✅ Add descriptive tags (`@smoke`, `@auth`)
4. ✅ Use `test.describe()` for grouping
5. ✅ Use `config.profiles` for test data
6. ✅ Assertions in tests, NOT page objects

---

## Step 3 — Inspect Page Elements (with approval)

**⚠️ Ask user before inspecting:**
```
I need to inspect the Sign In page to identify element selectors.
This will:
  - Navigate to the page in a browser
  - Capture element attributes (data-testid, text, roles)
  - Take screenshots for reference

Proceed with page inspection? (y/n)
```

**If approved, use Playwright MCP to:**
1. Navigate to target page
2. Capture element selectors (prefer `data-testid`)
3. Document findings
4. Take screenshots (save to `.kilo/temp/screenshots/`)

Example findings:
```
Found elements on Sign In page:
  - Email field: data-testid="signin-email-input"
  - Password field: data-testid="signin-password-input"
  - Sign In button: data-testid="signin-submit-btn"
  - Email error: data-testid="signin-email-error"
```

---

## Step 4 — Prepare Page Object

Check if Page Object exists in `/pages`:

### If EXISTS:
- Reuse it
- Add missing locators/methods if needed
- **Ask before modifying:**
  ```
  I need to update LoginPage to add new locators/methods.
  Changes:
    + Add: forgotPasswordLink locator
    + Add: navigateToForgotPassword() method
  
  Proceed with updating /pages/login.page.ts? (y/n)
  ```

### If NOT EXISTS:
- **Ask for approval before creating:**
  ```
  Page Object for Checkout does not exist.
  Create new CheckoutPage at /pages/checkout.page.ts? (y/n)
  ```

**Template for new Page Object:**
```typescript
import { type Page, type Locator } from '@playwright/test';
import BasePage from './base.page';

/**
 * {FeatureName}Page — {Brief description}
 *
 * Contains locators and interactions for {feature}.
 * NO assertions — tests handle all verification.
 */
export default class {FeatureName}Page extends BasePage {
    // ── Locators ──
    readonly heading: Locator;
    readonly {field}Field: Locator;
    readonly {action}Button: Locator;
    
    constructor(page: Page) {
        super(page);
        this.heading = page.getByText('{Heading}', { exact: true });
        this.{field}Field = this.byTestId('{testid}');
        this.{action}Button = this.byTestId('{testid}');
    }
    
    // ── Interactions ──
    async {methodName}({params}): Promise<void> {
        // Implementation
        await this.waitForDomReady();
    }
}
```

---

## Step 5 — Generate Test Spec

### File Naming
Pattern: `/tests/{feature}/{feature}.test.ts`

Examples:
- `/tests/auth/login.test.ts`
- `/tests/shop/product.test.ts`

### Map Test Case Steps to Code

| Test Step | Playwright Code |
|-----------|-----------------|
| Navigate to {page} | `await {fixture}.navigateTo{Page}()` |
| Enter {value} in {field} | `await {page}.{field}Field.fill('{value}')` |
| Click {button} | `await {page}.{button}Button.click()` |
| Verify {element} visible | `await expect({page}.{element}).toBeVisible()` |
| Verify URL is {url} | `await expect(page).toHaveURL(URL_PATTERNS.{pattern})` |

### Generate Test Code

```typescript
import { test, expect } from '../../fixtures/base.fixture';
import config from '../../config/env.config';
import { URL_PATTERNS } from '../../constants/env.constants';

test.describe('{Feature} Flow', () => {

    test.beforeEach(async ({ page, {fixture} }) => {
        await page.goto('/');
        // Common setup
    });

    test('should {action} @C{id} @{tags}', async ({ 
        page, 
        {fixtures} 
    }) => {
        // Arrange
        
        // Act
        
        // Assert
    });
});
```

### Add TestRail Tags

Format: `@C{caseId} @{tags}`

Common tags:
- `@smoke` — Critical path
- `@auth` — Authentication
- `@regression` — Full regression
- `@{feature}` — Feature-specific

---

## Step 6 — Autonomous Test Validation (with approval)

**⚠️ Ask user before running:**
```
I've generated the test code. Run autonomous test to validate?
This will:
  - Execute test in real browser
  - Verify all steps work
  - Capture screenshots and traces
  - Report failures

Run autonomous validation? (y/n)
```

**If approved:**
1. Run generated test
2. Monitor execution
3. Capture errors
4. Report results:
   ```
   Autonomous test results:
     ✓ Navigate to Sign In page
     ✓ Enter email
     ✓ Enter password
     ✓ Click Sign In button
     ✗ Verify Sign Out button visible
       Error: Timeout waiting for element
       
   Issue: Sign Out button selector may be incorrect.
   Suggested fix: Update navbar.signOutButton locator.
   
   Apply fix? (y/n)
   ```
5. Iterate if needed

---

## Step 7 — User Review and Approval

Show summary:
```
Generated automated test for C456 — Login with valid credentials

Files to be created/modified:
  [CREATE] /tests/auth/login.test.ts (45 lines)
  [UPDATE] /pages/login.page.ts (+3 locators, +1 method)
  [UPDATE] /fixtures/base.fixture.ts (+1 fixture)

Test structure:
  ✓ Uses existing LoginPage, Navbar, Toast
  ✓ Tagged with @C456 @smoke @auth
  ✓ Follows POM pattern
  ✓ Uses config.profiles for test data

Autonomous validation: PASSED

Options:
  [1] Accept and save all files
  [2] Review code (show diffs)
  [3] Modify test
  [4] Cancel
```

If user requests diffs, show changes:
```diff
// UPDATE: /pages/login.page.ts

  readonly signInButton: Locator;
+ readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
      ...
+     this.forgotPasswordLink = this.byTestId('signin-forgot-password-link');
  }

+ async navigateToForgotPassword(): Promise<void> {
+     await this.forgotPasswordLink.click();
+ }
```

---

## Step 8 — Save Files

**⚠️ Ask before overwriting:**
```
File /tests/auth/login.test.ts already exists.
Current file has 8 tests. New file will add 1 test.

Options:
  [1] Append new test to existing file (recommended)
  [2] Overwrite entire file (⚠️ will lose existing tests)
  [3] Save as new file with different name
  [4] Cancel
```

If appending:
- Read existing file
- Add to appropriate `test.describe()` block
- Preserve existing tests
- Maintain formatting

### Update Fixtures (if needed)

If new page objects created:
```diff
// UPDATE: /fixtures/base.fixture.ts

import LoginPage from '../pages/login.page';
+ import CheckoutPage from '../pages/checkout.page';

export const test = base.extend<{
    loginPage: LoginPage;
+   checkoutPage: CheckoutPage;
}>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
+   checkoutPage: async ({ page }, use) => {
+       await use(new CheckoutPage(page));
+   },
});
```

---

## Step 9 — Execute and Stabilize

Run the new test:
```bash
# Run specific test
npx playwright test tests/auth/login.test.ts --grep "@C456" --project=chromium

# Run with UI mode
npx playwright test tests/auth/login.test.ts --grep "@C456" --ui

# Run with TestRail reporting
TESTRAIL_REPORT=true npx playwright test tests/auth/login.test.ts --grep "@C456"
```

If it fails:
1. Identify issue (selector / logic / timing)
2. Fix in Page Object or test
3. Re-run

Repeat until test passes consistently (2-3 times).

(Max 3 iterations, then stop and report)

---

## Step 10 — Final Output

Provide:
- Summary of what was created
- Files affected
- Test execution results
- Any assumptions made
- Edge cases not covered

Show results:
```
Test Results:
  ✓ should login with valid credentials @C456 @smoke @auth (2.3s)

All tests passed!

Next steps:
  1. Run full test suite: npm test
  2. Push results to TestRail: npm run test:testrail
  3. Generate more tests for related cases
```

Ask user:
- Generate tests for related cases?
- Run full test suite?
- Proceed to fix-test workflow?

---

## Validation Rules

Before saving:
1. ✅ POM pattern compliance (extends BasePage, readonly locators, no assertions)
2. ✅ Test pattern compliance (uses fixtures, tagged with @C{id})
3. ✅ TypeScript types correct
4. ✅ Imports organized
5. ✅ Selector strategy (prefer data-testid)
6. ✅ Test data uses config.profiles

---

## Error Handling

| Error | Action |
|-------|--------|
| Page object not found | Create new (with approval) |
| Locator not found | Ask user or re-inspect with MCP |
| Test fails during validation | Debug, fix, re-run |
| File already exists | Ask: append, overwrite, or save as new |
| TypeScript error | Fix types, re-validate |
| Fixture not registered | Update base.fixture.ts |
