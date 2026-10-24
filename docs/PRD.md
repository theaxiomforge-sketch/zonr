# Zonr product requirements — single-community pilot

Rewrite of the docs on pull request #1. Code baseline: `main` at `99d283e` ("Opt Pages workflow into Node 24"). Design baseline: Henry approved resuming design on a single-community pilot (2026-10-22). S-2 is D-067 (Henry, 2026-10-23). The other success criteria in section 4 are PROPOSED and UNAPPROVED.

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
| Site | One California HOA | Design baseline from the approved scope. Not in the repo. The HOA's legal name is UNKNOWN |
| Size | About 700 homes | Same. Not a measured count in this repo. UNKNOWN as an audited figure. Stored later as community profile data, not as a constant |
| Guest parking | About 75 unnumbered guest spots | Same. Tracking is by plate and time, not by stall number |
| Identity | Plate and time | Approved scope |

### 3.2 Buyer and users

| Party | Role in the pilot | Label |
| --- | --- | --- |
| HOA board | Buyer. Buys on the committee's recommendation | Approved scope |
| Residents | Users. Register vehicles. Issue guest passes within caps | Approved scope, plus INFERRED that residents issue passes. Who else may issue is Q-003 |
| Volunteer patrollers | Users. Plate check and violation log | Approved scope |
| Admins | Users. Hold or remove a registered vehicle, configure rules, export. They do not pre-approve a resident's vehicle | Approved scope for the admin user, plus D-067 for hold and remove. Admin is not automatically a tow signer (PROPOSED) |
| Guests | Not accounts. A link only | Approved scope |
| Tow company | Not a user. No login, no dispatch action | Approved scope |
| Board or committee member | Signs the written tow authorization. Not a tow dispatcher | Approved scope |

INFERRED: Henry sits on the pilot HOA's committee and would also be the vendor. That office and any agreement are UNKNOWN. PROPOSED, for Henry to accept or reject: the board gets a disclosure or a formal agreement before resident data is collected, and the pilot has a stated price, including zero if that is the choice (Q-012).

### 3.3 In scope for the pilot build

| Capability | Rule |
| --- | --- |
| Guest passes | By plate, with an expiry, a per-stay cap, and a per-month cap. Cap values are community configuration (UNKNOWN until set, Q-001, Q-002) |
| Resident vehicles | A registry the resident keeps. A resident adds, updates, and removes their own vehicle. There is no admin pre-approval. An admin may remove any registered vehicle in the community or put it on hold (D-067). A resident cannot edit or remove a vehicle that is on hold. Only an admin may release that hold, and the status becomes `active` (D-075). That target is derived from D-069, which frees the vehicle for resident edits. Henry can correct the target status. A resident may register any number of vehicles (D-070). Each vehicle may have 3 plate changes in 30 days. The 4th in that window is refused. Description-only edits do not count. Admins see every plate change in the audit events that already store the previous and new plate (D-071, D-073). An admin hold and an admin removal each notify that vehicle's resident. The channel and the wording are not chosen (D-072, Q-028). What hold means for a plate check or for enforcement is Q-020 |
| Plate check | A patroller enters a plate and sees pass, vehicle, and open warning state for that community |
| Violations | A log with photos. First outcome is a warning. The reason is a code from a fixed list, and an empty reason is refused (D-076). The codes and labels are PROPOSED in `FRD.md`. A grace period then runs. Length is configuration (UNKNOWN, Q-005) |
| Tow authorization | A record of a written authorization the scope names as CVC §22658, signed by a board or committee member. Zonr stores the record. Zonr does not authorize or dispatch a tow |
| Disputes | Records export per community, including the audit trail |
| Tenancy principle | `community_id` required on every record. Access is scoped to that id. Caps, grace, and rules are rows, not code |

### 3.4 Out of scope for the pilot build

Plate cameras, payments, tow dispatch, numbered spots, and property-system sync are out of the pilot build (approved scope). A community switcher, a second community's signup, billing, and a sales site are also out. Designing the schema so those could exist later is in scope. Building them is not.

Market sizing, statute text, signage rules, and this HOA's governing documents are out of this PRD. They belong to RADAR (UNKNOWN).

## 4. Success

S-2 is D-067 (Henry, 2026-10-23, VERIFIED as his statement). Every other criterion in this section is PROPOSED and UNAPPROVED. Those rows are not targets the pilot has accepted.

| Id | Criterion | UNAPPROVED |
| --- | --- | --- |
| S-1 | A resident of the pilot community can issue a guest pass for a plate. The pass has an expiry. A pass that would break the stay cap or the month cap is refused and not stored | Yes |
| S-2 | A resident can add, update, and remove their own vehicle. There is no admin approval step. The status after add is `active`. An admin can hold or remove any vehicle in the community. A resident cannot put a vehicle on hold | No (D-067) |
| S-3 | A patroller can check a plate and file a warning with at least one photo. The grace clock starts at that warning | Yes |
| S-4 | A tow-authorization record can be signed only by an account with the signer permission, only after a warning and the configured grace, and the sign action sends nothing to a tow company. The product does not test committee membership or a named person | Yes |
| S-5 | An admin can export one community's passes, vehicles, violations, photos, authorizations, and audit events without exporting another community | Yes |
| S-6 | Adding a second `community_id` in data does not require a schema change. The pilot UI does not offer a second community | Yes |

No adoption rate, revenue, or time-saved figure is a success criterion. Those would be UNKNOWN market claims.

## 5. Non-goals

| Non-goal | Why |
| --- | --- |
| Treat the GitHub Pages mock as the pilot system of record | VERIFIED: it is a public static demo with no accounts |
| Require admin pre-approval of a resident's own vehicle | D-067. The resident adds, updates, and removes that vehicle. An admin may hold or remove it |
| Number the 75 guest spots | Approved scope: unnumbered. Count is profile data |
| Call, email, or otherwise dispatch a tow company | Tow company is not a user. Signing a record is not a dispatch |
| Explain CVC §22658, signage, or HOA rules in this set | UNKNOWN. RADAR |
| Pick a price, a market size, or a competitor set | UNKNOWN. RADAR for sizing. Price is Q-012 |
| Build multi-community product features | Principle only, section 8 |
| Hardcode Henry, or any committee-member exception, as the signer or the admin | Acquirability. The permission is a role, not a person |

## 6. Pilot behavior the design commits to

Detail and acceptance ids are in `FRD.md`. States and invariants are in `TECHNICAL_DESIGN.md`.

1. Every stored row carries `community_id`. A query without that scope returns nothing. On pass, vehicle, violation, authorization, export, and config requests, the community, the actor, and the permissions come from the server session, and those fields on the body are ignored. A guest-link read, invite acceptance, and the operator bootstrap have no session (PROPOSED, I-2).
2. Guest passes are plate plus a time window. They do not name a stall. A pass is permission to park only while `start <= now < end` and it is not revoked (PROPOSED).
3. Caps and grace are read from the community's configuration. Missing configuration fails closed: the action is refused (PROPOSED).
4. A resident adds, updates, and removes their own vehicle. The server sets `active` on add. An admin may hold an `active` vehicle or remove an `active` or `on_hold` vehicle in the community. There is no approval transition (D-067). A resident cannot edit or remove a vehicle that is `on_hold`, including when that session also has admin. Only an admin removing the hold frees it for resident edits and removal (D-069). D-075: that release is an admin action, a resident and a patroller cannot do it, and the status becomes `active`. That target is derived from D-069. Henry can correct it. A resident may register any number of vehicles. The schema and the add check have no count of that account's vehicles (D-070). One plate still has at most one vehicle that is not `removed` (PAC-024). A plate or description edit keeps the previous and new values on the audit event. It does not change a plate already stored on a warning. A plate change is an edit whose stored plate changes. Each vehicle may have 3 such changes in 30 days, and the 4th in that window is refused. Description-only edits do not count. The count is per vehicle. Admins see those changes in the same audit events (D-071, D-073). An admin hold and an admin removal each write a notification event for that vehicle's resident. A resident's own removal does not. The channel and the wording are not chosen (D-072, Q-028).
5. Every new violation's first stored outcome is a warning with photos and a reason chosen from a fixed list (D-076). An empty reason is refused. `other` also requires a short description. The warning stores the plate submitted at filing. There is no stay record. Grace runs from that warning. A tow-authorization signature is a later record, not a violation status called "dispatched" (PROPOSED). The codes and labels are PROPOSED in `FRD.md`.
6. The signed authorization stores who signed, when, the warning's plate, the linked warning, and the written artifact. It has no dispatch side effect (PROPOSED).
7. Guests open a link for one pass. A dead link shows one invalid line and no plate. A live link does not show other plates, phones, or photos (PROPOSED).
8. Export is per community and includes enough to reconstruct a dispute: the warning's stored plate, reason code, and reason text. That stored plate is the plate as filed. It remains the proof after an audit event is purged. While an audit event is still kept, the export also includes its previous and new plate (PROPOSED). Audit events are kept for 365 days and then purged (D-074). The file format is Q-010. Deletion of plates, photos, and phones is not in this list (Q-011).

## 7. Vehicle registry

VERIFIED today: the resident form includes a status control whose options are approved, review, and revoked, and save writes that status through `updatePermit`. There is no actor and no role.

Pilot rule (D-067): there is no admin pre-approval and no `approved` status. A resident adds, updates, and removes their own vehicle. The server ignores a status field on the body. Add stores `active`. An edit of that resident's own `active` vehicle stays `active`. Hold and remove are separate actions, not a status on the body. An admin may put a vehicle on hold or remove it. D-069: a resident cannot edit or remove a vehicle while it is `on_hold`. D-075: only an admin can release the hold. A resident and a patroller cannot. The status becomes `active`, which is the state those resident edits already require. That target is derived from D-069. Henry can correct it. The release audit event records the admin, the server time, and an optional reason. Whether the resident is notified is Q-032. D-070: a resident may register any number of vehicles. Add does not count that account's vehicles. D-071 and D-073: each vehicle may have 3 plate changes in 30 days. The 4th in that window is refused, and the row stays as it was. A description-only edit is not a plate change. Creating a vehicle is not a plate change. The count is per vehicle, including two vehicles of one resident. Admins see every plate change because the vehicle edit audit event already stores the previous and new plate. There is no second log and no further abuse-control rule (Q-030). How those 30 days are counted is the proposed rolling window in `TECHNICAL_DESIGN.md` (Q-029). D-072: an admin hold and an admin removal each notify that vehicle's resident. The notice is a stored event. It does not name a channel or a wording (Q-028). The same ignore rule covers `community_id`, actor, `decided_by`, `held_by`, `removed_by`, and permissions on pass, vehicle, violation, authorization, export, and config requests (`FRD.md` PAC-104). `community_id` stays required on the vehicle row.

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
| IP and licence inventory | No `LICENSE` file in the repo (VERIFIED). Ownership of the work is UNKNOWN (Q-018). npm dependencies are declared in `package.json` (VERIFIED) | A licence inventory as a document. Not a new feature |
| Export and portability | None (VERIFIED) | Per-community export, S-5 |
| Privacy and retention | None (VERIFIED). California privacy law applicability is UNKNOWN and goes to RADAR | Policy in `TECHNICAL_DESIGN.md` section 8. Durations UNKNOWN |
| Audit trail | None (VERIFIED) | Actor, action, entity, community, time |
| Architecture and ops | This doc set plus the Pages runbook | Keep them current when behavior changes |
| No person-specific logic | The mock has no users (VERIFIED) | Roles, not named people. No committee-member-specific logic, and no constant that names Henry or any other person as signer or admin |

The pilot MVP is section 3.3 only. Sections 8 and 9 are principles so a later sale or a second community is not blocked. They are not extra features. A community switcher, billing, a diligence portal, and a second HOA's signup are non-goals, not a build (PROPOSED).

## 10. Conflict of interest

INFERRED: Henry sits on the pilot HOA's committee and would also be the vendor. That is not a verified office or contract (UNKNOWN). PROPOSED response, for Henry to accept or reject: the board gets a disclosure or a formal agreement before resident data is collected, and the pilot has a stated price, including zero if that is the choice. Whether any of that exists is UNKNOWN (Q-012). The product must not encode "Henry may sign" as a special case.

## 11. Decisions and open questions

Legal and market questions are listed here and routed to RADAR. Henry still has to accept or reject the product choices that are open.

### 11.1 Decisions

| Id | Decision | Source |
| --- | --- | --- |
| D-067 | A resident adds, updates, and removes their own vehicle. There is no admin pre-approval. An admin may hold or remove any registered vehicle in the community | Henry, 2026-10-23, VERIFIED as his statement. S-2 |
| D-069 | A resident cannot edit or remove a vehicle that is on hold, including when that session also has admin. Only an admin removing the hold frees it for resident edits and removal. Admin removal of the vehicle, which sets `removed`, is a different action | Henry, VERIFIED as his statement. Resolves Q-021. Who may release is D-075 |
| D-070 | There is no cap on how many vehicles one resident may register. Add does not count that account's vehicles. One plate still has at most one vehicle that is not `removed` | Henry, VERIFIED as his statement. Resolves Q-022 |
| D-071 | A limit on plate changes is required, and admins can see plate changes | Henry, VERIFIED as his statement. The limit and the view are D-073. Further abuse controls are not specified and are not requirements (Q-030) |
| D-072 | The resident is notified when an admin holds or removes their vehicle. A resident's own removal does not send that notice. The channel and the wording are not chosen | Henry, VERIFIED as his statement. Resolves Q-024. Q-028 stays open and is tied to Q-019 |
| D-073 | The limit is 3 plate changes per vehicle per 30 days. The 4th change in that window is refused. Description-only edits do not count. Admins can see all plate changes. Those changes are the vehicle audit events that already store the previous and new plate | Henry, VERIFIED as his statement. Resolves Q-023. The way the 30 days are counted is the proposed reading in `TECHNICAL_DESIGN.md`. Q-029 stays open |
| D-074 | Audit log retention is 365 days. An audit event is kept through day 365 and purged once it is past 365 days. The job does not archive it. Violation records and tow authorizations are not part of this decision | Henry, VERIFIED as his statement. Resolves Q-025. Q-031 stays open. Distinct from Q-011 |
| D-075 | Only an admin can release a hold on a vehicle. A resident and a patroller cannot. The release sets the status to `active`. That target is derived from D-069, which frees the vehicle for resident edits, and those edits exist only while the status is `active`. Henry can correct the target status. The audit event records the admin, the server time, and an optional reason | Henry, VERIFIED as his statement. Resolves Q-026. Q-032 stays open |
| D-076 | A warning with an empty reason is refused. The reason is a code from a fixed list. The entry `other` requires non-empty free text. Any other code stores no free text. `close_reason` is a different field | Henry, VERIFIED as his statement. Resolves Q-027. The codes and labels are PROPOSED in `FRD.md` for Henry to confirm |

### 11.2 Questions

Q-021 through Q-027 are resolved in section 11.1. The question still open for Henry in that series is Q-020, in the paragraph below. Q-032, whether releasing a hold notifies the resident, is also open. Q-001 through Q-019, Q-028, Q-029, Q-030, and Q-031 stay open. Q-011 is plates, photos, and phones.

**Q-020, for Henry.** What does "on hold" mean for a plate check and for enforcement? Does a held vehicle count as registered, or not? Can a patroller file a warning on it? Can it be towed? What does the patroller see? One option is to treat the held vehicle as registered. Another is to treat it as not registered. The current safe default, until Henry answers: the plate check shows the status `on_hold`. Hold is not permission to park, not a warning, and not a tow. The plate check does not map `on_hold` to any of those.

| Id | Question | Label |
| --- | --- | --- |
| Q-001 | What is the per-stay cap, in what unit? | UNKNOWN |
| Q-002 | What is the per-month cap: hours or count? Is the subject the plate, the household, or the unit? Is the window a calendar month or a rolling period, and which timezone? Which pass statuses count? | UNKNOWN. PROPOSED until set: subject, window, and timezone are configuration, and a missing one refuses the create. PROPOSED count: a stored pass that overlaps the window counts, in any of scheduled, active, expired, or revoked. The account and the pass carry `unit` and `household_id` so those subjects can be counted. The mock's permit `unit` is a string on the prototype (VERIFIED) and is not this household id |
| Q-003 | Who may create a guest pass, and who may revoke it before expiry? | UNKNOWN. PROPOSED: resident and admin create; the issuing resident and an admin revoke |
| Q-004 | May one plate have two passes in the same community that are not revoked and have not reached their end, including a pass that has not started? | UNKNOWN. PROPOSED: no. A not-yet-started pass is still not permission to park (PAC-005) |
| Q-005 | How long is the grace period after a warning? | UNKNOWN |
| Q-006 | After grace, is the next product step only a tow-authorization record? | UNKNOWN. PROPOSED: yes. No citation product in the pilot |
| Q-007 | Is a warning invalid without a photo? | UNKNOWN. PROPOSED: at least one photo is required |
| Q-008 | Does the pilot store a phone number? The mock does (VERIFIED) | UNKNOWN |
| Q-009 | What does the guest link show, and when does the link die? | UNKNOWN. PROPOSED: the link dies at the pass end or at revoke, whichever is first. While it is live, and the pass is not revoked, the page shows that pass's plate, window, and the community's guest rules. If the pass has not started, the page does not call it permission to park. An unknown token, a revoked pass, an expired pass, and an expired link all show one line, "this link is not valid," and no plate |
| Q-010 | Export format, and which roles may run it? | UNKNOWN. PROPOSED: admin and signer; CSV plus the photo files |
| Q-011 | How long are plates, photos, and phones kept? | UNKNOWN. California privacy applicability is UNKNOWN. Both go to RADAR before a duration is chosen |
| Q-012 | What disclosure or formal agreement, and what price, does the board need before the pilot? | UNKNOWN. The conflict is INFERRED. The response is PROPOSED |
| Q-013 | Which success rows in section 4, if any, does Henry accept? | S-2 is D-067. S-1 and S-3 through S-6 remain PROPOSED and UNAPPROVED |
| Q-014 | Can one person hold admin and signer, and is that two permissions or one job? | UNKNOWN. PROPOSED: two permissions, both grantable to one account, neither implied by the other |
| Q-015 | Confirm the HOA's name and that "about 700" and "about 75" are the profile values to load | UNKNOWN as audited facts |
| Q-016 | What must a written CVC §22658 authorization contain, what signage must exist, and what do this HOA's rules add? | UNKNOWN. RADAR. The product stores the writing the signer uploads. It does not check the statute |
| Q-017 | May a resident see their own violation history? | UNKNOWN. PROPOSED: a resident sees their vehicles and their own passes. They do not see other residents' plates or patroller photos |
| Q-018 | Who owns the repository's IP, and what licence should the inventory name? | UNKNOWN. No `LICENSE` file (VERIFIED) |
| Q-019 | How does a person prove who they are, how is the first admin for a community created, and how are residents and patrollers invited? | UNKNOWN. PROPOSED shape, not a method: no public self-signup. An operator action creates the first admin bound to one community. Further accounts exist only by an invite from an admin of that community, and the invite cannot choose a different community. Password, magic link, or SSO is not chosen |
| Q-020 | What does `on_hold` mean for a plate check and for enforcement? | UNKNOWN. See the paragraph above this table. Safe default: the plate check shows `on_hold`. Hold is not permission to park, not a warning, and not a tow |
| Q-021 | May a resident edit or remove a vehicle that is `on_hold`? | Resolved by D-069. A resident cannot. Only an admin removing the hold frees the vehicle for resident edits and removal |
| Q-022 | Is there a cap on how many vehicles one resident may register? | Resolved by D-070. There is no cap. Add stores another vehicle for the same account when the plate is free. One plate still has at most one vehicle that is not `removed` (PAC-024) |
| Q-023 | How often may a resident change a plate, and can admins see those changes? | Resolved by D-073. 3 plate changes per vehicle per 30 days. The 4th in that window is refused. Description-only edits do not count, and creating a vehicle does not count. The count is per vehicle. Admins see all plate changes through the audit events that already store the previous and new plate. How the 30 days are counted is Q-029. Any control beyond this limit is Q-030 and is not a requirement. D-070 still sets no cap on how many vehicles one resident may register |
| Q-024 | Does anyone notify the resident when an admin holds or removes a vehicle? | Resolved by D-072. Yes. An admin hold and an admin removal each write a notification event for that vehicle's resident. A resident's own removal does not. The channel and the wording are Q-028 |
| Q-025 | How long are vehicle audit events kept? | Resolved by D-074. 365 days. An event at 364 days is kept. An event at exactly 365 days is kept. An event past 365 days is purged, not archived. The plate on a violation does not depend on that event surviving. Distinct from Q-011 |
| Q-026 | Who may take a vehicle off hold, and does that return it to `active`? | Resolved by D-075. Only an admin may release a hold. A resident and a patroller cannot. The status becomes `active`. That target is derived from D-069, which says removing the hold frees the vehicle for resident edits, and those edits exist only on `active`. Henry can correct the target status. Whether the resident is notified is Q-032 |
| Q-027 | Is a warning refused when the reason is empty, and is that reason free text or a fixed list? | Resolved by D-076. An empty reason is refused. The reason is a code from a fixed list. `other` requires non-empty text. The codes and labels are PROPOSED in `FRD.md`. A photo is still required (Q-007). `close_reason` is separate |
| Q-028 | What channel notifies the resident after an admin hold or an admin removal, and what does the notice say? | UNKNOWN. Tied to Q-019, because the channel depends on how that person is reached. No channel and no wording are chosen |
| Q-029 | How are the 30 days in D-073 counted? | UNKNOWN which window Henry means. PROPOSED reading, used until he answers: a rolling 30 × 24 hours on the server timestamp of that vehicle's plate-change audit events. An event counts while `now - at < 30 days`. At exactly 30 days it drops out. The community timezone is not used. A calendar window is not used |
| Q-030 | Does the pilot need an abuse control besides the plate-change limit? | UNKNOWN. Not a requirement. D-073 limits plate changes only. D-070 still lets one resident register any number of vehicles, so adding a vehicle is not limited by the plate-change rule. No such control is defined |
| Q-031 | Do violation records, signed authorizations, and tow records follow the 365-day audit retention, or a different one? | UNKNOWN. D-074 names only the audit log. In this design the signed authorization and the tow record are the same tow-authorization row. The purge job does not delete violation rows, tow-authorization rows, their files, or notification events. Q-011 remains plates, photos, and phones |
| Q-032 | Does releasing a hold notify the resident? | UNKNOWN. D-072 writes a notification event for an admin hold and an admin removal only. A release does not write one |

## 12. Document map

| Question | Document |
| --- | --- |
| Decisions D-067 and D-069 through D-076 | This file, section 11.1 |
| Acceptance ids for the pilot | `FRD.md` |
| Records, states, transitions, invariants, failures, permissions | `TECHNICAL_DESIGN.md` |
| Screens for resident, guest link, patroller, admin, signer | `UX_DESIGN_SPEC.md` |
| Pilot, then a reference case, then other HOAs | `GTM_STRATEGY.md` |
| What to test first | `TEST_PLAN.md` |
| Pages demo versus pilot operations | `RUNBOOK.md` |
