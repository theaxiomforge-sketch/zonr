# Zonr test plan — pilot design

Code baseline: `main` `99d283e` (VERIFIED). Pilot ids: `FRD.md`. The suite in section 5 is PROPOSED. It is not in the repo. S-2 is D-067. The other success criteria are UNAPPROVED.

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED.

## 1. Purpose

Say what is tested today, and name the smallest set that would lock the pilot rules: caps, resident-managed vehicles with admin hold and remove, warning before a signature, no dispatch, and tenant isolation.

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

PROPOSED, and UNAPPROVED except where it locks S-2: `npm test` fails if a vehicle add requires admin approval or stores a status from the body, if a resident can hold a vehicle, if a pass over the cap is stored, if a signature is allowed during grace, or if community B is readable from community A.

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
| T-1 | A resident session, including one that also has admin, ignores a body status of `approved`, `on_hold`, or `removed` and stores `active`. A body resident-account id is ignored and the vehicle's resident is the session. A patroller, signer, or admin session without resident is refused and stores nothing. `community_id` on the row is the session's community | PAC-020, PAC-080, PAC-101 |
| T-2 | Admin hold of an `active` vehicle stores `on_hold` with `held_by` and `held_at` from that admin session and the server clock. A second hold is refused and the row is unchanged. A patroller and a resident receive a refusal and the status does not change. The case does not assert an enforcement outcome | PAC-021, PAC-022, Q-020 |
| T-3 | An edit of plate or description on an `active` vehicle stays `active` when the vehicle's resident account is the session, including when that session also has admin. A body status does not change it. `updated_by` and `updated_at` are stored. An edit of someone else's vehicle is not found. An edit of an `on_hold` or `removed` vehicle is refused and the row is unchanged | PAC-023, PAC-101, Q-021 |
| T-4 | A second non-removed row for the same plate in the community is refused. A `removed` row does not block a new `active` row for that plate. The case is not a per-resident vehicle limit | PAC-024, Q-022 |
| T-5 | Pass longer than `per_stay_cap` is refused and absent afterward | PAC-003, PAC-100 |
| T-6 | Pass that breaks the month cap is refused and absent. A pass inside both caps whose window contains now is permission to park and has no stall id. The month total uses the configured window and timezone and still counts a revoked pass that overlaps the window. Unset subject, window, or timezone refuses the create. A session with resident and not admin that sends another account id still stores `for_account` as itself. A patroller session without resident is refused. An admin pass whose named account lacks the resident permission is refused. A later edit of unit or household does not change ids already copied onto an existing pass | PAC-001, PAC-002, PAC-004, PAC-075, PAC-100 |
| T-7 | Missing config refuses the pass and the warning. That includes an unset upload maximum and an unset guest-lookup limit | PAC-100 |
| T-8 | A second pass for the same plate is refused when the first is scheduled or still before its end, and not revoked | PAC-006 |
| T-9 | A pass with `start > now` is not permission to park. At `end`, a read shows `expired` using the server clock, not a client timestamp, and no job has to write that status | PAC-005, PAC-103 |
| T-10 | Plate check returns one payload: the non-removed vehicle or none, including its status, scheduled or current pass or none, and the open warning or none. A plate can have all three. `on_hold` is not mapped to a pass, a warning, or a tow. A `removed` row is not the current registration. Grace already ended still includes that warning until it is closed. "No record" is only the empty payload. The payload has no phone and no photo bytes | PAC-030, PAC-031, PAC-033, PAC-044, Q-020 |
| T-11 | Warning without a stored photo is absent. A non-image or an SVG does not create a warning. Warning with a JPEG, PNG, or WebP sets `grace_ends_at` from config. A second warning while the first is unclosed is refused. A photo read without a privacy-table role does not return a usable URL | PAC-040, PAC-041, PAC-042, PAC-046 |
| T-12 | Sign during grace is refused. Sign when server `now >= grace_ends_at` by a signer stores `signed` with no prior `grace_elapsed` write and performs no outbound tow call. A patroller sign is refused. The writing is not served inline | PAC-043, PAC-044, PAC-050, PAC-051, PAC-052, PAC-053, PAC-102 |
| T-13 | Export for community A contains A's rows and photo bytes and no B row. An audit row exists for the export. A signer without admin can run it | PAC-060, PAC-061, PAC-062 |
| T-14 | A request authenticated as A, using B's id in the body or the path, is not found. The stored community stays A's | PAC-071, PAC-080, PAC-104 |
| T-15 | On a pass or vehicle request, body `community_id`, actor, `decided_by`, `held_by`, `removed_by`, and `permissions` do not change the session's community or the actor stored on the row. Invite acceptance copies community and permissions from the invite and ignores both on the body. A guest-link read has no session and no actor. The lookup limit is per client address, not per token and not one community-wide counter. An over-limit lookup of a live token returns the same invalid line as an unknown token, and shows no plate | PAC-007, PAC-009, PAC-010, PAC-073, PAC-104 |
| T-16 | A resident can remove their own `active` vehicle. The row remains with status `removed`, `removed_by`, and `removed_at`. They cannot remove someone else's vehicle. They cannot remove an `on_hold` vehicle, and that row is unchanged. An admin can remove an `active` or `on_hold` vehicle in the community. A remove does not clear `held_by` or `held_at`. There is no request that moves `on_hold` to `active` | PAC-025, Q-021, Q-026 |

T-1 locks D-067: a resident add stores `active` and ignores a status on the body. It is in the minimum because the current UI writes the client's status (VERIFIED). T-16 locks the remove half of the same decision. Neither case asserts a per-resident count, a plate-change rate, a notice, or an audit retention duration (Q-022, Q-023, Q-024, Q-025).

## 6. Prototype check, not the pilot suite

Until the pilot exists, a change to the mock can still be looked at by hand: five routes load, a resident save still writes, a reload restores the seed. That walkthrough does not pass T-1 through T-16. Do not record it as pilot evidence.

`npm run build` on Node 24 matches the Pages workflow (VERIFIED). Run it for mock changes. It is not a substitute for section 5.

## 7. Questions

Q-002 changes T-6's fixture once the cap subject, window, and timezone are chosen. Q-007 changes T-11 if photos become optional. S-2 is D-067, so T-1, T-2, T-3, and T-16 lock an accepted rule. Q-013 still covers S-1 and S-3 through S-6. Q-019 decides how T-14 obtains a session. Q-020, Q-021, Q-022, and Q-026 change vehicle fixtures when answered. T-2 and T-10 do not assert an enforcement meaning for `on_hold`. T-4 is not a per-resident limit. No case asserts a plate-change rate, a hold or remove notice, or an audit retention duration (Q-023, Q-024, Q-025). T-7 checks that an unset upload maximum or guest-lookup limit refuses the action. It does not pick the number.
