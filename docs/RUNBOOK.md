# Zonr runbook — demo and pilot

Two different systems. The GitHub Pages demo is live. The pilot is a design and is not deployed.

Code baseline: `main` `99d283e` (VERIFIED). Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. S-2 is D-067. The other pilot success criteria are UNAPPROVED.

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
| Who owns the GitHub account | UNKNOWN (`PRD.md` does not assign an owner beyond the repo) | UNKNOWN |

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
| Retention | Do not delete or keep on a schedule that has not been chosen | UNKNOWN, Q-011, RADAR for California privacy applicability |
| Legal content of an authorization | Do not improvise from memory. Ask RADAR | UNKNOWN, Q-016 |
| Henry as a required operator | The design forbids a person-specific permission | PROPOSED, I-11 |
| First admin and invites | No public self-signup. The credential method is not chosen. Bootstrap is an operator action for one community, not a named person in this runbook | UNKNOWN method, Q-019. PROPOSED shape, PAC-073 |
| Deletion of plates or photos | No pilot delete step. The window is not chosen | UNKNOWN, Q-011 |
| Vehicle approval queue | None. A resident adds, updates, and removes their own vehicle. An admin may hold or remove a vehicle in the community | D-067 |
| Release a hold | Only an admin. Residents and patrollers cannot. The status becomes `active`. That target is derived from D-069, which frees the vehicle for resident edits. Henry can correct the target status. Record the admin, the time, and an optional reason on the audit event. Do not send a notice | D-075. The notice is Q-032 |
| How many vehicles one resident may register | No cap. Do not refuse an add because the account already has vehicles. One current row per plate still applies | D-070. Plate rule is PAC-024 |
| Notice when an admin holds or removes a vehicle | Send one to that vehicle's resident. Do not choose the channel or the wording. Do not send one when the resident removes their own vehicle | D-072. Channel and wording are Q-028, tied to Q-019 |
| Plate changes | Allow 3 per vehicle in 30 days. Refuse the 4th while those three still count. Do not count a description-only edit or the original add. Do not share the count across a resident's vehicles. Admins see the changes on the vehicle audit events. Do not keep a second log. Do not add another abuse control | D-073. The 30-day count is the proposed rolling window, Q-029. Further controls are Q-030 and are not in force |
| Audit log retention | A job deletes an audit event once its age is past 365 days. Keep an event at 364 days and an event at exactly 365 days. Do not archive the deleted event. Do not delete a violation, a tow authorization, a photo, or a notification event in that job. Do not use this job on the 30-day plate-change count. An event that still counts is younger than 30 days | D-074. Plates, photos, and phones stay Q-011. Violation and tow-authorization retention is Q-031 |
| File a warning | Refuse an empty reason. The patroller picks one code from the proposed list in `FRD.md` and in `PRD.md` section 11.2. Other requires a description. Do not accept a description on any other code. The close reason stays free text and is not that list. Do not file one when the plate check says "on hold, don't act" | D-076. The codes and labels are PROPOSED for Henry to confirm. The hold refusal is D-077 |
| Held vehicle | The patroller sees "on hold, don't act". Do not file a warning. Do not start a tow. Contact an admin of that community. Only an admin can release the hold. Do not name a person, and do not call a tow company. After the admin releases the hold, the plate check no longer shows that line, and warning and tow follow the usual rules | D-077. Release is D-075 |

## 9. Questions

Decisions are in `PRD.md` section 11.1. Q-021 is resolved there by D-069. Q-022 is resolved there by D-070. Q-023 is resolved there by D-073. Q-024 is resolved there by D-072. Q-025 is resolved there by D-074. Q-026 is resolved there by D-075. Q-027 is resolved there by D-076. Q-020 is resolved there by D-077. Q-028, Q-029, Q-030, Q-031, and Q-032 stay open. Q-011 stays open.

The warning-reason list is PROPOSED for Henry to confirm. It is in `PRD.md` section 11.2. It is not a new question number.

To verify the audit job: run it, then check one audit event aged 364 days and one aged exactly 365 days are still present, and one aged past 365 days is gone with no archive copy. Check the violation's stored plate and the tow authorization's copied plate are unchanged. Check a plate-change event aged 30 days is still present.

| Id | What operations needs |
| --- | --- |
| Q-011 | Retention, before any pilot backup policy is written. RADAR on California privacy applicability |
| Q-012 | Whether a contract exists before any real plate is stored |
| Q-016 | RADAR, before anyone treats a PDF in the product as a complete authorization |
| Q-018 | Who owns the GitHub account and the IP, before a second person is made admin of the repo |
| Q-019 | How the first admin signs in, before any resident plate is collected |
| Q-020 | Resolved by D-077. On a held plate, show "on hold, don't act". Do not file a warning or start a tow. Contact an admin of the community. After that admin releases the hold, the usual warning and tow rules apply |
| Q-021 | Resolved by D-069. A resident cannot change or remove a held vehicle. An admin release is what frees it. That release is D-075, and it is not the remove action |
| Q-022 | Resolved by D-070. Do not refuse an add because the resident already has vehicles |
| Q-023 | Resolved by D-073. Enforce 3 plate changes per vehicle per 30 days. Admins already see them on the audit events |
| Q-024 | Resolved by D-072. Tell the resident after an admin hold or an admin removal. Do not tell them after their own removal |
| Q-025 | Resolved by D-074. The audit job purges events past 365 days. Verify with the checks above |
| Q-026 | Resolved by D-075. Only an admin releases a hold. The status becomes active, derived from D-069. Do not let a resident or a patroller do it |
| Q-027 | Resolved by D-076. Refuse a warning with an empty reason. Store a code from the proposed list. Other needs a description. Do not store a description on any other code. The close reason stays free text |
| Q-028 | Which channel carries the hold or removal notice, and what it says. Tied to Q-019. Until answered, write the event and do not choose a channel or wording |
| Q-029 | Whether the 30 days are a rolling 30 × 24 hours on server timestamps, which is the proposed count, or some other window. Until answered, use the proposed count. Do not switch to a calendar or a community timezone |
| Q-030 | Whether any abuse control besides the plate-change limit is required. Until answered, do not add one |
| Q-031 | Whether violation records and tow-authorization records follow the 365-day audit retention. Until answered, the audit job does not delete them |
| Q-032 | Whether releasing a hold notifies the resident. Until answered, do not send one. D-072 covers hold and remove only |

D-053's reviewer list remains UNKNOWN until Henry writes it down.
