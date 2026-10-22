# Zonr

## 1. What this repository is

Zonr is a small Vite + React + TypeScript single-page app for residential parking operations. The running app is a mock prototype: one in-memory dataset, five public pages, and a GitHub Pages deploy. It is not a backend product.

These notes were taken from the source at main `99d283e` and later. They separate what the prototype does from what a real product would still have to decide. Product decisions that the code does not answer are listed for Henry in [docs/PRD.md](docs/PRD.md).

## 2. Docs

| Doc | What it is |
| --- | --- |
| [docs/PRD.md](docs/PRD.md) | Product intent read from the app, scope, and Henry's open questions |
| [docs/FRD.md](docs/FRD.md) | Functional requirements: one acceptance id per behavior that exists today |
| [docs/TECHNICAL_DESIGN.md](docs/TECHNICAL_DESIGN.md) | Implemented client architecture, and the mock boundary a backend would replace |
| [docs/UX_DESIGN_SPEC.md](docs/UX_DESIGN_SPEC.md) | Screens, copy, states, and where the copy is ahead of the behavior |
| [docs/GTM_STRATEGY.md](docs/GTM_STRATEGY.md) | Go-to-market. Claims are marked UNKNOWN or ASSUMPTION |
| [docs/TEST_PLAN.md](docs/TEST_PLAN.md) | No tests exist today. This is the minimum set to add |
| [docs/RUNBOOK.md](docs/RUNBOOK.md) | GitHub Pages deploy, and the D-053 pull-request-only workflow |

The public demo, as deployed from `main`, is [https://theaxiomforge-sketch.github.io/zonr/](https://theaxiomforge-sketch.github.io/zonr/). Local commands are `npm ci`, `npm run dev`, `npm run build`, and `npm run preview`.
