# Zonr functional requirements — pilot

Design baseline: the single-community pilot in `PRD.md`. Code baseline: `main` `99d283e`. Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. Acceptance ids in sections 6 through 12 are the pilot's behavior. They are not implemented. Section 5 is what the code does today (VERIFIED) and must not be treated as the pilot.

Success of the pilot against these ids is PROPOSED and UNAPPROVED (`PRD.md` section 4).

## 1. Purpose

State the pilot rules so a later build can be checked, and state the prototype behaviors that violate those rules.

## 2. Scope

In scope: guest passes, the vehicle registry, plate check, violations, tow-authorization records, export, roles, and tenant scope. Out of scope: cameras, payments, tow dispatch, numbered spots, property-system sync, and a second community's product surface (`PRD.md` section 3.4).

## 3. Success

A build matches this FRD when every PAC id below holds for one configured community and a second `community_id` cannot be read through the first community's session (PROPOSED, UNAPPROVED).

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| An acceptance id for statute text | UNKNOWN. RADAR (`PRD.md` Q-016) |
| An acceptance id for a price or a market size | UNKNOWN |
| Preserving resident self-approval | VERIFIED gap. Closed by PAC-020 |
| A test that the mock's `tow-dispatched` value still exists | The pilot does not have that action |

## 5. Prototype behavior that fails the pilot

Checked at `99d283e` (VERIFIED).

| What the code does | Pilot id it fails |
| --- | --- |
| No login. Every route is public | PAC-070 |
| Resident save can set status to `approved` | PAC-020 |
| Guest create stores minutes and does not expire them. No caps | PAC-001, PAC-004, PAC-005 |
| Spots have ids (A1, B7, C4) and a manager assigns them | PAC-008 |
| New violations may be `tow-dispatched` with a fixed GPS string and `photoCount: 1`. No photo file | PAC-040, PAC-042 |
| Nothing exports | PAC-060 |
| No `community_id` | PAC-080 |
| Reload restores the seed. Nothing is durable | PAC-090 |

Open pull request #2 changes demo plates and adds a banner. It does not add accounts, caps, or approval rules (VERIFIED: that branch's diff is the four files named on the pull request). It is not merged.

## 6. Guest passes

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-001 | Creating a pass requires `community_id`, a non-empty plate, a start time, and an end time. The end is after the start. The plate is stored in uppercase with outer spaces removed | PROPOSED |
| PAC-002 | The pass does not have a stall id | PROPOSED |
| PAC-003 | The duration is less than or equal to the community's per-stay cap. The cap is configuration. If the cap is missing, the create is refused | PROPOSED. Cap value UNKNOWN (Q-001) |
| PAC-004 | The create is refused when the community's per-month cap would be exceeded for the configured subject. No pass row is written | PROPOSED. Subject and amount UNKNOWN (Q-002) |
| PAC-005 | When the end time is reached, the pass is expired. It no longer counts as permission to park. Expiry does not create a violation by itself | PROPOSED |
| PAC-006 | A second active pass for the same plate in the same community is refused | PROPOSED (Q-004) |
| PAC-007 | Revoking an active pass before the end time records the actor and the time. A guest link for that pass then shows that it is no longer valid | PROPOSED. Who may revoke is Q-003 |
| PAC-008 | No screen assigns a pass to a numbered spot | PROPOSED |
| PAC-009 | The guest opens one link and sees that pass's plate, window, and the community's guest rules. The link does not list other plates, phones, or photos | PROPOSED (Q-009) |

## 7. Resident vehicles

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-020 | A resident may submit a vehicle: plate and a short description. The stored status is `pending_review`. The request body may include a status; it is ignored | PROPOSED |
| PAC-021 | Only an admin can set status to `approved` or `rejected`. The row stores that admin's id and the time | PROPOSED |
| PAC-022 | A patroller, a guest link, and a signer permission do not approve a vehicle. Admin does not imply signer, and signer does not imply admin | PROPOSED (Q-014) |
| PAC-023 | An edit by the resident to an approved vehicle sets that vehicle back to `pending_review`. The previous approval is not still in force | PROPOSED |
| PAC-024 | At most one `approved` vehicle row exists for a plate in a community | PROPOSED |
| PAC-025 | An admin may revoke an approved vehicle. The row remains for export. It is no longer a pass to park | PROPOSED |

## 8. Plate check

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-030 | A patroller or an admin submits a plate and receives, for their community only: approved vehicle or none, active pass or none, and whether a warning is inside its grace period | PROPOSED |
| PAC-031 | The check does not return phone numbers, photos, or other residents' vehicles | PROPOSED |
| PAC-032 | The check does not offer dispatch, payment, or a camera capture | PROPOSED |
| PAC-033 | A plate with no rows returns a clear "no record" result. It does not create a violation | PROPOSED |

## 9. Violations

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-040 | A patroller or an admin creates a violation for a plate in their community. The first stored outcome is `warning`. A create that asks for any other first outcome is refused | PROPOSED |
| PAC-041 | A warning requires at least one photo stored with the violation. If the photo write fails, the warning is not issued | PROPOSED (Q-007) |
| PAC-042 | Issuing the warning starts the grace period from the community configuration. If grace is not configured, the warning is refused | PROPOSED. Length UNKNOWN (Q-005) |
| PAC-043 | During grace the plate check shows the warning and the grace end time. A tow-authorization signature is refused | PROPOSED |
| PAC-044 | When grace ends, the violation is eligible for a tow-authorization record. The product does not create that record automatically and does not contact a tow company | PROPOSED (Q-006) |
| PAC-045 | An admin or the patroller who filed it may close a violation with a reason. Closing does not delete the row or the photos | PROPOSED |

## 10. Tow authorization

The scope names the writing CVC §22658. What the statute, the signs, or the HOA rules require the writing to contain is UNKNOWN and is RADAR's question (Q-016). These ids are the product's record, not a legal opinion.

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-050 | An account with the signer permission may create a draft linked to one warning whose grace has ended, in the same community. The check is that permission. It is not a test of committee membership or of a person's name | PROPOSED |
| PAC-051 | Signing stores the signer id, the time, the plate, the violation id, and the uploaded writing. The row becomes `signed` | PROPOSED |
| PAC-052 | Sign has no outbound effect. There is no dispatch, no vendor API, and no tow-company account | PROPOSED |
| PAC-053 | A patroller, a resident, a guest link, and an admin who lacks the signer permission cannot sign | PROPOSED |
| PAC-054 | A signed row is not edited in place. A void writes a new state, a reason, an actor, and a time, and keeps the original artifact | PROPOSED |
| PAC-055 | No rule in code treats a named person as the only signer | PROPOSED |

## 11. Export and audit

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-060 | An admin, or a signer, can export one community: passes, vehicles, violations, photo files, tow-authorization records, configuration, and audit events | PROPOSED (Q-010) |
| PAC-061 | The export contains no row whose `community_id` is different | PROPOSED |
| PAC-062 | Each create, approve, reject, revoke, warning, sign, void, close, and export appends an audit event with actor, action, entity, community, and time | PROPOSED |
| PAC-063 | Audit events are included in the export and are not editable | PROPOSED |

## 12. Roles and tenancy

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-070 | Accounts exist for residents, patrollers, and admins. A signer permission is separate and may be added to an account. Guests have a link, not an account. The tow company has neither | PROPOSED |
| PAC-071 | A session for community A cannot read or write community B, including by guessing an id | PROPOSED |
| PAC-072 | Caps, grace, and the guest-rule text are loaded from configuration for that community. The numbers 700 and 75 do not appear in code | PROPOSED. The profile values themselves are Q-015 |
| PAC-080 | A row without `community_id` cannot be saved | PROPOSED |
| PAC-090 | Approved data survives a browser reload. The pilot is not the in-memory mock | PROPOSED |

## 13. Failure behavior

| Id | Behavior | Label |
| --- | --- | --- |
| PAC-100 | Cap exceeded, missing cap, missing grace, or a photo that does not store: the parent action is refused. No half-written warning or pass remains | PROPOSED |
| PAC-101 | A status field on a resident vehicle request does not approve the vehicle, including when the client sends `approved` | PROPOSED |
| PAC-102 | Sign is refused while grace has not ended, when the link to the warning is missing, or when the caller lacks signer permission. Nothing is sent outside the system | PROPOSED |
| PAC-103 | The server clock is the clock for expiry and grace. Client-supplied "now" is ignored | PROPOSED |

## 14. Questions

Q-001 through Q-018 in `PRD.md` section 11. This FRD does not pick values for the UNKNOWN rows.
