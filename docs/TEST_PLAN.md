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
| T-3 | An edit of plate or description on an `active` vehicle stays `active` when the vehicle's resident account is the session, including when that session also has admin. A body status does not change it. `updated_by` and `updated_at` are stored. The audit event stores the session actor, the edit action, `community_id`, the server timestamp, and `before` and `after` for both plate and description. A body `before` or `after` is ignored. An edit of someone else's vehicle is not found. A resident edit of an `on_hold` vehicle is refused and the row stays `on_hold`, including when that session also has admin. An edit of a `removed` vehicle is refused. A description-only edit stores the description and is not a plate change | PAC-023, PAC-027, PAC-101, PAC-062, D-069, D-073 |
| T-4 | A second vehicle for the same resident, on a different plate, is stored. Add does not count that account's vehicles. A second non-removed row for the same plate in the community is refused. A `removed` row does not block a new `active` row for that plate | PAC-020, PAC-024, D-070 |
| T-5 | Pass longer than `per_stay_cap` is refused and absent afterward | PAC-003, PAC-100 |
| T-6 | Pass that breaks the month cap is refused and absent. A pass inside both caps whose window contains now is permission to park and has no stall id. The month total uses the configured window and timezone and still counts a revoked pass that overlaps the window. Unset subject, window, or timezone refuses the create. A session with resident and not admin that sends another account id still stores `for_account` as itself. A patroller session without resident is refused. An admin pass whose named account lacks the resident permission is refused. A later edit of unit or household does not change ids already copied onto an existing pass | PAC-001, PAC-002, PAC-004, PAC-075, PAC-100 |
| T-7 | Missing config refuses the pass and the warning. That includes an unset upload maximum and an unset guest-lookup limit | PAC-100 |
| T-8 | A second pass for the same plate is refused when the first is scheduled or still before its end, and not revoked | PAC-006 |
| T-9 | A pass with `start > now` is not permission to park. At `end`, a read shows `expired` using the server clock, not a client timestamp, and no job has to write that status | PAC-005, PAC-103 |
| T-10 | Plate check returns one payload: the non-removed vehicle or none, including its status, scheduled or current pass or none, and the open warning or none. A plate can have all three. `on_hold` is not mapped to a pass, a warning, or a tow. A `removed` row is not the current registration. Grace already ended still includes that warning until it is closed. "No record" is only the empty payload. The payload has no phone and no photo bytes | PAC-030, PAC-031, PAC-033, PAC-044, Q-020 |
| T-11 | Warning without a stored photo is absent. A non-image or an SVG does not create a warning. Warning with a JPEG, PNG, or WebP sets `grace_ends_at` from config and stores the submitted plate, `warning_reason` `guest_time_exceeded`, and empty `warning_reason_text`. Reason refusals are T-22. A second warning while the first is unclosed is refused. A photo read without a privacy-table role does not return a usable URL | PAC-040, PAC-041, PAC-042, PAC-046, PAC-047, D-076 |
| T-12 | Sign during grace is refused. Sign when server `now >= grace_ends_at` by a signer stores `signed` with no prior `grace_elapsed` write and performs no outbound tow call. A patroller sign is refused. The writing is not served inline | PAC-043, PAC-044, PAC-050, PAC-051, PAC-052, PAC-053, PAC-102 |
| T-13 | Export for community A contains A's rows and photo bytes and no B row. The archive includes a violation's stored plate, `warning_reason`, and `warning_reason_text`, a vehicle edit event's `before` and `after` plate and description, and a notification event with no channel and no wording. An admin read of plate changes is that same audit event where the plate differs, not a second row. An audit row exists for the export. A signer without admin can run it | PAC-060, PAC-061, PAC-062, D-072, D-073, D-076 |
| T-14 | A request authenticated as A, using B's id in the body or the path, is not found. The stored community stays A's | PAC-071, PAC-080, PAC-104 |
| T-15 | On a pass or vehicle request, body `community_id`, actor, `decided_by`, `held_by`, `removed_by`, `before`, `after`, `permissions`, channel, and wording do not change the session's community, the actor stored on the row, or the notification event. A notification event has no channel and no wording. Invite acceptance copies community and permissions from the invite and ignores both on the body. A guest-link read has no session and no actor. The lookup limit is per client address, not per token and not one community-wide counter. An over-limit lookup of a live token returns the same invalid line as an unknown token, and shows no plate | PAC-007, PAC-009, PAC-010, PAC-026, PAC-073, PAC-104 |
| T-16 | A resident can remove their own `active` vehicle. The row remains with status `removed`, `removed_by`, and `removed_at`. That resident removal writes no notification event. They cannot remove someone else's vehicle. A resident cannot remove an `on_hold` vehicle, including when that session also has admin, and the row stays `on_hold`. An admin can remove an `active` or `on_hold` vehicle in the community, which sets `removed` and is not a release of the hold, and each of those removals writes one notification event with action `remove` for that vehicle's resident, with no channel and no wording. A remove does not clear `held_by` or `held_at`. Admin remove does not release the hold. Release is T-21 | PAC-025, PAC-026, D-069, D-072, Q-028 |
| T-17 | A warning stores the submitted plate, the reason code, and, when the code is `other`, the reason text. A later edit of the vehicle that carried that plate appends an audit event with `community_id`, the resident actor, the edit action, the server timestamp, and `before` and `after` plate and description. The violation plate stays the warned plate. A signature copies that violation plate. While the audit events remain, the plate in effect on the vehicle at `warning_at`, taken from the create and edit audit events, equals the violation plate. After those audit events are purged, the violation plate and the authorization plate are unchanged. Those stored plates are the proof. They do not require the audit event | PAC-023, PAC-040, PAC-051, PAC-060, PAC-062, PAC-064, I-14, D-074 |
| T-18 | On one vehicle, the 1st, 2nd, and 3rd plate changes are stored, each with an audit event whose previous plate and new plate differ. The 4th, while those three are still inside the window, is refused: the plate and a description sent with it stay unchanged, the refusal text is "This vehicle has had 3 plate changes in the last 30 days.", and no new plate-change audit event is written. Description-only edits before and after the 3rd change are stored and do not count. Creating the vehicle does not count, so the three changes are all edits. A second vehicle for the same resident can still change its plate. An admin of the community can read all of those plate-change audit events. A resident cannot read the other resident's, and another community's admin cannot. The list is those audit events, not a second record | PAC-027, PAC-062, D-073 |
| T-19 | Three plate changes are stored at server times t, t + 1 day, and t + 2 days. At t + 29 days a 4th plate change is refused. At t + 30 days, when `now - t` is no longer under 30 × 24 hours, the next plate change is stored. The case uses that proposed rolling window and does not use the community timezone. The plate-change events in this case are inside 30 days, and the 365-day purge does not delete them | PAC-027, PAC-064, D-073, D-074, Q-029 |
| T-20 | An audit event whose age is 364 days is still present after the retention job. An audit event whose age is exactly 365 days is still present. An audit event whose age is past 365 days is gone, and no archive copy exists. The job leaves the violation row, its stored plate, the tow-authorization row, its copied plate, and a notification event in place. A plate-change audit event aged 30 days is still present, and it still counts under D-073 | PAC-064, D-074, D-073, I-14 |
| T-21 | A session with resident and not admin cannot release an `on_hold` vehicle. A session with resident and admin cannot release it by the resident edit, and the row stays `on_hold`. That same session can release it by the admin action. A patroller is refused. A signer without admin is refused. An admin release sets `active`, leaves `held_by` and `held_at`, and writes an audit event with that admin, the server time, `before` `on_hold`, `after` `active`, and the optional reason, including when the reason is empty. It writes no notification event. Release of an `active` or `removed` vehicle is refused. After the admin release, the vehicle's resident can edit the description and can remove the vehicle. The resulting status `active` is the one D-069's resident edits require | PAC-028, PAC-023, PAC-025, D-075, D-069, Q-032 |
| T-22 | A warning with no `warning_reason`, an empty `warning_reason`, or an unknown code is refused, no warning row is stored, and the error is "Choose a warning reason." Each code in the PAC-047 table other than `other`, sent with no text or with only spaces, is accepted and stores that code and empty `warning_reason_text`. `other` with non-empty text is accepted and stores that text with outer spaces removed. `other` with empty text, or text that is only spaces, is refused, no row is stored, and the error is "Describe this warning." A code other than `other` sent with non-empty text is refused, no row is stored, and the error is "A note is only allowed when the reason is Other." Closing still requires `close_reason` as free text and does not check it against this list. The codes and labels are the proposed list | PAC-040, PAC-045, PAC-047, D-076 |

T-1 locks D-067: a resident add stores `active` and ignores a status on the body. It is in the minimum because the current UI writes the client's status (VERIFIED). T-16 locks the remove half of the same decision, the D-069 refusal while `on_hold`, and the D-072 notice on an admin removal only. T-2 locks the same notice on hold. T-17 locks the warned plate after a later edit. T-4 locks D-070: a second vehicle for the same resident is stored. T-18 and T-19 lock D-073: the 3rd plate change is allowed, the 4th is refused, the count is per vehicle, description-only edits do not count, and the oldest change drops out at 30 days under the proposed window. Admins see those changes on the audit events. T-20 locks D-074: 364 days and exactly 365 days are kept, and past 365 days is purged. T-17 locks that the warned plate stays on the violation after that purge. T-19 locks that the 30-day plate-change count does not lose an event to that purge. T-21 locks D-075: a resident and a patroller cannot release a hold, an admin can, and the vehicle is resident-editable again. T-22 locks D-076: an empty warning reason is refused, each proposed code is accepted, Other with empty text is refused, and text on any other code is refused. The codes and labels stay PROPOSED. None of these cases asserts a notification channel or wording, a notice on release, a further abuse control, or a retention period for violations and tow authorizations (Q-028, Q-032, Q-030, Q-031). T-19 does not decide Q-029. It locks the proposed rolling window.

## 6. Prototype check, not the pilot suite

Until the pilot exists, a change to the mock can still be looked at by hand: five routes load, a resident save still writes, a reload restores the seed. That walkthrough does not pass T-1 through T-22. Do not record it as pilot evidence.

`npm run build` on Node 24 matches the Pages workflow (VERIFIED). Run it for mock changes. It is not a substitute for section 5.

## 7. Questions

Q-002 changes T-6's fixture once the cap subject, window, and timezone are chosen. Q-007 changes T-11 if photos become optional. S-2 is D-067, so T-1, T-2, T-3, and T-16 lock an accepted rule. Q-013 still covers S-1 and S-3 through S-6. Q-019 decides how T-14 obtains a session, and it is tied to Q-028. Decisions are in `PRD.md` section 11.1. Q-021 is resolved by D-069, so T-3 and T-16 lock that a resident cannot edit or remove an `on_hold` vehicle. Q-022 is resolved by D-070, so T-4 stores a second vehicle for the same resident and still refuses a second current row for one plate. Q-023 is resolved by D-073, so T-18 and T-19 lock 3 plate changes per vehicle per 30 days. Q-029 leaves the window as the proposed rolling 30 × 24 hours. Q-030 adds no case, because no further abuse control is a requirement. Q-025 is resolved by D-074, so T-20 keeps an audit event at 364 days and at exactly 365 days, and purges one past 365 days. Q-031 adds no retention number for violations or tow authorizations. Q-024 is resolved by D-072, so T-2 and T-16 lock the notification event and do not lock a channel or wording (Q-028). Q-026 is resolved by D-075, so T-21 refuses a resident release and a patroller release, stores `active` on an admin release, and then allows the resident edit. The `active` target is derived from D-069. Q-032 adds no release notice. Q-027 is resolved by D-076, so T-22 refuses an empty reason, accepts each proposed code, refuses Other with empty text, and refuses text on any code other than Other. T-11 still locks the photo rule and files one warning with `guest_time_exceeded`.

**Q-020, for Henry.** What does "on hold" mean for a plate check and for enforcement? Does a held vehicle count as registered, or not? Can a patroller file a warning on it? Can it be towed? What does the patroller see? One option is to treat the held vehicle as registered. Another is to treat it as not registered. The current safe default, until Henry answers: the plate check shows the status `on_hold`. Hold is not permission to park, not a warning, and not a tow. The plate check does not map `on_hold` to any of those. The same paragraph is in `PRD.md` section 11.2. Q-020 changes vehicle fixtures when answered. T-2 and T-10 do not assert an enforcement meaning for `on_hold`. T-16 does not treat admin remove as a release. T-7 checks that an unset upload maximum or guest-lookup limit refuses the action. It does not pick the number.
