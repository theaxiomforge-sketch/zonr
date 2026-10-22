# Zonr test plan

Baseline: main `99d283e`. This plan states the test inventory as it is, then the smallest set that would lock the behavior in `FRD.md`. The set is PROPOSED. This pull request does not add it.

## 1. Purpose

Make the absence of tests explicit, and name the few checks that would catch a break in the mock, the shared screen state, or the Pages build.

## 2. Scope

### 2.1 What exists today

| Check | Result at this baseline |
| --- | --- |
| Unit tests | None. No `*.test.*` or `*.spec.*` files |
| Component or end-to-end tests | None |
| Test script | `package.json` has `dev`, `build`, and `preview` only |
| Test runner, jsdom, Testing Library, Playwright, Cypress, ESLint | Not declared |
| CI besides Pages | None. `.github/workflows/` contains only `deploy-pages.yml` |
| What CI actually runs | On a push to `main`, or a manual dispatch: `npm ci` and `npm run build` (`tsc && vite build`) on Node 24 |

`npm run build` proves the TypeScript in `src` typechecks and Vite emits `dist/`. It does not open a page, click a control, or execute an acceptance id.

### 2.2 In scope for the minimum proposal

The mock functions, one screen flow that the mock test cannot see, the five routes' loading and navigation, and the existing production build.

### 2.3 Out of scope for the minimum

| Left out | Why it can wait |
| --- | --- |
| Visual regression and CSS pixel checks | No baseline images. The UX spec is the contract until Henry asks for snapshots |
| Accessibility automation and contrast measurement | Not measured. Section 8 of `UX_DESIGN_SPEC.md` says so |
| Load, soak, and the 180ms delay as a performance budget | The delay is a `setTimeout`. Asserting the exact wait makes tests slow and brittle |
| Browser matrix beyond one Chromium | UNKNOWN requirement. One engine is enough to start |
| Security, penetration, or privacy tests | There is no account and no server. Q-015 is a product decision, not a test to invent |
| A test for every one of AC-001 through AC-056 as its own case | That is a full suite. Section 5 maps the minimum cases onto the ids they cover |

## 3. Success

The minimum is in place when:

1. A new `npm test` runs the cases in section 5 without a network.
2. Those cases fail if guest allocation, plate uppercasing, permit save, violation matching, or the reload-to-seed rule changes by accident.
3. `npm run build` still passes on Node 24, which the Pages workflow already enforces on `main`.
4. A failing test blocks merge only after Henry answers Q-018. Today nothing blocks merge except a human. The Pages workflow does not run on pull requests.

Until `npm test` exists, success of a change is a manual pass through section 6. That manual pass is not automated coverage. Do not describe it as a test suite.

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| Adding the tests in the docs pull request | This change is documentation only |
| Choosing a coverage percentage | A percentage without the cases in section 5 is a vanity gate |
| Testing PROPOSED backend behavior | There is no backend. Do not mock a server that the product has not specified |
| Treating the seed's broken cross-links as failures | `FRD.md` section 12 records them as the fixture. A test may lock the fixture. It should not "fix" it |
| Flake from real timers | Fake the 180ms timer. The delay is not the behavior under test |

## 5. Minimum proposed suite

### 5.1 Runner

PROPOSED, not adopted: Vitest, with `jsdom` and React Testing Library for the two component cases. Vitest is the smallest runner that matches a Vite + TypeScript app already in the repo. No runner is installed today. If Henry prefers Node's built-in test runner, the case list does not change. The package choice is a tooling choice, not a product decision. It does not need a Q-id unless he wants a different constraint.

`mockApi.ts` keeps `db` for the life of the module. Tests that import it once will leak sessions into the next case. The suite has to reset that state. PROPOSED approach: dynamic import after resetting the module, one fresh module per case. That avoids a production `reset` function until a test needs it. A `reset` export is also fine. Either is a code change for a later pull request.

Use fake timers so the 180ms wait does not make the suite sleep.

### 5.2 Cases

Eight module cases and three screen cases. That is the minimum.

| Case | Kind | What it asserts | Ids |
| --- | --- | --- | --- |
| M-1 | Module | The first `fetchDashboard` result equals the seed counts: 4 stats, 8 spots, 3 permits, 3 sessions, 3 violations. Mutating the result does not change the next fetch | AC-010, AC-014, fixture in `FRD.md` section 12 |
| M-2 | Module | `createGuestSession` prepends a `guest-` id, uppercases the plate, sets remaining minutes to hours times 60, sets `expiresSoon` false, and stores the phone | AC-030 |
| M-3 | Module | A North Court session on a fresh seed changes only A2. A second open spot in that zone, created with `assignSpot` first, stays open in the module. The screen rule is S-2, not this case | AC-032, AC-033 |
| M-4 | Module | A Clubhouse session is stored and no spot changes, because that zone has no open spot | AC-033 |
| M-5 | Module | `createGuestSession` does not change `stats`. The "312" string survives | AC-034's module half. The screen half is S-2 |
| M-6 | Module | `updatePermit` uppercases a non-empty plate and keeps the old plate when the new plate is `""`. Permit type, name, and unit stay put. An unknown id resolves empty after the 180ms wait | AC-010, AC-024, AC-025 |
| M-7 | Module | `assignSpot` writes unit, name, plate, and status, and replaces the note with "{status} assignment updated". The plate is stored as typed, not uppercased | AC-041 |
| M-8 | Module | `createViolation` prepends a `violation-` id, uppercases the plate, stores GPS `34.0523, -118.2438` and photo count 1, and sets only spots with that exact plate to `violation` with the reason as the note | AC-047, AC-048 |
| S-1 | Screen | Render the app. Each of the five routes leaves its loading sentence and shows its heading. `#/no-such-page` ends on the overview. The overview is not marked active on `#/manager` | AC-003, AC-004, AC-005, AC-007, AC-008, AC-011 |
| S-2 | Screen | From a fresh load, open the guest form, register a 2-hour North Court session, and see it at the top of the guest list with 120 minutes. Open the manager and see A2 as a guest with that plate and the note "Guest pass active for 2h". Open the overview and see the guest-session stat increased by 1 and the "2 tow escalations" text unchanged. Then set a second North Court spot to open, register another guest, and see both open spots become guest spots on the manager grid | AC-028, AC-029, AC-031, AC-034, AC-012, AC-051 |
| S-3 | Screen | Edit permit-2's plate to `abc123`, set status to revoked, check registration, save, and read `ABC123`, `revoked`, and "Docs on file" in the manager queue. The spot C6 plate stays `9MVP611`. Log plate `9MVP611` from enforcement and see C6 become a violation. Reload the page and see the seed plate `9MVP611`, status `review`, and C6's original note again | AC-009, AC-023, AC-024, AC-042, AC-048, AC-051, AC-054 |

S-2 is the case that protects the screen/module split. M-3 without S-2 would "pass" a change that made the screen update only one spot, and S-2 without M-3 would hide the opposite bug. Both stay in the minimum for that reason.

Ids not named in the table are either copy checks inside S-1 (the overview heading covers AC-011, and a single assertion can include the nav labels) or behaviors the three screen cases walk through without a dedicated row. A reviewer adding assertions inside S-1 through S-3 should prefer, in order if time appears: AC-001, AC-002, AC-006 on a built bundle rather than the dev server, AC-013, AC-015, AC-016, AC-017 through AC-022, AC-026, AC-027, AC-035, AC-036, AC-037 through AC-040, AC-043 through AC-046, AC-049, AC-050, AC-052, AC-053, AC-055, AC-056. Those are not part of the minimum. AC-056 (double submit) is the first case to add when the minimum is already green, because the form does not lock.

### 5.3 Build check

Keep the current command. Do not add a second build.

| Check | Command | Where it runs today |
| --- | --- | --- |
| Typecheck and production bundle | `npm run build` | Locally, and in the Pages workflow on Node 24 |

PROPOSED later, not minimum: run the same command on pull requests. The workflow file does not do that. Changing it is a code change and a D-053 process change. See `RUNBOOK.md`.

## 6. Manual check while no suite exists

Use this before merging a behavior change, until section 5 exists. It is a script for a person, not a test.

1. `npm ci` and `npm run dev`.
2. Load `/`. Wait until the loading sentence is gone. Confirm four stat cards and the literal "2 tow escalations pending."
3. Open each nav item, including Guest Portal, and confirm the loading sentence is replaced by that page's heading.
4. Visit a bad hash and confirm the overview returns.
5. On Resident, search `camry`, save plate `abc123` and status Revoked, and confirm the manager queue shows `ABC123` and `revoked`.
6. On Guest, submit an empty form and confirm the browser blocks it. Submit a named guest for North Court for 1 hour. Confirm the list shows 60 minutes and manager spot A2 changed.
7. On Guest, submit a Clubhouse session. Confirm the session exists and no Clubhouse spot became a guest solely because of that submit. B7 stays a violation. B8 stays a resident.
8. On Enforcement, log plate `8HTX224` as a warning. Confirm A1 shows as a violation and the incident shows one photo and GPS `34.0523, -118.2438`.
9. Reload. Confirm the seed scene from `FRD.md` section 12 is back, including stat "312" and spot A1's note "Smart Decal active".
10. `npm run build` on Node 24.

The hosted site at `https://theaxiomforge-sketch.github.io/zonr/` can stand in for steps 2 through 9 after a Pages deploy. It cannot stand in for step 10.

## 7. Defects the minimum must not "fix" by assertion

| Behavior | How a bad test would lie |
| --- | --- |
| Screen updates every open spot; module updates the first | One shared expected value for both |
| Guest stat changes on screen and not in the module | Expecting `fetchDashboard` to return the incremented stat |
| "2 tow escalations pending" | Computing the 2 from the violation list |
| Seed zones that disagree across spots and violations | A relational assertion between violation-2 and spot B7 |
| Reload restores the seed | Asserting that the module survives a reload. It does not |

## 8. Open questions

No product question blocks section 6. Section 5's package choice is PROPOSED. Q-018 decides whether a red `npm test` is allowed to merge. Q-016 decides whether any of this is the prototype's success bar. Neither answer changes the case list.
