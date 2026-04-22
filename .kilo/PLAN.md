# AI-Powered Test Case Generation & TestRail Integration — Plan

**Created:** 2025-01-15  
**Status:** ✅ Executed  
**Author:** QA Automation Engineer  

---

## 1. Overview

Build an AI agent workflow that:
1. Explores a web application UI using MCP (Playwright)
2. Maps elements to existing Page Object Model structure
3. Generates structured test cases matching TestRail's API format
4. Pushes test cases to TestRail via API
5. Optionally creates Playwright `.spec.ts` automation alongside

All driven by natural language within the IDE — no manual CLI required for the push step.

---

## 2. Current State

### What Exists

| Component | Status | Location |
|---|---|---|
| Playwright + POM structure | ✅ Done | `page-objects/`, `tests/` |
| `learn-ui` workflow | ✅ Done | `.kilo/workflows/learn-ui.md` |
| `create-test` workflow | ✅ Done (updated) | `.kilo/workflows/create-test.md` |
| `fix-test` workflow | ✅ Done | `.kilo/workflows/fix-test.md` |
| TestRailPusher script | ✅ Done | `src/utils/TestRailPusher.ts` |
| TestRail env config | ✅ Done | `.env` / `.env.example` |
| `push:testrail` npm script | ✅ Done | `package.json` |

### What Was Built

| Component | Status | Details |
|---|---|---|
| Snapshot output from `learn-ui` | ✅ Done | Step 6 saves to `.kilo/snapshots/ui/<page>-<timestamp>.md` |
| `create-test` reads from snapshots | ✅ Done | Step 2 checks `.kilo/snapshots/ui/` for recent files |
| `.kilo/snapshots/` directory structure | ✅ Done | `ui/` and `test-cases/` subdirectories created |
| TestRail section mapping | ✅ Done | Dynamic resolution via API in `TestRailPusher.ts` |

---

## 3. Architecture

### Workflow Pipeline

```
/learn-ui (MCP explores page)
    ↓
.kilo/snapshots/ui/<page>-<timestamp>.md       ← persistent output
    ↓
/create-test (reads snapshot OR user provides requirements directly)
    ↓
Outputs:
  ├── tests/<feature>.spec.ts                  ← Playwright automation (POM)
  ├── page-objects/actions/<Page>Action.ts      ← POM updates
  └── .kilo/snapshots/test-cases/<feature>.json ← TestRail payload
    ↓
User reviews JSON in chat
    ↓
User says "push" → TestRailPusher runs → Cases appear in TestRail
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Workflows are decoupled** | `learn-ui` and `create-test` can run independently. `create-test` works with or without a prior `learn-ui` run. |
| **Snapshot files bridge workflows** | Persistent `.md` files replace fragile chat context. Timestamped, reviewable, diffable. |
| **TestRail JSON is generated alongside specs** | One workflow, two outputs. No separate `generate-cases` workflow needed. |
| **Human review gate before push** | AI output is a draft. User approves, edits, or skips before anything hits TestRail. |
| **Section mapping is dynamic** | `section_name` in JSON is human-readable. `TestRailPusher` resolves it to `section_id` via API. |

---

## 4. Snapshot File Format

**Location:** `.kilo/snapshots/ui/<page-name>-<YYYY-MM-DD-HHmm>.md`

**Example:** `.kilo/snapshots/ui/shop-page-2025-01-15-1430.md`

```markdown
# UI Snapshot — Shop Page
**Timestamp:** 2025-01-15 14:30:00
**URL:** https://staging.petpals-demo.shop/shop
**Workflow:** learn-ui

## Covered Elements
| Element | Page Object | Method |
|---|---|---|
| Add to Cart button | ProductAction | addToCart() |
| Product name | ProductPageElements | productName |

## Missing Coverage
| Element | Suggested Method | Locator Strategy | Priority |
|---|---|---|---|
| Wishlist button | addToWishlist() | getByTestId('wishlist-btn') | High |
| Sort dropdown | sortProducts() | getByRole('combobox') | Medium |

## Suggested Flows
- Browse → Add to Cart → View Cart
- Browse → Filter by Category → Sort by Price

## Improvements
- Product card selector uses CSS class → migrate to data-testid

## Flow Changes
- None detected
```

---

## 5. TestRail JSON Format

**Location:** `.kilo/snapshots/test-cases/<feature>.json`

**Schema (matches TestRail API):**

```json
[
  {
    "title": "User can add product to cart from shop page",
    "section_name": "Shopping",
    "type_id": 1,
    "priority_id": 2,
    "preconds": "User is logged in. Products exist in the shop.",
    "steps_separated": [
      { "content": "Navigate to shop page", "expected": "Product grid is visible with product cards" },
      { "content": "Click Add to Cart on a product", "expected": "Toast notification confirms item added to cart" },
      { "content": "Open cart page", "expected": "Product appears in cart with correct name and price" }
    ],
    "refs": "tests/shopping.spec.ts",
    "automation_type": 1,
    "is_automated": true
  }
]
```

### Field Reference

| Field | Type | Description |
|---|---|---|
| `title` | string | Test name from `test()` block |
| `section_name` | string | Human-readable, resolved to `section_id` by pusher (not sent to API) |
| `type_id` | number | 1 = Automated, 6 = Functional |
| `priority_id` | number | 1 = Low, 2 = Medium, 3 = High, 4 = Critical |
| `preconds` | string | Preconditions / setup requirements |
| `steps_separated` | array | `{ content, expected }` step pairs |
| `refs` | string | Path to `.spec.ts` file for traceability |
| `automation_type` | number | 1 = Automated |
| `is_automated` | boolean | Automation status flag |

---

## 6. TestRail Integration

### Environment Variables (`.env`)

```
TESTRAIL_BASE_URL=https://yourcompany.testrail.io
TESTRAIL_EMAIL=your@email.com
TESTRAIL_API_KEY=your-api-key
TESTRAIL_PROJECT_ID=1
```

### Push Methods

| Method | How |
|---|---|
| **From workflow (natural language)** | User says "push to TestRail" → agent runs `npx ts-node src/utils/TestRailPusher.ts .kilo/snapshots/test-cases/<file>.json` |
| **From CLI** | `npm run push:testrail .kilo/snapshots/test-cases/shopping.json` |

### API Endpoints Used

| Action | Endpoint |
|---|---|
| Get sections | `GET /api/v2/get_sections/{project_id}` |
| Create case | `POST /api/v2/add_case/{section_id}` |

---

## 7. Workflow Responsibilities

### `learn-ui`
- Explore UI via MCP
- Map elements to existing Page Objects
- Identify coverage gaps
- **NEW:** Save output to `.kilo/snapshots/ui/<page>-<timestamp>.md`

### `create-test`
- Create `.spec.ts` + Page Object updates
- Generate TestRail JSON (`.kilo/snapshots/test-cases/<feature>.json`)
- Present JSON for review (edit / push / save only)
- Push to TestRail on user approval
- **Can read from** `.kilo/snapshots/ui/` if available, or work from user requirements alone

### `fix-test`
- Fix failing tests
- No changes needed for this plan

---

## 8. Execution Order

### Phase 1 — Update `learn-ui` to Save Snapshots
1. Add Step 5.5 to `learn-ui.md`: save structured output to `.kilo/snapshots/`
2. Create `.kilo/snapshots/` directory (auto-created on first run)

### Phase 2 — Update `create-test` to Read Snapshots
3. Add instruction to Step 2: if `.kilo/snapshots/` has a recent file for the target page, use it as input
4. JSON format in Step 5 already matches TestRail ✅
5. Interactive review + push flow already in Step 5 ✅

### Phase 3 — Validate End-to-End
6. Run `/learn-ui` on a page → verify snapshot saved
7. Run `/create-test` → verify it reads snapshot + generates JSON
8. Push to TestRail → verify cases appear in correct section

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| AI generates shallow/obvious test steps | Low-value cases in TestRail | Human review gate; strong prompting with business context |
| TestRail custom fields differ per instance | Push fails on `custom_automation_type` etc. | Document field IDs; make them configurable |
| Snapshot files accumulate | Clutter in `.kilo/snapshots/` | Add to `.gitignore` or periodic cleanup |
| Section name mismatch | Push fails if section doesn't exist in TestRail | `TestRailPusher` lists available sections in error message |
| Token limits in long sessions | AI loses earlier context | Snapshot files decouple workflows — no reliance on chat memory |

---

## 10. File Structure After Execution

```
petpals-auto-test/
├── .kilo/
│   ├── workflows/
│   │   ├── learn-ui.md          ← updated (snapshot output)
│   │   ├── create-test.md       ← updated (TestRail JSON + review flow)
│   │   └── fix-test.md          ← unchanged
│   └── snapshots/               ← NEW (all AI-generated artifacts)
│       ├── ui/                  ← learn-ui output
│       │   └── shop-page-2025-01-15-1430.md
│       └── test-cases/          ← generated TestRail JSON
│           └── shopping.json
├── src/
│   └── utils/
│       ├── TestRailPusher.ts    ← NEW (already created)
│       └── Logger.ts
├── tests/                       ← automation only (POM structure)
│   └── shopping.spec.ts
├── page-objects/                ← automation only (POM structure)
│   ├── actions/
│   └── locators/
├── .env.example                 ← updated (TestRail vars)
└── package.json                 ← updated (push:testrail script)
```

### Separation Principle
- **`page-objects/` + `tests/`** → Pure automation code (POM structure)
- **`.kilo/snapshots/`** → AI-generated artifacts (UI snapshots + test case JSON)
- **`.kilo/workflows/`** → Agent workflow definitions

---

## 11. Success Criteria

- [ ] `/learn-ui` saves a snapshot `.md` file with timestamp
- [ ] `/create-test` can read from snapshot or work standalone
- [ ] `/create-test` generates TestRail-compatible JSON
- [ ] User can review, edit, and push JSON via natural language
- [ ] Cases appear in TestRail under the correct section
- [ ] Full flow works in a single chat session: explore → create → push
