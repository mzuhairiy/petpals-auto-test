# TestRail Integration — Full Guide

This document covers the complete TestRail integration for the PetPals automated test suite, from initial account setup to running automated reports.

---

## Table of Contents

1. [Prerequisites: TestRail Account Setup](#1-prerequisites-testrail-account-setup)
2. [Project Configuration](#2-project-configuration)
3. [Overview](#3-overview)
4. [Files Created / Modified](#4-files-created--modified)
5. [Part 1: Pushing Test Cases](#5-part-1-pushing-test-cases)
6. [Part 2: Reporting Results](#6-part-2-reporting-results)
7. [Test Case ↔ Automation Mapping](#7-test-case--automation-mapping)
8. [Adding New Test Cases](#8-adding-new-test-cases)
9. [Issues Found & Fixed During Setup](#9-issues-found--fixed-during-setup)
10. [Cleanup](#10-cleanup)

---

## 1. Prerequisites: TestRail Account Setup

### 1.1 Create a TestRail Account

1. Go to [https://www.testrail.com](https://www.testrail.com) and sign up for a trial or paid plan
2. You'll receive a TestRail instance URL like `https://yourcompany.testrail.io`
3. Log in with your admin credentials

### 1.2 Generate an API Key

The API key is used to authenticate API requests (instead of your password).

1. Click your **name/avatar** in the top-right corner → **My Settings**
2. Go to the **API Keys** tab
3. Click **Add Key** → give it a name (e.g., `playwright-automation`)
4. Copy the generated key — **you won't see it again**

> ⚠️ Treat the API key like a password. Never commit it to version control.

### 1.3 Enable the API

TestRail's API may need to be enabled by an admin:

1. Go to **Administration** → **Site Settings** → **API** tab
2. Check **Enable API**
3. Save

### 1.4 Create a Project

1. Go to **Administration** → **Projects** → **Add Project**
2. Enter a project name (e.g., `PetPals`)
3. Choose the project type:
   - **Single repository** — one suite of test cases (simpler)
   - **Multiple test suites** — separate suites per area (our setup uses this)
4. Click **Add Project**
5. Note the **Project ID** from the URL: `https://yourcompany.testrail.io/index.php?/projects/overview/2` → ID is `2`

### 1.5 Create a Test Suite (multi-suite projects only)

If you chose "Multiple test suites":

1. Open your project → **Test Cases** tab
2. Click **Add Test Suite** → name it (e.g., `Regression Suite`)
3. Note the **Suite ID** from the URL: `https://yourcompany.testrail.io/index.php?/suites/view/6` → ID is `6`

### 1.6 Gather Your Configuration Values

After the above steps, you should have:

| Value | Example | Where to find it |
|-------|---------|-------------------|
| Base URL | `https://petpals.testrail.io` | Your browser address bar |
| Email | `you@company.com` | The email you log in with |
| API Key | `of9UzRPxMx7qLY...` | My Settings → API Keys |
| Project ID | `2` | URL of your project overview page |
| Suite ID | `6` | URL of your test suite page (multi-suite only) |

---

## 2. Project Configuration

### 2.1 Add TestRail Variables to `.env`

Add the following to your `.env` file (never commit this file):

```env
# TEST RAIL
TESTRAIL_BASE_URL=https://yourcompany.testrail.io
TESTRAIL_EMAIL=you@company.com
TESTRAIL_API_KEY=your-api-key-here
TESTRAIL_PROJECT_ID=2
TESTRAIL_SUITE_ID=6
TESTRAIL_REPORT=false
```

| Variable | Required | Description |
|----------|----------|-------------|
| `TESTRAIL_BASE_URL` | ✅ | Your TestRail instance URL (no trailing slash) |
| `TESTRAIL_EMAIL` | ✅ | Email address of your TestRail account |
| `TESTRAIL_API_KEY` | ✅ | API key generated in step 1.2 |
| `TESTRAIL_PROJECT_ID` | ✅ | Numeric project ID from the URL |
| `TESTRAIL_SUITE_ID` | ⚠️ | Required only for multi-suite projects |
| `TESTRAIL_REPORT` | ✅ | Set to `true` to push results after test runs |
| `TESTRAIL_RUN_NAME` | ❌ | Optional custom name for the test run |

### 2.2 Install Dependencies

```bash
npm install
```

This installs `ts-node` (needed for the pusher script) and all other dev dependencies.

### 2.3 Verify Connection

Quick sanity check that your credentials work:

```bash
npx ts-node scripts/testrail-pusher.ts test-data/testrail-auth-cases.json
```

If credentials are correct, you'll see sections being fetched and cases being pushed (or skipped if they already exist).

---

## 3. Overview

The integration has two parts:

1. **Push test cases** — Define test cases in JSON and push them to TestRail via the API
2. **Report results** — After Playwright tests run, automatically push pass/fail results back to TestRail

```
┌──────────────────────────────────────────────────────────────┐
│                        WORKFLOW                              │
│                                                              │
│  ① Write test cases (JSON)                                   │
│       ↓                                                      │
│  ② Push to TestRail (testrail-pusher.ts)                     │
│       ↓                                                      │
│  ③ Tag Playwright tests with @TC{id}                         │
│       ↓                                                      │
│  ④ Run tests (npm run test:testrail:auth)                    │
│       ↓                                                      │
│  ⑤ Reporter creates a Run, pushes results, closes the Run   │
│       ↓                                                      │
│  ⑥ View results in TestRail                                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Files Created / Modified

### New Files

| File | Purpose |
|------|---------|
| `scripts/testrail-pusher.ts` | CLI tool to push test cases from JSON to TestRail |
| `utils/testrail-reporter.ts` | Custom Playwright reporter that sends results to TestRail |
| `test-data/testrail-auth-cases.json` | 14 auth test cases in TestRail-compatible JSON format |
| `TESTRAIL-INTEGRATION.md` | This document |

### Modified Files

| File | Change |
|------|--------|
| `tests/auth/login.test.ts` | Added `@TC{id}` tags to all 8 test titles |
| `tests/auth/register.test.ts` | Added `@TC{id}` tags to all 6 test titles |
| `playwright.config.ts` | Conditionally loads TestRail reporter when `TESTRAIL_REPORT=true` |
| `package.json` | Added `test:testrail`, `test:testrail:auth`, `push:testrail` scripts |
| `tsconfig.json` | Added `ts-node` compiler override for CommonJS compatibility |
| `.env` | Added `TESTRAIL_SUITE_ID`, `TESTRAIL_REPORT` |
| `.env.example` | Documented all TestRail env vars |

---

## 5. Part 1: Pushing Test Cases

### JSON Format

Test cases are defined in `test-data/testrail-auth-cases.json`:

```json
{
    "title": "US-20 — Login with valid credentials",
    "section_name": "Auth",
    "type_id": 1,
    "priority_id": 2,
    "refs": "US-20",
    "preconds": "User has a registered account.",
    "steps_separated": [
        {
            "content": "Click the 'Sign In' button.",
            "expected": "The Sign In page is displayed."
        }
    ]
}
```

Key fields:
- **`section_name`** — Auto-creates the section if it doesn't exist
- **`type_id`** — Case type (1=Acceptance, 3=Automated, 6=Functional, etc.)
- **`priority_id`** — Priority (1=Low, 2=Medium/High, 3=Medium, 4=Must Test)
- **`template_id`** — Auto-set to `2` (Test Case Steps) when `steps_separated` is present
- **`refs`** — Links to user stories (US-19, US-20, etc.)

### Push Command

```bash
npx ts-node scripts/testrail-pusher.ts test-data/testrail-auth-cases.json
```

Or via npm:

```bash
npm run push:testrail -- test-data/testrail-auth-cases.json
```

### Pusher Features

- **Auto-creates sections** if they don't exist in TestRail
- **Skips duplicates** by matching case titles (safe to re-run)
- **Sets `template_id: 2`** automatically when steps are provided
- **Validates all cases** before pushing any (fail-fast)
- **Caches sections** to avoid redundant API calls
- **Retries** on rate limits (429) and server errors (5xx)

---

## 6. Part 2: Reporting Results

### How It Works

1. Tag each Playwright test with `@TC{id}` in the title:

```ts
test('should login with valid credentials @TC79 @smoke @auth', async ({ ... }) => {
    // test code
});
```

2. The custom reporter (`utils/testrail-reporter.ts`) hooks into Playwright's lifecycle:
   - **`onTestEnd`** — Extracts `@TC{id}` from the title, maps pass/fail status
   - **`onEnd`** — Creates a TestRail Run, pushes all results, closes the run

3. Results appear in TestRail with:
   - Pass/Fail status
   - Test duration
   - Browser name
   - Error messages (for failures, truncated to 1000 chars)
   - Retry attempt number

### Status Mapping

| Playwright Outcome | TestRail Status |
|--------------------|-----------------|
| `expected` (pass)  | Passed (1)      |
| `unexpected` (fail)| Failed (5)      |
| `flaky`            | Retest (4)      |
| `skipped`          | Blocked (2)     |

### Run Commands

```bash
# Run auth tests + report to TestRail (chromium only)
npm run test:testrail:auth -- --project=chromium

# Run ALL tests + report to TestRail
npm run test:testrail

# Run normally (no TestRail reporting)
npm test
```

The reporter is **opt-in** — it only activates when `TESTRAIL_REPORT=true`. Normal test runs are unaffected.

---

## 7. Test Case ↔ Automation Mapping

### Login Tests (`tests/auth/login.test.ts`)

| Tag | Test Title | TestRail Case |
|-----|-----------|---------------|
| `@TC79` | should login with valid credentials | US-20 — Login with valid credentials |
| `@TC80` | should show error toast with invalid credentials | US-20 — Login with invalid credentials shows error |
| `@TC81` | should not submit with empty credentials | US-20 — Login with empty credentials is prevented |
| `@TC82` | should show validation for invalid email format | US-20 — Login with invalid email format shows validation error |
| `@TC83` | should show error toast with unregistered email | US-20 — Login with unregistered email shows error |
| `@TC84` | should navigate to sign-up page from sign-in | US-20 — Navigate to sign-up page from sign-in |
| `@TC85` | should navigate to forgot password page | US-22 — Navigate to forgot password page from sign-in |
| `@TC86` | should logout and return to unauthenticated state | US-20 — Logout returns to unauthenticated state |

### Register Tests (`tests/auth/register.test.ts`)

| Tag | Test Title | TestRail Case |
|-----|-----------|---------------|
| `@TC87` | should register with valid data | US-19 — Register with valid data |
| `@TC88` | should not register with mismatched passwords | US-19 — Register with mismatched passwords is prevented |
| `@TC89` | should not register without accepting terms | US-19 — Register without accepting terms is prevented |
| `@TC90` | should not register with empty email | US-19 — Register with empty email is prevented |
| `@TC91` | should not register with already registered email | US-19 — Register with already registered email shows error |
| `@TC92` | should navigate to sign-in page from sign-up | US-19 — Navigate to sign-in page from sign-up |

> **Note:** The `@TC` IDs above are placeholders. Replace them with the actual Case IDs from your TestRail instance.

---

## 8. Adding New Test Cases

1. **Add the case to a JSON file** (or create a new one):
   ```json
   {
       "title": "US-XX — Your test case title",
       "section_name": "YourSection",
       "type_id": 1,
       "priority_id": 2,
       "refs": "US-XX",
       "preconds": "Preconditions here.",
       "steps_separated": [
           { "content": "Step 1", "expected": "Expected 1" },
           { "content": "Step 2", "expected": "Expected 2" }
       ]
   }
   ```

2. **Push it:**
   ```bash
   npx ts-node scripts/testrail-pusher.ts test-data/your-cases.json
   ```

3. **Note the Case ID** from the output

4. **Tag your Playwright test:**
   ```ts
   test('your test @TC{id} @smoke', async ({ ... }) => {
   ```

5. **Run with reporting:**
   ```bash
   npm run test:testrail -- --project=chromium
   ```

---

## 9. Issues Found & Fixed During Setup

### testrail-pusher.ts (API Review)

| # | Issue | Fix |
|---|-------|-----|
| 1 | API URL format — `index.php?/api/v2/` is correct for query param chaining | Kept `index.php?/` format (required by TestRail) |
| 2 | `get_sections` missing `suite_id` for multi-suite projects | Added `TESTRAIL_SUITE_ID` support |
| 3 | No pagination on `get_sections` | Added pagination loop checking `_links.next` |
| 4 | No retry/rate-limit handling | Added retry with exponential backoff + 429 handling |
| 5 | No duplicate detection | Added title-based duplicate check before creating |
| 6 | N+1 API calls for section resolution | Added section cache (fetched once) |
| 7 | No input validation | Added `validateCase()` with fail-fast before any API calls |
| 8 | Missing `template_id` — steps not appearing in TestRail | Auto-sets `template_id: 2` when `steps_separated` is present |
| 9 | Wrong custom field name `custom_is_automated` | Fixed to `custom_case_is_automated` (per instance config) |
| 10 | Missing `Content-Type` header on POST requests | Fixed: always send `Content-Type: application/json` |

### tsconfig.json

- Added `ts-node` compiler override (`module: CommonJS`, `moduleResolution: node`) so `npx ts-node` works with the ESNext tsconfig

---

## 10. Cleanup

These files can be safely deleted (leftover from development):

```bash
rm -f test-data/testrail-case-map.ts
rm -f scripts/testrail-list-sections.mjs
rm -f scripts/testrail-push.mjs
rm -f scripts/testrail-list-sections.ts
rm -f scripts/testrail-debug-fields.ts
```
