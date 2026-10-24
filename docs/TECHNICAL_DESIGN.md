# Zonr technical design — pilot

Code baseline: `main` `99d283e` (VERIFIED). Pilot behavior: `FRD.md`. This file is the record shape. It is PROPOSED except where D-067, D-069, D-070, D-071, D-072, D-073, D-074, and D-075 decide the vehicle rule, D-076 decides the warning reason, and D-077 decides the plate check of a held vehicle. It is not a deployed service. Success criteria other than S-2 are UNAPPROVED (`PRD.md` section 4).

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. Statute text is UNKNOWN and is not designed here. Route it to RADAR.

## 1. Purpose

Define the records, the states, the transitions, the invariants, the failures, and the permissions for the pilot, including the tenancy principle that is in the schema and not in the product surface.

## 2. Scope

### 2.1 In the pilot design

`Community`, `CommunityConfig`, `Account`, `Session`, `Invite`, `GuestPass`, `Vehicle`, `Violation`, `ViolationPhoto`, `TowAuthorization`, `AuditEvent`, `Notification`, `GuestLink`. Files for photos and for the signed writing, keyed by `community_id`, private.

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
| A delete API for plates, photos, or phones | That retention window is not chosen (Q-011). The audit purge is a job, not this API (D-074) |

## 5. Records

Every row has `id` and `community_id`. Ids are unique. `community_id` is required (PAC-080). Plates are uppercase with outer spaces removed (PAC-001). On the requests PAC-104 names, authority fields are not taken from the client. Guest-link read, invite acceptance, and the operator bootstrap are the exceptions in I-2.

| Record | Fields | Notes |
| --- | --- | --- |
| Community | `id`, name, region text, home count, guest-spot count | Profile only. Name and counts are data (Q-015). Not used as branch logic |
| CommunityConfig | `community_id`, `per_stay_cap`, `per_month_cap`, `month_cap_subject`, `month_window`, `timezone`, `grace_period`, `max_upload_bytes`, `guest_lookup_limit`, guest-rule text | One row per community. Missing row, or a null cap, subject, window, timezone, grace, upload maximum, or lookup limit, fails closed. No column counts a resident's vehicles (D-070). The plate-change limit is D-073, not a column on this row |
| Account | `community_id`, person, `unit`, `household_id`, permissions (`resident`, `patroller`, `admin`, `signer`) | A person may hold more than one permission (Q-014). No account is the tow company. On the requests PAC-104 names, permissions in the body are ignored. A resident's `unit` and `household_id` are written from the invite at acceptance (PAC-073), not from a pass or vehicle body. An admin correction (PAC-075) changes the account and later passes only. Credential material, if Q-019 needs any, is not a column the pass or vehicle APIs accept |
| Session | `account_id`, `community_id`, `expires_at` | Server-created after the method in Q-019 succeeds. It identifies the account and the community. The server reads permissions from that account. The client does not insert the session or send those fields |
| Invite | `community_id`, permissions, `unit`, `household_id`, `expires_at`, token hash | Created by an admin session. The community is copied from that session. Permissions are the allow-list in PAC-073, not the admin's own set. `unit` and `household_id` are required when `resident` is on that list. The token is at least 128 bits, stored only as a hash, and shown once. Accepting it creates an account in that community only. The accepter cannot send community, permissions, unit, or household |
| GuestPass | `community_id`, plate, issuer account, `for_account`, `unit`, `household_id`, start, end, status, optional phone | `for_account` is the resident the pass is for. Resident and not admin: the session account, and a body value is ignored. Admin, including an admin who also has resident: the named account, which must have the resident permission in this community. Neither resident nor admin: the create is refused. `unit` and `household_id` are copied from `for_account`. Body copies of those two fields are ignored. Phone is present only if Q-008 says to keep it. No stall id. Status stored: `scheduled`, `active`, or `revoked`. `expired` is derived |
| Vehicle | `community_id`, resident account, `unit`, plate, description, status (`active`, `on_hold`, `removed`), `created_by`, `created_at`, `updated_by`, `updated_at`, `held_by`, `held_at`, `removed_by`, `removed_at` | The resident account is the session, and only a session with resident may add, including when that session also has admin (PAC-020, D-067). Admin does not name another account. `unit` is copied from that account. A body `unit` or `household_id` is ignored. Actor and time columns are the session and the server clock for that transition. A body `decided_by`, `held_by`, or `removed_by` is ignored (PAC-104). There is no `decided_by` column. `held_by` and `held_at` stay after a later remove. Status names and these audit columns are PROPOSED names for the transitions D-067 requires. No column counts how many vehicles the account has. Add does not refuse because the account already has vehicles (D-070) |
| Violation | `community_id`, plate, `warning_reason`, `warning_reason_text`, status, warning_at, grace_ends_at, filed_by, closed_by, close_reason | Stored status is `warning` or `closed`. Grace elapsed is derived from `grace_ends_at`. It is not a status a job must write. `warning_reason` is a required code from the list in PAC-047 (D-076). `warning_reason_text` is required only when that code is `other`, and is empty for every other code. An empty or unknown code, `other` with empty text, and text on any other code are refused and no row is stored. The codes and labels are PROPOSED. A photo is still required (Q-007). `close_reason` is a different field, is required to close, and is not that list (PAC-045). `plate` is the submitted plate, uppercased, with outer spaces removed. It is the plate as recorded at filing. The row has no vehicle id. A later vehicle edit does not change this plate |
| ViolationPhoto | `community_id`, violation id, file key, content type | Content type is the type the server detected. At least one JPEG, PNG, or WebP for a warning (PAC-041, Q-007) |
| TowAuthorization | `community_id`, violation id, plate, status, signer account, signed_at, artifact key, content type, void_reason, voided_by, voided_at | Artifact is the writing the signer uploaded. The product does not parse the statute. Content type is server-detected. `plate` is copied from the violation's stored plate at sign time and is not read from the vehicle's current plate. A later vehicle edit does not change it |
| AuditEvent | `community_id`, actor, action, entity type, entity id, `at`, `before`, `after`, optional reason | Actor is the session account when a session exists. A release stores the optional reason here and may leave it empty (D-075). Other events leave the reason empty. Bootstrap has no person-named actor (PAC-062). `at` is the server timestamp. `before` and `after` are the values that action changed. A body `before` or `after` is ignored. Append only (PAC-063). Entity type and entity id name the row. On a vehicle create, `before` is empty and `after` holds the plate and description. On a resident plate or description edit, both `before` and `after` hold the plate and description, including a field the edit left unchanged (PAC-023). A plate change is one of these edit events whose normalized plate differs. Admins see all plate changes by reading these events (D-073). There is no second plate-change record. The row stays until its age is past 365 days, then the job in PAC-064 deletes it (D-074). It is not archived |
| Notification | `community_id`, vehicle id, resident account, action (`hold` or `remove`), actor, `at` | Written when an admin hold or an admin removal succeeds (D-072, PAC-026). The resident account is the vehicle's. The actor is the admin session. `at` is the server clock. A resident's own removal does not write one. There is no channel column and no wording column (Q-028) |
| GuestLink | `community_id`, pass id, token hash, expires_at | `expires_at` equals the pass end (PAC-009). Raw token is shown once and is at least 128 bits. Lookup uses the hash (PAC-010) |

`month_cap_subject` is an enum of plate, household, or unit (Q-002). `month_window` is an enum of calendar month or rolling period. `timezone` is an IANA name stored as data. Until those are set, the columns exist and creates are refused (PROPOSED). The pilot does not hardcode a California zone. The mock's permit `unit` and guest `hostUnit` are strings (VERIFIED, `src/types.ts`). They are not `household_id`.

The month total counts stored passes whose interval overlaps the window, in any of `scheduled`, `active`, derived `expired`, or `revoked` (PROPOSED, Q-002). If the subject is household or unit and `for_account` has no such id, the create is refused. The cap subject is `for_account`. When the issuer is an admin, that is the named resident, not the admin, unless the admin account is itself that resident. A later edit of the account does not change ids already stored on a pass (PAC-075).

The plate recorded on a vehicle at time t is the `after` plate on the latest audit event for that vehicle whose action is vehicle create or a plate or description edit, and whose `at` is less than or equal to t. When two such events share `at`, the later appended event is the one that counts. Hold and remove events record status in `before` and `after`. They are not plate events. The vehicle row keeps the current plate and description. While the audit event is still kept, the export can also show the previous and new plate (PAC-023, PAC-060).

The plate that was warned is the `plate` stored on the violation at filing. That field does not point at the vehicle row, and it does not depend on the audit event still existing after 365 days (D-074). A warning for a plate that no vehicle carried at that time still keeps the submitted plate. Signing copies that same violation plate onto the authorization (PAC-051). That copied plate is on the authorization row. It also remains after the audit event is purged. During the 365 days, the audit history can still be compared with the violation plate. After the purge, the violation plate and the authorization plate are the record of what was filed and what was signed.

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
| — | `active` | Session with resident, including one that also has admin | Own account only. Body status, account, unit, and household are ignored. `created_by` and `created_at` are the session and the server clock. The audit event's `after` holds the plate and description (PAC-020, PAC-062, PAC-101, D-067) |
| `active` | `active` | That vehicle's resident session, including when it also has admin | Plate or description only. Status stays `active`. Refused while `on_hold` (D-069). `updated_by` and `updated_at` are the session and the server clock. The audit event stores `before` and `after` for plate and description. The edit does not change a violation plate or an authorization plate. A plate change counts under PAC-027 (D-073). The 4th in the proposed 30-day window is refused and the row stays unchanged. A description-only edit does not count |
| `active` | `on_hold` | Admin | Any vehicle in the community. `held_by` and `held_at` are the admin session and the server clock. Holding `on_hold` or `removed` is refused (PAC-021, D-067). A successful hold writes a `Notification` with action `hold` (D-072, PAC-026). A later plate check of this vehicle returns status `on_hold` and action `none` (D-077, PAC-034) |
| `active` | `removed` | That vehicle's resident session, or an admin | Resident: own `active` vehicle only (D-069 refuses this while `on_hold`). Admin: any in the community. Row kept. `removed_by` and `removed_at` are the session and the server clock (PAC-025, D-067). An admin removal writes a `Notification` with action `remove`. A resident removal does not (D-072, PAC-026) |
| `on_hold` | `removed` | Admin | Any in the community. Same remove fields. `held_by` and `held_at` stay (PAC-025). Writes a `Notification` with action `remove` (D-072) |
| `on_hold` | `active` | Admin | Release of the hold (D-075, PAC-028). A resident, a patroller, and a signer are refused. `held_by` and `held_at` stay. The audit event stores that admin, the server time, `before` `on_hold`, `after` `active`, and an optional reason. Empty reason is stored. No `Notification` (Q-032). The status `active` is derived from D-069, because resident edits exist only on `active`. Henry can correct that target. The next plate check does not return action `none`. A warning and a tow authorization are no longer refused because of the hold (D-077) |

D-067 (Henry, 2026-10-23, VERIFIED as his statement): a resident adds, updates, and removes their own vehicle with no admin pre-approval. An admin may remove any registered vehicle in the community or put it on hold. There is no approval status and no admin add of a vehicle for another account. A session without resident is refused on add. The mock still lets a resident save a status of approved (VERIFIED, `PRD.md` section 7). The pilot does not copy that write. `community_id` is required (I-1). D-077 (Henry, VERIFIED as his statement): a plate check of an `on_hold` vehicle returns status `on_hold` and action `none`, and the line is "on hold, don't act". A warning and a tow authorization for that plate are refused while the vehicle stays `on_hold`. There is no dispatch endpoint. Release returns the usual warning and tow rules (PAC-034). D-069 (Henry, VERIFIED as his statement; `PRD.md` section 11.1): a resident cannot edit or remove a vehicle that is `on_hold`, including when that session also has admin. The request is refused and the row stays `on_hold`. Only an admin removing the hold frees that vehicle for resident edits and removal. D-075 (Henry, VERIFIED as his statement): only an admin can release a hold. A resident and a patroller cannot. The edge is `on_hold` to `active`. That target is derived from D-069, which frees the vehicle for resident edits, and those edits exist only while the status is `active`. Henry can correct the target status. Admin removal of an `on_hold` vehicle still sets `removed` (PAC-025) and is a different action from removing the hold. Nothing restores a `removed` row. D-073 (Henry, VERIFIED as his statement; `PRD.md` section 11.1): 3 plate changes per vehicle per 30 days. Enforcement is the refusal. The 1st, 2nd, and 3rd plate changes in the window are stored. The 4th is refused, the vehicle row is unchanged, and no plate-change audit event is appended. A plate change is a successful edit of that vehicle id whose normalized plate in `after` differs from `before`. Create is not a plate change. A description-only edit is not a plate change. Two vehicles of one resident each have their own count. A later vehicle that reuses a plate after `removed` starts at zero. PROPOSED window (Q-029): rolling, on the server `at` of those plate-change audit events, counting an event while `now - at < 30 × 24 hours`. The community timezone is not applied. At exactly 30 days the oldest event drops out and another plate change is allowed. Admins already see every plate change: the same audit event stores `before` and `after` plate, the actor, the vehicle id, and `at` (PAC-062). No second log is added. No other abuse control is defined (Q-030). The 30-day count uses events younger than 30 days. D-074 purges an audit event only once it is past 365 days, so that job does not remove an event the count still uses. D-072 (Henry, VERIFIED as his statement): an admin hold and an admin removal each write a `Notification` for that vehicle's resident. A resident removal does not. The event has no channel and no wording (Q-028).

### 6.3 Violation

| From | To | Who or what | Guard |
| --- | --- | --- | --- |
| — | `warning` | Patroller or admin | No other unclosed warning for that plate. Photo rules met. Grace configured. `warning_reason` is a code from PAC-047. `warning_reason_text` is non-empty only for `other`. An empty or unknown code, `other` with empty text, and text on another code are refused and no row is stored. If the plate's current non-removed vehicle is `on_hold`, the warning is refused and the error is "on hold, don't act" (PAC-040, PAC-041, PAC-042, PAC-046, PAC-047, D-076, D-077) |
| `warning` | `closed` | Filer or admin | `close_reason` required. It is free text and is not the PAC-047 list (PAC-045) |

Grace has ended when the stored status is `warning` and `now >= grace_ends_at`. That is a read-time comparison. It is not a stored `grace_elapsed` state and not a job. It unlocks PAC-050. It does not hide the warning on plate check (PAC-030, PAC-044).

### 6.4 Tow authorization

| From | To | Who | Guard |
| --- | --- | --- | --- |
| — | `draft` | Signer | Same community, warning not closed, `now >= grace_ends_at`. Refused when the warning's stored plate is the current plate of a non-removed `on_hold` vehicle. The error is "on hold, don't act" (PAC-050, D-077) |
| `draft` | `signed` | Signer | Artifact stored under PAC-051. No outbound call (PAC-052). The same `on_hold` refusal as the draft (PAC-102, D-077) |
| `signed` | `voided` | Signer or admin | Reason required. Session actor stored. Artifact kept (PAC-054) |

A void does not delete the warning.

## 7. Invariants

| Id | Invariant | Label |
| --- | --- | --- |
| I-1 | Every row's `community_id` references a community | PROPOSED |
| I-2 | Pass, vehicle, violation, authorization, export, and config reads and writes take `community_id` and actor from the server session, and permissions from the account that session identifies. Body copies are ignored. Three flows have no session: a guest-link read (token hash, no actor), invite acceptance (token hash; community, permissions, unit, and household copied from the invite; the accepter cannot send them), and the operator bootstrap (out of band, one community, audited) | PROPOSED |
| I-3 | One pass per plate per community that is not revoked and has `now < end`, whether or not it has started. Permission to park is only the in-window case | PROPOSED (Q-004, PAC-005, PAC-006) |
| I-4 | Pass duration is within `per_stay_cap`. The month total uses `month_window` and `timezone`, for `month_cap_subject`, and counts overlapping passes in any of scheduled, active, expired, or revoked | PROPOSED (Q-002) |
| I-5 | One vehicle that is not `removed` per plate per community. A resident may have any number of vehicles on different plates | PROPOSED for the plate rule (PAC-024). D-070 for the missing resident count |
| I-6 | `active` is written on a resident add, with `created_by` from that session, and again when an admin releases a hold (D-075). `on_hold` is written only by an admin hold, with `held_by` from that admin session. `removed` is written by the resident remove of their own `active` vehicle or by an admin remove, with `removed_by` from that session. A resident cannot edit or remove an `on_hold` vehicle (D-069). No status is written from the body | D-067, D-069, and D-075. Column names are PROPOSED. The return to `active` is derived from D-069 |
| I-7 | A warning has at least one private photo and a `grace_ends_at` | PROPOSED |
| I-8 | A `signed` authorization points at a warning where `grace_ends_at <= signed_at`, and the warning was not closed at sign time | PROPOSED. Whether the statute requires this sequence is UNKNOWN (Q-016). The product rule is PROPOSED |
| I-9 | Sign, void, and export do not perform network calls to a tow vendor | PROPOSED |
| I-10 | An audit row is not updated, and a request cannot delete it. `before` and `after` stay as written until the retention job deletes the row. That job deletes the row when its age is past 365 days and does not archive it (D-074, PAC-064) | D-074 |
| I-11 | No column or constant names a person, including Henry, or encodes a committee-member-specific exception. Signer is a permission | PROPOSED |
| I-12 | Guest-spot count is not a foreign key from a pass | PROPOSED |
| I-13 | Photo and authorization bytes are private objects. The storage key is not a public URL. A read checks the privacy table, then uses a short-lived URL and the server's content type | PROPOSED |
| I-14 | A violation's plate, and the plate copied onto a tow authorization at sign time, stay as written. A vehicle edit records the previous and new plate and description on its audit event and does not rewrite those plates. Purging that audit event does not change either stored plate (D-074) | PROPOSED (PAC-023, PAC-040, PAC-051). D-074 for the purge |
| I-15 | A stored warning has `warning_reason` equal to one code in the PAC-047 list. `warning_reason_text` is non-empty only when that code is `other`, and empty for every other code. A request that does not meet that is refused and writes no warning | D-076. The codes and labels are PROPOSED |
| I-16 | A plate check of a non-removed `on_hold` vehicle returns status `on_hold` and action `none`. No warning and no tow authorization are stored for that plate while the vehicle stays `on_hold` | D-077 |

## 8. Privacy and retention

California privacy law applicability is UNKNOWN. Do not pick a statute here. Plate, photo, and phone retention stay UNKNOWN (Q-011). Audit-log retention is 365 days (D-074). The table says who can read data while it is kept. It does not add a delete screen. The audit purge is a job, not a screen.

| Data | Who can read it in the pilot design | Retention |
| --- | --- | --- |
| Plate on a pass, vehicle, violation, or authorization | Resident: vehicles whose resident account is the session, and passes whose `for_account` is the session. Patroller: the plate-check payload, including the open warning on that plate, and warnings that patroller filed. Admin and signer: their community. Guest link: the one plate on that pass, and only while the link is live under PAC-009. `warning_reason` and `warning_reason_text` are part of the violation: admin and signer read them in the export, and the filing patroller reads them on a warning they filed. The plate-check payload does not add them (PAC-030) | UNKNOWN. PROPOSED later, not in this build: keep through the dispute window, then delete or irreversibly tokenize. The window is not chosen |
| Photos | Admin, signer, and the filing patroller, through the short-lived URL in PAC-041. Not on the guest link. Not in the plate-check payload (PAC-031) | UNKNOWN. Same later gate as plates. Export includes the bytes while they are retained (PAC-060) |
| Authorization file | Admin and signer, `Content-Disposition: attachment` (PAC-051). Not on the guest link. Not in the plate-check payload | UNKNOWN. Same later gate |
| Phone | Only if Q-008 keeps the field. PROPOSED: issuing resident and admin. Not patroller, not guest link, not other residents | UNKNOWN |
| Audit | Admin and signer via export, for events the job has not yet deleted. Not a public page | 365 days (D-074). Kept when `now - at` is 365 × 24 hours or less, including exactly 365 days. Purged when `now - at` is greater than that. No archive. Distinct from Q-011. A request cannot delete the row (I-10, PAC-064) |

The public Pages site shows the seed, including phones, to anyone (VERIFIED, `seed.ts` and the Pages URL). That site is not the pilot store. Pilot photos and plates do not go on that site (PROPOSED).

## 9. Failure behavior

| Condition | Result | Label |
| --- | --- | --- |
| Config row missing, or cap, grace, month subject, month window, timezone, upload maximum, or guest-lookup limit null | Refuse the create, the warning, or the guest lookup. No default of zero and no California timezone default | PROPOSED, PAC-100 |
| Photo or writing type, size, or upload fails | No `warning` row, or no `signed` row. The client content type is not stored | PROPOSED, PAC-041, PAC-051 |
| A vehicle request sends `status` of `approved`, `on_hold`, `removed`, or `active` | Ignore the field. Add persists `active`. An edit of an `active` vehicle stays `active`. Hold and remove are not this field | D-067, PAC-101 |
| Body sends `community_id`, actor, `decided_by`, `held_by`, `removed_by`, `before`, `after`, `permissions`, channel, or wording on a pass, vehicle, violation, authorization, export, or config request | Ignore them. Use the session. The server writes `before` and `after` on the audit event. A notification event stores no channel and no wording. No session: refuse. A vehicle has no `decided_by` column | PROPOSED, PAC-104, D-072 |
| Pass or vehicle body sends `unit` or `household_id` | Ignore them. Copy from `for_account` or the vehicle's resident account | PROPOSED, PAC-004, PAC-020 |
| Session has resident and not admin, and the body sends `for_account` | Ignore it. Use the session account | PROPOSED, PAC-004 |
| Session has resident, including a session that also has admin, and the body sends a vehicle resident-account id | Ignore it. Use the session account | D-067, PAC-020 |
| Session without the resident permission calls add vehicle | Refuse. No row. Admin, patroller, and signer do not grant the add | D-067, PAC-020 |
| Resident adds another vehicle on a different plate | Store it. Do not count the account's existing vehicles | D-070, PAC-020 |
| 4th plate change while 3 plate-change audit events for that vehicle are still inside the proposed 30-day window | Refuse. Plate and description on the row stay as they were, including when the request changes both. Do not append a plate-change audit event | D-073, PAC-027 |
| Plate change when fewer than 3 of that vehicle's plate-change events are inside the window, including when the oldest is exactly 30 days old | Store the plate. Append the audit event with the previous and new plate. A description-only edit never enters this count. That event is 30 days old, so the 365-day purge does not delete it | D-073, PAC-027, Q-029, D-074 |
| Audit event age is 364 days, or exactly 365 days | The retention job leaves it | D-074, PAC-064 |
| Audit event age is past 365 days | The retention job deletes it. It does not write a copy. The violation plate and the authorization plate stay | D-074, PAC-064, I-14 |
| Admin hold or admin removal succeeds | Store the vehicle change and one `Notification` for that vehicle's resident. Do not store a channel or wording | D-072, PAC-026, Q-028 |
| Resident removes their own `active` vehicle | Store `removed`. Do not write a `Notification` | D-072, PAC-025 |
| Second non-removed vehicle for a plate the community already has | Refuse. No second row | PROPOSED, PAC-024 |
| Session has neither resident nor admin and calls create pass | Refuse. No row. A patroller or signer permission does not grant the create | PROPOSED, PAC-004 |
| Admin names a `for_account` that is missing, outside this community, or without the resident permission | Refuse. No pass row | PROPOSED, PAC-004 |
| Hold of an `on_hold` or `removed` vehicle, resident edit or remove of `on_hold`, release by a resident, patroller, or signer, or any edit or remove of `removed` | Refuse. The row is unchanged. A resident cannot edit or remove while `on_hold`, including a session that also has admin (D-069). Admin removal that sets `removed` is allowed on `on_hold` (PAC-025). Only an admin release moves `on_hold` to `active` (D-075) | D-069, D-075, PAC-021, PAC-023, PAC-025, PAC-028 |
| Guest-link read or invite acceptance sends `community_id`, permissions, unit, or household | Ignore them. Guest link uses the token hash and has no actor. Invite acceptance copies community, permissions, unit, and household from the invite row | PROPOSED, I-2, PAC-073 |
| Sign before grace ends, warning closed, or caller is not a signer | Refuse. No artifact is marked signed. No outbound call. Do not wait for a `grace_elapsed` write | PROPOSED, PAC-102 |
| Client sends its own timestamp as "now" | Ignore it. Use the server clock | PROPOSED, PAC-103 |
| Id from another community | Not found. Same response as a missing id | PROPOSED, PAC-071 |
| Unknown, revoked, expired-pass, or expired-link guest token, or a lookup over the rate limit | One line, "this link is not valid." No plate | PROPOSED, PAC-009, PAC-010 |
| Export fails midway | Do not publish a partial archive as complete. Audit the failure | PROPOSED |
| Second unclosed warning for the plate | Refuse. The first warning remains | PROPOSED, PAC-046 |
| Warning with a missing, empty, or unknown `warning_reason` | Refuse. No warning row. The error is "Choose a warning reason." | D-076, PAC-047 |
| Warning with `warning_reason` `other` and empty or whitespace-only `warning_reason_text` | Refuse. No warning row. The error is "Describe this warning." | D-076, PAC-047 |
| Warning whose `warning_reason` is not `other` and whose `warning_reason_text` is non-empty | Refuse. No warning row. The text is not stored. The error is "A note is only allowed when the reason is Other." | D-076, PAC-047 |
| Warning for a plate whose current non-removed vehicle is `on_hold` | Refuse. No warning row. The error is "on hold, don't act." Patroller and admin are both refused | D-077, PAC-040, PAC-034 |
| Tow-authorization draft or sign for a warning whose stored plate is an `on_hold` vehicle's current plate | Refuse. No signed row. The error is "on hold, don't act." There is no dispatch endpoint | D-077, PAC-050, PAC-102 |

The mock cannot reject a read (VERIFIED). `updatePermit` copies the request onto the permit (VERIFIED, `src/services/mockApi.ts`). The pilot does not copy that pattern. The UI needs an error state the mock does not have. That screen is in `UX_DESIGN_SPEC.md`.

## 10. Permissions

This table is the source of truth. A column is a permission, not an exclusive role. An account may hold more than one (Q-014). The account may take an action when one held permission's cell allows it. A No cell means that permission does not grant the action. Where the resident cell and the admin cell name different account rules for creating a pass, admin wins if the session has admin. Vehicle add, edit, and remove do not use that exception. A session with resident acts on its own vehicles even when it also has admin. The admin permission does not add a vehicle for another account. A screen that omits a control for an allowed cell is incomplete. A screen that offers a control for a No cell is wrong.

| Action | Resident | Patroller | Admin | Signer | Guest link | Tow company |
| --- | --- | --- | --- | --- | --- | --- |
| Create pass | Yes, only when this session does not also have admin. `for_account` is the session | No | Yes. The named account must have the resident permission. This rule wins if the session also has resident | No | No | No account |
| Revoke a pass | Only a pass they issued | No | Any pass in the community | No | No | — |
| Add vehicle | Yes. The resident account is the session, including when this session also has admin. Status becomes `active` | No | No | No | No | — |
| Edit own vehicle plate or description | Only an `active` vehicle whose resident account is this session, including when this session also has admin. `on_hold` is refused (D-069). The 4th plate change in the 30-day window is refused (D-073) | No | No | No | No | — |
| Remove own vehicle | Only an `active` vehicle whose resident account is this session, including when this session also has admin. `on_hold` is refused (D-069) | No | No | No | No | — |
| Hold a vehicle | No | No | Yes. Any `active` vehicle in the community. Writes a `Notification` (D-072) | No | No | — |
| Release a hold | No | No | Yes. An `on_hold` vehicle in the community becomes `active` (D-075). The `active` target is derived from D-069 | No | No | — |
| See all plate changes | No | No | Yes. The list is this community's vehicle edit audit events whose plate changed (D-073, PAC-062). There is no second record | Through the export, which includes those audit events (PAC-060) | No | — |
| Remove a vehicle | No | No | Yes. Any `active` or `on_hold` vehicle in the community. This sets `removed`. It is not removing the hold | No | No | — |
| Edit resident unit and household | No | No | Yes | No | No | — |
| Plate check | No | Yes | Yes | No | No | — |
| File warning with photos | No | Yes, unless that plate's non-removed vehicle is `on_hold` (D-077) | Yes, unless that plate's non-removed vehicle is `on_hold` (D-077) | No | No | — |
| Close violation | No | Only one they filed | Yes | No | No | — |
| Sign authorization | No | No | Only with signer permission, and refused while the warning's plate is an `on_hold` vehicle (D-077) | Yes, and refused while the warning's plate is an `on_hold` vehicle (D-077) | No | — |
| Void authorization | No | No | Yes | Yes | No | — |
| Export community | No | No | Yes | Yes | No | — |
| Edit config | No | No | Yes | No | No | — |
| Invite an account | No | No | Yes. Allow-list: resident, patroller, admin, signer (PAC-073) | No | No | — |

Signer is a permission, not a hardcoded seat (I-11). Admin does not imply signer, signer does not imply resident, and admin does not imply resident (PAC-022). The tow company is absent, not a denied role with a login. The first admin is the operator bootstrap in PAC-073, not an invite. A later admin or a signer is granted by that allow-list, which does not copy the inviting admin's permissions. A session without resident cannot add a vehicle, including an admin who does not also have resident (PAC-020, D-067). A patroller or a signer without resident and without admin cannot create a pass (PAC-004).

### 10.1 Where a value comes from

PROPOSED. This table is the field source for the actions above. A later sentence that disagrees with it is wrong.

| Value | Source |
| --- | --- |
| `community_id` on a pass, vehicle, violation, authorization, export, config, invite create, or unit edit | Session |
| `community_id` on a guest-link read | The `GuestLink` row found by token hash. The body cannot send it |
| `community_id`, permissions, `unit`, and `household_id` on invite acceptance | The invite row. The accepter cannot send them. There is no session |
| `community_id` on bootstrap | The operator action, one community. Not a request body. There is no session |
| Actor, `filed_by`, `closed_by`, `voided_by`, signer id, `created_by`, `updated_by`, `held_by`, `removed_by` | Session account for that action. A body `decided_by`, `held_by`, or `removed_by` is ignored. A vehicle has no `decided_by` column. Bootstrap has no person-named actor. A guest-link read has no actor. Invite acceptance uses the new account after the copy |
| Permissions on a pass, vehicle, violation, authorization, export, or config request | The account on the session. The body is ignored |
| Permissions on invite create | Body allow-list: `resident`, `patroller`, `admin`, `signer` only. This does not change the admin's own permissions |
| `now` | Server clock. A body timestamp is ignored |
| `for_account` on create pass | Resident and not admin: session. Body ignored. Admin, including an admin who also has resident: body, then checked for resident permission in this community. Neither resident nor admin: refused |
| `unit` and `household_id` on a pass or vehicle | Copied from `for_account` or the vehicle's resident account at create time. Body ignored. A later account edit does not rewrite them (PAC-075) |
| `unit` and `household_id` on invite create | Body. Required when `resident` is in the allow-list |
| `unit` and `household_id` on the unit-edit action | Body, admin session only (PAC-075) |
| Plate, start, end, vehicle description, photo bytes, close reason, void reason | Body. Plate is stored uppercased with outer spaces removed. `filed_by` is the session |
| `warning_reason` | Body. Required. One code from the PAC-047 list (D-076). Missing, empty, and unknown are refused with "Choose a warning reason." No warning row. The codes are PROPOSED. `close_reason` is the separate body field used only on close, and it is not checked against this list |
| `warning_reason_text` | Body. Required only when `warning_reason` is `other`: stored after outer spaces are removed, and empty or whitespace-only is refused with "Describe this warning." For every other code, non-empty text is refused with "A note is only allowed when the reason is Other." and the stored text on an accepted warning is empty. Text that is only spaces counts as empty. No length maximum is set, and length alone is not a refusal |
| Plate-check `action` | Server. `none` when the non-removed vehicle for that plate is `on_hold`, and the payload includes the line "on hold, don't act" (D-077, PAC-034). A body action is ignored. After release the value is not `none` |
| Cap, grace, month subject, month window, timezone, upload maximum, guest-lookup limit, guest-rule text | Body on the admin config save. `community_id` is the session. An empty value is refused (PAC-100) |
| Phone | Body only if Q-008 keeps the field. Otherwise it is not stored |
| Vehicle's resident account on add | Session, only when the session has resident, including when it also has admin. Body ignored. Without resident: refused. Admin does not name another account (PAC-020, D-067) |
| Vehicle status on add | Server: `active`. Body ignored (PAC-020, PAC-101) |
| Vehicle status on the own-vehicle edit | Server. Stays `active`. Body ignored. The edit exists only while status is `active`. An `on_hold` edit is refused and the status stays `on_hold` (D-069). A `removed` edit is refused (PAC-023) |
| Audit `before` and `after` on a vehicle create or a plate or description edit | Server. Create: `after` is the stored plate and description, and `before` is empty. Edit: `before` is the row's plate and description, and `after` is the stored plate and description. A body `before` or `after` is ignored |
| Vehicle status on hold | Server: `on_hold`, from an admin session, and only from `active`. `held_by` is that session. `held_at` is the server clock. Body status and actor are ignored (PAC-021) |
| Vehicle status on remove | Server: `removed`. `removed_by` is the session. `removed_at` is the server clock. Resident: own `active` only. A resident remove of `on_hold` is refused (D-069). Admin: `active` or `on_hold` in the community, which sets `removed` and does not release the hold. `held_by` and `held_at` are not cleared (PAC-025) |
| Vehicle status on release | Server: `active`, from an admin session, and only from `on_hold` (D-075, PAC-028). The `active` target is derived from D-069. Henry can correct it. Actor and time on the audit event are the admin session and the server clock. An optional reason on that event comes from the body and may be empty. A body actor, time, or status is ignored. `held_by` and `held_at` stay. No notification event (Q-032) |
| Content type of a photo or a writing | Server, from the bytes. The client type is ignored |
| Guest-link token and invite token at creation | Server. At least 128 bits, shown once, stored only as a hash |
| Guest-link token at lookup | Presented by the holder. The server compares the hash. `community_id` comes from the link row, not from the body |

### 10.2 Not found

PROPOSED. These are the same response as a missing id. They do not say which case it was.

| Caller | Read that is not found |
| --- | --- |
| Any session | An id whose `community_id` is not the session's community (PAC-071) |
| Resident, including a resident who also holds another permission, when the session does not have admin | A pass whose `for_account` is not the session, or a vehicle whose resident account is not the session (PAC-007) |
| Patroller or signer, unless another held permission allows the read | A pass or vehicle opened by id. Plate check is the patroller's granted read. Export is the signer's granted read |
| Admin | Not limited to the session's own account. Still limited to the session's community |
| Guest link | No account read. A dead or over-limit token is the one invalid line and shows no plate (PAC-009, PAC-010) |

## 11. What the prototype seam implies

VERIFIED: the UI calls `fetchDashboard`, `createGuestSession`, `updatePermit`, `assignSpot`, and `createViolation` in `mockApi.ts`. `createGuestSession` assigns the first open numbered spot in the zone. The React state assigns every open spot in that zone. The pilot does not reuse `assignSpot` or that guest-create assignment (numbered spots are out, PAC-008). It does not reuse a violation action enum that includes `tow-dispatched`. A new client replaces that module. The five-function list is not the pilot API.

## 12. Questions

Decisions are in `PRD.md` section 11.1. D-069 resolves Q-021: a resident cannot edit or remove an `on_hold` vehicle, and only an admin removing the hold frees it for those actions. D-070 resolves Q-022: a resident may register any number of vehicles, and add does not count that account's vehicles. D-073 resolves Q-023: 3 plate changes per vehicle per 30 days, refused on the 4th, and admins see those changes on the existing audit events. D-072 resolves Q-024: an admin hold and an admin removal each write a `Notification`. A resident removal does not. D-074 resolves Q-025: an audit event is kept for 365 days and deleted once it is past that age. The plate stored on a violation, and the plate copied onto a tow authorization, stay after that deletion. D-075 resolves Q-026: only an admin can release a hold, and the status becomes `active`. That target is derived from D-069. Henry can correct it. D-076 resolves Q-027: an empty warning reason is refused. `warning_reason` is a required code, and `warning_reason_text` is required only for `other`. The codes and labels are PROPOSED in `PRD.md` section 11.2 and in `FRD.md`. That list is the only PROPOSED part of D-076. D-077 resolves Q-020: a plate check of an `on_hold` vehicle returns status `on_hold` and action `none`, and the line is "on hold, don't act". A warning and a tow authorization for that plate are refused until an admin releases the hold.

Q-001, Q-002, Q-003, Q-004, Q-005, Q-007, Q-008, Q-009, Q-010, Q-011, Q-014, Q-015, Q-016, Q-018, Q-019, Q-028, Q-029, Q-030, Q-031, and Q-032 stay open. Q-020 through Q-027 are resolved. Vendor choice and the login method stay UNKNOWN until Henry answers Q-019. Q-028 is the notification channel and the wording, and it is tied to Q-019. Q-029 is the plate-change window. This file uses a rolling 30 × 24 hours on server timestamps and labels that PROPOSED. Q-030 asks whether any abuse control besides D-073 is required. None is defined. Q-031 asks whether violation records and tow-authorization records follow the 365-day audit retention. This file does not apply that number to them. Q-032 asks whether a release notifies the resident. This file does not write that notice.
