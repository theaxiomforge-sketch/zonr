# Zonr runbook — demo and pilot

Two different systems. The GitHub Pages demo is live. The pilot is a design and is not deployed.

Code baseline: `main` `99d283e` (VERIFIED). Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. Success criteria for the pilot are UNAPPROVED.

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
| Export for a dispute | An admin or signer action in the future product, per community | PROPOSED, PAC-060. Not available today |
| Retention | Do not delete or keep on a schedule that has not been chosen | UNKNOWN, Q-011, RADAR for California privacy applicability |
| Legal content of an authorization | Do not improvise from memory. Ask RADAR | UNKNOWN, Q-016 |
| Henry as a required operator | The design forbids a person-specific permission | PROPOSED, I-11 |
| First admin and invites | No public self-signup. The credential method is not chosen. Bootstrap is an operator action for one community, not a named person in this runbook | UNKNOWN method, Q-019. PROPOSED shape, PAC-073 |
| Deletion of plates or photos | No pilot delete step. The window is not chosen | UNKNOWN, Q-011 |

## 9. Questions

| Id | What operations needs |
| --- | --- |
| Q-011 | Retention, before any pilot backup policy is written. RADAR on California privacy applicability |
| Q-012 | Whether a contract exists before any real plate is stored |
| Q-016 | RADAR, before anyone treats a PDF in the product as a complete authorization |
| Q-018 | Who owns the GitHub account and the IP, before a second person is made admin of the repo |
| Q-019 | How the first admin signs in, before any resident plate is collected |

D-053's reviewer list remains UNKNOWN until Henry writes it down.
