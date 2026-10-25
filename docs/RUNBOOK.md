# Zonr runbook — demo and pilot

Two different systems. The GitHub Pages demo is live. The pilot is a design and is not deployed.

Code baseline: `main` `99d283e` (VERIFIED). Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. S-1 and S-3 are accepted (D-092). S-2 is D-067. S-4, S-5, and S-6 stay UNAPPROVED. The copyright notice is [LICENSE.md](../LICENSE.md) (D-096). It is not an open-source license.

## 1. Purpose

Operate the public demo without pretending it is the HOA pilot, and state how a change is allowed to reach `main`.

## 2. Scope

| In scope | Out of scope |
| --- | --- |
| Pages workflow, URL, and recorded runs | An SLA (UNKNOWN) |
| D-053 pull-request rule and what GitHub does not enforce | Inventing branch protection. The protection API returned HTTP 403 on the earlier read (VERIFIED as that 403, not as "unprotected") |
| What must not be done with pilot data on the demo | Tow dispatch, because there is no such integration to operate |

## 3. Success

| Situation | Success | Label |
| --- | --- | --- |
| Demo | A green Pages run on `main` updates https://theaxiomforge-sketch.github.io/zonr/ | VERIFIED as the pipeline's job. Uptime target UNKNOWN |
| A change | It arrives by a pull request, not a direct push, under the operating rule called D-053 | The rule is the instruction used for these docs. Enforcement is not in the repo (section 7) |
| Pilot | Not applicable. No pilot environment exists | VERIFIED by absence |

## 4. Non-goals

| Non-goal | Why |
| --- | --- |
| Host resident plates, photos, or phones on Pages | The site is public (VERIFIED). Pilot data stays off it (PROPOSED) |
| Add a tow-vendor secret to the workflow | Dispatch is out of scope. PAC-052 |
| Deploy the pilot from this runbook | The pilot is not built |
| Force-push `main` or merge from the authoring session | D-053 as practiced on the docs and demo pull requests |

## 5. Demo system

| Item | Value | Label |
| --- | --- | --- |
| Repository | `theaxiomforge-sketch/zonr`, public | VERIFIED |
| Demo URL | https://theaxiomforge-sketch.github.io/zonr/ | VERIFIED. Pages `build_type` workflow, branch `main`, HTTPS on |
| App paths | `/zonr/#/`, `/zonr/#/manager`, `/zonr/#/resident`, `/zonr/#/guest`, `/zonr/#/enforcement` | VERIFIED (`HashRouter`, Vite `base` `/zonr/`) |
| Workflow | `.github/workflows/deploy-pages.yml`, name "Deploy To GitHub Pages" | VERIFIED |
| Node | 24, plus `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` | VERIFIED |
| Artifact | `dist/` from `npm run build` | VERIFIED |
| Concurrency | Group `pages`, cancel in progress | VERIFIED |
| Who owns the work | Henry (TheAxiomForge). The notice is LICENSE.md. It is not an open-source license | D-096 |
| Who owns the GitHub account | Not named by D-096. IP ownership is not a GitHub-admin seat | Still not a product rule |

### 5.1 When a deploy runs

| Trigger | Runs | Publishes |
| --- | --- | --- |
| Push to `main` | Yes | If the deploy job succeeds |
| `workflow_dispatch` | Yes | If the deploy job succeeds |
| Pull request, including this docs PR and the demo-plate PR | No | No |

A docs-only merge to `main` still builds, because there is no path filter (VERIFIED). The build does not read the markdown. It will still publish a new bundle of the same app.

### 5.2 Jobs

Build: checkout, Node 24, `npm ci`, `npm run build`, configure Pages, upload `dist/`. Deploy needs build and runs `deploy-pages` in the `github-pages` environment (VERIFIED).

If build fails, deploy is skipped and the previous site remains. That follows from `needs: build` (VERIFIED as the workflow shape).

### 5.3 Recorded runs

| Run | Head | Result | Label |
| --- | --- | --- | --- |
| [23728281604](https://github.com/theaxiomforge-sketch/zonr/actions/runs/23728281604) | `f23ae13` | Build failed, deploy skipped. Log download HTTP 410. Cause UNKNOWN | VERIFIED outcome. Cause UNKNOWN |
| [23729407085](https://github.com/theaxiomforge-sketch/zonr/actions/runs/23729407085) | `f23ae13` | `workflow_dispatch` succeeded. Same commit as the failure | VERIFIED. The red build was not a source change that remained |
| [23729580260](https://github.com/theaxiomforge-sketch/zonr/actions/runs/23729580260) | `99d283e` | Push succeeded | VERIFIED |

### 5.4 Demo data

`main` still serves the original seed plates and the three phones `(310) 555-0188`, `(424) 555-0173`, and `(800) 555-0100` (VERIFIED at `99d283e`). Those phones are inside `555-0100`–`555-0199` (VERIFIED by reading them).

Pull request #2, not merged, replaces eight licence plates with `DEMO001`–`DEMO008` and adds the banner "Demo — all names, plates, phones and locations are fictional." (VERIFIED on that branch). `TEMP-QR` is unchanged there. Merging #2 updates the demo only after it reaches `main` and the Pages job succeeds.

Do not load the pilot HOA's plates, photos, or phones into this site (PROPOSED).

## 6. Local demo commands

| Step | Command | Label |
| --- | --- | --- |
| Install | `npm ci` | VERIFIED script via npm |
| Dev | `npm run dev` | App is under `/zonr/` because `base` is `/zonr/` (VERIFIED) |
| Build | `npm run build` | `tsc && vite build` (VERIFIED) |
| Preview | `npm run preview` | Serves `dist/` |
| Lint | `npm run lint` | No script (VERIFIED). Exit is the npm missing-script error |
| Test | `npm test` | No script (VERIFIED) |

There is no `.env` and no API secret in the demo (VERIFIED). Do not add one to reach a tow vendor.

Reset the demo's data: reload the browser. The module seed returns (VERIFIED). That reset is not a pilot procedure.

## 7. D-053 pull-request-only workflow

### 7.1 The rule

D-053, as followed for this repository's docs and for the demo-plate change: work is done on a branch that is not `main`, pushed normally, and opened as a pull request. Do not force-push. Do not merge from the authoring session unless a reviewer asks. Do not comment on the pull request unless asked.

The exact policy text, the required reviewers, and whether docs and product code share reviewers are UNKNOWN (`PRD.md` does not settle them; the earlier question stands as an operations unknown).

### 7.2 What the repo enforces

| Control | Observed at the docs rewrite |
| --- | --- |
| History of `main` | Three direct commits through `99d283e`. No merge commit in that history (VERIFIED) |
| Pull requests | #1 docs, open. #2 demo plates, open. Neither merged at the time of this rewrite (VERIFIED) |
| A workflow that rejects a direct push | None (VERIFIED). A direct push to `main` would still run Pages |
| Rulesets | Empty list on the earlier read (VERIFIED then). Re-check before relying on it |
| Branch protection | HTTP 403 to this token earlier (VERIFIED as the error). Current setting UNKNOWN |

D-053 is an operating instruction. It is not a control.

### 7.3 Landing a change

1. Branch from current `main`.
2. Commit and push the branch. No force-push.
3. Open or update one pull request into `main`.
4. Leave merge to the reviewer.
5. After a merge, section 5.1 runs because the merge is a push to `main`.

## 8. Pilot operations

There is no pilot host, database, backup, or on-call (VERIFIED by absence). When a pilot environment exists, this section has to be rewritten. Until then:

| Topic | Rule | Label |
| --- | --- | --- |
| Data store | Not the Pages site | PROPOSED |
| Tow dispatch | No runbook step. The product has no such action | PROPOSED, PAC-052 |
| Secrets | None for a tow vendor | PROPOSED |
| Export for a dispute | An admin or signer action in the future product, per community. The archive includes the warning's stored plate, reason code, and reason text, and the previous and new plate on a vehicle edit | PROPOSED, PAC-060. Not available today |
| Retention | The schedule in `TECHNICAL_DESIGN.md` section 8, adopted pending attorney review (D-103). Not a legal conclusion. Audit events stay 365 days (D-074). A closed violation stays 36 calendar months from `closed_at` and is not deleted while open or while a photo file remains (Q-048). A tow authorization stays 36 calendar months from the signature (D-101). Photo files, plates, phones, scan events, and access logs follow their own rows in that schedule | D-103, D-074, and D-101 |
| Legal content of an authorization | The §22658 list in `PRD.md` section 11.2 is PROPOSED (D-104). It is not a legal conclusion and not an instruction to treat a PDF as complete. A California attorney confirms that list before the pilot goes live. Design may be written before that confirmation. The confirmation is not a finding that the list is the law | D-104 |
| Pre-pilot gate | Do not take the pilot live until that attorney confirmation is recorded. Bridgeway's CC&Rs and parking rules are added later. That dependency is known. It is not a question | D-104 |
| Henry as a required operator | The design forbids a person-specific permission. Henry owns the IP (D-096). That ownership is not a signer seat | D-096, I-11 |
| First admin and invites | No public sign-up. Login is an email magic link (D-097). Bootstrap is an operator action for one community, not a named person in this runbook. Do not issue a magic link until its lifetime is set (Q-041). Refuse an invite that names another community. A resident invite needs a phone (D-087). A person with no email cannot be invited (Q-036) | D-097, PAC-073 |
| Purge jobs | There is no delete screen. Run the jobs in PAC-064 through PAC-069. Each purge, redaction, or blocked purge writes one deletion-log row: `purged`, `redacted`, or `held`. The jobs do not delete that log. A failed run leaves the rows in place | D-103, PAC-068 |
| Vehicle approval queue | None. A resident adds, updates, and removes their own vehicle. An admin may hold or remove a vehicle in the community | D-067 |
| Release a hold | Only an admin. Residents and patrollers cannot. The status becomes `active`. That target is derived from D-069. Henry can correct the target status. Record the admin, the time, and an optional reason on the audit event. Notify the resident by email and by text | D-075 and D-102 |
| How many vehicles one resident may register | No cap. Do not refuse an add because the account already has vehicles. One current row per plate still applies | D-070. Plate rule is PAC-024 |
| Notice when an admin holds, removes, or releases a vehicle | Send email and text to that vehicle's resident. Do not choose the wording (Q-037). What happens when a text fails, including the email, any retry, and the vehicle change, is Q-042. No fallback is decided. Do not send one when the resident removes their own vehicle | D-072, D-098, and D-102. The phone is required by D-087. Q-042 is open |
| Guest passes | Stay cap 72 hours. Month cap 4 passes per household per Pacific calendar month. Refuse a second unrevoked pass on the same plate, including one that has not started. The daily household cap is configuration and is unset: refuse creates until it is set (Q-034). Do not invent the number | D-080, D-081, D-082, D-083, D-100 |
| Plate changes | Allow a change while fewer than 3 plate-change events for that vehicle are under 30 × 24 hours old. At exactly 30 × 24 hours the oldest no longer counts, and another change is allowed if fewer than 3 remain in the count. Refuse the 4th while three still count, and write an admin alert. Do not send that alert until its channel is chosen (Q-038). Do not count a description-only edit or the original add. Do not share the count across a resident's vehicles. Admins see the changes on the vehicle audit events. Do not keep a second log | D-073, D-099, and D-100 |
| Audit log retention | A job deletes an audit event once its age is past 365 days. Keep an event at 364 days and an event at exactly 365 days. Do not archive the deleted event. Do not delete a violation, a tow authorization, a photo, a notification event, or an access-log row in that job. The plate on the violation stays. Do not use this job on the 30-day plate-change count. An event still counts only while its age is under 30 × 24 hours. An event aged exactly 30 × 24 hours no longer counts and is still kept. Access logs are a second store, kept 12 calendar months (Q-046) | D-074. The 12-month access-log row does not replace 365 days |
| Violation and tow retention | Delete a closed violation past 36 calendar months from `closed_at`. Keep one at exactly 36 calendar months. Do not delete an open violation or its plate, however old the first warning is. A case that never closes stays under the 90-day review. No outer limit is set (Q-048). Do not delete a closed violation while any of its photo files remain. Photo purge runs first. Delete a tow authorization, including a voided one, past 36 calendar months from the signature. Keep one at exactly that age. Do not clear `had_tow_authorization` on the violation. The violation row still carries that flag. The `closed_at` clock is a proposed reading of D-101. Do not delete photo files in this job. Photo purge still runs before the violation row. An address inside the uploaded writing has no sooner period (Q-047). Do not show that address to the vehicle owner | D-101 and D-103. Q-047 and Q-048 are open |
| Photo purge | At closure, each photo stores its own class and `purge_after`. Warning-only: `closed_at` plus 6 calendar months. Fined or disputed: plus 24 calendar months. Nothing in the pilot writes the fined class, and no admin action changes the class after closure. Tow case: plus 36 calendar months when `had_tow_authorization` on the violation is true. That flag is set when the authorization is created and stays true after the authorization is voided or purged. Close does not look for an authorization row. A violation whose flag is false is warning-only. The job reads `purge_after` only. It does not read the flag and it does not look up an authorization row. Keep a file at exactly `purge_after`. Photos of an open violation have no `purge_after` and are not purged by age. After a warning-only file is gone the row shows its id, plate, reasons, times, filers, grace end, and close reason, and no image (Q-043). A GPS stamp goes with the file | D-103. Q-043 asks Henry to confirm the split |
| Plates | Resident vehicle plate: 30 days after move-out or deactivation, using the earlier recorded time when both exist. Keep it at exactly 30 × 24 hours. Do not delete the plate on the violation (Q-045). Guest-pass plate: 14 days after the pass end, or after revoke if that is earlier. Keep it at exactly 14 × 24 hours. Open-case plate: do not delete it. Review each open case every 90 days. The review is not a deletion. After closure the plate stays with the violation until 36 calendar months from `closed_at`, and only after its photos are gone (Q-048) | D-103. Q-045 and Q-048 are open |
| Phones | Do not collect a guest phone. Resident phone: delete every stored copy 30 days after move-out. The copies are the account and any invite that still has a phone. Keep each at exactly 30 × 24 hours. Deactivation alone does not delete it. Accepting an invite deletes the invite phone in that transaction. Revoking an invite deletes the invite phone in that transaction. The deletion log says `purged`. An invite phone at exactly `expires_at` is still present. Past that instant the phone job redacts it and the log says `redacted`. The invite row stays. Do not invent how long the row is kept, or the length of `expires_at`. A legal hold on that row blocks the delete or the redaction and the log says `held`. Closed-case phone: redact 30 days after closure. The violation keeps no phone. The case id and the plate stay. Do not remove an active account's phone on case closure (Q-044). Do not copy a phone onto a notification, an audit `before` or `after`, or the export CSV | D-103 and D-087. Q-044 is open |
| Scan events | A patroller or admin plate check writes one. Delete it once its age is past 90 × 24 hours. Keep one at exactly 90 × 24 hours. Do not treat it as an audit event | D-103 |
| Legal hold | An admin sets the flag when a row is tied to a dispute, a claim, a subpoena, or a member records request, and clears it when that matter is resolved. While the flag is set, do not purge and do not redact that row. The job writes `held`. After the flag is cleared, the next run applies the age rule, including a row already past its period | D-103 |
| File a warning | Refuse an empty reason. The patroller picks one code from the proposed list in `FRD.md` and in `PRD.md` section 11.2. Other requires a description. Do not accept a description on any other code. Require at least one photo. The close reason stays free text and is not that list. Do not file one when the plate check says "on hold, don't act" | D-076 and D-086. The codes and labels are PROPOSED for Henry to confirm. The hold refusal is D-077 |
| Second warning | On the same open violation, not a second row. The patroller uses the same reason list and a new photo. Do not offer a tow until this step exists and the 3-day grace has ended. Do not require a wait or the same reason (Q-033). Do not file it when the plate is on hold | D-085, D-084, D-077 |
| Held vehicle | The patroller sees "on hold, don't act". Do not file a warning or a second warning. Do not start a tow. Contact an admin of that community. Only an admin can release the hold. Do not name a person, and do not call a tow company. After the admin releases the hold, the plate check no longer shows that line, and warning and tow follow the usual rules | D-077. Release is D-075 |
| Guest link | An unrevoked pass stays viewable for 24 hours after it ends, including at exactly 24 hours, and the page says the pass has ended. A revoked pass, an unknown token, and a pass older than those 24 hours show only "this link is not valid." | D-088 |
| Pilot paperwork | The board disclosure and the short pilot agreement are planned documents outside this repository. The pilot is free. Do not copy those files into the repo | D-091 |
| IP | Do not replace [LICENSE.md](../LICENSE.md) with an open-source license. Henry (TheAxiomForge) owns the work | D-096 |

## 9. Questions

Decisions are in `PRD.md` section 11.1. Q-001 through Q-032 are resolved there. The only open questions are in `PRD.md` section 11.3.

The warning-reason list is PROPOSED for Henry to confirm. It is in `PRD.md` section 11.2. It is not a new question number. The resident consent step is PROPOSED and is not a legal conclusion. The retention schedule is adopted pending attorney review and is not a legal conclusion (D-103).

To verify the audit job: run it, then check one audit event aged 364 days and one aged exactly 365 days are still present, and one aged past 365 days is gone with no archive copy and a deletion-log row of `purged`. Check the violation's stored plate and the tow authorization's copied plate are unchanged. Check a plate-change event aged exactly 30 × 24 hours is still present and no longer counts toward the plate-change limit. To verify the 36-month job: an open violation older than 36 calendar months from the first warning is still present, with its plate. A closed violation at exactly 36 calendar months from `closed_at` is still present, and one past that date is gone only when no photo file remains. A closed violation past that date that still has a photo file is still present. A tow authorization at exactly 36 calendar months from the signature is still present, and one past that date is gone. That job does not delete photo files. A tow-case photo whose authorization row is already gone is still purged on the `purge_after` stored on the photo. To verify the rest of the schedule: a vehicle plate at exactly 30 × 24 hours after move-out or deactivation is present, and one past that age is gone while the violation plate remains; a guest plate at exactly 14 × 24 hours after the session is present and one past that age is gone; a scan at exactly 90 × 24 hours is present and one past that age is gone; a warning-only photo at exactly 6 calendar months after closure is present, and one past that date is gone while the violation row still shows its id, plate, reasons, times, filers, grace end, and close reason, and no image; a closed-case redaction past 30 days leaves the case id and the plate and leaves no phone on the violation; an access-log row at exactly 12 calendar months is present and one past that date is gone, while an audit event under 365 days is still present. To verify legal hold: set the flag on a row already past its period, run the job, and check the row is unchanged and the log says `held`. Clear the flag, run the job again, and check the row is purged or redacted. The deletion log is still present after every run.

| Id | What operations needs |
| --- | --- |
| Q-011 | Resolved by D-103. Run the schedule. It is adopted pending attorney review. Do not treat it as a legal conclusion. Do not change the 365-day audit job or the 36-month violation job |
| Q-012 | Resolved by D-091. Use the disclosure and the pilot agreement that already exist outside the repo. The pilot is free. Do not commit those files |
| Q-016 | Resolved by D-104. The list is PROPOSED. Do not go live until a California attorney confirms it. CC&Rs and parking rules come later |
| Q-018 | Resolved by D-096. Henry personally owns the IP. The notice is LICENSE.md |
| Q-019 | Resolved by D-097. Magic link by email. Bootstrap one admin for one community. Refuse a cross-community invite |
| Q-020 | Resolved by D-077. On a held plate, show "on hold, don't act". Do not file a warning, a second warning, or a tow |
| Q-028 | Resolved by D-098 for the channel. Email and text. The words are Q-037 |
| Q-029 | Resolved by D-099. Count an event while its age is under 30 × 24 hours and drop it at exactly that age |
| Q-030 | Resolved by D-100. Alert an admin on the refused 4th plate change. Do not set the daily guest-pass number (Q-034) |
| Q-031 | Resolved by D-101 for the length. 36 months. The proposed clocks are `closed_at` for a closed violation and `signed_at` for a tow authorization (Q-048). Do not purge an open violation by age. The audit log stays 365 days |
| Q-032 | Resolved by D-102. A release notifies the resident by email and text |
| Q-033 | Still open. Do not add a wait between warnings, and do not require the same reason |
| Q-034 | Still open. Leave the daily cap unset and refuse pass creates until Henry sets it |
| Q-035 | Still open. When both the month cap and the daily cap fail, refuse the pass and do not pick which error to show |
| Q-036 | Still open. Do not invent a sign-in for a person with no email |
| Q-037 | Still open. Do not write the notice text |
| Q-038 | Still open. Write the plate-change alert and do not send it |
| Q-041 | Still open. Do not issue magic links until the lifetime is set |
| Q-042 | Still open. Do not decide what happens when a text fails |
| Q-043 | Still open. After a warning-only or fined photo is purged, the violation row remains and shows no image. Do not change the photo periods |
| Q-044 | Still open. Redact a closed-case phone and do not remove an active account phone because of that redaction |
| Q-045 | Still open. Purge the vehicle plate and keep the plate on the violation |
| Q-046 | Still open. Keep the access log and the audit log as two stores |
| Q-047 | Still open. Do not pick a sooner period for the authorizer address |
| Q-048 | Still open. Do not treat `closed_at` as Henry's clock. A case that never closes stays under the 90-day review. Do not invent an outer limit |

D-053's reviewer list remains UNKNOWN until Henry writes it down.
