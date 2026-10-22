# Zonr technical design — pilot

Code baseline: `main` `99d283e` (VERIFIED). Pilot behavior: `FRD.md`. This file is the record shape. It is PROPOSED. It is not a deployed service. Success criteria that depend on it are UNAPPROVED (`PRD.md` section 4).

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. Statute text is UNKNOWN and is not designed here. Route it to RADAR.

## 1. Purpose

Define the records, the states, the transitions, the invariants, the failures, and the permissions for the pilot, including the tenancy principle that is in the schema and not in the product surface.

## 2. Scope

### 2.1 In the pilot design

`Community`, `CommunityConfig`, `Account`, `GuestPass`, `Vehicle`, `Violation`, `ViolationPhoto`, `TowAuthorization`, `AuditEvent`. Files for photos and for the signed writing, keyed by `community_id`.

### 2.2 Not in the pilot build

A second community's UI, payments, cameras, property-system sync, numbered-spot geometry, and any client of a tow vendor (approved scope). The mock's module store (`src/services/mockApi.ts`) is the prototype only (VERIFIED). The pilot replaces that seam. It does not extend `tow-dispatched`.

## 3. Success

The schema can hold the pilot community and a second id without a migration of column meanings (PROPOSED, UNAPPROVED, S-6). Permission checks match `FRD.md` PAC-020 through PAC-072.

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| Choose a cloud vendor | UNKNOWN. Not required to freeze the records |
| Treat RADAR's regulatory scan as a validation routine | The 2026-10-22 brief exists on Henry's Drive (VERIFIED that the file is there). Its legal summaries are not product rules. Q-016 stays UNKNOWN |
| Store 75 stall rows | Spots are unnumbered. A count may sit on the community profile (Q-015) |

## 5. Records

Every row has `id` and `community_id`. Ids are unique. `community_id` is required (PAC-080). Plates are uppercase with outer spaces removed (PAC-001).

| Record | Fields | Notes |
| --- | --- | --- |
| Community | `id`, name, region text, home count, guest-spot count | Profile only. Name and counts are data (Q-015). Not used as branch logic |
| CommunityConfig | `community_id`, `per_stay_cap`, `per_month_cap`, `month_cap_subject`, `grace_period`, guest-rule text | One row per community. Missing row fails closed |
| Account | `community_id`, person, permissions (`resident`, `patroller`, `admin`, `signer`) | A person may hold more than one permission (Q-014). No account is the tow company |
| GuestPass | `community_id`, plate, issuer account, start, end, status, optional phone | Phone is present only if Q-008 says to keep it. No stall id |
| Vehicle | `community_id`, resident account, plate, description, status, decided_by, decided_at | `decided_by` is an admin on approval, rejection, or revocation |
| Violation | `community_id`, plate, status, warning_at, grace_ends_at, filed_by, closed_by, close_reason | First status after a successful create is `warning` |
| ViolationPhoto | `community_id`, violation id, file key, content type | At least one for a warning (Q-007) |
| TowAuthorization | `community_id`, violation id, plate, status, signer account, signed_at, artifact key, void_reason, voided_by | Artifact is the writing the signer uploaded. The product does not parse the statute |
| AuditEvent | `community_id`, actor, action, entity type, entity id, at | Append only (PAC-063) |
| GuestLink | `community_id`, pass id, token hash, expires_at | Raw token is shown once. Lookup uses the hash |

`month_cap_subject` is an enum whose allowed values are decided by Q-002. Until then the column exists and creates are refused when it is unset (PROPOSED).

## 6. States and transitions

### 6.1 Guest pass

| From | To | Who or what | Guard |
| --- | --- | --- | --- |
| — | `active` | Resident or admin (Q-003) | Caps, one active plate, config present (PAC-003, PAC-004, PAC-006) |
| `active` | `expired` | Server clock | `now >= end` (PAC-005, PAC-103) |
| `active` | `revoked` | Issuer or admin (Q-003) | Actor recorded (PAC-007) |

No transition creates a violation.

### 6.2 Vehicle

| From | To | Who | Guard |
| --- | --- | --- | --- |
| — | `pending_review` | Resident or admin | Status in the body is ignored (PAC-020, PAC-101) |
| `pending_review` | `approved` | Admin only | No other approved row for that plate (PAC-021, PAC-024) |
| `pending_review` | `rejected` | Admin only | Row kept |
| `approved` | `pending_review` | Resident edit | Prior approval ceases (PAC-023) |
| `approved` | `revoked` | Admin | Row kept (PAC-025) |

There is no resident edge into `approved`. That is the fix for the self-approve gap (VERIFIED in the mock; PAC-020).

### 6.3 Violation

| From | To | Who or what | Guard |
| --- | --- | --- | --- |
| — | `warning` | Patroller or admin | At least one photo stored; grace configured (PAC-040, PAC-041, PAC-042) |
| `warning` | `grace_elapsed` | Server clock | `now >= grace_ends_at` |
| `warning` or `grace_elapsed` | `closed` | Filer or admin | Reason required (PAC-045) |

`grace_elapsed` is not a tow. It only unlocks PAC-050.

### 6.4 Tow authorization

| From | To | Who | Guard |
| --- | --- | --- | --- |
| — | `draft` | Signer | Linked violation is `grace_elapsed` and same community (PAC-050) |
| `draft` | `signed` | Signer | Artifact stored. No outbound call (PAC-051, PAC-052) |
| `signed` | `voided` | Signer or admin | Reason required. Artifact kept (PAC-054) |

A void does not delete the warning.

## 7. Invariants

| Id | Invariant | Label |
| --- | --- | --- |
| I-1 | Every row's `community_id` references a community | PROPOSED |
| I-2 | A session's community filter is applied on every read and write | PROPOSED |
| I-3 | One `active` pass per plate per community | PROPOSED (Q-004) |
| I-4 | Pass duration is within `per_stay_cap`, and the month total for `month_cap_subject` is within `per_month_cap` | PROPOSED |
| I-5 | One `approved` vehicle per plate per community | PROPOSED |
| I-6 | `approved` is written only with an admin `decided_by` | PROPOSED |
| I-7 | A warning has at least one photo and a `grace_ends_at` | PROPOSED |
| I-8 | A `signed` authorization points at a violation that was already `grace_elapsed` at sign time | PROPOSED. Whether the statute requires this sequence is UNKNOWN (Q-016). The product rule is PROPOSED |
| I-9 | Sign, void, and export do not perform network calls to a tow vendor | PROPOSED |
| I-10 | Audit rows are not updated or deleted by the application | PROPOSED |
| I-11 | No column or constant is a person's name used as a permission | PROPOSED |
| I-12 | Guest-spot count is not a foreign key from a pass | PROPOSED |

## 8. Privacy and retention

California privacy law applicability is UNKNOWN. Do not pick a statute or a retention number here. RADAR, then Henry (Q-011).

| Data | Who can read it in the pilot design | Retention |
| --- | --- | --- |
| Plate on a pass, vehicle, violation, or authorization | Resident: own vehicles and own passes. Patroller: plate-check result and violations they need to file. Admin and signer: their community. Guest link: the one plate on that pass | UNKNOWN. PROPOSED: keep through the dispute window, then delete or irreversibly tokenize. The window is not chosen |
| Photos | Admin, signer, and the filing patroller. Not on the guest link. Not in the plate-check payload (PAC-031) | UNKNOWN. Same gate as plates. Export includes them while they are retained (PAC-060) |
| Phone | Only if Q-008 keeps the field. PROPOSED: issuing resident and admin. Not patroller, not guest link, not other residents | UNKNOWN |
| Audit | Admin and signer via export. Not a public page | UNKNOWN. PROPOSED: at least as long as the records they describe |

The public Pages site shows the seed, including phones, to anyone (VERIFIED, `seed.ts` and the Pages URL). That site is not the pilot store. Pilot photos and plates do not go on that site (PROPOSED).

## 9. Failure behavior

| Condition | Result | Label |
| --- | --- | --- |
| Config row missing, or cap or grace null | Refuse the create or the warning. No default of zero | PROPOSED, PAC-100 |
| Photo upload fails | No `warning` row | PROPOSED |
| Resident sends `status: approved` | Ignore the field. Persist `pending_review` | PROPOSED, PAC-101 |
| Sign before grace ends, or caller is not a signer | Refuse. No artifact is marked signed. No outbound call | PROPOSED, PAC-102 |
| Client sends its own timestamp as "now" | Ignore it. Use the server clock | PROPOSED, PAC-103 |
| Id from another community | Not found. Same response as a missing id | PROPOSED, PAC-071 |
| Export fails midway | Do not publish a partial archive as complete. Audit the failure | PROPOSED |

The mock cannot reject a read (VERIFIED). The pilot can. The UI needs an error state the mock does not have. That screen is in `UX_DESIGN_SPEC.md`.

## 10. Permissions

| Action | Resident | Patroller | Admin | Signer | Guest link | Tow company |
| --- | --- | --- | --- | --- | --- | --- |
| Create pass | PROPOSED yes | No | Yes | No | No | No account |
| Revoke own pass | PROPOSED yes | No | Yes | No | No | — |
| Submit vehicle | Yes | No | Yes | No | No | — |
| Approve or reject vehicle | No | No | Yes | No | No | — |
| Plate check | No | Yes | Yes | No | No | — |
| File warning with photos | No | Yes | Yes | No | No | — |
| Sign authorization | No | No | Only with signer permission | Yes | No | — |
| Export community | No | No | Yes | Yes | No | — |
| Edit config | No | No | Yes | No | No | — |

Signer is a permission, not a hardcoded seat (I-11). The tow company is absent, not a denied role with a login.

## 11. What the prototype seam implies

VERIFIED: the UI calls `fetchDashboard`, `createGuestSession`, `updatePermit`, `assignSpot`, and `createViolation` in `mockApi.ts`. The pilot does not reuse `assignSpot` (numbered spots are out). It does not reuse a violation action enum that includes `tow-dispatched`. A new client replaces that module. The five-function list is not the pilot API.

## 12. Questions

Q-001, Q-002, Q-004, Q-005, Q-007, Q-008, Q-010, Q-011, Q-014, Q-015, Q-016, and Q-018. Vendor choice stays UNKNOWN until a build is approved. This file does not make that choice.
