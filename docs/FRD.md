# Zonr functional requirements — pilot

Design baseline: the single-community pilot in `PRD.md`. Code baseline: `main` `99d283e`. Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. Acceptance ids in sections 6 through 13 are the pilot's behavior. They are not implemented. Section 5 is what the code does today (VERIFIED) and must not be treated as the pilot.

S-2 is D-067. Success of the pilot against the other ids is PROPOSED and UNAPPROVED (`PRD.md` section 4).

## 1. Purpose

State the pilot rules so a later build can be checked, and state the prototype behaviors that violate those rules.

## 2. Scope

In scope: guest passes, the vehicle registry, plate check, violations, tow-authorization records, export, roles, and tenant scope. Out of scope: cameras, payments, tow dispatch, numbered spots, property-system sync, a second community's product surface, and deletion or tokenization of a community (`PRD.md` section 3.4 and section 8).

## 3. Success

A build matches this FRD when every PAC id below holds for one configured community and a second `community_id` cannot be read through the first community's server session (PROPOSED, UNAPPROVED except the vehicle rule in S-2).

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| An acceptance id for statute text | UNKNOWN. RADAR (`PRD.md` Q-016) |
| An acceptance id for a price or a market size | UNKNOWN |
| An acceptance id for deleting or tokenizing plates, photos, or phones | Not in the pilot build. The window stays Q-011 |
| Require admin pre-approval of a resident's own vehicle | D-067. The resident adds, updates, and removes that vehicle (PAC-020, PAC-023, PAC-025) |
| A test that the mock's `tow-dispatched` value still exists | The pilot does not have that action |

## 5. Prototype behavior that fails the pilot

Checked at `99d283e` (VERIFIED).

| What the code does | Pilot id it fails |
| --- | --- |
| No login. Every route is public | PAC-070, PAC-073 |
| Resident save can set status to `approved`. `updatePermit` copies the request object onto the permit, so a client field is not dropped. The pilot has no approval status. Add stores `active` and ignores a status on the body | PAC-020, PAC-101, PAC-104 |
| Guest create stores minutes and does not expire them. No caps. The new guest session is treated as current parking permission | PAC-001, PAC-004, PAC-005 |
| Spots have ids (A1, B7, C4). A manager assigns them (`assignSpot`). Guest create also assigns a numbered spot: `createGuestSession` writes the guest plate onto the first open spot in the chosen zone, and the screen state writes it onto every open spot in that zone (`AppState.tsx`) | PAC-008 |
| New violations may be `tow-dispatched` with a fixed GPS string and `photoCount: 1`. No photo file | PAC-040, PAC-041, PAC-042 |
| Nothing exports | PAC-060 |
| No `community_id`. No server session | PAC-071, PAC-080 |
| Reload restores the seed. Nothing is durable | PAC-090 |

Open pull request #2 changes demo plates and adds a banner. It does not add accounts, caps, or the vehicle-registry rules (VERIFIED: that branch's diff is the four files named on the pull request). It is not merged.

## 6. Guest passes

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-001 | Creating a pass requires a non-empty plate, a start time, and an end time. The end is after the start. The plate is stored in uppercase with outer spaces removed. `community_id` is the session's community, not a body field | PROPOSED |
| PAC-002 | The pass does not have a stall id | PROPOSED |
| PAC-003 | The duration is less than or equal to the community's per-stay cap. The cap is configuration. If the cap is missing, the create is refused | PROPOSED. Cap value UNKNOWN (Q-001) |
| PAC-004 | The create is refused when the community's per-month cap would be exceeded for the configured subject, window, and timezone. No pass row is written. Subject, window, or timezone unset also refuses the create. The pass copies `unit` and `household_id` from `for_account`. Body `unit` and `household_id` are ignored. A session with the resident permission and not admin has `for_account` set from that session, and a body `for_account` is ignored. A session with neither resident nor admin is refused, including a patroller or a signer who does not also have resident. An admin session must name an account in this community that has the resident permission; otherwise the create is refused. Admin wins when the session also has resident. The cap uses that account, not the admin's ids unless the admin account is the named resident. If the configured subject is household or unit and that id is missing on `for_account`, the create is refused | PROPOSED. Subject, window, timezone, and which statuses count are UNKNOWN (Q-002). PROPOSED count: overlapping passes count, in any of scheduled, active, expired, or revoked |
| PAC-005 | Permission to park is `start <= now < end` and not revoked. A pass with `start > now` is `scheduled` and is not permission. When `now >= end`, a read shows `expired`. Expiry is that comparison on the server clock. It does not wait for a background writer, and it does not create a violation | PROPOSED |
| PAC-006 | A second pass for the same plate in the same community is refused when an existing pass is not revoked and `now < end`. That includes a scheduled pass | PROPOSED (Q-004) |
| PAC-007 | Revoking a pass before the end time records the session actor and the server time. The issuer may revoke a pass they issued. An admin may revoke any pass in the community. A resident's list is passes whose `for_account` is that session, including a pass an admin issued for them. Revoke on that list is still only for passes they issued. A resident read, when that session does not have admin, of any other pass or of a vehicle whose resident account is not that session, is not found. A patroller or signer id read is not found unless another permission they hold allows it. Plate check, admin reads, and export are not limited to the caller's own account. Afterwards the guest link uses the dead-link line in PAC-009 | PROPOSED. Who may revoke is still Q-003 |
| PAC-008 | No screen assigns a pass to a numbered spot, including guest create | PROPOSED |
| PAC-009 | A live guest link shows that pass's plate, window, and the community's guest rules, and nothing else. If the pass has not started, the page does not call it permission to park. An unknown token, a revoked pass, an expired pass, and an expired link all render one line, "this link is not valid," and do not show a plate or which of those cases it was. The link's `expires_at` is the pass end | PROPOSED (Q-009) |
| PAC-010 | The guest token is generated by the server, is at least 128 bits, and is stored only as a hash. The raw token is shown once. Lookups compare the hash. The lookup limit is one counter per client network address, shared by every token seen from that address. It is not a counter per token, and it is not one counter for the whole community. The number is the community's configured limit. An over-limit lookup gets the same invalid line as an unknown token, including when the token would otherwise be live. A missing limit refuses the lookup with that same line, rather than allowing unlimited lookups. A token the server did not generate is not accepted | PROPOSED. The numeric limit is UNKNOWN, same pattern as the caps |

## 7. Resident vehicles

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-020 | A session with the resident permission may add a vehicle for that session's own account: plate and a short description. The stored status is `active`. A status on the body is ignored, including `approved`, `on_hold`, and `removed`. Body `unit`, `household_id`, and resident-account id are ignored. The resident account is the session, including when that session also has admin. `unit` is copied from that account. `created_by` is the session and `created_at` is the server clock. A session without the resident permission is refused, including a patroller, a signer, or an admin who does not also have resident. The admin permission does not add a vehicle for another account. There is no admin pre-approval | D-067. Field names are PROPOSED |
| PAC-021 | An admin may put any `active` vehicle in the community on hold. The status becomes `on_hold`. `held_by` is that admin's session account and `held_at` is the server time. A body actor or status is ignored. Holding a vehicle that is already `on_hold` or `removed` is refused and the row is unchanged. A resident, a patroller, and a signer cannot hold a vehicle. What `on_hold` means for enforcement is not defined | D-067 for the hold action. Q-020 is UNKNOWN |
| PAC-022 | A patroller, a guest link, and a signer permission do not add, edit, remove, or hold a vehicle. Admin does not imply signer, signer does not imply admin, signer does not imply resident, and admin does not imply resident | PROPOSED (Q-014), and D-067 for hold and remove |
| PAC-023 | An edit of plate or description is allowed only when the vehicle's resident account is the session account, including when that session also has admin, and the status is `active`. A body account id and a body status are ignored. The status stays `active`. `updated_by` is the session and `updated_at` is the server clock. The audit event stores the session actor, the edit action, `community_id`, the vehicle id, the server timestamp, and `before` and `after` values for both plate and description. A body `before` or `after` is ignored. The vehicle row keeps the new plate. The edit does not change a plate already stored on a violation or on a tow authorization. No frequency limit is defined. An edit of someone else's vehicle is not found. An edit of an `on_hold` vehicle is not a defined transition: the request is refused and the row is unchanged. An edit of a `removed` vehicle is refused. The edit is on the resident screen, which a session with resident sees even when it also has admin. There is no admin form that edits another resident's plate | D-067 for the update. Q-021 and Q-023 are UNKNOWN |
| PAC-024 | At most one vehicle row that is not `removed` exists for a plate in a community, so a plate check has one current row. A `removed` row does not occupy the plate. This is not a limit on how many vehicles one resident may register | PROPOSED. The per-resident limit is Q-022 |
| PAC-025 | Remove sets status to `removed`, stores `removed_by` as the session account and `removed_at` as the server time, and keeps the row for export and audit. It does not clear `held_by` or `held_at`. A resident may remove a vehicle whose resident account is the session and whose status is `active`. A resident remove of an `on_hold` vehicle is not a defined transition: the request is refused and the row is unchanged. An admin may remove any `active` or `on_hold` vehicle in the community. Removing a `removed` row is refused. There is no transition from `on_hold` to `active`. `removed` is not the current registration on a plate check | D-067 for resident remove of their own vehicle and admin remove of any. Q-021 and Q-026 are UNKNOWN |

## 8. Plate check

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-030 | A patroller or an admin submits a plate and receives one payload for their community only: the vehicle that is not `removed` (`active` or `on_hold`) or none, including that status, the pass that is scheduled or currently permission to park or none, and the open warnings (at most one) with `grace_ends_at` and whether grace has ended. The three parts are independent. A plate can have all of them. "No record" means all three are empty. A `removed` row is not the vehicle part. The payload does not map `on_hold` or `removed` to a pass, a warning, or a tow, and it does not treat `on_hold` as permission to park. A warning whose grace has ended stays in the payload until the violation is closed | PROPOSED. What `on_hold` means for enforcement is Q-020 |
| PAC-031 | The check returns at most the one non-removed vehicle for the submitted plate, including its status. It does not return phone numbers, photo bytes, a list of other vehicles, or a `removed` row | PROPOSED |
| PAC-032 | The check does not offer dispatch, payment, or a camera capture | PROPOSED |
| PAC-033 | A plate with no non-removed vehicle, no scheduled or current pass, and no open warning returns a clear "no record" result. It does not create a violation | PROPOSED |

## 9. Violations

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-040 | A patroller or an admin creates a violation for a plate in their community. The stored status is `warning`. A create that asks for any other first outcome is refused. There is no stay to attach it to. `plate` is the submitted plate, normalized, and is not a vehicle id. A later vehicle edit does not change it. `warning_reason` is the free-text reason from the body. An empty reason is stored. No allowed-value list is defined | PROPOSED. Whether an empty reason is refused, and whether a fixed list replaces free text, is Q-027 |
| PAC-041 | A warning requires at least one photo stored with the violation. The server accepts only JPEG, PNG, or WebP, detected from the bytes. A client content type is ignored. SVG, HTML, and any other type are refused. The upload must be within the community's configured maximum size; a missing maximum refuses the upload. If the type, the size, or the write fails, the warning is not issued. The object is private. A read is allowed only for a role in the privacy table, and only through a short-lived URL whose content type is the server's type | PROPOSED (Q-007). The byte maximum's number is not chosen. An uncapped or public URL fails this id |
| PAC-042 | Issuing the warning sets `grace_ends_at` from the community configuration and the server clock. If grace is not configured, the warning is refused | PROPOSED. Length UNKNOWN (Q-005) |
| PAC-043 | While `now < grace_ends_at`, the plate check shows the warning and the grace end time. A tow-authorization signature is refused | PROPOSED |
| PAC-044 | When `now >= grace_ends_at`, the violation is eligible for a tow-authorization record. Eligibility is that comparison at read time. Nothing has to write a `grace_elapsed` status first. The product does not create the authorization automatically and does not contact a tow company. The plate check still shows the warning | PROPOSED (Q-006) |
| PAC-045 | An admin, or the patroller who filed the warning, may close it with a reason. That text is `close_reason` and is required. It is not `warning_reason`. Closing does not delete the row, the photos, or the warning reason. The permissions table is the source of truth for who | PROPOSED |
| PAC-046 | A second warning for the same plate in the same community is refused while one warning is not closed | PROPOSED |

## 10. Tow authorization

The scope names the writing CVC §22658. What the statute, the signs, or the HOA rules require the writing to contain is UNKNOWN and is RADAR's question (Q-016). These ids are the product's record, not a legal opinion.

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-050 | An account with the signer permission may create a draft linked to one warning in the same community once `now >= grace_ends_at` on the server clock. The check is that permission and that comparison. It is not a stored `grace_elapsed` flag, a test of committee membership, or a person's name | PROPOSED |
| PAC-051 | Signing stores the session signer id, the server time, the violation id, the violation's stored plate, and the uploaded writing. The plate is copied from that violation at sign time. It is not the vehicle's current plate. The row becomes `signed`. The writing is a private object. PROPOSED types, detected by the server: PDF, JPEG, or PNG. HTML and SVG are refused. A client content type is ignored. A read uses a short-lived URL after the privacy-table check, with `Content-Disposition: attachment` and the server's content type. The same size rule as PAC-041 applies | PROPOSED |
| PAC-052 | Sign has no outbound effect. There is no dispatch, no vendor API, and no tow-company account | PROPOSED |
| PAC-053 | A patroller, a resident, a guest link, and an admin who lacks the signer permission cannot sign | PROPOSED |
| PAC-054 | A signed row is not edited in place. A signer, or an admin, may void it. The void stores `voided`, a reason, the session actor, and the server time, and keeps the original artifact | PROPOSED |
| PAC-055 | No rule in code treats a named person as the only signer | PROPOSED |

## 11. Export and audit

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-060 | An admin, or a signer, can export one community: passes, vehicles, violations, photo files, tow-authorization records, configuration, and audit events. Each violation in the archive includes its stored plate and `warning_reason`. Each vehicle edit event includes `before` and `after` for plate and description. Together those show whether a vehicle carried the warned plate at `warning_at`. The archive contains the bytes. It does not publish a permanent file URL. A signer without admin still has this action | PROPOSED (Q-010) |
| PAC-061 | The export contains no row whose `community_id` is different | PROPOSED |
| PAC-062 | Each pass or vehicle create, pass revoke, vehicle hold, vehicle remove, warning, sign, void, close, export, invite, config save, edit of resident unit and household, and edit of the session's own vehicle plate or description appends an audit event. The event fields are `community_id`, actor, action, entity type, entity id, server timestamp `at`, `before`, and `after`. A vehicle create stores the plate and description in `after` and leaves `before` empty. A resident plate or description edit stores both fields in `before` and in `after`. Hold and remove store the status change in `before` and `after` and are not the plate history. A body `before` or `after` is ignored. Invite acceptance appends one whose actor is the new account. Bootstrap appends one for that community and does not name a person as a permission. A guest-link read has no actor and is not one of these events. A plate check is a read and is not an audit event. Issuing the guest link is part of the pass-create event. How long vehicle audit events are kept is not chosen | PROPOSED. Retention of those events is Q-025 |
| PAC-063 | Audit events are included in the export and are not editable | PROPOSED |

## 12. Roles, session, and tenancy

The permissions table in `TECHNICAL_DESIGN.md` section 10 is the source of truth for every action it lists. A column is a permission, not an exclusive role. Screens in `UX_DESIGN_SPEC.md` match that table, including its conditions. Field sources are in that file's section 10.1.

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-070 | Accounts exist for residents, patrollers, and admins. A signer permission is separate and may be added to an account. Guests have a link, not an account. The tow company has neither | PROPOSED |
| PAC-071 | A server session for community A cannot read or write community B, including by guessing an id. The session's community is chosen by the server | PROPOSED |
| PAC-072 | Caps, grace, month window, timezone, upload maximum, guest-lookup limit, and the guest-rule text are loaded from configuration for that community. The numbers 700 and 75 do not appear in code. California is not a hardcoded timezone | PROPOSED. The profile values themselves are Q-015. The timezone value is Q-002 |
| PAC-073 | There is no public self-signup. The first admin is an operator bootstrap: out of band, one community, audited, not a session request, and not a rule that names a person. That account has the admin permission and may also have signer. An admin session creates an invite. The body may include an allow-list of `resident`, `patroller`, `admin`, and `signer` only. Anything else is refused. The invite stores that subset, not a copy of the admin's own permissions. `community_id` and actor on that body are ignored. If `resident` is included, `unit` and `household_id` are required and stored on the invite. The raw invite token is shown once and stored only as a hash. Accepting an invite has no session: the server copies community, permissions, `unit`, and `household_id` from the invite row. The accepter cannot send any of those | PROPOSED shape. The credential method is UNKNOWN (Q-019). Whether one person holds both admin and signer stays Q-014 |
| PAC-074 | On pass, vehicle, violation, authorization, export, and config requests, the server loads permissions from the account identified by the session. The body cannot set them. Invite creation is the PAC-073 allow-list, and it does not change the inviting admin's permissions | PROPOSED |
| PAC-075 | An admin may set `unit` and `household_id` on an account in their community that has the resident permission. The audit actor is that admin session. The write changes the account and later passes only. It does not rewrite ids already copied onto existing passes. A resident, a patroller, and a signer cannot do this | PROPOSED |
| PAC-080 | A row without `community_id` cannot be saved | PROPOSED |
| PAC-090 | Pilot data survives a browser reload. The pilot is not the in-memory mock | PROPOSED |
| PAC-104 | On pass, vehicle, violation, authorization, export, and config requests, the server ignores body `community_id`, actor, `decided_by`, `held_by`, `removed_by`, `before`, `after`, `permissions`, and `now`. It uses the session and the server clock. There is no stored `decided_by` on a vehicle. The server writes audit `before` and `after`. A missing session refuses these requests. This id does not cover a guest-link read, invite acceptance, or the operator bootstrap. Those three are named in I-2 | PROPOSED |

## 13. Failure behavior

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-100 | Cap exceeded, missing cap, missing grace, missing month subject, missing month window, missing timezone, missing upload maximum, missing guest-lookup limit, or a photo that does not store: the parent action is refused. No half-written warning or pass remains | PROPOSED |
| PAC-101 | A status field on a vehicle request does not set `active`, `on_hold`, `removed`, or `approved`. Create sets `active` (PAC-020). An edit of an `active` vehicle leaves the status `active` (PAC-023). Hold and remove are separate actions (PAC-021, PAC-025) | D-067 |
| PAC-102 | Sign is refused while `now < grace_ends_at`, when the link to the warning is missing, when the warning is closed, or when the caller lacks signer permission. Nothing is sent outside the system. Sign does not wait for a stored `grace_elapsed` row | PROPOSED |
| PAC-103 | The server clock is the clock for expiry, scheduled versus current permission, and grace. Client-supplied "now" is ignored | PROPOSED |

## 14. Questions

Q-001 through Q-027 in `PRD.md` section 11. This FRD does not pick values for the UNKNOWN rows. Q-020 through Q-026 are the vehicle questions D-067 left open. Q-027 is the warning-reason question.
