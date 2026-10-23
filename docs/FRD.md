# Zonr functional requirements — pilot

Design baseline: the single-community pilot in `PRD.md`. Code baseline: `main` `99d283e`. Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. Acceptance ids in sections 6 through 13 are the pilot's behavior. They are not implemented. Section 5 is what the code does today (VERIFIED) and must not be treated as the pilot.

Success of the pilot against these ids is PROPOSED and UNAPPROVED (`PRD.md` section 4).

## 1. Purpose

State the pilot rules so a later build can be checked, and state the prototype behaviors that violate those rules.

## 2. Scope

In scope: guest passes, the vehicle registry, plate check, violations, tow-authorization records, export, roles, and tenant scope. Out of scope: cameras, payments, tow dispatch, numbered spots, property-system sync, a second community's product surface, and deletion or tokenization of a community (`PRD.md` section 3.4 and section 8).

## 3. Success

A build matches this FRD when every PAC id below holds for one configured community and a second `community_id` cannot be read through the first community's server session (PROPOSED, UNAPPROVED).

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| An acceptance id for statute text | UNKNOWN. RADAR (`PRD.md` Q-016) |
| An acceptance id for a price or a market size | UNKNOWN |
| An acceptance id for deleting or tokenizing plates, photos, or phones | Not in the pilot build. The window stays Q-011 |
| Preserving resident self-approval | VERIFIED gap. Closed by PAC-020 |
| A test that the mock's `tow-dispatched` value still exists | The pilot does not have that action |

## 5. Prototype behavior that fails the pilot

Checked at `99d283e` (VERIFIED).

| What the code does | Pilot id it fails |
| --- | --- |
| No login. Every route is public | PAC-070, PAC-073 |
| Resident save can set status to `approved`. `updatePermit` copies the request object onto the permit, so a client field is not dropped | PAC-020, PAC-101, PAC-104 |
| Guest create stores minutes and does not expire them. No caps. The new guest session is treated as current parking permission | PAC-001, PAC-004, PAC-005 |
| Spots have ids (A1, B7, C4). A manager assigns them (`assignSpot`). Guest create also assigns a numbered spot: `createGuestSession` writes the guest plate onto the first open spot in the chosen zone, and the screen state writes it onto every open spot in that zone (`AppState.tsx`) | PAC-008 |
| New violations may be `tow-dispatched` with a fixed GPS string and `photoCount: 1`. No photo file | PAC-040, PAC-041, PAC-042 |
| Nothing exports | PAC-060 |
| No `community_id`. No server session | PAC-071, PAC-080 |
| Reload restores the seed. Nothing is durable | PAC-090 |

Open pull request #2 changes demo plates and adds a banner. It does not add accounts, caps, or approval rules (VERIFIED: that branch's diff is the four files named on the pull request). It is not merged.

## 6. Guest passes

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-001 | Creating a pass requires a non-empty plate, a start time, and an end time. The end is after the start. The plate is stored in uppercase with outer spaces removed. `community_id` is the session's community, not a body field | PROPOSED |
| PAC-002 | The pass does not have a stall id | PROPOSED |
| PAC-003 | The duration is less than or equal to the community's per-stay cap. The cap is configuration. If the cap is missing, the create is refused | PROPOSED. Cap value UNKNOWN (Q-001) |
| PAC-004 | The create is refused when the community's per-month cap would be exceeded for the configured subject, window, and timezone. No pass row is written. Subject, window, or timezone unset also refuses the create. The pass stores the issuer's `unit` and `household_id` at create time | PROPOSED. Subject, window, timezone, and which statuses count are UNKNOWN (Q-002). PROPOSED count: overlapping passes count, in any of scheduled, active, expired, or revoked |
| PAC-005 | Permission to park is `start <= now < end` and not revoked. A pass with `start > now` is `scheduled` and is not permission. When `now >= end`, a read shows `expired`. Expiry is that comparison on the server clock. It does not wait for a background writer, and it does not create a violation | PROPOSED |
| PAC-006 | A second pass for the same plate in the same community is refused when an existing pass is not revoked and `now < end`. That includes a scheduled pass | PROPOSED (Q-004) |
| PAC-007 | Revoking a pass before the end time records the session actor and the server time. The issuer may revoke a pass they issued. An admin may revoke any pass in the community. Afterwards the guest link uses the dead-link line in PAC-009 | PROPOSED. Who may revoke is still Q-003 |
| PAC-008 | No screen assigns a pass to a numbered spot, including guest create | PROPOSED |
| PAC-009 | A live guest link shows that pass's plate, window, and the community's guest rules, and nothing else. If the pass has not started, the page does not call it permission to park. An unknown token, a revoked pass, an expired pass, and an expired link all render one line, "this link is not valid," and do not show a plate or which of those cases it was. The link's `expires_at` is the pass end | PROPOSED (Q-009) |
| PAC-010 | The guest token is generated by the server, is at least 128 bits, and is stored only as a hash. The raw token is shown once. Lookups compare the hash. The server limits lookups per source using the community's configured limit. Over-limit attempts get the same invalid line as an unknown token. A missing limit refuses the lookup with that same invalid line, rather than allowing unlimited lookups. A token the server did not generate is not accepted | PROPOSED. The numeric limit is UNKNOWN, same pattern as the caps |

## 7. Resident vehicles

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-020 | A resident may submit a vehicle: plate and a short description. The stored status is `pending_review`. A status on the body is ignored | PROPOSED |
| PAC-021 | Only an admin can set status to `approved` or `rejected`. The row stores that admin's session id and the server time. A body `decided_by` is ignored | PROPOSED |
| PAC-022 | A patroller, a guest link, and a signer permission do not approve a vehicle. Admin does not imply signer, and signer does not imply admin | PROPOSED (Q-014) |
| PAC-023 | An edit by the resident to an approved vehicle sets that vehicle back to `pending_review`. The previous approval is not still in force | PROPOSED |
| PAC-024 | At most one `approved` vehicle row exists for a plate in a community | PROPOSED |
| PAC-025 | An admin may revoke an approved vehicle. The row remains for export. It is no longer a pass to park | PROPOSED |

## 8. Plate check

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-030 | A patroller or an admin submits a plate and receives one payload for their community only: the approved vehicle or none, the pass that is scheduled or currently permission to park or none, and the open warnings (at most one) with `grace_ends_at` and whether grace has ended. The three parts are independent. A plate can have all of them. "No record" means all three are empty. A warning whose grace has ended stays in the payload until the violation is closed | PROPOSED |
| PAC-031 | The check does not return phone numbers, photo bytes, or other residents' vehicles | PROPOSED |
| PAC-032 | The check does not offer dispatch, payment, or a camera capture | PROPOSED |
| PAC-033 | A plate with no vehicle, no scheduled or current pass, and no open warning returns a clear "no record" result. It does not create a violation | PROPOSED |

## 9. Violations

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-040 | A patroller or an admin creates a violation for a plate in their community. The stored status is `warning`. A create that asks for any other first outcome is refused. There is no stay to attach it to | PROPOSED |
| PAC-041 | A warning requires at least one photo stored with the violation. The server accepts only JPEG, PNG, or WebP, detected from the bytes. A client content type is ignored. SVG, HTML, and any other type are refused. The upload must be within the community's configured maximum size; a missing maximum refuses the upload. If the type, the size, or the write fails, the warning is not issued. The object is private. A read is allowed only for a role in the privacy table, and only through a short-lived URL whose content type is the server's type | PROPOSED (Q-007). The byte maximum's number is not chosen. An uncapped or public URL fails this id |
| PAC-042 | Issuing the warning sets `grace_ends_at` from the community configuration and the server clock. If grace is not configured, the warning is refused | PROPOSED. Length UNKNOWN (Q-005) |
| PAC-043 | While `now < grace_ends_at`, the plate check shows the warning and the grace end time. A tow-authorization signature is refused | PROPOSED |
| PAC-044 | When `now >= grace_ends_at`, the violation is eligible for a tow-authorization record. Eligibility is that comparison at read time. Nothing has to write a `grace_elapsed` status first. The product does not create the authorization automatically and does not contact a tow company. The plate check still shows the warning | PROPOSED (Q-006) |
| PAC-045 | An admin, or the patroller who filed the warning, may close it with a reason. Closing does not delete the row or the photos. The permissions table is the source of truth for who | PROPOSED |
| PAC-046 | A second warning for the same plate in the same community is refused while one warning is not closed | PROPOSED |

## 10. Tow authorization

The scope names the writing CVC §22658. What the statute, the signs, or the HOA rules require the writing to contain is UNKNOWN and is RADAR's question (Q-016). These ids are the product's record, not a legal opinion.

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-050 | An account with the signer permission may create a draft linked to one warning in the same community once `now >= grace_ends_at` on the server clock. The check is that permission and that comparison. It is not a stored `grace_elapsed` flag, a test of committee membership, or a person's name | PROPOSED |
| PAC-051 | Signing stores the session signer id, the server time, the plate, the violation id, and the uploaded writing. The row becomes `signed`. The writing is a private object. PROPOSED types, detected by the server: PDF, JPEG, or PNG. HTML and SVG are refused. A client content type is ignored. A read uses a short-lived URL after the privacy-table check, with `Content-Disposition: attachment` and the server's content type. The same size rule as PAC-041 applies | PROPOSED |
| PAC-052 | Sign has no outbound effect. There is no dispatch, no vendor API, and no tow-company account | PROPOSED |
| PAC-053 | A patroller, a resident, a guest link, and an admin who lacks the signer permission cannot sign | PROPOSED |
| PAC-054 | A signed row is not edited in place. A signer, or an admin, may void it. The void stores `voided`, a reason, the session actor, and the server time, and keeps the original artifact | PROPOSED |
| PAC-055 | No rule in code treats a named person as the only signer | PROPOSED |

## 11. Export and audit

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-060 | An admin, or a signer, can export one community: passes, vehicles, violations, photo files, tow-authorization records, configuration, and audit events. The archive contains the bytes. It does not publish a permanent file URL. A signer without admin still has this action | PROPOSED (Q-010) |
| PAC-061 | The export contains no row whose `community_id` is different | PROPOSED |
| PAC-062 | Each create, approve, reject, revoke, warning, sign, void, close, export, invite, and bootstrap appends an audit event with the session actor, action, entity, community, and server time | PROPOSED |
| PAC-063 | Audit events are included in the export and are not editable | PROPOSED |

## 12. Roles, session, and tenancy

The permissions table in `TECHNICAL_DESIGN.md` section 10 is the source of truth for who may void, close, export, create a pass, and revoke a pass. Screens in `UX_DESIGN_SPEC.md` match that table.

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-070 | Accounts exist for residents, patrollers, and admins. A signer permission is separate and may be added to an account. Guests have a link, not an account. The tow company has neither | PROPOSED |
| PAC-071 | A server session for community A cannot read or write community B, including by guessing an id. The session's community is chosen by the server | PROPOSED |
| PAC-072 | Caps, grace, month window, timezone, upload maximum, guest-lookup limit, and the guest-rule text are loaded from configuration for that community. The numbers 700 and 75 do not appear in code. California is not a hardcoded timezone | PROPOSED. The profile values themselves are Q-015. The timezone value is Q-002 |
| PAC-073 | There is no public self-signup. The first admin for a community is created by an operator action bound to that one community, recorded in the audit log, and not by a rule that names a person. Residents and patrollers are created only by an invite from an admin of that community. The invite's community is the admin's session community. Accepting it cannot select another | PROPOSED shape. The credential method is UNKNOWN (Q-019) |
| PAC-074 | The server loads permissions from the account identified by the session. The body cannot set them | PROPOSED |
| PAC-080 | A row without `community_id` cannot be saved | PROPOSED |
| PAC-090 | Approved data survives a browser reload. The pilot is not the in-memory mock | PROPOSED |
| PAC-104 | On every authenticated request the server ignores body `community_id`, actor, `decided_by`, `permissions`, and `now`. It uses the session and the server clock. A missing session is a refusal, not an anonymous write | PROPOSED |

## 13. Failure behavior

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-100 | Cap exceeded, missing cap, missing grace, missing month subject, missing month window, missing timezone, missing upload maximum, missing guest-lookup limit, or a photo that does not store: the parent action is refused. No half-written warning or pass remains | PROPOSED |
| PAC-101 | A status field on a resident vehicle request does not approve the vehicle, including when the client sends `approved` | PROPOSED |
| PAC-102 | Sign is refused while `now < grace_ends_at`, when the link to the warning is missing, when the warning is closed, or when the caller lacks signer permission. Nothing is sent outside the system. Sign does not wait for a stored `grace_elapsed` row | PROPOSED |
| PAC-103 | The server clock is the clock for expiry, scheduled versus current permission, and grace. Client-supplied "now" is ignored | PROPOSED |

## 14. Questions

Q-001 through Q-019 in `PRD.md` section 11. This FRD does not pick values for the UNKNOWN rows.
