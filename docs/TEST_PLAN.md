# Zonr test plan — pilot design

Code baseline: `main` `99d283e` (VERIFIED). Pilot ids: `FRD.md`. The suite in section 5 is PROPOSED. It is not in the repo. Success criteria are UNAPPROVED.

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED.

## 1. Purpose

Say what is tested today, and name the smallest set that would lock the pilot rules: caps, admin-only approval, warning before a signature, no dispatch, and tenant isolation.

## 2. Scope

### 2.1 Today

| Check | Result |
| --- | --- |
| Test files | None (VERIFIED: no `*.test.*` or `*.spec.*` on `99d283e`) |
| `npm test` | No script (VERIFIED, `package.json`) |
| `npm run lint` | No script (VERIFIED) |
| CI | `Deploy To GitHub Pages` on push to `main` and `workflow_dispatch` only. It runs `npm ci` and `npm run build` (VERIFIED, `.github/workflows/deploy-pages.yml`) |
| What that build proves | `tsc` and a Vite bundle. It does not execute a PAC id |

### 2.2 In the minimum proposal

Rules that are easy to break and that the pilot exists to enforce. Not a visual suite. Not a legal test of CVC §22658 (UNKNOWN, RADAR).

### 2.3 Out of scope

| Left out | Why |
| --- | --- |
| Pixel tests of the prototype | The pilot UI is not built |
| Load tests | No volume target is approved |
| A test that hardcodes 700 or 75 | Those must not be logic (PAC-072) |
| Tow-vendor contract tests | No vendor. PAC-052 |

## 3. Success

PROPOSED and UNAPPROVED: `npm test` fails if a resident can approve a vehicle, if a pass over the cap is stored, if a signature is allowed during grace, or if community B is readable from community A.

Until that suite exists, there is no automated pilot gate. `npm run build` remains the only automated check, and only on `main` (VERIFIED).

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| Add the suite in the docs pull request | Documentation only |
| A coverage percentage | The cases matter, not a ratio |
| Treat the manual mock walkthrough as pilot coverage | The mock fails section 5 of `FRD.md` |

## 5. Minimum proposed cases

PROPOSED runner: the project's test tool is not chosen (UNKNOWN). The cases do not depend on the name of the runner.

| Case | Asserts | Ids |
| --- | --- | --- |
| T-1 | Resident create ignores `status: approved` and stores `pending_review` | PAC-020, PAC-101 |
| T-2 | Admin moves that row to `approved` and is recorded as `decided_by`. A patroller token receives a refusal and the status does not change | PAC-021, PAC-022 |
| T-3 | Resident edit of an approved plate returns it to `pending_review` | PAC-023 |
| T-4 | Second approved row for the same plate in the community is refused | PAC-024 |
| T-5 | Pass longer than `per_stay_cap` is refused and absent afterward | PAC-003, PAC-100 |
| T-6 | Pass that breaks the month cap is refused and absent. A pass inside both caps is `active` and has no stall id | PAC-001, PAC-002, PAC-004 |
| T-7 | Missing config refuses the pass | PAC-100 |
| T-8 | Second active pass for the same plate is refused | PAC-006 |
| T-9 | At `end`, a read shows `expired` using the server clock, not a client timestamp | PAC-005, PAC-103 |
| T-10 | Plate check returns the four results in PAC-030 and PAC-033, and the payload has no phone and no photo | PAC-030, PAC-031, PAC-033 |
| T-11 | Warning without a stored photo is absent. Warning with a photo sets `grace_ends_at` from config | PAC-040, PAC-041, PAC-042 |
| T-12 | Sign during grace is refused. Sign after grace by a signer stores `signed` and performs no outbound tow call. A patroller sign is refused | PAC-043, PAC-050, PAC-051, PAC-052, PAC-053, PAC-102 |
| T-13 | Export for community A contains A's rows and photos and no B row. An audit row exists for the export | PAC-060, PAC-061, PAC-062 |
| T-14 | A request authenticated as A, using B's id, is not found | PAC-071, PAC-080 |

T-1 is the self-approve regression. It is in the minimum because the current UI has the opposite behavior (VERIFIED).

## 6. Prototype check, not the pilot suite

Until the pilot exists, a change to the mock can still be looked at by hand: five routes load, a resident save still writes, a reload restores the seed. That walkthrough does not pass T-1 through T-14. Do not record it as pilot evidence.

`npm run build` on Node 24 matches the Pages workflow (VERIFIED). Run it for mock changes. It is not a substitute for section 5.

## 7. Questions

Q-002 changes T-6's fixture once the cap subject is chosen. Q-007 changes T-11 if photos become optional. Q-013 decides whether a red T-1 blocks a merge. None of those answers exist (UNKNOWN).
