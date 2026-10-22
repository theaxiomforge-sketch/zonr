# Zonr product requirements

Baseline: main `99d283e9e7aad854559df145ea4834fab428fec1` ("Opt Pages workflow into Node 24"), plus the public site that build deployed. Henry approved a docs-only pull request. He has not approved the product choices below. Anything the code does not settle is a question in section 8, not a decision.

Labels used in this set:

| Label | Meaning |
| --- | --- |
| IMPLEMENTED | Behavior present in the prototype at the baseline commit |
| PROPOSED | A direction the UI copy points at, or a seam the code leaves open. Not designed and not built |
| UNKNOWN | Not in the repo. Only Henry can close it |

## 1. Purpose

### 1.1 What the code says the product is

Zonr, in this repository, is a residential parking-operations prototype. The page title is "Zonr | Smart Parking Operations". The header says "Smart parking operations for residential communities." The GitHub repository description says: Focuses on the "parking zones" managed within the app. The overview calls the category "Proptech parking orchestration" and says the product should replace hangtags, disconnected spreadsheets, and manual patrol ambiguity with digital permits, guest sessions, a map, and enforcement verification.

That positioning is IMPLEMENTED as copy. The software behind it is IMPLEMENTED as a single-browser mock. Five routes share one in-memory dashboard: Overview, Manager, Resident, Guest, and Enforcement. There is no server, no account, and no saved record after a reload.

### 1.2 Why this document exists

The prototype mixes working behavior with marketing sentences. A reader can think QR codes, cameras, drag-and-drop, document upload, property-management sync, and tow dispatch already exist. They do not. This PRD records the product the code actually is, names the next product only as PROPOSED, and stops where Henry has to choose.

## 2. Scope

### 2.1 In scope for this PRD

| Item | Status | Evidence |
| --- | --- | --- |
| One unnamed residential site with three zones: North Court, Clubhouse, East Garage | IMPLEMENTED | Seed data and the zone dropdowns |
| Eight parking spots with status open, resident, guest, or violation | IMPLEMENTED | `src/data/seed.ts`, manager grid |
| Three resident permits, types smart-decal, plate-based, and temporary, statuses approved, review, and revoked | IMPLEMENTED | Permit type and the resident editor |
| Guest session registration into the shared list, and occupancy of an open spot in the chosen zone | IMPLEMENTED | `createGuestSession` and the guest page |
| Spot assignment edits from the manager page | IMPLEMENTED | Assignment form |
| Violation logging that can mark a matching plate as a violation | IMPLEMENTED | Enforcement page |
| A public GitHub Pages demo | IMPLEMENTED | `.github/workflows/deploy-pages.yml` and the live site |
| A real multi-user backend, auth, persistence, QR, camera, payments, or tow integration | PROPOSED | Named in copy or left as a mock seam. Not built |

### 2.2 Users the prototype actually serves

The prototype has no user accounts. Anyone who can open the site can use every page. The four operating roles below are pages, not permissions.

| Role page | What that person can do in the prototype |
| --- | --- |
| Overview visitor | Read the pitch, the sample stats, and links into the other pages |
| Property manager | Select a spot and overwrite its unit, name, plate, and status. Read the permit queue and the violation list |
| Resident | Search the three permits and edit vehicle, plate, status, and a registration checkbox |
| Guest | Submit a session form. Read the session list |
| Enforcement | Type a plate and log a warning, citation, tow-watch, or tow-dispatched record |

Who those roles are in a real deployment, and whether a resident should be able to revoke their own permit, is UNKNOWN. See Q-001, Q-003, and Q-006.

### 2.3 Sample world the prototype ships with

The seed is a demo scene, not a customer. It uses 555 phone numbers and GPS coordinates around 34.05, -118.24. The overview stats say 1,284 active permits, 312 guest sessions today, 87 violations prevented, and 98.4% occupancy accuracy. The editable records are 3 permits, 3 guest sessions, 3 violations, and 8 spots. Those figures do not describe the same property. The seed is also internally uneven: a guest session plate is not always the plate on the host's spot, and a violation's zone is not always the zone of the spot showing that plate. Treat the seed as fixture copy.

## 3. Success

### 3.1 Success of the prototype, as it exists

The prototype succeeds when a reviewer can open the Pages site, or `npm run dev`, and walk one shared story without a backend:

1. The overview loads the sample stats and the five destinations.
2. A manager can select a spot and save a new assignment, and the grid shows it.
3. A resident can find a permit and save a plate, vehicle, status, and registration flag, and the manager queue shows the edit.
4. A guest can start a session, see it in the list, and see an open spot in that zone change on the manager grid.
5. Enforcement can log a plate that already sits on a spot, and that spot turns into a violation.
6. A browser reload clears every edit and restores the seed.
7. A push to `main` that passes the Pages workflow updates `https://theaxiomforge-sketch.github.io/zonr/`.

No numeric target, adoption goal, or service level is in the repo. Those are UNKNOWN (Q-016).

### 3.2 Success of a later product

PROPOSED, and not specified: the resident page itself says vehicle changes "update locally now and can later be wired straight into a real permits API." The manager permit panel is badged "PMS sync next." Success for that later product cannot be written until Henry answers section 8. This PRD does not set revenue, accuracy, or response-time goals. The "-22 min avg response" and "98.4%" figures are seed strings. They are not measurements.

## 4. Non-goals

These are outside the prototype. They stay outside until Henry puts them in scope.

| Non-goal | Why it is out |
| --- | --- |
| Authentication, roles, and per-community tenancy | No login exists. Every route is public |
| A database or shared state across browsers | The store is a module variable. Reload rebuilds it from the seed |
| QR codes, guest-session extension, and a ticking expiry | The guest page is a form. `expiresSoon` is stored and never shown. Minutes do not move |
| Document upload | The resident control is a checkbox |
| Drag-and-drop assignment | The manager map is a grid of buttons. The badge says "Drag-and-drop ready" |
| License-plate cameras, photos, and a permit lookup at scan time | The scanner prints the plate input. New violations store `photoCount: 1` and a fixed GPS string. `logViolation` does not read permits |
| Property-management sync | Badge copy only |
| Tow dispatch to a vendor | The action is a label on a record |
| Payments, citations as legal documents, notifications, email, or SMS | No such flows exist |
| Making the overview statistics consistent with the eight spots | Not done, and not assumed to be a bug until Q-012 and Q-013 |
| Go-to-market claims | See `GTM_STRATEGY.md`. None are treated as fact |

## 5. Product behavior in force today

Detail and acceptance ids live in `FRD.md`. The product rules a reviewer can rely on now:

1. One browser session has one dashboard. Edits on one page show up on the others without a reload.
2. A reload restores the seed. Nothing is saved.
3. Guest registration stores an uppercased plate and `durationHours * 60` remaining minutes. On screen, every open spot in the chosen zone becomes a guest spot. The mock module itself updates only the first open spot. A reload discards both results. See the technical design for that split.
4. The guest-session stat on screen increases by one per registration. The mock module does not store that increase. A reload restores "312".
5. Saving a permit does not move the plate onto a parking spot. Enforcement matches the plate string on the spot, not the permit.
6. Logging a violation rewrites every spot with that exact plate to status `violation`.
7. Unknown routes return to the overview.
8. There is no permission check.

## 6. PROPOSED next product

This section is a boundary, not a design.

The only integration seam in the code is `src/services/mockApi.ts`. The UI calls five functions: load the dashboard, create a guest session, update a permit, assign a spot, and create a violation. A real backend would replace those functions. The UI copy also names, without implementing, a permits API, property-management sync, QR entry, a camera, drag-and-drop, and tow escalation.

PROPOSED work stops at that sentence. Choosing the API, the system of record, auth, file storage, plate-recognition vendor, or tow partner would invent answers Henry has not given. Do not treat section 6 as approval to build a backend.

## 7. Constraints the repo already imposes

| Constraint | Source |
| --- | --- |
| Static SPA. Hash URLs under `/zonr/` | `HashRouter`, `vite.config.ts` base `/zonr/`, Pages workflow uploads `dist/` |
| TypeScript strict, React 18, React Router 6, Vite 5 | `package.json`, `tsconfig.json` |
| Node 24 in the Pages workflow | `deploy-pages.yml` |
| Public repo and public Pages site | GitHub Pages API: `public: true`, `https://theaxiomforge-sketch.github.io/zonr/` |
| Changes to `main` are how the demo ships | Workflow trigger is `push` to `main`, plus manual dispatch |
| D-053 says later changes arrive by pull request | Operating instruction for this work. Not enforced in the repo. See `RUNBOOK.md` |

Privacy of the sample plates and phone numbers on a public URL is UNKNOWN (Q-015). The numbers are fictional 555 numbers, but the site is world-readable.

## 8. Questions only Henry can answer

These are the product questions. Engineering should not fill them in.

| Id | Question |
| --- | --- |
| Q-001 | Who pays, who uses the product day to day, and who is explicitly not a user? |
| Q-002 | Is Zonr one community's tool or software for many properties? The code has one unnamed site, three zones, and no property record. |
| Q-003 | Are the five pages separate accounts with permissions, or public demo lenses? Today they are public lenses. |
| Q-004 | Which UI sentences are commitments for a later release, and which are prototype decoration? |
| Q-005 | What does a smart decal physically do, and is it required for a first real release? |
| Q-006 | Who may set a permit to approved or revoked? The resident editor can do both today. |
| Q-007 | What evidence counts as "registration on file," and is a checkbox an acceptable record? |
| Q-008 | What are the guest rules: who may start a session, the real duration limits, extensions, overnight stays, delivery and lobby sessions, and the rule when the zone has no open spot? |
| Q-009 | Should remaining time count down, and should expiry change the spot? Today the minutes never move. |
| Q-010 | Is the plate the match key for enforcement? How should temporary plates, blank plates, and a permit plate edit that does not update the spot behave? |
| Q-011 | Are warning, citation, tow-watch, and tow-dispatched notes only, or do they call an outside service? Who has authority to tow? |
| Q-012 | Are the overview statistics real measures or sample copy? They do not match the eight spots and three permits. |
| Q-013 | Is the hardcoded phrase "2 tow escalations pending" intentional demo copy or a defect? |
| Q-014 | Which property-management system, if any, should sync, and which fields move in which direction? |
| Q-015 | May the public Pages demo keep showing plates, phone numbers, and GPS, including after the data stops being a seed? |
| Q-016 | What is success for this prototype, and what is success for a paid product? No target is in the repo. |
| Q-017 | What, if anything, should the go-to-market doc be allowed to claim? Pricing, geography, competitors, and channel are absent. See `GTM_STRATEGY.md`. |
| Q-018 | What is the exact text of D-053, who may merge to `main`, and should GitHub enforce it? |
| Q-019 | Is `https://theaxiomforge-sketch.github.io/zonr/` the canonical demo, and who owns the GitHub account and the Pages environment? |
| Q-020 | Which sentence is the product: the repo's "parking zones," or the UI's "smart parking operations"? |

## 9. Document map

| Question a reader has | Document |
| --- | --- |
| What must the prototype do, id by id? | `FRD.md` |
| How is the client built, and where would a backend attach? | `TECHNICAL_DESIGN.md` |
| What does each screen show, including copy that over-promises? | `UX_DESIGN_SPEC.md` |
| What can we say in the market? | `GTM_STRATEGY.md` |
| What should be tested first? | `TEST_PLAN.md` |
| How does the demo ship, and how do changes land? | `RUNBOOK.md` |
