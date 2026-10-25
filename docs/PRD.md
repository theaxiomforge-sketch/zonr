# Zonr product requirements — single-community pilot

Design docs merged to `main` at `7c3588c`. Mock code baseline: `99d283e` ("Opt Pages workflow into Node 24"). Design baseline: Henry approved resuming design on a single-community pilot (2026-10-22). S-1 and S-3 are accepted (D-092). S-2 is D-067 (Henry, 2026-10-23). S-4, S-5, and S-6 stay PROPOSED and UNAPPROVED.

`pilot-scope.md` and FOUNDRY's `assessment.md` were named as the inputs. They were not in the repository, and no Drive file with those titles was found. This PRD uses the scope the task stated. It does not add findings and attribute them to FOUNDRY. Anything those files may say beyond section 3 is UNKNOWN.

## 1. How a claim is labeled

| Label | Meaning |
| --- | --- |
| VERIFIED | Checked in the git tree at `99d283e`, or in GitHub state read for this rewrite |
| INFERRED | A conclusion from those facts or from Henry's stated intent. Not a measurement |
| UNKNOWN | Not in the repo and not settled by the approved scope |
| PROPOSED | A design choice or success test written here. Not an approval |

Legal content (what CVC §22658 requires, signage, this HOA's rules, California privacy applicability) is UNKNOWN. Those questions go to RADAR. This PRD does not restate RADAR's 2026-10-22 research brief as law or as product requirements.

## 2. Purpose

### 2.1 What the repository is today

Zonr at `99d283e` is a public Vite + React + TypeScript mock: five pages, one in-memory seed, no accounts, no server (VERIFIED). The resident editor can set a permit to approved, review, or revoked (VERIFIED, `src/pages/ResidentPage.tsx`). The pilot does not keep that status control. D-067 (Henry, 2026-10-23, VERIFIED as his statement): a resident adds, updates, and removes their own vehicle with no admin pre-approval. An admin may remove any registered vehicle or put it on hold.

The mock is not the pilot. Guest sessions do not expire, spots are numbered buttons, violations can be stored as `tow-dispatched`, and nothing is exported (VERIFIED).

Open pull request #2 (`935e9df`, not merged) replaces eight seeded plates with `DEMO001`–`DEMO008` and adds a demo banner (VERIFIED on that branch only). `main` does not have that commit.

### 2.2 What this design is

A pilot for one community, shaped so a later second community does not require a schema change. The pilot build does not include multi-community features. It does include `community_id` on every record, tenant-scoped access, and community configuration for caps, grace, and rules. No pilot number is hardcoded in logic (PROPOSED).

Henry's strategic intent, given as his words for 2026-10-22: after piloting at his own community, he will market Zonr to other communities, and he is open to selling the company (VERIFIED as that statement). Selling terms are UNKNOWN.

## 3. Scope

### 3.1 Pilot site

| Item | Statement | Label |
| --- | --- | --- |
| Site | Bridgeway HOA, one California HOA | D-094. Henry's profile for the pilot. Not a new measurement in this repo |
| Size | About 700 homes | D-094. Henry's profile figure. Stored as community profile data, not as a constant |
| Guest parking | About 75 unnumbered guest spots | D-094. Tracking is by plate and time, not by stall number |
| Identity | Plate and time | Approved scope |

### 3.2 Buyer and users

| Party | Role in the pilot | Label |
| --- | --- | --- |
| HOA board | Buyer. Buys on the committee's recommendation | Approved scope |
| Residents | Users. Register vehicles. Issue guest passes within caps. See their own vehicles and passes only | Approved scope, plus D-082 and D-095 |
| Volunteer patrollers | Users. Plate check and violation log, including the second warning | Approved scope, plus D-085 |
| Admins | Users. Hold or remove a registered vehicle, configure rules, export, issue and revoke guest passes. They do not pre-approve a resident's vehicle. One account may also hold signer. That is a second permission | Approved scope for the admin user, plus D-067 for hold and remove, D-082 for passes, and D-093 for the two permissions |
| Guests | Not accounts. A link only | Approved scope |
| Tow company | Not a user. No login, no dispatch action | Approved scope |
| Board or committee member | Signs the written tow authorization. Not a tow dispatcher | Approved scope |

INFERRED: Henry sits on the pilot HOA's committee and would also be the vendor. That office is not a verified title in this repo. D-091: before resident data is collected, the board gets a written disclosure and a short board-signed pilot agreement. The pilot is free. Those two documents are planned documents and already exist outside this repository. They are not copied here, because Henry has not decided whether the repository is public.

### 3.3 In scope for the pilot build

| Capability | Rule |
| --- | --- |
| Guest passes | By plate, with an expiry. The pilot stay cap is 72 hours (D-080). The pilot month cap is 4 passes per household per calendar month in Pacific time (D-081). A per-day household cap is configuration and its number is not set (D-100, Q-034). Caps are community configuration, not code constants |
| Resident vehicles | A registry the resident keeps. A resident adds, updates, and removes their own vehicle. There is no admin pre-approval. An admin may remove any registered vehicle in the community or put it on hold (D-067). A resident cannot edit or remove a vehicle that is on hold. Only an admin may release that hold, and the status becomes `active` (D-075). That target is derived from D-069, which frees the vehicle for resident edits. Henry can correct the target status. A resident may register any number of vehicles (D-070). A resident sees only their own vehicles and passes (D-095). Each vehicle may have 3 plate changes in a rolling 30 × 24 hours (D-073, D-099). The 4th in that window is refused, and that refusal alerts an admin (D-100). The alert's delivery channel is not chosen (Q-038). Description-only edits do not count. Admins see every plate change in the audit events that already store the previous and new plate. An admin hold, an admin removal, and a release of a hold each notify that vehicle's resident by email and by text (D-072, D-098, D-102). The wording of those notices is not chosen (Q-037). A resident phone number is required (D-087). A plate check of a held vehicle shows "on hold, don't act" and offers no warning and no tow (D-077) |
| Plate check | A patroller enters a plate and sees pass, vehicle, and open warning state for that community. When the vehicle is `on_hold`, the result is status `on_hold` and action `none`, and the screen says "on hold, don't act". There is no warning and no tow (D-077) |
| Violations | A log with photos. First outcome is a warning. The reason is a code from a fixed list, and an empty reason is refused (D-076). The codes and labels are PROPOSED in section 11.2 and in `FRD.md`. Each warning needs at least one photo (D-086). Grace after the first warning is 3 days (D-084). A second warning on that same open violation is required before a tow authorization (D-085). The gap between the two warnings, and whether they must use the same reason, are not chosen (Q-033) |
| Tow authorization | A record of a written authorization the scope names as CVC §22658, signed by a board or committee member, and refused until the second warning exists and grace has ended (D-085). Zonr stores the record. Zonr does not authorize or dispatch a tow. What the statute requires the writing and the signs to contain is still Q-016 |
| Disputes | Records export per community, including the audit trail |
| Tenancy principle | `community_id` required on every record. Access is scoped to that id. Caps, grace, and rules are rows, not code |

### 3.4 Out of scope for the pilot build

Plate cameras, payments, tow dispatch, numbered spots, and property-system sync are out of the pilot build (approved scope). A community switcher, a second community's signup, billing, and a sales site are also out. Designing the schema so those could exist later is in scope. Building them is not.

Market sizing, statute text, signage rules, and this HOA's governing documents are out of this PRD. Q-016 records RADAR's findings as proposed notes, not as rules. The board disclosure and the pilot agreement are planned documents outside this repository (D-091).

## 4. Success

S-1 and S-3 are accepted (D-092). S-2 is D-067 (Henry, 2026-10-23, VERIFIED as his statement). S-4, S-5, and S-6 stay PROPOSED and UNAPPROVED. Those three are not targets the pilot has accepted.

| Id | Criterion | Status |
| --- | --- | --- |
| S-1 | A resident of the pilot community can issue a guest pass for a plate. The pass has an expiry. A pass that would break the stay cap or the month cap is refused and not stored | Accepted (D-092). The stay cap is 72 hours (D-080). The month cap is 4 passes per household per Pacific calendar month (D-081) |
| S-2 | A resident can add, update, and remove their own vehicle. There is no admin approval step. The status after add is `active`. An admin can hold or remove any vehicle in the community. A resident cannot put a vehicle on hold | Accepted (D-067) |
| S-3 | A patroller can check a plate and file a warning with at least one photo. The grace clock starts at that warning | Accepted (D-092). The photo rule is D-086. Grace is 3 days (D-084). D-085 adds a second warning before tow authorization. That step is not a change to this sentence |
| S-4 | A tow-authorization record can be signed only by an account with the signer permission, only after a warning and the configured grace, and the sign action sends nothing to a tow company. The product does not test committee membership or a named person | PROPOSED and UNAPPROVED. The design also refuses the signature until a second warning exists (D-085) |
| S-5 | An admin can export one community's passes, vehicles, violations, photos, authorizations, and audit events without exporting another community | PROPOSED and UNAPPROVED. The format, if this row is later accepted, is CSV plus photo files, and a signer can run it too (D-089) |
| S-6 | Adding a second `community_id` in data does not require a schema change. The pilot UI does not offer a second community | PROPOSED and UNAPPROVED |

No adoption rate, revenue, or time-saved figure is a success criterion. Those would be UNKNOWN market claims.

## 5. Non-goals

| Non-goal | Why |
| --- | --- |
| Treat the GitHub Pages mock as the pilot system of record | VERIFIED: it is a public static demo with no accounts |
| Require admin pre-approval of a resident's own vehicle | D-067. The resident adds, updates, and removes that vehicle. An admin may hold or remove it |
| Number the 75 guest spots | Approved scope: unnumbered. Count is profile data |
| Call, email, or otherwise dispatch a tow company | Tow company is not a user. Signing a record is not a dispatch |
| Explain CVC §22658, signage, or HOA rules in this set | UNKNOWN. RADAR |
| Pick a market size or a competitor set | UNKNOWN. RADAR for sizing. The pilot price is free (D-091) |
| Build multi-community product features | Principle only, section 8 |
| Hardcode Henry, or any committee-member exception, as the signer or the admin | Acquirability. The permission is a role, not a person |

## 6. Pilot behavior the design commits to

Detail and acceptance ids are in `FRD.md`. States and invariants are in `TECHNICAL_DESIGN.md`.

1. Every stored row carries `community_id`. A query without that scope returns nothing. On pass, vehicle, violation, authorization, export, and config requests, the community, the actor, and the permissions come from the server session, and those fields on the body are ignored. A guest-link read, invite acceptance, and the operator bootstrap have no session (PROPOSED, I-2).
2. Guest passes are plate plus a time window. They do not name a stall. A pass is permission to park only while `start <= now < end` and it is not revoked (D-082, D-083). Residents and admins create them. The issuing resident or an admin revokes. One plate cannot have two unrevoked passes that have not ended, including a pass that has not started (D-083).
3. Caps and grace are read from the community's configuration. The pilot values are 72 hours per stay (D-080), 4 passes per household per Pacific calendar month (D-081), and 3 × 24 hours of grace from the first warning (D-084). The daily household cap is configuration and is unset (Q-034). Missing configuration fails closed: the action is refused.
4. A resident adds, updates, and removes their own vehicle. The server sets `active` on add. An admin may hold an `active` vehicle or remove an `active` or `on_hold` vehicle in the community. There is no approval transition (D-067). A resident cannot edit or remove a vehicle that is `on_hold`, including when that session also has admin. Only an admin removing the hold frees it for resident edits and removal (D-069). D-075: that release is an admin action, a resident and a patroller cannot do it, and the status becomes `active`. That target is derived from D-069. Henry can correct it. A resident may register any number of vehicles. The schema and the add check have no count of that account's vehicles (D-070). A resident sees only their own vehicles and passes (D-095). One plate still has at most one vehicle that is not `removed` (PAC-024). A plate or description edit keeps the previous and new values on the audit event. It does not change a plate already stored on a warning. A plate change is an edit whose stored plate changes. Each vehicle may have 3 such changes while each counted event has age under 30 × 24 hours, and the 4th while three still count is refused (D-073, D-099). An event drops out at exactly 30 × 24 hours. Description-only edits do not count. The count is per vehicle. Admins see those changes in the same audit events. The refused 4th also writes an admin alert (D-100). Its delivery channel is Q-038. An admin hold, an admin removal, and a release each notify that vehicle's resident by email and by text (D-072, D-098, D-102). A resident's own removal does not. The wording is Q-037. If the text send fails, the email still goes, the failure is stored, and no other number is tried. D-077: a plate check of an `on_hold` vehicle returns status `on_hold` and action `none`, and the screen says "on hold, don't act". A warning, including the second warning, and a tow authorization for that plate are refused while the hold lasts. After the release in D-075, those actions follow their usual rules again.
5. Every new violation's first stored outcome is a warning with at least one photo (D-086) and a reason chosen from a fixed list (D-076). An empty reason is refused. `other` also requires a short description. The warning stores the plate submitted at filing. There is no stay record. Grace runs 3 × 24 hours from that first warning (D-084). A second warning is a later step on the same open violation, with its own reason and its own photo (D-085, D-086). It is not a second violation row. A tow-authorization signature is a later record, not a violation status called "dispatched", and it is refused until that second warning exists. The codes and labels are PROPOSED in section 11.2 and in `FRD.md`. The minimum gap and whether the second reason must match the first are Q-033. A warning, including the second warning, is also refused while that plate's current non-removed vehicle is `on_hold`, and a tow authorization for that plate is refused for the same reason (D-077).
6. The signed authorization stores who signed, when, the warning's plate, the linked warning, and the written artifact. It has no dispatch side effect. It is refused until the second warning exists and grace has ended (D-085). What the writing must contain is Q-016.
7. Guests open a link for one pass (D-088). While the pass has not ended and is not revoked, the page shows that pass. After the end, and for 24 hours, an unrevoked pass stays viewable and is marked ended. A revoked pass, an unknown token, and a pass more than 24 hours past its end each show only "this link is not valid." The page does not show other plates, phones, or photos.
8. Export is per community, run by an admin or a signer, as CSV plus photo files (D-089). It includes enough to reconstruct a dispute: the warning's stored plate, reason code, and reason text, including the second warning when one exists. That stored plate is the plate as filed. It remains the proof after an audit event is purged, and it lives on the violation until that record is purged at 36 months (D-101). While an audit event is still kept, the export also includes its previous and new plate. Audit events are kept for 365 days and then purged (D-074). Violation records and tow authorizations are kept for 36 months (D-101). Deletion of plates, photos, and phones outside those two decisions is Q-011.

## 7. Vehicle registry

VERIFIED today: the resident form includes a status control whose options are approved, review, and revoked, and save writes that status through `updatePermit`. There is no actor and no role.

Pilot rule (D-067): there is no admin pre-approval and no `approved` status. A resident adds, updates, and removes their own vehicle. The server ignores a status field on the body. Add stores `active`. An edit of that resident's own `active` vehicle stays `active`. Hold and remove are separate actions, not a status on the body. An admin may put a vehicle on hold or remove it. D-069: a resident cannot edit or remove a vehicle while it is `on_hold`. D-075: only an admin can release the hold. A resident and a patroller cannot. The status becomes `active`, which is the state those resident edits already require. That target is derived from D-069. Henry can correct it. The release audit event records the admin, the server time, and an optional reason. The resident is notified by email and by text (D-102). After that release, a plate check no longer says "on hold, don't act", and a warning or a tow authorization is no longer refused because of the hold (D-077). D-070: a resident may register any number of vehicles. Add does not count that account's vehicles. D-071, D-073, and D-099: each vehicle may have 3 plate changes while each counted event is under 30 × 24 hours old. The 4th while three still count is refused, the row stays as it was, and an admin alert is written (D-100). A description-only edit is not a plate change. Creating a vehicle is not a plate change. The count is per vehicle, including two vehicles of one resident. An event counts while its age is under 30 × 24 hours and drops out at exactly that age. The audit row stays. Admins see every plate change because the vehicle edit audit event already stores the previous and new plate. There is no second log. D-072, D-098, and D-102: an admin hold, an admin removal, and a release each notify that vehicle's resident by email and by text. The wording is Q-037. The same ignore rule covers `community_id`, actor, `decided_by`, `held_by`, `removed_by`, and permissions on pass, vehicle, violation, authorization, export, and config requests (`FRD.md` PAC-104). `community_id` stays required on the vehicle row.

## 8. Multi-community principle, not a build

Henry will market to other communities after this pilot (VERIFIED as his 2026-10-22 statement). The pilot therefore:

| Principle | Pilot build | Not built |
| --- | --- | --- |
| `community_id` on every record, including config, audit, and files | Yes | — |
| Every read and write is filtered by the caller's community | Yes | A screen to join or switch communities |
| Caps, grace, and house rules are configuration for that id | Yes | A marketplace of rule templates |
| No constant for 700, 75, California, or the pilot name | Yes | — |
| Export runs for one community | Yes | Deletion or tokenization. The dispute window is Q-011 and is not a pilot screen. A bulk sale-of-company tool is also not built |

## 9. Acquirability, documented only

Henry is open to selling the company (VERIFIED as his statement). Terms are UNKNOWN. The pilot does not build a diligence product. It does keep these practices so a later sale is not blocked by the pilot's shape (PROPOSED checklist, not a legal opinion):

| Practice | Today | Pilot |
| --- | --- | --- |
| IP and licence inventory | [LICENSE.md](../LICENSE.md) is the copyright notice (D-096). Henry (TheAxiomForge) personally owns the IP. The notice is not an open-source license. npm dependencies are declared in `package.json` (VERIFIED) | The notice stays at the repo root. It is not a feature |
| Export and portability | None (VERIFIED) | Per-community CSV plus photo files, by admin and by signer (D-089). S-5 itself stays PROPOSED |
| Privacy and retention | None (VERIFIED). California privacy law applicability is UNKNOWN and goes to RADAR | Policy in `TECHNICAL_DESIGN.md` section 8. Audit events: 365 days (D-074). Violation records and tow authorizations: 36 months (D-101). Plates, photos, and phones: Q-011 |
| Audit trail | None (VERIFIED) | Actor, action, entity, community, time |
| Architecture and ops | This doc set plus the Pages runbook | Keep them current when behavior changes |
| No person-specific logic | The mock has no users (VERIFIED) | Roles, not named people. No committee-member-specific logic, and no constant that names Henry or any other person as signer or admin |

The pilot MVP is section 3.3 only. Sections 8 and 9 are principles so a later sale or a second community is not blocked. They are not extra features. A community switcher, billing, a diligence portal, and a second HOA's signup are non-goals, not a build (PROPOSED).

## 10. Conflict of interest

INFERRED: Henry sits on the pilot HOA's committee and would also be the vendor. That office is not a verified title in this repo. D-091: the board gets a written disclosure and a short board-signed pilot agreement before resident data is collected, and the pilot is free. Those documents are planned documents outside this repository. They are not committed here. The product must not encode "Henry may sign" as a special case. Signer remains a permission (D-093).

## 11. Decisions and open questions

Legal and market questions are listed here and routed to RADAR. Henry still has to accept or reject the product choices that are open.

### 11.1 Decisions

| Id | Decision | Source |
| --- | --- | --- |
| D-067 | A resident adds, updates, and removes their own vehicle. There is no admin pre-approval. An admin may hold or remove any registered vehicle in the community | Henry, 2026-10-23, VERIFIED as his statement. S-2 |
| D-069 | A resident cannot edit or remove a vehicle that is on hold, including when that session also has admin. Only an admin removing the hold frees it for resident edits and removal. Admin removal of the vehicle, which sets `removed`, is a different action | Henry, VERIFIED as his statement. Resolves Q-021. Who may release is D-075 |
| D-070 | There is no cap on how many vehicles one resident may register. Add does not count that account's vehicles. One plate still has at most one vehicle that is not `removed` | Henry, VERIFIED as his statement. Resolves Q-022 |
| D-071 | A limit on plate changes is required, and admins can see plate changes | Henry, VERIFIED as his statement. The limit and the view are D-073. D-100 adds the admin alert and the daily guest-pass cap |
| D-072 | The resident is notified when an admin holds or removes their vehicle. A resident's own removal does not send that notice | Henry, VERIFIED as his statement. Resolves Q-024. The channel is D-098. The wording is Q-037 |
| D-073 | The limit is 3 plate changes per vehicle per 30 days. The 4th change in that window is refused. Description-only edits do not count. Admins can see all plate changes. Those changes are the vehicle audit events that already store the previous and new plate | Henry, VERIFIED as his statement. Resolves Q-023. The window is D-099 |
| D-074 | Audit log retention is 365 days. An audit event is kept through day 365 and purged once it is past 365 days. The job does not archive it. Violation records and tow authorizations are not part of this decision | Henry, VERIFIED as his statement. Resolves Q-025. D-101 sets 36 months for those two records. Distinct from Q-011 |
| D-075 | Only an admin can release a hold on a vehicle. A resident and a patroller cannot. The release sets the status to `active`. That target is derived from D-069, which frees the vehicle for resident edits, and those edits exist only while the status is `active`. Henry can correct the target status. The audit event records the admin, the server time, and an optional reason | Henry, VERIFIED as his statement. Resolves Q-026. The release notice is D-102 |
| D-076 | A warning with an empty reason is refused. The reason is a code from a fixed list. The entry `other` requires non-empty free text. Any other code stores no free text. `close_reason` is a different field | Henry, VERIFIED as his statement. Resolves Q-027. The codes and labels are PROPOSED in section 11.2 for Henry to confirm |
| D-077 | When a patroller checks the plate of a vehicle that is `on_hold`, the screen shows "on hold, don't act" and offers no violation action. There is no warning and no tow. The plate-check result is status `on_hold` and action `none`. The server refuses a warning and a tow authorization for that plate while the vehicle stays `on_hold`. After an admin release, those actions follow their usual rules again | Henry, VERIFIED as his statement. Resolves Q-020. The refusal includes the second warning in D-085, because that step is a warning |
| D-080 | The per-stay cap is 72 hours | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-001. Stored as this community's configuration |
| D-081 | The per-month cap is 4 passes per household per calendar month, Pacific time | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-002. Timezone `America/Los_Angeles`. A pass that overlaps that month counts, in any of scheduled, active, expired, or revoked |
| D-082 | Residents and admins create guest passes. The issuing resident or an admin revokes | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-003 |
| D-083 | One plate cannot have two unrevoked, unexpired passes in the same community, including a pass that has not started | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-004 |
| D-084 | The grace period is 3 days | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-005. Measured as 3 × 24 hours from the first warning's server timestamp. The second warning does not restart it |
| D-085 | A second warning step is required before a tow authorization. A tow authorization is refused until that second warning exists | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-006. The state, who issues it, and what the patroller sees are in section 11.2. The minimum gap and whether the same reason is required are Q-033 |
| D-086 | At least one photo is required per warning | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-007. This applies to the first warning and to the second warning |
| D-087 | Resident phone numbers are stored and are required for residents | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-008. A guest phone is not collected. The consent step in section 11.2 is PROPOSED, not a legal conclusion |
| D-088 | A guest link stops working at pass end or revoke. An ended pass that was not revoked stays viewable for 24 hours after the pass end. A revoked or unknown token shows only "this link is not valid" | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-009. The cases are in section 11.2 |
| D-089 | Export is done by an admin and by a signer, as CSV plus photo files | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-010 |
| D-090 | Retention for plates, photos, and phones stays unknown until Henry chooses among RADAR's defaults | Henry, 2026-10-25, VERIFIED as his statement. Q-011 stays open. The proposed table is in section 11.2. D-101 is not changed by that table |
| D-091 | The board gets a written disclosure and a short board-signed pilot agreement. The pilot is free | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-012. The documents stay outside this repository |
| D-092 | Henry accepts success rows S-1 and S-3 only. S-2 is already D-067. S-4, S-5, and S-6 stay proposed | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-013 |
| D-093 | One account may hold both admin and signer. Those are two permissions | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-014 |
| D-094 | The pilot HOA is Bridgeway HOA, about 700 homes, about 75 guest spots | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-015 |
| D-095 | Residents see their own vehicles and passes only | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-017 |
| D-096 | Henry personally owns the IP. The repo root notice is [LICENSE.md](../LICENSE.md): Copyright (c) 2026 Henry (TheAxiomForge). All rights reserved. It is not an open-source license | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-018. The owner name is the form already used for this repository |
| D-097 | Login is a magic link by email. There is no public sign-up. The operator creates the first admin bound to one community. Only that community's admins invite residents and patrollers | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-019. A cross-community invite is refused. A person with no email is Q-036 |
| D-098 | Hold and removal notices go by email and by text | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-028's channel. The wording is Q-037. The text uses the required resident phone (D-087) |
| D-099 | The plate-change window is a rolling 30 × 24 hours | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-029. An event counts while `now - at < 30 × 24 hours` and drops out when `now - at >= 30 × 24 hours`, including at exactly 30 × 24 hours. The audit row stays. The community timezone is not used |
| D-100 | An admin is alerted when a resident hits the plate-change limit. There is also a limit on guest passes created per day per household. That daily number is per-community configuration | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-030. The daily number is Q-034. The alert channel is Q-038. Which of the daily cap and the monthly cap is reported when both fail is Q-035 |
| D-101 | Violation records and tow authorizations are kept 36 months. The audit log stays 365 days | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-031. The plate stored on the violation is part of that record, so it survives the audit purge |
| D-102 | Releasing a hold notifies the resident by email and by text | Henry, 2026-10-25, VERIFIED as his statement. Resolves Q-032. Same delivery rules as D-098. The wording is Q-037 |

### 11.2 Questions and the rules these decisions add

Q-001 through Q-010, Q-012 through Q-015, and Q-017 through Q-032 are resolved in section 11.1. Q-011 and Q-016 stay open. Q-033 through Q-038 and Q-041 are new and stay open. The warning-reason list below stays PROPOSED. It is not a question number. S-4, S-5, and S-6 stay PROPOSED.

**Second warning (D-085).** The open violation stays one row with status `warning`. The first warning stores `warning_at`, `warning_reason`, `warning_reason_text`, `filed_by`, and at least one photo. The second warning, on that same row, stores `second_warning_at`, `second_warning_reason`, `second_warning_reason_text`, `second_filed_by`, and at least one photo of its own. A patroller or an admin issues it. A resident does not. The patroller's plate check shows the first warning and, once it exists, the second. Until the second exists, the screen offers "Issue second warning" and does not offer a tow. The server refuses a tow authorization until `second_warning_at` is set, and also while `now < grace_ends_at`. The error when the second warning is missing is "A second warning is required before a tow authorization." While the vehicle is `on_hold`, that screen offers neither warning, and the error is "on hold, don't act" (D-077). Each warning uses the reason list and the photo rule on its own (D-076, D-086). A second violation row for the same plate is still refused. No minimum gap is enforced, and the second reason does not have to match the first, because Q-033 has not set either rule.

**Guest link cases (D-088).** These are different pages.

| Case | What the page shows |
| --- | --- |
| Not revoked, and `now < start` | Plate, window, and guest rules. The pass is not permission to park yet |
| Not revoked, and `start <= now < end` | Plate, window, and guest rules. The pass is in effect |
| Not revoked, and `end <= now` and `now - end <= 24 hours` | Plate, window, and guest rules, plus "This pass has ended." At exactly 24 hours after the end, the page still shows this |
| Not revoked, and `now - end > 24 hours` | Only "this link is not valid." No plate |
| Revoked, at any time, including during the original window and during the 24 hours | Only "this link is not valid." No plate and no word that it was revoked |
| Unknown token | Only "this link is not valid." |
| Lookup over the rate limit | Only "this link is not valid." including when the token would otherwise be viewable |

The 24-hour page does not show a phone. A guest phone is not collected (D-087). RADAR's preference not to retain a guest phone is noted under Q-011 and is not a reason to shorten the 24-hour view of the plate and the window.

**Cap errors (D-080, D-081, D-100).** The stay check uses this pass's own duration. If it is over 72 hours, the error is "This pass is longer than 72 hours." and that is the message even if a household cap would also fail. When the stay is within 72 hours and only the month cap fails, the error is "This household has used its 4 guest passes for this month." When only the daily cap fails, the error is "This household has reached today's guest-pass limit." When both household caps would fail, the pass is not stored, and which of those two sentences is returned is Q-035. The daily count is passes created on the current calendar day in the community timezone, including a pass later revoked. The month count is passes whose window overlaps the calendar month, in any of scheduled, active, expired, or revoked. An unset daily cap refuses the create (Q-034).

**Text fallback (D-087, D-098, D-102).** A resident account requires a phone, so the text has a number. The hold, the removal, or the release is stored even if a send fails. The email is still sent if the text fails. The text is still sent if the email fails. Each result is stored as sent or failed. No second phone and no third channel are tried. No retry count is chosen. The wording of the email and the text is Q-037.

**Login (D-097).** There is no public sign-up screen. A sign-up request is refused with "There is no public sign-up." The operator bootstrap creates the first admin for one community and is audited. An admin of that community creates invites. An invite request that names a different community is refused and stores nothing. An invite with no email is refused. A resident invite also requires a phone. Accepting an invite cannot move the account to another community. Later sign-in is a magic link to that email. The link lifetime is Q-041. Until it is set, a magic link is not issued.

**Consent step (PROPOSED, not a legal conclusion).** RADAR notes that California Civil Code section 5230(c) may apply when a member gives a phone number to a vendor. This design does not decide that. The proposed resident invite screen asks the resident to confirm that the HOA may give their phone number to the vendor. The proposed behavior is that the account is not stored until that confirmation is given. That step is not a finding that the statute is met.

**Admin alert (D-100).** Each refused 4th plate change writes one alert for that community's admins, naming the vehicle and the resident. It does not change the count. How the alert is delivered is Q-038. It is not assumed to be email or text.

**Warning reasons (PROPOSED for Henry to confirm).** D-076 is decided: an empty reason is refused, the reason is one code, and `other` requires non-empty text. The rows below are the part still waiting for Henry. This is not a new question number, and it is not a reading of California law. A kind that is not in the list is `other`. The same table is in `FRD.md` section 9. Each of the two warnings uses this list on its own.

| Code | Label |
| --- | --- |
| `guest_time_exceeded` | Parked in a guest spot beyond the allowed time |
| `unauthorized_plate` | Unregistered or unauthorized plate |
| `fire_lane_or_red_curb` | Fire lane or red curb |
| `blocking_access` | Blocking access |
| `other` | Other |

| Id | Question | Label |
| --- | --- | --- |
| Q-001 | What is the per-stay cap, in what unit? | Resolved by D-080. 72 hours, as this community's configuration |
| Q-002 | What is the per-month cap: hours or count? Is the subject the plate, the household, or the unit? Is the window a calendar month or a rolling period, and which timezone? Which pass statuses count? | Resolved by D-081. 4 passes, household, calendar month, Pacific time (`America/Los_Angeles`). A stored pass that overlaps the month counts, in any of scheduled, active, expired, or revoked. The account and the pass carry `unit` and `household_id`. The mock's permit `unit` is a string on the prototype (VERIFIED) and is not this household id |
| Q-003 | Who may create a guest pass, and who may revoke it before expiry? | Resolved by D-082. Residents and admins create. The issuing resident or an admin revokes |
| Q-004 | May one plate have two passes in the same community that are not revoked and have not reached their end, including a pass that has not started? | Resolved by D-083. No. A not-yet-started pass is still not permission to park |
| Q-005 | How long is the grace period after a warning? | Resolved by D-084. 3 days, measured as 3 × 24 hours from the first warning. The second warning does not restart it |
| Q-006 | After grace, is the next product step only a tow-authorization record? | Resolved by D-085. A second warning is required first. A tow authorization is refused until it exists. There is still no citation product and no dispatch |
| Q-007 | Is a warning invalid without a photo? | Resolved by D-086. At least one photo is required on the first warning and on the second warning |
| Q-008 | Does the pilot store a phone number? The mock does (VERIFIED) | Resolved by D-087 for residents: the phone is stored and required. A guest phone is not collected. The proposed consent step is not a legal conclusion |
| Q-009 | What does the guest link show, and when does the link die? | Resolved by D-088. The case table above this question list is the rule. A revoked or unknown token shows only "this link is not valid." An unrevoked pass stays viewable for 24 hours after its end, including at exactly 24 hours |
| Q-010 | Export format, and which roles may run it? | Resolved by D-089. Admin and signer. CSV plus the photo files |
| Q-011 | How long are plates, photos, and phones kept? | OPEN. Henry has not chosen among RADAR's defaults (D-090). The table below is PROPOSED. It is inferred, not statutory. Confidence is low to moderate. Memo: [RADAR retention memo, 2026-10-24](https://drive.google.com/file/d/1pILQvdwkXzopjCl7Mni2sK9rue8toiKN/view). D-101 already keeps violation records and tow authorizations for 36 months, and D-074 keeps the audit log for 365 days. Those two decisions are not changed by this table. The mismatches under the table are questions, not answers |
| Q-012 | What disclosure or formal agreement, and what price, does the board need before the pilot? | Resolved by D-091. A written disclosure to the board and a short board-signed pilot agreement. The pilot is free. Both documents are planned documents outside this repository and are not copied in |
| Q-013 | Which success rows in section 4, if any, does Henry accept? | Resolved by D-092. S-1 and S-3 are accepted. S-2 is D-067. S-4, S-5, and S-6 remain PROPOSED and UNAPPROVED |
| Q-014 | Can one person hold admin and signer, and is that two permissions or one job? | Resolved by D-093. One account may hold both. They are two permissions. Neither implies the other |
| Q-015 | Confirm the HOA's name and that "about 700" and "about 75" are the profile values to load | Resolved by D-094. Bridgeway HOA, about 700 homes, about 75 guest spots. Those figures are Henry's profile, stored as data |
| Q-016 | What must a written CVC §22658 authorization contain, what signage must exist, and what do this HOA's rules add? | OPEN. Pending Henry. RADAR's findings below are PROPOSED and are not legal conclusions. Confirm them with a California attorney. The product stores the writing the signer uploads. It does not check the statute |
| Q-017 | May a resident see their own violation history? | Resolved by D-095. A resident sees their own vehicles and their own passes only. They do not see other residents' records, patroller photos, or violation records |
| Q-018 | Who owns the repository's IP, and what licence should the inventory name? | Resolved by D-096. Henry personally owns the IP. The notice is [LICENSE.md](../LICENSE.md). It is not an open-source license |
| Q-019 | How does a person prove who they are, how is the first admin for a community created, and how are residents and patrollers invited? | Resolved by D-097. Magic link by email. No public sign-up. The operator creates the first admin for one community. Only that community's admins invite residents and patrollers. A cross-community invite is refused. A person with no email is Q-036. The link lifetime is Q-041 |
| Q-020 | What does `on_hold` mean for a plate check and for enforcement? | Resolved by D-077. A plate check of that vehicle returns status `on_hold` and action `none`. The screen shows "on hold, don't act" and offers no warning and no tow, including no second warning. The server refuses a warning and a tow authorization while the vehicle stays `on_hold`. After an admin release, those actions follow their usual rules again |
| Q-021 | May a resident edit or remove a vehicle that is `on_hold`? | Resolved by D-069. A resident cannot. Only an admin removing the hold frees the vehicle for resident edits and removal |
| Q-022 | Is there a cap on how many vehicles one resident may register? | Resolved by D-070. There is no cap. Add stores another vehicle for the same account when the plate is free. One plate still has at most one vehicle that is not `removed` (PAC-024) |
| Q-023 | How often may a resident change a plate, and can admins see those changes? | Resolved by D-073 and D-099. 3 plate changes per vehicle per rolling 30 × 24 hours. The 4th while three still count is refused. An event counts while `now - at < 30 × 24 hours` and drops out when `now - at >= 30 × 24 hours`, including at exactly 30 × 24 hours. Description-only edits do not count, and creating a vehicle does not count. Admins see all plate changes through the audit events. The refused 4th alerts an admin (D-100). The alert channel is Q-038 |
| Q-024 | Does anyone notify the resident when an admin holds or removes a vehicle? | Resolved by D-072 and D-098. Yes. Email and text. A resident's own removal does not. The wording is Q-037 |
| Q-025 | How long are vehicle audit events kept? | Resolved by D-074. 365 days. An event at 364 days is kept. An event at exactly 365 days is kept. An event past 365 days is purged, not archived. The plate on the violation does not depend on that event surviving. It is deleted only with the violation record at 36 months (D-101). Distinct from Q-011 |
| Q-026 | Who may take a vehicle off hold, and does that return it to `active`? | Resolved by D-075. Only an admin may release a hold. A resident and a patroller cannot. The status becomes `active`. That target is derived from D-069. Henry can correct the target status. The resident is notified by email and text (D-102) |
| Q-027 | Is a warning refused when the reason is empty, and is that reason free text or a fixed list? | Resolved by D-076. An empty reason is refused. The reason is a code from a fixed list. `other` requires non-empty text. The codes and labels are PROPOSED in the list above this table. Each warning also needs a photo (D-086). `close_reason` is separate. The second warning uses the same list (D-085) |
| Q-028 | What channel notifies the resident after an admin hold or an admin removal, and what does the notice say? | Resolved by D-098 for the channel: email and text. The wording is the new question Q-037 |
| Q-029 | How are the 30 days in D-073 counted? | Resolved by D-099. Rolling 30 × 24 hours on the server timestamp. An event counts while `now - at < 30 × 24 hours`. It drops out when `now - at >= 30 × 24 hours`, including at exactly 30 × 24 hours. The audit row stays. The community timezone is not used |
| Q-030 | Does the pilot need an abuse control besides the plate-change limit? | Resolved by D-100. Yes: an admin alert when the plate-change limit is hit, and a per-household per-day guest-pass cap. The daily number is Q-034. D-070 still sets no cap on how many vehicles one resident may register |
| Q-031 | Do violation records, signed authorizations, and tow records follow the 365-day audit retention, or a different one? | Resolved by D-101. Violation records and tow authorizations are kept 36 months. The audit log stays 365 days. In this design the signed authorization and the tow record are the same tow-authorization row. The plate on the violation survives the audit purge because it is stored on the violation. Photo files and phones are not given a duration by this decision (Q-011) |
| Q-032 | Does releasing a hold notify the resident? | Resolved by D-102. Yes. Email and text, with the same failure rule as D-098. The wording is Q-037 |
| Q-033 | What is the minimum time between the first warning and the second warning, and must the second warning use the same reason code? | OPEN. D-085 does not set either. Until answered, the server does not enforce a gap and does not require the same code. Each warning still needs its own reason and its own photo |
| Q-034 | How many guest passes may one household create per calendar day? | OPEN. The value is per-community configuration (`per_day_cap`). No number is set. An unset value refuses the create. The day is the community timezone, which for this pilot is Pacific time |
| Q-035 | When a pass would break both the monthly household cap and the daily household cap, which check is reported, and which error is shown? | OPEN. Each cap has its own error when it is the only one that fails, in the cap-error paragraph above. When both fail, the pass is not stored, and the sentence is not chosen |
| Q-036 | How does a resident or a patroller with no email address sign in? | OPEN. D-097 uses an email magic link. No other method is defined. An invite without an email is refused |
| Q-037 | What do the hold, removal, and release emails and texts say? | OPEN. The channel is email and text (D-098, D-102). No wording is chosen |
| Q-038 | How is the admin alert delivered when a resident hits the plate-change limit? | OPEN. D-100 writes the alert for that community's admins. It does not choose email, text, or another channel |
| Q-041 | How long is an email magic link valid? | OPEN. Until a lifetime is configured, the server does not issue one. The operator bootstrap still creates the first admin without a link |

**RADAR retention table (PROPOSED, for Q-011).** Inferred, not statutory. Confidence low to moderate. Source: the RADAR memo dated 2026-10-24, [Drive file](https://drive.google.com/file/d/1pILQvdwkXzopjCl7Mni2sK9rue8toiKN/view). Henry has not chosen these defaults (D-090). A legal hold overrides every row: an item tied to a dispute, a claim, a subpoena, or a member records request stays until that matter is resolved. That override is also PROPOSED.

| Data | State | Range | Default in the memo |
| --- | --- | --- | --- |
| Plates, resident permit | Active | Life of permit; purge 30–90 days after deactivation or move-out | 30 days |
| Plates, guest-QR sessions | No incident | 7–30 days after session end | 14 days |
| Plates, scan events (patrol or public lookups) | No incident | 30–90 days | 90 days |
| Plates, open case | Active | Until closure, reviewed every 90 days | n/a |
| Photos, warning only | Closed | 3–6 months | 6 months |
| Photos, fined or disputed | Closed | 12–24 months | 24 months |
| Photos, tow case | Closed | 36–48 months | 36 months |
| Tow authorization record | Closed | 36–48 months from tow | 36 months, with the authorizer's residential address redacted or purged sooner |
| Resident phone | Active | While the account is active; purge 30–90 days after move-out or deactivation | 30 days |
| Guest phone | No incident | Prefer not collected; if collected, 1–7 days after the session | 1 day |
| Phone, closed case | Closed | Redact 0–90 days after closure | 30 days |
| GPS stamp on a photo | With the photo | Same as the photo | n/a |
| Access and audit logs | Any | 12–24 months | 12 months. The memo's 12-month default is not the product rule. D-074 fixes the audit log at 365 days |

RADAR minimum data practices, also PROPOSED and not adopted as product rules: no ALPR cameras and no OCR in the pilot; no sale or sharing; no tow-company-paid fees; named users, least privilege, and an access log; automated deletion with a dated log; encryption in transit and at rest; a breach plan; a privacy notice; a written agreement with the HOA covering data ownership, instructions-only processing, and deletion on termination; do not store the authorizer's residential address beyond the authorization record, and never show it to the vehicle owner.

Mismatches, left open inside Q-011. None of these changes D-074 or D-101.

- Audit logs. The memo's default is 12 months. D-074 and D-101 keep the audit log for 365 × 24 hours. Those are not the same length. The product rule stays 365 days. Whether Henry wants a different audit length is not decided here, and this note does not reopen D-074.
- Photos on a warning-only case. The memo's default is 6 months after closure. D-101 keeps the violation record for 36 months and does not set a photo-file duration. Whether the photo bytes follow the violation, follow 6 months, or follow another row is not decided. The 36-month job deletes the violation row and the tow-authorization row. It does not delete photo files.
- Photos on a fined or disputed case. The memo's default is 24 months. This product has no fine status. Whether "disputed" maps to an open or closed violation is not decided.
- Photos on a tow case, and the tow-authorization row. The memo's default of 36 months matches D-101's 36 months for the tow-authorization record. The memo also says the authorizer's residential address is redacted or purged sooner. This design has no structured address field. The uploaded writing may contain one. Whether that file is redacted is not decided. Q-016 is where the writing's contents stay open. The address is not shown to the vehicle owner, because the guest link and the resident screens do not show authorization files.
- Plates on a violation. The plate-at-warning proof is a field on the violation, so it follows D-101 (36 months) and survives the 365-day audit purge. The memo's open-case row keeps plates until closure, and its other plate rows are shorter. Which memo row applies to a plate that is also on a closed violation is not decided. The product rule for that field is the violation's 36 months.
- Guest-session plates. The memo's default is 14 days after the session, with a range of 7–30 days. D-088 requires the unrevoked pass to stay viewable for 24 hours after the end. That view is inside the memo's range. How long the pass row itself is kept after those 24 hours is not decided.
- Guest phone. The memo prefers that it not be collected, and if it is collected the default is 1 day. D-087 does not collect it. The 24-hour pass view shows the plate and the window, not a phone. Collecting a guest phone would conflict with that preference and with a 1-day default that is shorter than the 24-hour view. That conflict is not resolved by adding a phone field.
- Resident phone after the account ends. D-087 requires the phone while the resident account exists. The memo's default purge is 30 days after move-out or deactivation, and its closed-case phone default is also 30 days. Neither purge is chosen.
- Notification events are not given a duration by D-074 or D-101. Their retention stays inside this open question.

**Q-016 RADAR findings (PROPOSED, not legal conclusions).** Pending Henry. Confirm with a California attorney before anyone treats them as the HOA's rules. The product does not enforce this list.

- The sign is 17 by 22 inches, with 1-inch lettering, in plain view at each entrance.
- The sign shows the law-enforcement phone number and the tow company's name and phone.
- Each tow has a written authorization. The authorizer is present and verifies the vehicle. The writing includes make, model, VIN, and plate; the authorizer's name, signature, title, address, and phone; and the time first observed and the time authorized.
- Law enforcement is notified within 1 hour.
- If the rules are not met, towing and storage liability can double.
- A general authorization is only for a hydrant, a fire lane, or blocking an entrance.
- Vehicle Code section 12110(a) bars tow commissions, so the HOA pays a flat fee only.
- Plate scanning and OCR stay out of the pilot.

The authorizer address in that list is the same field the retention memo says not to show to the vehicle owner and not to keep beyond the authorization record. This design does not add the field while Q-016 is open.

## 12. Document map

| Question | Document |
| --- | --- |
| Decisions D-067 and D-069 through D-102 | This file, section 11.1 |
| Copyright notice | [LICENSE.md](../LICENSE.md) |
| Acceptance ids for the pilot | `FRD.md` |
| Records, states, transitions, invariants, failures, permissions | `TECHNICAL_DESIGN.md` |
| Screens for resident, guest link, patroller, admin, signer | `UX_DESIGN_SPEC.md` |
| Pilot, then a reference case, then other HOAs | `GTM_STRATEGY.md` |
| What to test first | `TEST_PLAN.md` |
| Pages demo versus pilot operations | `RUNBOOK.md` |
