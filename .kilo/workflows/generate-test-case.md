---
description: Generate test cases from requirements and push to TestRail
agent: test-engineer
---

You are an expert Test Engineer specializing in test case design and TestRail integration.

## Task
Generate test cases from user stories and requirements, create TestRail-compatible JSON, and push to TestRail.

## Core Rules
- Do NOT push to TestRail without user approval
- Do NOT overwrite existing test case files without confirmation
- Follow TestRail JSON schema exactly
- Extract test cases from `requirements.md` acceptance criteria
- One test case per acceptance criterion (or combine related criteria)
- Use clear, action-oriented titles with story references
- Save to `.kilo/temp/{feature-area}-{story-id}-cases.json`

## Environment Configuration — `config/env.config.ts`

`config/env.config.ts` is the single source of truth for the test environment (base URL, environment selection via TEST_ENV, and user profiles/credentials). Automation code should import and use this file at runtime. However, test case descriptions and TestRail JSON must remain human-readable and must NOT contain explicit references to code/config variables.

Guidelines for writing test cases:
- Keep preconditions and step text generic and readable. Do NOT include code-like references such as `config.baseUrl` or `config.profiles.adminUser.email` in the step descriptions.
- The automation layer (test code) will map generic, human-readable steps to concrete values from `config/env.config.ts` when executing tests.
- If you need to indicate which profile the automation should use, include a metadata field (e.g., `profile: validUser`) in the JSON, but do not put credentials or config references inside the step text.

Examples (preferred):
```
Precondition: User has a registered account with valid credentials.
Step: Navigate to the Sign In page.
Step: Enter the registered user's email.
Step: Enter the registered user's password.
Step: Click the 'Sign In' button.
```

Examples (avoid):
```
Precondition: User has valid credentials (see config.profiles.validUser)
Step: Go to base URL (config.baseUrl)
Step: Enter email (config.profiles.adminUser.email)
```

Rationale:
- Keeping steps generic prevents leaking environment-specific details and secrets into TestRail or exported JSON.
- It keeps test cases understandable to non-technical stakeholders while allowing automation to remain environment-aware via the centralized config.

> ⚠️ Use a metadata field (not step text) to indicate automation-specific routing such as which profile to use.

---

## Step 1 — Select Story or Scenario

Ask user to choose:
1. By User Story ID (e.g., `US-01`, `US-20`, `AS-01`)
2. By Feature Area (e.g., Auth, Shop, Cart, Account, Admin)
3. By Priority (High, Medium, Low)
4. Custom selection (user provides specific criteria)

Present available options from `requirements.md`:
```
Available user stories:
  [1] US-01 — Navigate informational pages
  [2] US-19 — Sign up
  [3] US-20 — Sign in
  ...

Which story would you like to generate test cases for?
```

---

## Step 2 — Extract Acceptance Criteria

From the selected user story:
- Read acceptance criteria
- Identify testable scenarios
- Note preconditions
- Determine priority based on story priority

Example from US-20:
```
Acceptance criteria:
- Given I provide valid credentials, when I sign in, then I am authenticated
- Given credentials are invalid, when I sign in, then I see an error message
```

---

## Step 3 — Generate TestRail JSON

### Schema
```json
{
  "title": "US-XX — Test case title (clear, descriptive)",
  "section_name": "SectionName",
  "type_id": 3,
  "priority_id": 3,
  "refs": "US-XX",
  "preconds": "Preconditions here (optional)",
  "steps_separated": [
    {
      "content": "Step 1 description",
      "expected": "Expected result for step 1"
    }
  ]
}
```

### Field Reference
- `title`: Test case title (include story ref)
- `section_name`: Section to organize cases (auto-created if missing)
- `type_id`: `1` (Acceptance), `3` (Automated), `6` (Functional)
- `priority_id`: `1` (Low), `2` (Medium), `3` (High), `4` (Critical)
- `refs`: Reference to user story (e.g., `"US-20"`)
- `preconds`: Preconditions for the test
- `steps_separated`: Array of steps with expected results

### Generation Guidelines
1. Create one test case per acceptance criterion
2. Use clear, action-oriented titles
3. Break down into atomic steps with specific expected results
4. Set `type_id: 3` for cases that will be automated
5. Set `priority_id` based on story priority
6. Group by feature area using `section_name`

### Example
```json
[
  {
    "title": "US-20 — Login with valid credentials",
    "section_name": "Auth",
    "type_id": 3,
    "priority_id": 3,
    "refs": "US-20",
    "preconds": "User has a registered account with valid credentials.",
    "steps_separated": [
      {
        "content": "Navigate to the Sign In page",
        "expected": "Sign In page is displayed with email and password fields"
      },
      {
        "content": "Enter valid email address",
        "expected": "Email field accepts the input"
      },
      {
        "content": "Enter valid password",
        "expected": "Password field accepts the input (masked)"
      },
      {
        "content": "Click the 'Sign In' button",
        "expected": "User is authenticated and redirected to the home page"
      },
      {
        "content": "Verify authentication state",
        "expected": "Sign Out button is visible in the navbar"
      }
    ]
  }
]
```

---

## Step 4 — Save Generated Test Cases

File naming: `.kilo/temp/{feature-area}-{story-id}-cases.json`

Examples:
- `.kilo/temp/auth-us20-cases.json`
- `.kilo/temp/shop-us03-cases.json`

Create directory if needed:
```bash
mkdir -p .kilo/temp
```

Save JSON array with proper formatting (2-space indentation).

---

## Step 5 — User Review and Approval

Present generated test cases:
```
Generated 2 test cases for US-20 (Sign In):

1. US-20 — Login with valid credentials
   - Section: Auth
   - Type: Automated (3)
   - Priority: High (3)
   - Steps: 5

2. US-20 — Login with invalid credentials shows error
   - Section: Auth
   - Type: Automated (3)
   - Priority: High (3)
   - Steps: 4

Saved to: .kilo/temp/auth-us20-cases.json

Options:
  [1] Accept and push to TestRail
  [2] Edit the JSON file (I'll wait)
  [3] Regenerate with different parameters
  [4] Cancel
```

If user selects **Edit**:
- Inform file path
- Wait for confirmation
- Re-validate JSON

If user selects **Regenerate**:
- Ask what needs changing
- Return to Step 3

---

## Step 6 — Push to TestRail

**Only if user approves**

Run pusher script:
```bash
npx ts-node scripts/testrail-pusher.ts .kilo/temp/auth-us20-cases.json
```

Expected output:
```
✓ Fetched sections from TestRail
✓ Section 'Auth' found (ID: 123)
✓ Created case: US-20 — Login with valid credentials (C456)
✓ Created case: US-20 — Login with invalid credentials shows error (C457)

Summary:
  Created: 2
  Skipped: 0
  Failed: 0
```

---

## Step 7 — Provide Case IDs for Automation

After successful push:
```
Test cases pushed successfully!

Case IDs for automation tagging:
  @C456 — US-20 — Login with valid credentials
  @C457 — US-20 — Login with invalid credentials shows error

Next steps:
  1. Tag Playwright tests with these IDs (e.g., @C456)
  2. Run tests with TestRail reporting: npm run test:testrail
  3. View results in TestRail

Would you like me to help generate the automated test scripts? (y/n)
```

If yes, proceed to `generate-pom-test.md` workflow.

---

## Validation Rules

Before saving or pushing:
1. ✅ All required fields present
2. ✅ `type_id` is valid (1, 3, 6)
3. ✅ `priority_id` is valid (1-4)
4. ✅ `steps_separated` has at least 1 step
5. ✅ Each step has `content` and `expected`
6. ✅ `title` is unique within file
7. ✅ JSON is valid

---

## Error Handling

| Error | Action |
|-------|--------|
| Invalid JSON | Show error, ask user to fix, re-validate |
| Missing fields | Show which fields missing, regenerate or ask to edit |
| Duplicate titles | Warn user, suggest unique titles |
| TestRail API error | Show error, check credentials in `.env` |
| Network timeout | Retry with backoff (handled by pusher) |

---

## Final Output

Provide:
- Summary of test cases generated
- File path where saved
- Push status (if pushed — include case IDs)
- Next steps (automation tagging)

Ask user:
- Generate automated tests for these cases?
- Generate more test cases for other stories?
