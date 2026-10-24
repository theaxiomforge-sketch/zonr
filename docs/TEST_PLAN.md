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
| T-2 | Admin hold of an `active` vehicle stores `on_hold` with `held_by` and `held_at` from that admin session and the server clock, and writes one notification event for that vehicle's resident with action `hold`, that admin as actor, and no channel and no wording. A second hold is refused, the row is unchanged, and no second notification is written. A patroller and a resident receive a refusal and the status does not change. The case does not assert an enforcement outcome | PAC-021, PAC-022, PAC-026, D-072, Q-020, Q-028 |
| T-3 | An edit of plate or description on an `active` vehicle stays `active` when the vehicle's resident account is the session, including when that session also has admin. A body status does not change it. `updated_by` and `updated_at` are stored. The audit event stores the session actor, the edit action, `community_id`, the server timestamp, and `before` and `after` for both plate and description. A body `before` or `after` is ignored. An edit of someone else's vehicle is not found. A resident edit of an `on_hold` vehicle is refused and the row stays `on_hold`, including when that session also has admin. An edit of a `removed` vehicle is refused. A plate change while the community's plate-change limit is unset is refused and the plate is unchanged. A description-only edit while that limit is unset still stores the description. The case does not use a product number for the limit | PAC-023, PAC-027, PAC-101, PAC-062, D-069, D-071 |
| T-4 | A second vehicle for the same resident, on a different plate, is stored. Add does not count that account's vehicles. A second non-removed row for the same plate in the community is refused. A `removed` row does not block a new `active` row for that plate | PAC-020, PAC-024, D-070 |
| T-5 | Pass longer than `per_stay_cap` is refused and absent afterward | PAC-003, PAC-100 |
| T-6 | Pass that breaks the month cap is refused and absent. A pass inside both caps whose window contains now is permission to park and has no stall id. The month total uses the configured window and timezone and still counts a revoked pass that overlaps the window. Unset subject, window, or timezone refuses the create. A session with resident and not admin that sends another account id still stores `for_account` as itself. A patroller session without resident is refused. An admin pass whose named account lacks the resident permission is refused. A later edit of unit or household does not change ids already copied onto an existing pass | PAC-001, PAC-002, PAC-004, PAC-075, PAC-100 |
| T-7 | Missing config refuses the pass and the warning. That includes an unset upload maximum and an unset guest-lookup limit. An unset plate-change limit refuses a plate change and refuses a config save that leaves the limit empty. It does not supply a number | PAC-100, PAC-027, D-071 |
| T-8 | A second pass for the same plate is refused when the first is scheduled or still before its end, and not revoked | PAC-006 |
| T-9 | A pass with `start > now` is not permission to park. At `end`, a read shows `expired` using the server clock, not a client timestamp, and no job has to write that status | PAC-005, PAC-103 |
| T-10 | Plate check returns one payload: the non-removed vehicle or none, including its status, scheduled or current pass or none, and the open warning or none. A plate can have all three. `on_hold` is not mapped to a pass, a warning, or a tow. A `removed` row is not the current registration. Grace already ended still includes that warning until it is closed. "No record" is only the empty payload. The payload has no phone and no photo bytes | PAC-030, PAC-031, PAC-033, PAC-044, Q-020 |
| T-11 | Warning without a stored photo is absent. A non-image or an SVG does not create a warning. Warning with a JPEG, PNG, or WebP sets `grace_ends_at` from config and stores the submitted free-text `warning_reason` and the submitted plate. The case sends a non-empty reason and does not assert a fixed list or an empty-reason refusal. A second warning while the first is unclosed is refused. A photo read without a privacy-table role does not return a usable URL | PAC-040, PAC-041, PAC-042, PAC-046, Q-027 |
| T-12 | Sign during grace is refused. Sign when server `now >= grace_ends_at` by a signer stores `signed` with no prior `grace_elapsed` write and performs no outbound tow call. A patroller sign is refused. The writing is not served inline | PAC-043, PAC-044, PAC-050, PAC-051, PAC-052, PAC-053, PAC-102 |
| T-13 | Export for community A contains A's rows and photo bytes and no B row. The archive includes a violation's stored plate and `warning_reason`, a vehicle edit event's `before` and `after` plate and description, a notification event with no channel and no wording, and an abuse-control violation. An audit row exists for the export. A signer without admin can run it | PAC-060, PAC-061, PAC-062, D-071, D-072 |
| T-14 | A request authenticated as A, using B's id in the body or the path, is not found. The stored community stays A's | PAC-071, PAC-080, PAC-104 |
| T-15 | On a pass or vehicle request, body `community_id`, actor, `decided_by`, `held_by`, `removed_by`, `before`, `after`, `permissions`, channel, and wording do not change the session's community, the actor stored on the row, or the notification event. A notification event has no channel and no wording. Invite acceptance copies community and permissions from the invite and ignores both on the body. A guest-link read has no session and no actor. The lookup limit is per client address, not per token and not one community-wide counter. An over-limit lookup of a live token returns the same invalid line as an unknown token, and shows no plate | PAC-007, PAC-009, PAC-010, PAC-026, PAC-073, PAC-104 |
| T-16 | A resident can remove their own `active` vehicle. The row remains with status `removed`, `removed_by`, and `removed_at`. That resident removal writes no notification event. They cannot remove someone else's vehicle. A resident cannot remove an `on_hold` vehicle, including when that session also has admin, and the row stays `on_hold`. An admin can remove an `active` or `on_hold` vehicle in the community, which sets `removed` and is not a release of the hold, and each of those removals writes one notification event with action `remove` for that vehicle's resident, with no channel and no wording. A remove does not clear `held_by` or `held_at`. The case does not move `on_hold` to `active` | PAC-025, PAC-026, D-069, D-072, Q-026, Q-028 |
| T-17 | A warning stores the submitted plate and the free-text warning reason. A later edit of the vehicle that carried that plate appends an audit event with `community_id`, the resident actor, the edit action, the server timestamp, and `before` and `after` plate and description. The violation plate stays the warned plate. A signature copies that violation plate. The plate in effect on the vehicle at `warning_at`, taken from the create and edit audit events, equals the violation plate | PAC-023, PAC-040, PAC-051, PAC-060, PAC-062, I-14 |
| T-18 | The product has no built-in plate-change number and no named extra control. The case puts a fixture value in the community's plate-change limit and asserts that exceeding that configured limit stores an abuse-control violation. It does not assert a product default, what counts as one change, or what the admin action does. An admin of that community can read the violation. A resident, a patroller, a signer, and another community's admin cannot. A description-only edit is not that limit. An empty list of other abuse controls stores no extra control | PAC-027, D-071, Q-023 |

T-1 locks D-067: a resident add stores `active` and ignores a status on the body. It is in the minimum because the current UI writes the client's status (VERIFIED). T-16 locks the remove half of the same decision, the D-069 refusal while `on_hold`, and the D-072 notice on an admin removal only. T-2 locks the same notice on hold. T-17 locks the warned plate after a later edit. T-4 locks D-070: a second vehicle for the same resident is stored. T-3, T-7, and T-18 lock D-071: an unset plate-change limit refuses a plate change, and a fixture value that is exceeded stores a violation an admin can read. None of these cases asserts a product plate-change number, a named extra abuse control, a notification channel or wording, an audit retention duration, or a release from `on_hold` to `active` (Q-023, Q-028, Q-025, Q-026). T-11 does not decide Q-027.

## 6. Prototype check, not the pilot suite

Until the pilot exists, a change to the mock can still be looked at by hand: five routes load, a resident save still writes, a reload restores the seed. That walkthrough does not pass T-1 through T-18. Do not record it as pilot evidence.

`npm run build` on Node 24 matches the Pages workflow (VERIFIED). Run it for mock changes. It is not a substitute for section 5.

## 7. Questions

Q-002 changes T-6's fixture once the cap subject, window, and timezone are chosen. Q-007 changes T-11 if photos become optional. S-2 is D-067, so T-1, T-2, T-3, and T-16 lock an accepted rule. Q-013 still covers S-1 and S-3 through S-6. Q-019 decides how T-14 obtains a session, and it is tied to Q-028. Decisions are in `PRD.md` section 11.1. Q-021 is resolved by D-069, so T-3 and T-16 lock that a resident cannot edit or remove an `on_hold` vehicle. Q-022 is resolved by D-070, so T-4 stores a second vehicle for the same resident and still refuses a second current row for one plate. Q-023 is partly resolved by D-071. T-18 uses a fixture value and does not lock a product number, a list of other controls, or the admin action. Q-024 is resolved by D-072, so T-2 and T-16 lock the notification event and do not lock a channel or wording (Q-028). Q-020 and Q-026 change vehicle fixtures when answered. T-2 and T-10 do not assert an enforcement meaning for `on_hold`. T-16 does not assert a release to `active`. No case asserts an audit retention duration (Q-025). Q-027 changes T-11 if an empty reason is refused or the reason becomes a fixed list. T-7 checks that an unset upload maximum, guest-lookup limit, or plate-change limit refuses the action. It does not pick the number.
