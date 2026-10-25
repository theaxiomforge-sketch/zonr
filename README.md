# Zonr

## 1. What this repository is

Zonr on `main` is a Vite + React + TypeScript mock of residential parking operations. It is a public demo, not the HOA pilot.

The docs are the single-community pilot design Henry approved for a design pass on 2026-10-22. They separate that design from the mock. Claims are marked VERIFIED, INFERRED, or UNKNOWN. The pilot community is Bridgeway HOA (D-094). S-1 and S-3 are accepted (D-092). S-2, the vehicle registry, is D-067. S-4, S-5, and S-6 stay proposed. A guest pass is at most 72 hours (D-080) and a household may have 4 passes in a Pacific calendar month (D-081). Residents and admins create passes; the issuing resident or an admin revokes (D-082). One plate cannot have two live passes (D-083). Grace after the first warning is 3 days (D-084). A second warning is required before a tow authorization (D-085). Each warning needs a photo (D-086) and a reason from the proposed list (D-076). A plate change counts only while its age is under 30 × 24 hours and drops out at exactly that age (D-099). The audit log is kept for 365 days (D-074). Violation records and tow authorizations are kept for 36 months (D-101). The plate stored on the violation survives the audit purge. Login is an email magic link, with no public sign-up (D-097). Hold, removal, and release notices go by email and text (D-098, D-102). Henry personally owns the IP. The notice is [LICENSE.md](LICENSE.md) (D-096). It is not an open-source license. Q-011 and Q-016 stay open for RADAR. Legal questions are not decided in these docs.

## 2. Docs

| Doc | What it is |
| --- | --- |
| [docs/PRD.md](docs/PRD.md) | Pilot scope, buyer, users, non-goals, decisions, and Henry's open questions |
| [docs/FRD.md](docs/FRD.md) | Pilot acceptance ids, and the prototype behaviors that fail them |
| [docs/TECHNICAL_DESIGN.md](docs/TECHNICAL_DESIGN.md) | Records, states, transitions, invariants, failures, permissions |
| [docs/UX_DESIGN_SPEC.md](docs/UX_DESIGN_SPEC.md) | Pilot screens, including resident self-service for their own vehicles (D-067) |
| [docs/GTM_STRATEGY.md](docs/GTM_STRATEGY.md) | Pilot, then a reference case, then other HOAs. No market figures |
| [docs/TEST_PLAN.md](docs/TEST_PLAN.md) | No tests today. Minimum cases for the pilot rules |
| [docs/RUNBOOK.md](docs/RUNBOOK.md) | GitHub Pages demo, D-053, and the fact that the pilot is not deployed |
| [LICENSE.md](LICENSE.md) | Copyright notice. Henry (TheAxiomForge), all rights reserved. Not an open-source license (D-096) |

The demo, from `main`, is [https://theaxiomforge-sketch.github.io/zonr/](https://theaxiomforge-sketch.github.io/zonr/). Local commands are `npm ci`, `npm run dev`, and `npm run build`. There is no lint script and no test script.
