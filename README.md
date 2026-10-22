# Zonr

## 1. What this repository is

Zonr on `main` is a Vite + React + TypeScript mock of residential parking operations. It is a public demo, not the HOA pilot.

The docs on this branch are the single-community pilot design Henry approved for a design pass on 2026-10-22. They separate that design from the mock. Claims are marked VERIFIED, INFERRED, or UNKNOWN. Success criteria are PROPOSED and not approved. Legal questions go to RADAR.

## 2. Docs

| Doc | What it is |
| --- | --- |
| [docs/PRD.md](docs/PRD.md) | Pilot scope, buyer, users, non-goals, and Henry's open questions |
| [docs/FRD.md](docs/FRD.md) | Pilot acceptance ids, and the prototype behaviors that fail them |
| [docs/TECHNICAL_DESIGN.md](docs/TECHNICAL_DESIGN.md) | Records, states, transitions, invariants, failures, permissions |
| [docs/UX_DESIGN_SPEC.md](docs/UX_DESIGN_SPEC.md) | Pilot screens, including the removal of resident self-approval |
| [docs/GTM_STRATEGY.md](docs/GTM_STRATEGY.md) | Pilot, then a reference, then other HOAs. No market figures |
| [docs/TEST_PLAN.md](docs/TEST_PLAN.md) | No tests today. Minimum cases for the pilot rules |
| [docs/RUNBOOK.md](docs/RUNBOOK.md) | GitHub Pages demo, D-053, and the fact that the pilot is not deployed |

The demo, from `main`, is [https://theaxiomforge-sketch.github.io/zonr/](https://theaxiomforge-sketch.github.io/zonr/). Local commands are `npm ci`, `npm run dev`, and `npm run build`. There is no lint script and no test script.
