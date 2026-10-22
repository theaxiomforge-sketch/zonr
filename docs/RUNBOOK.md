# Zonr runbook

Baseline: main `99d283e`. Two operating facts belong here. The GitHub Pages pipeline is IMPLEMENTED in `.github/workflows/deploy-pages.yml` and has run. The D-053 pull-request-only workflow is the rule this documentation change followed. It is not implemented as a GitHub control.

## 1. Purpose

Tell a person how the public demo is built and published, how to run the same app locally, and how a change is allowed to reach `main` under D-053.

## 2. Scope

| In scope | Out of scope |
| --- | --- |
| The Pages workflow, its triggers, the live URL, and the three recorded runs | A general GitHub Actions tutorial |
| Local `npm` commands that exist in `package.json` | Adding Node, npm, or packages to a machine image |
| What D-053 requires for this repository, and what the repo does not enforce | Inventing branch-protection settings the token could not read |
| What to do when a Pages job fails | On-call staffing, status pages, or an SLA. None exist. UNKNOWN |

## 3. Success

| Situation | Success looks like |
| --- | --- |
| Local review | `npm run dev` serves the five routes, and `npm run build` exits 0 |
| Demo update | A green `Deploy To GitHub Pages` run on `main` leaves `https://theaxiomforge-sketch.github.io/zonr/` serving the new bundle |
| A product or docs change | The change is on a non-`main` branch and is opened as a pull request. It is not pushed straight to `main` |

There is no uptime target. Q-016 and Q-019.

## 4. Non-goals

| Non-goal | Why |
| --- | --- |
| Deploying from a pull request | The workflow trigger is `push` to `main` and `workflow_dispatch` only |
| A staging environment | One Pages site, one environment named `github-pages` |
| Rollback automation | Not in the workflow. Section 6.4 is the manual path |
| Enforcing D-053 inside GitHub | Not done. Section 7 says what was verified |
| Monitoring, alerting, or log shipping | The app has no logger. Actions stores the workflow log |

## 5. System

| Item | Value |
| --- | --- |
| Repository | `theaxiomforge-sketch/zonr`, public |
| Default branch | `main` |
| Demo | `https://theaxiomforge-sketch.github.io/zonr/` |
| Pages source | GitHub Actions workflow. API reports `build_type: workflow`, source branch `main`, path `/` |
| HTTPS | Enforced on the Pages site |
| App path | `/zonr/` plus a hash route, for example `/zonr/#/manager` |
| Artifact | `./dist` from `npm run build` |
| Workflow file | `.github/workflows/deploy-pages.yml` |
| Workflow name | Deploy To GitHub Pages |
| Environment | `github-pages` |
| Node in CI | 24, with `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` |
| Concurrency | Group `pages`, `cancel-in-progress: true` |

The live HTML as checked for this run returned 200, `content-type: text/html`, and `last-modified: Mon, 30 Mar 2026 05:35:00 GMT`. That timestamp matches the successful Node 24 run in section 6.3. The bundle referenced `/zonr/assets/index-5KVJI3YX.js` and a sibling CSS file. Those hashes change when the build changes. Do not treat the hashes as stable.

Who owns the GitHub account and who is allowed to dispatch the workflow is UNKNOWN. Q-019.

## 6. GitHub Pages deploy

### 6.1 When it runs

| Trigger | Runs the workflow | Publishes the site |
| --- | --- | --- |
| Push to `main` | Yes | Only if the deploy job succeeds |
| `workflow_dispatch` | Yes | Only if the deploy job succeeds |
| Pull request | No | No |
| Push to any other branch | No | No |

A docs-only change to `main` still runs the workflow, because the trigger is the branch, not a path filter. The build does not read the markdown.

### 6.2 What the jobs do

Permissions on the workflow token: `contents: read`, `pages: write`, `id-token: write`.

Job `build`, on `ubuntu-latest`:

1. `actions/checkout@v4`
2. `actions/setup-node@v4` with Node 24 and the npm cache
3. `npm ci`
4. `npm run build`
5. `actions/configure-pages@v5`
6. `actions/upload-pages-artifact@v3` with `path: ./dist`

Job `deploy` needs `build`. It runs `actions/deploy-pages@v4` in the `github-pages` environment. The environment URL is the deployment step's `page_url`.

If `build` fails, `deploy` does not run. The previous successful Pages deployment stays what visitors see. That follows from `needs: build`. It is not a separate rollback step.

`cancel-in-progress` means a newer `main` push cancels an in-flight Pages run in the same concurrency group. The cancelled run does not publish. The later run does, if it succeeds.

The `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` variable was added in `99d283e` ("Opt Pages workflow into Node 24"). The setup step was already requesting Node 24 in the earlier workflow. The variable forces Actions' own JavaScript actions onto Node 24. Leave it in place unless GitHub withdraws the opt-in. Do not bump the action major versions in a drive-by.

### 6.3 Recorded runs

| Run | Event | Head | Result |
| --- | --- | --- | --- |
| [23728281604](https://github.com/theaxiomforge-sketch/zonr/actions/runs/23728281604) | push of `f23ae13`, "Add GitHub Pages deployment" | `f23ae1335a8dc248870294f0cbcc17cf9f08c8aa` | Failed. The build job failed and the deploy job was skipped. The log download returns HTTP 410. Cause UNKNOWN |
| [23729407085](https://github.com/theaxiomforge-sketch/zonr/actions/runs/23729407085) | `workflow_dispatch` at 2026-03-30 05:28 UTC | `f23ae1335a8dc248870294f0cbcc17cf9f08c8aa` | Succeeded. Same commit as the failed push |
| [23729580260](https://github.com/theaxiomforge-sketch/zonr/actions/runs/23729580260) | push of `99d283e` | `99d283e9e7aad854559df145ea4834fab428fec1` | Succeeded |

The failed push and the later green dispatch are the same commit, so that red build is not a source bug still sitting in the tree. Do not invent a root cause. The log is gone. The site is serving the `99d283e` build.

### 6.4 Publish, check, and go back

Publish:

1. Land the commit on `main` by the path in section 7. A direct push also publishes, because the trigger does not care. D-053 says not to use that path.
2. Open Actions and watch `Deploy To GitHub Pages`.
3. When the deploy job is green, load `https://theaxiomforge-sketch.github.io/zonr/` and one hash route, `#/manager`. Hard-refresh. GitHub's edge cache on the HTML checked here was `max-age=600`. A stale page for a few minutes is consistent with that header.
4. Confirm the document title "Zonr | Smart Parking Operations" and that the overview leaves its loading sentence.

The app assets are hashed. The HTML file is what points at them. A cached HTML file can point at assets that still exist from that build. It should not point at a half-written deploy, because the deploy job publishes a finished artifact.

Go back:

1. There is no rollback button in this repo.
2. Revert the bad commit on a branch, open a pull request, and merge it to `main` under section 7. The new green deploy replaces the site.
3. Dispatching the workflow again republishes the current `main`. It does not republish an older commit unless `main` has moved back.
4. Redeploying an older SHA by checking it out and pushing it onto `main` is a history rewrite or a revert. Do not force-push `main`. D-053 and the request that opened this docs change both forbid a force-push.

### 6.5 Failure

| Symptom | What to do |
| --- | --- |
| `npm ci` fails | Lockfile and `package.json` disagree, or the npm registry was unreachable. Read the job log. Do not switch the workflow to `npm install` to get past it |
| `npm run build` fails | `tsc` failed or Vite failed. The site is unchanged. Fix on a branch |
| Deploy job fails after a green build | The artifact was produced and not published. The previous site remains. Re-run the workflow from the Actions tab once the Pages environment is healthy. Cause is in that job's log |
| Site 404s at `/zonr/` | Confirm Pages is still `build_type: workflow` and the last deploy job was green. Confirm `vite.config.ts` still has `base: "/zonr/"` |
| Deep link 404s | Use the hash form `/zonr/#/manager`. The server does not rewrite `/zonr/manager` to `index.html`. That path is not a route the host understands |
| Workflow did not start | The push was not to `main`. Pull requests do not deploy |

## 7. D-053 pull-request-only workflow

### 7.1 The rule

D-053, as given for this repository's documentation work: changes reach `main` only through a pull request. Do the work on a new branch that is not `main`. Open one pull request. Do not merge it from the authoring session unless the reviewer asks. Do not force-push. Do not comment on the pull request unless asked.

This docs change follows that rule. The branch is not `main`. The pull request is the delivery.

The exact policy text, the required reviewers, and whether documentation needs the same reviewers as product code are UNKNOWN. Q-018. Henry approved opening the docs pull request. That approval is not a written D-053 charter in the repo.

### 7.2 What the repository enforces

Verified while writing this runbook, against `main` at `99d283e`:

| Control | Observed |
| --- | --- |
| Commits on `main` | Three: `5eea8d1` "Build Zonr parking operations app", `f23ae13` "Add GitHub Pages deployment", `99d283e` "Opt Pages workflow into Node 24". All are ordinary commits. None is a merge commit |
| Pull requests | None open or closed |
| Rulesets | The rulesets API returned an empty list |
| Branch protection | The branch-protection API returned HTTP 403 for this token. Whether protection is on is UNKNOWN. Do not read the 403 as "unprotected" |
| A workflow that rejects direct pushes | None. The only workflow deploys Pages. It will publish a direct push to `main` |
| CODEOWNERS, a pull-request template, required reviews in repo files | None present |

D-053 is an operating instruction. It is not a control. A person with push access can still update the demo by pushing `main`. The instruction says not to.

### 7.3 How to land a change under D-053

1. Start from `main` at `99d283e` or a later commit on `main`.
2. Create a new branch. Do not commit on `main`.
3. Keep the change inside the request. For this pass, that meant markdown only.
4. Push the branch and open one pull request into `main`.
5. Leave it for review. Merging, force-pushing, and drive-by comments are out of the authoring session.
6. After a merge, section 6 runs because the merge is a push to `main`.

### 7.4 What D-053 does not require

| Not required by the observed rule | Note |
| --- | --- |
| A green test suite | No test suite exists. `TEST_PLAN.md` |
| A Pages preview for the branch | The workflow ignores branches other than `main` |
| Squash versus merge | UNKNOWN. Q-018 |
| A signed commit | Not configured in anything this runbook could see |

## 8. Local operation

| Step | Command | Notes |
| --- | --- | --- |
| Install | `npm ci` | Uses the lockfile. Prefer this over `npm install` when reproducing CI |
| Dev server | `npm run dev` | Vite. `base` is `/zonr/`, so the local app is `http://localhost:<port>/zonr/#/` and the manager is `http://localhost:<port>/zonr/#/manager`. The port is Vite's default unless it is already taken |
| Production build | `npm run build` | `tsc && vite build`. Writes `dist/`, which is gitignored |
| Serve the build | `npm run preview` | Serves `dist/` under the same `/zonr/` base |

Node 24 matches CI. Another current Node may run Vite. If it does not match CI, believe the workflow.

There is no `.env`, no secret, and no API key. The mock does not call the network. Do not add credentials to the Pages workflow to "finish" the prototype. A real backend's secrets are a design that Q-001 through Q-015 have not authorized. See `TECHNICAL_DESIGN.md` section 8.

Data reset for a confused reviewer: reload the browser. There is no admin reset and no database to wipe.

## 9. Open questions

| Id | What operations needs from Henry |
| --- | --- |
| Q-018 | The exact D-053 text, who may approve and merge, and whether GitHub should reject a direct push |
| Q-019 | Whether the Pages URL is canonical, and who owns the account and the `github-pages` environment |
| Q-015 | Whether this public demo is allowed to keep rendering plates, phones, and GPS once the data is no longer a seed |
| Q-016 | Whether a green Pages deploy is the operational success condition, or whether something else is |

The other product questions are in `PRD.md`. They do not change the deploy steps.
