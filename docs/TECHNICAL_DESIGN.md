# Zonr technical design — pilot

Code baseline: `main` `99d283e` (VERIFIED). Pilot behavior: `FRD.md`. This file is the record shape. It is PROPOSED. It is not a deployed service. Success criteria that depend on it are UNAPPROVED (`PRD.md` section 4).

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. Statute text is UNKNOWN and is not designed here. Route it to RADAR.

## 1. Purpose

Define the records, the states, the transitions, the invariants, the failures, and the permissions for the pilot, including the tenancy principle that is in the schema and not in the product surface.

## 2. Scope

### 2.1 In the pilot design

`Community`, `CommunityConfig`, `Account`, `Session`, `Invite`, `GuestPass`, `Vehicle`, `Violation`, `ViolationPhoto`, `TowAuthorization`, `AuditEvent`, `GuestLink`. Files for photos and for the signed writing, keyed by `community_id`, private.

### 2.2 Not in the pilot build

A second community's UI, payments, cameras, property-system sync, numbered-spot geometry, deletion or tokenization of a community, and any client of a tow vendor (approved scope, plus `PRD.md` section 8). The mock's module store (`src/services/mockApi.ts`) is the prototype only (VERIFIED). The pilot replaces that seam. It does not extend `tow-dispatched`.

## 3. Success

The schema can hold the pilot community and a second id without a migration of column meanings (PROPOSED, UNAPPROVED, S-6). Permission checks match the PAC ids in `FRD.md`.

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| Choose a cloud vendor or a login vendor | UNKNOWN (Q-019). Not required to freeze the records |
| Treat RADAR's regulatory scan as a validation routine | The 2026-10-22 brief exists on Henry's Drive (VERIFIED that the file is there). Its legal summaries are not product rules. Q-016 stays UNKNOWN |
| Store 75 stall rows | Spots are unnumbered. A count may sit on the community profile (Q-015) |
| A delete API | The retention window is not chosen (Q-011) |

## 5. Records

Every row has `id` and `community_id`. Ids are unique. `community_id` is required (PAC-080). Plates are uppercase with outer spaces removed (PAC-001). On the requests PAC-104 names, authority fields are not taken from the client. Guest-link read, invite acceptance, and the operator bootstrap are the exceptions in I-2.

| Record | Fields | Notes |
| --- | --- | --- |
| Community | `id`, name, region text, home count, guest-spot count | Profile only. Name and counts are data (Q-015). Not used as branch logic |
| CommunityConfig | `community_id`, `per_stay_cap`, `per_month_cap`, `month_cap_subject`, `month_window`, `timezone`, `grace_period`, `max_upload_bytes`, `guest_lookup_limit`, guest-rule text | One row per community. Missing row, or a null cap, subject, window, timezone, grace, upload maximum, or lookup limit, fails closed |
| Account | `community_id`, person, `unit`, `household_id`, permissions (`resident`, `patroller`, `admin`, `signer`) | A person may hold more than one permission (Q-014). No account is the tow company. On the requests PAC-104 names, permissions in the body are ignored. A resident's `unit` and `household_id` are written from the invite at acceptance (PAC-073), not from the vehicle form. An admin may correct those two fields on the resident account. Credential material, if Q-019 needs any, is not a column the pass or vehicle APIs accept |
| Session | `account_id`, `community_id`, `expires_at` | Server-created after the method in Q-019 succeeds. It identifies the account and the community. The server reads permissions from that account. The client does not insert the session or send those fields |
| Invite | `community_id`, permissions, `unit`, `household_id`, `expires_at`, token hash | Created by an admin session. The community is copied from that session. Permissions are the allow-list in PAC-073, not the admin's own set. `unit` and `household_id` are required when `resident` is on that list. The token is at least 128 bits, stored only as a hash, and shown once. Accepting it creates an account in that community only. The accepter cannot send community, permissions, unit, or household |
| GuestPass | `community_id`, plate, issuer account, `for_account`, `unit`, `household_id`, start, end, status, optional phone | `for_account` is the resident the pass is for. `unit` and `household_id` are copied from that account at create time, not from an admin issuer. Phone is present only if Q-008 says to keep it. No stall id. Status stored: `scheduled`, `active`, or `revoked`. `expired` is derived |
| Vehicle | `community_id`, resident account, `unit`, plate, description, status, decided_by, decided_at | `unit` is copied from the resident account. The submit form does not collect it. `decided_by` is the admin session on approval, rejection, or revocation. A body `decided_by` is ignored |
| Violation | `community_id`, plate, status, warning_at, grace_ends_at, filed_by, closed_by, close_reason | Stored status is `warning` or `closed`. Grace elapsed is derived from `grace_ends_at`. It is not a status a job must write |
| ViolationPhoto | `community_id`, violation id, file key, content type | Content type is the type the server detected. At least one JPEG, PNG, or WebP for a warning (PAC-041, Q-007) |
| TowAuthorization | `community_id`, violation id, plate, status, signer account, signed_at, artifact key, content type, void_reason, voided_by, voided_at | Artifact is the writing the signer uploaded. The product does not parse the statute. Content type is server-detected |
| AuditEvent | `community_id`, actor, action, entity type, entity id, at | Actor is the session account when a session exists. Bootstrap has no person-named actor (PAC-062). Append only (PAC-063) |
| GuestLink | `community_id`, pass id, token hash, expires_at | `expires_at` equals the pass end (PAC-009). Raw token is shown once and is at least 128 bits. Lookup uses the hash (PAC-010) |

`month_cap_subject` is an enum of plate, household, or unit (Q-002). `month_window` is an enum of calendar month or rolling period. `timezone` is an IANA name stored as data. Until those are set, the columns exist and creates are refused (PROPOSED). The pilot does not hardcode a California zone. The mock's permit `unit` and guest `hostUnit` are strings (VERIFIED, `src/types.ts`). They are not `household_id`.

The month total counts stored passes whose interval overlaps the window, in any of `scheduled`, `active`, derived `expired`, or `revoked` (PROPOSED, Q-002). If the subject is household or unit and `for_account` has no such id, the create is refused. An admin issuer's own ids are not the cap subject.

## 6. States and transitions

Clocks in this section are the server clock (PAC-103). No transition below is a tow dispatch.

### 6.1 Guest pass

| From | To | Who or what | Guard |
| --- | --- | --- | --- |
| — | `scheduled` | Resident or admin (Q-003) | `start > now`. Caps against `for_account`, config, and PAC-006 |
| — | `active` | Resident or admin (Q-003) | `start <= now < end`. Same guards |
| `scheduled` or `active` | `expired` | Read-time comparison | `now >= end`. Not a background job. Not permission (PAC-005) |
| `scheduled` or `active` | `revoked` | Issuer, or an admin for any pass in the community (Q-003) | Session actor recorded (PAC-007) |

A read treats a stored `scheduled` or `active` row as permission only when `start <= now < end`. When a `scheduled` row enters that window, the read treats it as `active` without a writer. No transition creates a violation.

### 6.2 Vehicle

| From | To | Who | Guard |
| --- | --- | --- | --- |
| — | `pending_review` | Resident or admin | Status in the body is ignored (PAC-020, PAC-101) |
| `pending_review` | `approved` | Admin only | No other approved row for that plate. `decided_by` is the session (PAC-021, PAC-024) |
| `pending_review` | `rejected` | Admin only | Row kept |
| `approved` | `pending_review` | Resident edit | Prior approval ceases (PAC-023) |
| `approved` | `revoked` | Admin | Row kept (PAC-025) |

There is no resident edge into `approved`. That is the fix for the self-approve gap (VERIFIED in the mock; PAC-020).

### 6.3 Violation

| From | To | Who or what | Guard |
| --- | --- | --- | --- |
| — | `warning` | Patroller or admin | No other unclosed warning for that plate. Photo rules met. Grace configured (PAC-040, PAC-041, PAC-042, PAC-046) |
| `warning` | `closed` | Filer or admin | Reason required (PAC-045) |

Grace has ended when the stored status is `warning` and `now >= grace_ends_at`. That is a read-time comparison. It is not a stored `grace_elapsed` state and not a job. It unlocks PAC-050. It does not hide the warning on plate check (PAC-030, PAC-044).

### 6.4 Tow authorization

| From | To | Who | Guard |
| --- | --- | --- | --- |
| — | `draft` | Signer | Same community, warning not closed, `now >= grace_ends_at` (PAC-050) |
| `draft` | `signed` | Signer | Artifact stored under PAC-051. No outbound call (PAC-052) |
| `signed` | `voided` | Signer or admin | Reason required. Session actor stored. Artifact kept (PAC-054) |

A void does not delete the warning.

## 7. Invariants

| Id | Invariant | Label |
| --- | --- | --- |
| I-1 | Every row's `community_id` references a community | PROPOSED |
| I-2 | Pass, vehicle, violation, authorization, export, and config reads and writes take `community_id` and actor from the server session, and permissions from the account that session identifies. Body copies are ignored. Three flows have no session: a guest-link read (token hash, no actor), invite acceptance (token hash; community, permissions, unit, and household copied from the invite; the accepter cannot send them), and the operator bootstrap (out of band, one community, audited) | PROPOSED |
| I-3 | One pass per plate per community that is not revoked and has `now < end`, whether or not it has started. Permission to park is only the in-window case | PROPOSED (Q-004, PAC-005, PAC-006) |
| I-4 | Pass duration is within `per_stay_cap`. The month total uses `month_window` and `timezone`, for `month_cap_subject`, and counts overlapping passes in any of scheduled, active, expired, or revoked | PROPOSED (Q-002) |
| I-5 | One `approved` vehicle per plate per community | PROPOSED |
| I-6 | `approved` is written only with `decided_by` set from an admin session | PROPOSED |
| I-7 | A warning has at least one private photo and a `grace_ends_at` | PROPOSED |
| I-8 | A `signed` authorization points at a warning where `grace_ends_at <= signed_at`, and the warning was not closed at sign time | PROPOSED. Whether the statute requires this sequence is UNKNOWN (Q-016). The product rule is PROPOSED |
| I-9 | Sign, void, and export do not perform network calls to a tow vendor | PROPOSED |
| I-10 | Audit rows are not updated or deleted by the application | PROPOSED |
| I-11 | No column or constant names a person, including Henry, or encodes a committee-member-specific exception. Signer is a permission | PROPOSED |
| I-12 | Guest-spot count is not a foreign key from a pass | PROPOSED |
| I-13 | Photo and authorization bytes are private objects. The storage key is not a public URL. A read checks the privacy table, then uses a short-lived URL and the server's content type | PROPOSED |

## 8. Privacy and retention

California privacy law applicability is UNKNOWN. Do not pick a statute or a retention number here. RADAR, then Henry (Q-011). Deletion and tokenization are not a pilot feature. The table says who can read data while it is kept. It does not add a delete screen.

| Data | Who can read it in the pilot design | Retention |
| --- | --- | --- |
| Plate on a pass, vehicle, violation, or authorization | Resident: own vehicles and own passes. Patroller: plate-check result and violations they need to file. Admin and signer: their community. Guest link: the one plate on that pass, and only while the link is live under PAC-009 | UNKNOWN. PROPOSED later, not in this build: keep through the dispute window, then delete or irreversibly tokenize. The window is not chosen |
| Photos | Admin, signer, and the filing patroller, through the short-lived URL in PAC-041. Not on the guest link. Not in the plate-check payload (PAC-031) | UNKNOWN. Same later gate as plates. Export includes the bytes while they are retained (PAC-060) |
| Authorization file | Admin and signer, `Content-Disposition: attachment` (PAC-051). Not on the guest link. Not in the plate-check payload | UNKNOWN. Same later gate |
| Phone | Only if Q-008 keeps the field. PROPOSED: issuing resident and admin. Not patroller, not guest link, not other residents | UNKNOWN |
| Audit | Admin and signer via export. Not a public page | UNKNOWN. PROPOSED: at least as long as the records they describe |

The public Pages site shows the seed, including phones, to anyone (VERIFIED, `seed.ts` and the Pages URL). That site is not the pilot store. Pilot photos and plates do not go on that site (PROPOSED).

## 9. Failure behavior

| Condition | Result | Label |
| --- | --- | --- |
| Config row missing, or cap, grace, month subject, month window, timezone, upload maximum, or guest-lookup limit null | Refuse the create, the warning, or the guest lookup. No default of zero and no California timezone default | PROPOSED, PAC-100 |
| Photo or writing type, size, or upload fails | No `warning` row, or no `signed` row. The client content type is not stored | PROPOSED, PAC-041, PAC-051 |
| Resident sends `status: approved` | Ignore the field. Persist `pending_review` | PROPOSED, PAC-101 |
| Body sends `community_id`, actor, `decided_by`, or `permissions` on a pass, vehicle, violation, authorization, export, or config request | Ignore them. Use the session. No session: refuse | PROPOSED, PAC-104 |
| Guest-link read or invite acceptance sends `community_id` or permissions | Ignore them. Guest link uses the token hash and has no actor. Invite acceptance copies community and permissions from the invite row | PROPOSED, I-2, PAC-073 |
| Sign before grace ends, warning closed, or caller is not a signer | Refuse. No artifact is marked signed. No outbound call. Do not wait for a `grace_elapsed` write | PROPOSED, PAC-102 |
| Client sends its own timestamp as "now" | Ignore it. Use the server clock | PROPOSED, PAC-103 |
| Id from another community | Not found. Same response as a missing id | PROPOSED, PAC-071 |
| Unknown, revoked, expired-pass, or expired-link guest token, or a lookup over the rate limit | One line, "this link is not valid." No plate | PROPOSED, PAC-009, PAC-010 |
| Export fails midway | Do not publish a partial archive as complete. Audit the failure | PROPOSED |
| Second unclosed warning for the plate | Refuse. The first warning remains | PROPOSED, PAC-046 |

The mock cannot reject a read (VERIFIED). `updatePermit` copies the request onto the permit (VERIFIED, `src/services/mockApi.ts`). The pilot does not copy that pattern. The UI needs an error state the mock does not have. That screen is in `UX_DESIGN_SPEC.md`.

## 10. Permissions

This table is the source of truth. A screen that omits a control for a Yes cell is incomplete. A screen that offers a control for a No cell is wrong.

| Action | Resident | Patroller | Admin | Signer | Guest link | Tow company |
| --- | --- | --- | --- | --- | --- | --- |
| Create pass | PROPOSED yes | No | Yes | No | No | No account |
| Revoke a pass | Only a pass they issued | No | Any pass in the community | No | No | — |
| Submit vehicle | Yes | No | Yes | No | No | — |
| Approve or reject vehicle | No | No | Yes | No | No | — |
| Revoke vehicle | No | No | Yes | No | No | — |
| Plate check | No | Yes | Yes | No | No | — |
| File warning with photos | No | Yes | Yes | No | No | — |
| Close violation | No | Only one they filed | Yes | No | No | — |
| Sign authorization | No | No | Only with signer permission | Yes | No | — |
| Void authorization | No | No | Yes | Yes | No | — |
| Export community | No | No | Yes | Yes | No | — |
| Edit config | No | No | Yes | No | No | — |
| Invite an account | No | No | Yes. Allow-list: resident, patroller, admin, signer (PAC-073) | No | No | — |

Signer is a permission, not a hardcoded seat (I-11). Admin does not imply signer (PAC-022). The tow company is absent, not a denied role with a login. The first admin is the operator bootstrap in PAC-073, not an invite. A later admin or a signer is granted by that allow-list, which does not copy the inviting admin's permissions.

## 11. What the prototype seam implies

VERIFIED: the UI calls `fetchDashboard`, `createGuestSession`, `updatePermit`, `assignSpot`, and `createViolation` in `mockApi.ts`. `createGuestSession` assigns the first open numbered spot in the zone. The React state assigns every open spot in that zone. The pilot does not reuse `assignSpot` or that guest-create assignment (numbered spots are out, PAC-008). It does not reuse a violation action enum that includes `tow-dispatched`. A new client replaces that module. The five-function list is not the pilot API.

## 12. Questions

Q-001, Q-002, Q-003, Q-004, Q-005, Q-007, Q-008, Q-009, Q-010, Q-011, Q-014, Q-015, Q-016, Q-018, and Q-019. Vendor choice and the login method stay UNKNOWN until Henry answers Q-019. This file does not make that choice.
