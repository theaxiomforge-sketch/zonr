# Zonr functional requirements

Baseline: main `99d283e`. This FRD lists behavior the prototype has today. Each acceptance id is one behavior. PROPOSED work is not given an acceptance id. Product choices the code does not make stay in `PRD.md` section 8.

## 1. Purpose

Give a reviewer a checklist that matches the running mock. A test can cite an id. A later backend must not be read into these ids.

## 2. Scope

### 2.1 In scope

User-visible behavior of the five routes, the shared in-memory dashboard, and the rules the mock applies when a form is submitted. Static marketing paragraphs are in scope only where they state a fact a user could mistake for live data.

### 2.2 Out of scope

CSS color values, animation timing, and component structure. Those are in `UX_DESIGN_SPEC.md` and `TECHNICAL_DESIGN.md`. GitHub Pages operation is in `RUNBOOK.md`. Behaviors that do not exist are grouped once, in AC-053, so they are not quietly treated as requirements.

## 3. Success

Every id below can be demonstrated on `npm run dev` or on `https://theaxiomforge-sketch.github.io/zonr/` without a server. After a reload, the seed from `src/data/seed.ts` is back.

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| Acceptance tests for QR, camera, upload, drag-and-drop, PMS, SMS, or tow dispatch | Not implemented. AC-053 records the absence |
| A spec for roles and permissions | No gate exists. AC-052 records that |
| Fixing seed inconsistencies | The seed is fixture data. ACs describe the code's rules, not a cleaned dataset |
| Performance budgets beyond the built-in delay | The delay is the fixed 180ms in `mockApi.ts` |

## 5. Shared shell

| Id | Behavior |
| --- | --- |
| AC-001 | The document title is "Zonr \| Smart Parking Operations". |
| AC-002 | The header shows the brand "Zonr" and the sentence "Smart parking operations for residential communities." |
| AC-003 | The header nav shows Overview, Manager, Resident, Guest Portal, and Enforcement, in that order, linking to `/`, `/manager`, `/resident`, `/guest`, and `/enforcement`. |
| AC-004 | The link for the current route uses the active style. Overview is active only on `/`, not on the other routes. |
| AC-005 | Any path other than the five routes replaces the current history entry with `/`. |
| AC-006 | Routing is hash-based. On GitHub Pages the app is served under the `/zonr/` base, so a manager link resolves as `/zonr/#/manager`. |
| AC-007 | Until the dashboard load finishes, the requested page shows only its loading sentence: "Loading Zonr workspace...", "Loading manager workspace...", "Loading resident portal...", "Loading guest portal...", or "Loading patrol tools...". The workspace does not render during that wait. |
| AC-008 | After the load, Overview, Manager, Resident, Guest, and Enforcement read one shared dashboard: stats, spots, permits, guest sessions, and violations. |
| AC-009 | A full page reload restores the seed dashboard. Moving between routes in the same page load does not. |
| AC-010 | A dashboard read or write waits 180ms and then resolves. A found record resolves as a clone, and editing that clone does not edit the stored dashboard. A permit or spot write whose id is not in the list resolves empty after the same wait, and the screen ignores the empty result. No screen sends an unknown id. |

## 6. Overview

| Id | Behavior |
| --- | --- |
| AC-011 | The overview shows the eyebrow "Proptech parking orchestration", the headline "Zonr turns every residential lot into a live, enforceable system.", the hangtag / spreadsheet / patrol paragraph, a primary action "Explore manager view" to `/manager`, and a secondary action "Launch guest portal" to `/guest`. |
| AC-012 | The Live Ops card shows "{spot count} spots monitored" and the sentence "{guest-session count} guest sessions, {violation count} active incidents, 2 tow escalations pending." The spot, session, and incident counts follow the current lists. The "2" is literal text. It does not change when a tow action is logged. |
| AC-013 | The Smart Decals card shows "{n} decal accounts live", where n is the number of permits whose type is `smart-decal`. |
| AC-014 | The overview renders one stat card per stat, in list order, with that stat's label, value, and delta. The seed cards are "Active permits" / "1,284" / "+9.2%", "Guest sessions today" / "312" / "+14%", "Violations prevented" / "87" / "-22 min avg response", and "Occupancy accuracy" / "98.4%" / "+6.1 pts". |
| AC-015 | Four role cards appear, in order: Property Manager to `/manager` ("Open manager workspace"), Resident to `/resident` ("Open resident portal"), Guest to `/guest` ("Open guest flow"), and Enforcement to `/enforcement` ("Open patrol tools"). Each card shows its title, its paragraph, and that call to action. |
| AC-016 | The blueprint block is fixed copy for Manager, Resident, Guest, and Enforcement. Saving data does not change those four paragraphs. |

## 7. Resident portal

| Id | Behavior |
| --- | --- |
| AC-017 | The directory lists permits and badges "{n} matches" with the filtered count. |
| AC-018 | A blank search lists every permit. A non-blank search keeps a permit when the trimmed query is a case-insensitive substring of the resident name, vehicle, plate, or unit. Other fields, including status and permit type, are not searched. |
| AC-019 | Activating a permit row selects it, marks that row active, and shows it in the editor. |
| AC-020 | If the selected id is not in the permit list, the editor falls back to the first permit. No screen removes a permit, so a person cannot start this fallback. It is the lookup rule. |
| AC-021 | The editor shows "Resident" as read-only text "{name} · Unit {unit}". Vehicle, plate, permit status, and "Registration document on file" are editable. |
| AC-022 | The status control offers `approved` labeled "Approved", `review` labeled "Review needed", and `revoked` labeled "Revoked". |
| AC-023 | Submitting "Save permit" stores that permit's vehicle, plate, status, and registration flag. The directory and the manager permit queue show the stored values. |
| AC-024 | On save, a non-empty plate is stored in uppercase. An empty plate leaves the previous plate in place. |
| AC-025 | The editor cannot change permit type, resident name, or unit. |
| AC-026 | Selecting a different permit id reloads the editor from that permit. Unsaved text in the previous permit is dropped. |
| AC-027 | Filtering the directory does not change which permit is selected. A permit can stay in the editor while it is hidden from the list. An empty match list leaves the editor as it was. |

## 8. Guest portal

| Id | Behavior |
| --- | --- |
| AC-028 | The form has guest name, host unit, license plate, and phone, all required by the form. Duration offers 1, 2, 4, and 8 hours and starts at 2. Zone offers North Court, Clubhouse, and East Garage and starts at North Court. |
| AC-029 | A submit with those required fields creates a session and places it at the top of the live list when the write resolves. The form clears immediately, before that resolve, back to empty text, 2 hours, and North Court. A submit the browser blocks, because a required field is empty, does not run the submit handler, so nothing is created and the typed fields stay. |
| AC-030 | The new session has an id beginning with `guest-`, the entered name, host unit, phone, duration, and zone, an uppercased plate, remaining minutes equal to the duration in hours times 60, and `expiresSoon` false. |
| AC-031 | On the current screen, every spot in the chosen zone whose status is `open` changes to `guest`. Each of those spots shows the session plate, the host unit, the guest name, and the note "Guest pass active for {hours}h". |
| AC-032 | The mock module updates only the first open spot in that zone, in array order. The screen does not read the module back after the write. With one open spot, the screen and the module match. With two or more, the screen shows every open spot changed and the module has changed only the first. AC-009 discards both, because a reload rebuilds the module from the seed. |
| AC-033 | If the chosen zone has no open spot, the session is still created and no spot changes. |
| AC-034 | Each created session adds 1 to the numeric value of the stat labeled "Guest sessions today". The delta text on that stat does not change. The other three stats do not change. |
| AC-035 | The live list shows, for every session including the seed, the guest name, plate, host unit, remaining minutes, and zone. It does not show the phone number or the duration in hours. |
| AC-036 | Remaining minutes do not count down. `expiresSoon` is not rendered. Nothing in the guest flow extends, ends, or deletes a session. |

## 9. Manager workspace

| Id | Behavior |
| --- | --- |
| AC-037 | The spot grid renders every spot. The spot's background follows its status: open, resident, guest, or violation. Each spot shows its id, zone, and note, or "Ready to assign" when the note is missing. |
| AC-038 | The legend reads Available / Open, Occupied by Resident, Guest Active, and Violation Detected, mapped to open, resident, guest, and violation. |
| AC-039 | Choosing a spot outlines it and fills the assignment form with its unit, resident or guest name, plate, and status. A missing unit, name, or plate fills as an empty field. |
| AC-040 | Submitting "Save assignment" with no spot selected does not change the dashboard. |
| AC-041 | Submitting with a spot selected stores the typed unit, name, and plate, the chosen status, and the note "{status} assignment updated" on that spot. The grid shows the new note and status. The previous note is replaced. |
| AC-042 | The permit queue lists every permit, read-only, with name, unit, vehicle, plate, status, and either "Docs on file" or "Awaiting docs" from the registration flag. |
| AC-043 | The violation feed lists every violation, read-only, with plate, reason, action, and zone. |
| AC-044 | Spots are buttons. The page has no drag-and-drop behavior. The badge "Drag-and-drop ready" does not add any. |

## 10. Enforcement

| Id | Behavior |
| --- | --- |
| AC-045 | The form starts with plate `8GKF204`, reason "Unauthorized vehicle", zone East Garage, and action warning. The scanner frame displays the current plate text and the sentence "Permit status checked against Zonr records". |
| AC-046 | Zone offers North Court, Clubhouse, and East Garage. Action offers warning labeled "Warning", citation labeled "Citation", tow-watch labeled "Tow watchlist", and tow-dispatched labeled "Tow dispatched". |
| AC-047 | Submitting "Log violation" prepends a violation whose id begins with `violation-`, whose plate is the uppercased input, and whose reason, zone, and action are the form values. The stored GPS stamp is the fixed string "34.0523, -118.2438". The stored photo count is 1. |
| AC-048 | Every spot whose current plate equals that stored plate changes to status `violation`, and its note becomes the violation reason. Spots with a different plate do not change. |
| AC-049 | The incident list shows, for every violation, the plate, reason, photo count, action, zone, and GPS stamp. |
| AC-050 | The form does not require a plate or a reason. It does not open a camera, attach a photo, read the permit list, or change a permit. The scanner sentence in AC-045 is copy. |

## 11. Cross-page rules

| Id | Behavior |
| --- | --- |
| AC-051 | A permit save, a spot save, a guest session, or a logged violation is visible on the other pages in the same page load, without another fetch. |
| AC-052 | No route asks the visitor to sign in. No route hides an action based on a role. |
| AC-053 | The following have no working behavior behind the copy that names them: generating or scanning a QR code, extending a guest session, uploading a registration file, dragging a spot assignment, recognizing a plate from a camera, capturing a photo, syncing a property-management system, and contacting a tow vendor. |
| AC-054 | Editing a permit plate does not change `currentPlate` on any spot. A later violation matches spots, not permits. |
| AC-055 | The manager and enforcement zone controls cannot create a fourth zone. Guest and enforcement zones are the three names in AC-028 and AC-046. Spots keep whatever zone the seed, or a future data change, gave them. The assignment form does not edit the zone. |
| AC-056 | Guest, permit, assignment, and violation submits do not disable the form during the 180ms wait. A second submit starts a second write. |

## 12. Seed the acceptance checks start from

A fresh load uses these records. They are the starting state for the ids above, not extra rules.

### 12.1 Spots

| Id | Zone | Status | Unit | Name on spot | Plate | Note |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | North Court | resident | 214 | Jordan Lee | 8HTX224 | Smart Decal active |
| A2 | North Court | open | — | — | — | Visitor-friendly spot |
| A3 | North Court | guest | 302 | Camila Flores | 6LPE920 | Guest pass expires in 48 min |
| B7 | Clubhouse | violation | — | — | 3VLE551 | Expired session |
| B8 | Clubhouse | resident | 118 | Miles Carter | 7KDU402 | Assigned compact space |
| C4 | East Garage | open | — | — | — | EV-ready |
| C5 | East Garage | guest | Lobby | Delivery | TEMP-QR | 15-minute service window |
| C6 | East Garage | resident | 441 | Avery Nguyen | 9MVP611 | Docs pending review |

North Court and East Garage each have one open spot. Clubhouse has none. AC-031 on a fresh load therefore changes A2 for North Court, C4 for East Garage, and no spot for Clubhouse.

### 12.2 Permits

| Id | Resident | Unit | Plate | Vehicle | Type | Status | Registration on file |
| --- | --- | --- | --- | --- | --- | --- | --- |
| permit-1 | Jordan Lee | 214 | 8HTX224 | Tesla Model Y | smart-decal | approved | yes |
| permit-2 | Avery Nguyen | 441 | 9MVP611 | Toyota Camry | temporary | review | no |
| permit-3 | Miles Carter | 118 | 7KDU402 | Ford F-150 | plate-based | approved | yes |

The resident page selects `permit-1` on first render.

### 12.3 Guest sessions

| Id | Guest | Host unit | Plate | Phone | Hours | Minutes left | Expires soon | Zone |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| guest-1 | Amelia R. | 302 | 6LPE920 | (310) 555-0188 | 2 | 48 | false | North Court |
| guest-2 | Marcus T. | 118 | 4WRS118 | (424) 555-0173 | 1 | 11 | true | Clubhouse |
| guest-3 | Food delivery | Lobby | TEMP-QR | (800) 555-0100 | 1 | 7 | true | East Garage |

`guest-2` has no spot with plate 4WRS118. Spot A3 names Camila Flores, while guest-1, which shares that plate, is Amelia R. The code does not reconcile those rows.

### 12.4 Violations

| Id | Plate | Reason | Zone | Action | GPS | Photos |
| --- | --- | --- | --- | --- | --- | --- |
| violation-1 | 5BXR993 | No permit found | Clubhouse | warning | 34.0522, -118.2437 | 2 |
| violation-2 | 3VLE551 | Guest time expired | North Court | tow-watch | 34.0524, -118.2440 | 3 |
| violation-3 | 8GKF204 | Repeat offense | East Garage | tow-dispatched | 34.0520, -118.2432 | 4 |

Spot B7 carries plate 3VLE551 in Clubhouse. violation-2 records the same plate in North Court. The code does not keep those zones aligned. AC-012's "2 tow escalations" matches the count of tow-watch plus tow-dispatched in this seed only by coincidence of the literal.

## 13. Open questions

No functional id is blocked on a guess. Q-006, Q-008, Q-009, Q-010, Q-012, and Q-013 in `PRD.md` would change a later FRD. They do not change the ids in this file.
