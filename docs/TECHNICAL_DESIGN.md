# Zonr technical design

Baseline: main `99d283e`. This document describes the client that is in the repository. Section 8 is the PROPOSED boundary for a backend. It is not an architecture decision.

## 1. Purpose

Explain how the prototype is built, which state is real, and which sentences in the UI are not backed by code. A reader should be able to change the mock without inventing a server.

## 2. Scope

### 2.1 IMPLEMENTED

| Piece | Where |
| --- | --- |
| Vite 5 + React 18 + TypeScript SPA | `package.json`, `src/main.tsx` |
| Hash routing, five pages | `src/main.tsx`, `src/App.tsx` |
| In-memory mock with a 180ms delay | `src/services/mockApi.ts` |
| Seed fixture | `src/data/seed.ts` |
| Shared React state | `src/context/AppState.tsx` |
| Static GitHub Pages deploy of `dist/` | `.github/workflows/deploy-pages.yml` |

Declared dependency ranges are React `^18.3.1`, React DOM `^18.3.1`, and React Router DOM `^6.28.0`. Dev dependencies are the React type packages, `@vitejs/plugin-react` `^4.3.4`, TypeScript `^5.6.3`, and Vite `^5.4.10`. The Pages job installs with `npm ci` on Node 24. There is no `engines` field.

### 2.2 PROPOSED

Replacing `mockApi.ts` with a network client. Everything past that function list — accounts, a database, files, QR, cameras, property-management sync, notifications, tow partners — is unnamed by the code. See section 8.

## 3. Success

A technical change is faithful to this design when:

1. `npm run build` still means `tsc && vite build`.
2. The five pages still read and write through `useAppState`, not through a second store.
3. A reload still restores `seedData`.
4. The Pages artifact is still the Vite `dist/` directory, with `base` `/zonr/`.

## 4. Non-goals

| Non-goal | Why |
| --- | --- |
| A component library, state library, or CSS framework | The app uses local components and one stylesheet |
| Server-side rendering | `vite build` emits a static `index.html` plus hashed assets |
| Automated tests in this tree | None exist. The minimum to add is in `TEST_PLAN.md` |
| Choosing a database, auth provider, or API style | UNKNOWN until the questions in `PRD.md` section 8 are answered |
| Hardening the public demo as a production system | The demo is a static mock. Threats that matter to a real parking system are not mitigated here because there is no shared data |

## 5. Runtime shape

### 5.1 Boot

`index.html` mounts `/src/main.tsx` into `#root`. The title is set in that file. `main.tsx` renders, inside `React.StrictMode`, a `HashRouter`, then `AppStateProvider`, then `App`.

`App` defines one layout route and five child routes. `path="*"` renders `<Navigate to="/" replace />`.

| Path | Page | Loading sentence |
| --- | --- | --- |
| `/` | `OverviewPage` | Loading Zonr workspace... |
| `/manager` | `ManagerPage` | Loading manager workspace... |
| `/resident` | `ResidentPage` | Loading resident portal... |
| `/guest` | `GuestPage` | Loading guest portal... |
| `/enforcement` | `EnforcementPage` | Loading patrol tools... |

`HashRouter` keeps the route after `#`. Combined with Vite `base: "/zonr/"`, the hosted manager URL is `https://theaxiomforge-sketch.github.io/zonr/#/manager`. The Pages commit `f23ae13` replaced `BrowserRouter` with `HashRouter` in the same change as the workflow. ASSUMPTION, labeled as such: the hash exists so a static host can refresh any screen without a rewrite rule. The commit message does not say that. Q-019 owns the canonical URL. The routing fact is IMPLEMENTED.

### 5.2 Module store and React store

`mockApi.ts` holds `let db`, initialized with `structuredClone(seedData)`. Every function waits `NETWORK_DELAY_MS` (180) and returns `structuredClone` of the value it hands back. Returned objects are not the stored objects.

`AppStateProvider` loads once. The effect calls `fetchDashboard()`, ignores the result if the provider unmounted, then in a transition stores the clone and clears `isLoading`. There is no second fetch, no error state, and no abort of the timer. The load cannot fail: the mock does not reject.

Writes go through four context methods. Each method calls the matching mock function and then applies its own update to React state:

| Context method | Mock function | What React state does after the mock returns |
| --- | --- | --- |
| `createGuest` | `createGuestSession` | Prepends the session. Maps every open spot in that zone to guest. Increments the "Guest sessions today" stat by parsing its value and adding 1 |
| `savePermit` | `updatePermit` | Replaces the matching permit. If the id is missing, the mock resolves empty after the wait and the context returns without a state change. No screen sends a missing id |
| `saveSpotAssignment` | `assignSpot` | Replaces the matching spot. A missing id resolves empty and the context returns. The manager page also refuses to call this when no spot is selected |
| `logViolation` | `createViolation` | Prepends the violation. Sets status `violation` and note to the reason on every spot with the same `currentPlate` |

The screen reads React state. The module `db` is written too, but nothing refetches it. The copies diverge in two IMPLEMENTED ways:

1. Spot allocation on guest create. The mock uses `find` and updates the first open spot in the zone. React uses `map` and updates every open spot in the zone. The seed has at most one open spot per zone, so a fresh session does not show the split. A manager can set a second spot to `open` first. Then the screen and the module disagree until reload.
2. The guest-session stat. Only the React state update changes it. `db.stats` stays at the seed. A refetch, if one were added, would show the new session and the old "312".

Reload re-executes the module, so `db` is seeded again and React loads that seed. Both divergences disappear. They matter the day someone refetches, or tests the mock and the UI as if they were one store.

`useAppState` throws `useAppState must be used inside AppStateProvider` when the context is missing. The five pages are inside the provider.

### 5.3 Data model

Types live in `src/types.ts`. There is no property, user, or audit type.

| Type | Fields the code stores | Notes |
| --- | --- | --- |
| `Spot` | `id`, `zone`, `status` (`open`, `resident`, `guest`, `violation`), optional unit, resident name, plate, note | Zone is a free string on the spot. Forms only offer three zone names. Assignment does not edit zone |
| `Permit` | `id`, resident name, unit, plate, vehicle, `permitType` (`smart-decal`, `plate-based`, `temporary`), `status` (`approved`, `review`, `revoked`), `registrationOnFile` | Type is never edited. Status is edited from the resident page |
| `GuestSession` | `id`, guest name, host unit, plate, phone, `durationHours`, `remainingMinutes`, `expiresSoon`, `zone` | New rows set remaining minutes to hours times 60 and `expiresSoon` to false. No clock updates them |
| `Violation` | `id`, plate, reason, zone, `action` (`warning`, `citation`, `tow-watch`, `tow-dispatched`), `gpsStamp`, `photoCount` | New rows use GPS `34.0523, -118.2438` and `photoCount` 1 |
| `Stat` | `label`, `value`, `delta` | All strings. Only one label is rewritten, and only on the React copy |

Ids for new sessions and violations are `guest-` or `violation-` plus `crypto.randomUUID()`.

Plate handling is IMPLEMENTED as follows. Guest create and violation create call `toUpperCase()` on the input. Permit update uppercases only when `input.plate` is truthy; an empty string keeps the stored plate. Spot assignment stores the plate as typed. Violation matching compares that stored spot plate to the already-uppercased violation plate. A lowercase spot plate therefore does not match an uppercase log of the "same" plate.

Permit save spreads the input onto the permit object. The resident editor always sends id, vehicle, plate, status, and registration flag. It never sends a permit type.

### 5.4 Seed

The fixture is the whole product dataset. Counts a reviewer can confuse:

| Source | What it counts |
| --- | --- |
| `stats` | 1,284 permits, 312 guest sessions, 87 violations prevented, 98.4% occupancy. Display strings |
| Arrays | 8 spots, 3 permits, 3 guest sessions, 3 violations |
| Overview Live Ops | Array lengths, plus the literal "2 tow escalations pending" |
| Smart Decals card | Permits with type `smart-decal`. The seed has one |

Spot, permit, session, and violation rows are tabulated in `FRD.md` section 12. The fixture does not satisfy referential integrity. A guest plate need not appear on a spot. A violation zone need not equal the zone of the spot with that plate. The name on a guest spot need not equal the guest-session name. No code path repairs this.

## 6. Page behavior that is easy to misread from the file names

### 6.1 Resident

`ResidentPage` filters with `useDeferredValue`. The filter predicate is a case-insensitive `includes` over name, vehicle, plate, and unit. Selection is a separate `useState` defaulting to `permit-1`. The editor is `PermitEditor` with `key={selectedPermit.id}`, so a new id remounts the form and drops unsaved input. The resident and unit inputs are `readOnly`. The save handler does not touch spots.

### 6.2 Guest

The form uses native `required` on the four text fields. Duration and zone are selects with fixed options. Submit does not await the promise before clearing the form, and it does not disable the button. Two quick submits are two sessions. Phone is stored and not shown in the list.

### 6.3 Manager

The "map" is a CSS grid of `<button>` elements. Click copies the spot into local form state. Save is a no-op when `selectedSpotId` is still `""`. The note written by the mock is the template `` `${status} assignment updated` ``. The permit queue and violation feed are read-only maps. Nothing on this page creates a permit or a violation.

### 6.4 Enforcement

The scanner is a styled box. The large plate is the form state, initial value `8GKF204`, which is also seed violation-3. Changing the input changes the box. Submit does not consult `data.permits`. Empty plate is allowed. A spot with `currentPlate` `""` would match an empty log. The seed spots use `undefined` for a missing plate, and `"" === undefined` is false, so a blank log does not mark seed spots that have no plate.

## 7. Build, host, and repository layout

### 7.1 Scripts and config

| Script | Command | Role |
| --- | --- | --- |
| `dev` | `vite` | Local dev server |
| `build` | `tsc && vite build` | Typecheck the app project, then emit `dist/` |
| `preview` | `vite preview` | Serve the production build locally |

`tsconfig.json` is strict, `noEmit`, JSX `react-jsx`, and includes `src` only. `tsconfig.node.json` includes `vite.config.ts`. A type error in `src` fails the Pages build because the workflow runs `npm run build`. There is no ESLint config, Prettier config, test script, or CI job other than Pages.

`.gitignore` ignores `node_modules/` and `dist/`.

### 7.2 Files

| Path | Responsibility |
| --- | --- |
| `index.html` | Shell and title |
| `vite.config.ts` | React plugin and `base` `/zonr/` |
| `src/main.tsx` | Router and provider |
| `src/App.tsx` | Route table |
| `src/components/Layout.tsx` | Brand and nav |
| `src/components/Shared.tsx` | `SectionHeading` and `Panel` |
| `src/pages/*.tsx` | The five screens |
| `src/context/AppState.tsx` | Load and the four writes |
| `src/services/mockApi.ts` | The only data access |
| `src/data/seed.ts` | Fixture |
| `src/types.ts` | The dashboard types |
| `src/styles.css` | All presentation |
| `.github/workflows/deploy-pages.yml` | Pages pipeline |

Deploy steps, the Node 24 opt-in, and the D-053 pull-request rule are operational. They are specified in `RUNBOOK.md`, not repeated here.

## 8. PROPOSED backend boundary

IMPLEMENTED seam: the UI does not know about `db`. It knows `fetchDashboard`, `createGuestSession`, `updatePermit`, `assignSpot`, and `createViolation`.

PROPOSED, and not designed: a client module with those five calls against a real API. A backend would also have to decide, and the code does not:

| Topic | What the prototype does instead |
| --- | --- |
| Identity and authorization | Nothing. Q-001, Q-003, Q-006 |
| Durability | Process memory. Q-015 |
| Guest inventory when the zone is full | Creates the session anyway. Q-008 |
| Time | Stores a number. Never decrements it. Q-009 |
| Plate identity | String equality after an inconsistent case rule. Q-010 |
| Files, images, GPS | A boolean, a constant photo count, a constant coordinate. Q-007, Q-011 |
| Property-management sync | A badge. Q-014 |
| Overview metrics | Strings, one of which the guest flow rewrites on screen only. Q-012, Q-013 |

Do not add endpoints, tables, or vendors in a follow-up until those questions have answers. The resident-page sentence about a future permits API is a comment to the reader, not a contract.

## 9. Defects to keep visible

These are IMPLEMENTED behaviors, not a backlog Henry has accepted.

| Defect | Consequence |
| --- | --- |
| Two writers for one action | UI tests and module tests can disagree on guest spot updates and on the guest stat |
| Guest stat parse | `Number.parseInt` of the stat value. A non-numeric value would become `NaN` on screen. The seed value "312" parses |
| No in-flight lock | Double submit duplicates sessions, permit writes, assignments, or violations |
| No load or write failure UI | The mock's reads resolve. The pages call `void` on write promises, so a future rejection would be unhandled. Nothing in today's mock rejects |
| Seed integrity | Cross-links between spots, guests, and violations are narrative, not constraints |
| Public static hosting | Every visitor gets the same seed and a private dirty copy. There is no shared vandalism of a server, and there is also no real operation |

## 10. Open questions

Technical work past section 8 waits on `PRD.md` Q-001 through Q-015, Q-018, and Q-019. No stack is recommended here.
