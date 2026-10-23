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
| Resident vehicles | A registry the resident keeps. A resident adds, updates, and removes their own vehicle. There is no admin pre-approval. An admin may remove any registered vehicle in the community or put it on hold (D-067). What hold means for a plate check or for enforcement is Q-020 |
| Plate check | A patroller enters a plate and sees pass, vehicle, and open warning state for that community |
| Violations | A log with photos. First outcome is a warning. A grace period then runs. Length is configuration (UNKNOWN, Q-005) |
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
4. A resident adds, updates, and removes their own vehicle. The server sets `active` on add. An admin may hold an `active` vehicle or remove an `active` or `on_hold` vehicle in the community. There is no approval transition (D-067).
5. Every new violation's first stored outcome is a warning with photos. There is no stay record. Grace runs from that warning. A tow-authorization signature is a later record, not a violation status called "dispatched" (PROPOSED).
6. The signed authorization stores who signed, when, the plate, the linked warning, and the written artifact. It has no dispatch side effect (PROPOSED).
7. Guests open a link for one pass. A dead link shows one invalid line and no plate. A live link does not show other plates, phones, or photos (PROPOSED).
8. Export is per community and includes enough to reconstruct a dispute (PROPOSED). The file format is Q-010. Deletion is not in this list.

## 7. Vehicle registry

VERIFIED today: the resident form includes a status control whose options are approved, review, and revoked, and save writes that status through `updatePermit`. There is no actor and no role.

Pilot rule (D-067): there is no admin pre-approval and no `approved` status. A resident adds, updates, and removes their own vehicle. The server ignores a status field on the body. Add stores `active`. An edit of that resident's own `active` vehicle stays `active`. Hold and remove are separate actions, not a status on the body. An admin may put a vehicle on hold or remove it. The same ignore rule covers `community_id`, actor, `decided_by`, `held_by`, `removed_by`, and permissions on pass, vehicle, violation, authorization, export, and config requests (`FRD.md` PAC-104). `community_id` stays required on the vehicle row.

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

## 11. Questions only Henry can answer

Legal and market questions are listed here and routed to RADAR. Henry still has to accept or reject the product choices.

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
| Q-020 | What does `on_hold` mean for a plate check and for enforcement? | UNKNOWN. The plate check may show the status. It does not map `on_hold` to a pass, a warning, or a tow, and it does not treat `on_hold` as permission to park |
| Q-021 | May a resident edit or remove a vehicle that is `on_hold`? | UNKNOWN. Until answered, those requests are refused and the row is unchanged, because no transition is defined |
| Q-022 | Is there a limit on how many vehicles one resident may register? | UNKNOWN. Separate and PROPOSED: at most one vehicle that is not `removed` per plate per community (PAC-024). That is not a per-resident count |
| Q-023 | Is there a limit on how often a resident may change a plate, or another abuse control? | UNKNOWN. Each plate or description edit is audited. No frequency rule is defined |
| Q-024 | Does anyone notify the resident when an admin holds or removes a vehicle? | UNKNOWN. The pilot design sends no notice |
| Q-025 | How long are vehicle audit events kept? | UNKNOWN. Distinct from Q-011, which is plates, photos, and phones. No duration is chosen |
| Q-026 | Who may take a vehicle off hold, and does that return it to `active`? | UNKNOWN. No release transition is defined |

## 12. Document map

| Question | Document |
| --- | --- |
| Acceptance ids for the pilot | `FRD.md` |
| Records, states, transitions, invariants, failures, permissions | `TECHNICAL_DESIGN.md` |
| Screens for resident, guest link, patroller, admin, signer | `UX_DESIGN_SPEC.md` |
| Pilot, then a reference case, then other HOAs | `GTM_STRATEGY.md` |
| What to test first | `TEST_PLAN.md` |
| Pages demo versus pilot operations | `RUNBOOK.md` |
