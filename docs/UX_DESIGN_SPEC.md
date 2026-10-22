# Zonr UX design spec

Baseline: main `99d283e`, stylesheet `src/styles.css`, and the five pages. This spec records the interface that ships. It does not invent a visual system Henry has not drawn.

## 1. Purpose

Describe what a person sees, what each control does, and which labels promise a product the screen does not run. Acceptance behavior is `FRD.md`. This file is the screen contract.

## 2. Scope

### 2.1 IMPLEMENTED

One responsive page shell. A dark header and hero, then a light workspace. Five destinations in one nav. No login wall, no modal, no toast, and no empty-state illustration. Placeholder art is the colored spot grid and the scanner frame. There is no image asset in the repo.

### 2.2 PROPOSED

A true map, drag-and-drop, a QR code, a camera viewfinder backed by a device, a file upload, session extension, and role-specific navigation. The current screens mention several of these. None are interaction patterns yet. Whether to design them is Q-004.

## 3. Success

A UX change matches this spec when a person can, on a 320px-wide viewport and on a desktop viewport:

1. Tell which of the five destinations is current.
2. Finish a guest registration, a permit edit, a spot assignment, and a violation log using only the visible controls.
3. See that edit on another destination without being told to refresh.
4. Refresh and recognize the original sample scene.

Visual novelty is not a success metric. None is stated in the product.

## 4. Non-goals

| Non-goal | What the prototype does instead |
| --- | --- |
| A design system with tokens, theming, or a component library | One CSS file and two shared components, `SectionHeading` and `Panel` |
| Accessibility certification | Keyboard use is whatever native controls provide. Contrast is not measured. See section 8 |
| Distinct products for resident, guest, manager, and patrol | One chrome, five pages, no role switcher because there is no account |
| Copywriting a market claim | Copy is quoted here so it can be checked. Claims are judged in `GTM_STRATEGY.md` |
| Fixing misleading badges inside this docs pass | The badges stay until Henry answers Q-004. The spec marks them |

## 5. Information architecture

### 5.1 Destinations

The nav order is the product order.

| Label | Route | Job of the screen |
| --- | --- | --- |
| Overview | `#/` | Pitch, sample metrics, and doors into the four workspaces |
| Manager | `#/manager` | Spot grid, assignment form, permit queue, violation feed |
| Resident | `#/resident` | Searchable permit list and one editor |
| Guest Portal | `#/guest` | Registration form and session list |
| Enforcement | `#/enforcement` | Plate form styled as a scanner, and the incident list |

Unknown hashes return to Overview. The back control returns to the previous real page because the redirect uses replace.

### 5.2 Shell

The header is a rounded dark bar. Left: the word "Zonr" in a serif face, and the line "Smart parking operations for residential communities." Right: the five links as pills. The active pill is the brighter gradient. At the 720px breakpoint the header stacks and the nav wraps.

The page column is `min(1240px, 100% - 32px)`, reduced to a 20px gutter at 720px. Body minimum width is 320px.

Below the hero, the background of the page turns light (`#f3efe7` from 44% of the viewport height). Workspace text switches to dark. The header and hero stay light-on-dark. This split is IMPLEMENTED in the root background gradient. It is not a theme toggle.

### 5.3 Shared panel pattern

Workspace screens use a heading row: an uppercase eyebrow, a serif title, and a description. Panels have a kicker, a title, an optional pill badge, and a body. The manager spot panel is the only `large` panel; it spans two columns until the 1080px breakpoint, where the grid becomes one column.

## 6. Screen specifications

### 6.1 Overview

| Region | Content | Live or fixed |
| --- | --- | --- |
| Hero | Eyebrow "Proptech parking orchestration". Headline "Zonr turns every residential lot into a live, enforceable system." Paragraph beginning "Replace hangtags, disconnected spreadsheets, and manual patrol ambiguity". Buttons "Explore manager view" and "Launch guest portal" | Fixed copy. Buttons navigate |
| Live Ops card | "{n} spots monitored" and "{sessions} guest sessions, {incidents} active incidents, 2 tow escalations pending." | Counts are live. The 2 is fixed. AC-012 |
| Smart Decals card | "{n} decal accounts live" and a sentence about residents leaving stickers and office visits | The count is live. The sentence is fixed. AC-013 |
| Stat row | Four cards, label, large value, green delta | Live strings. Only "Guest sessions today" changes, and only after a guest submit. AC-014, AC-034 |
| Role row | Four cards. Titles are also repeated as a small label above the serif title | Fixed. Each card has one text button. AC-015 |
| Blueprint | Four panels: Interactive Smart Map, Permit lifecycle, QR session simulation, Violation logging | Fixed. AC-016 |

Role-card promises, quoted so they stay attached to the screen:

| Card | Paragraph | What the linked screen actually offers |
| --- | --- | --- |
| Property Manager | "Monitor occupancy, drag assignments across spots, and keep policy enforcement visible." | Monitor and edit, yes. Drag, no. AC-044 |
| Resident | "Update vehicles, upload docs, and manage permits without office back-and-forth." | Update vehicle and a checkbox, yes. Upload, no. AC-053 |
| Guest | "Launch QR-based sessions with no app download and clear extension-ready timing." | A form in this same site, yes. QR and extension, no. AC-036, AC-053 |
| Enforcement | "Verify plates in the field, log incidents, and escalate repeat offenders faster." | Log an incident, yes. Verify against permits, or escalate to a person, no. AC-050 |

Primary buttons use the green-to-blue gradient and dark text. Secondary buttons are ghost pills. On the light workspace the same primary class is reused, so those buttons stay bright.

### 6.2 Manager

Eyebrow "Property Manager". Title "Assign spaces, monitor occupancy, and orchestrate enforcement". Description "The smart map, permit roster, and incident activity all respond to the same source of truth."

| Panel | Badge | Interaction |
| --- | --- | --- |
| Interactive Smart Map | Drag-and-drop ready | Legend plus a grid of spot buttons. Click to select. No drag. AC-037, AC-044 |
| Assignment Editor | The selected spot id, or "Pick a spot" | Four fields and "Save assignment". Unit, name, and plate are single-line inputs. Status is a select of Resident, Guest, Open, Violation. AC-039 through AC-041 |
| Permit Queue | PMS sync next | Read-only rows. Right column is the status and "Docs on file" or "Awaiting docs". AC-042 |
| Violation Feed | "{n} active" | Read-only rows: plate, reason, action, zone. AC-043 |

Legend swatches and spot fills are the same colors: open `#71d87b`, resident `#53a3ff`, guest `#f0c54f`, violation `#e76a6a`. Spot text is `#07111f`. A selected spot has a 3px dark outline. The status name is not printed on the spot. The note text and the legend carry the meaning. Color is doing a lot of the work. That is an observation, not a passed contrast check.

The spot grid is four columns, two columns under 1080px, one column under 720px. Spot buttons are at least 112px tall.

### 6.3 Resident

Eyebrow "Resident Portal". Title "Self-service permits with manager-friendly review context". Description "Vehicle changes update locally now and can later be wired straight into a real permits API." That sentence is the UI's own IMPLEMENTED versus PROPOSED split. Keep it, or replace it, only with Henry's answer to Q-004.

| Panel | Badge | Interaction |
| --- | --- | --- |
| Permit Directory | "{n} matches" | A search field labeled "Search residents, units, vehicles, or plates". Rows are buttons. The active row is tinted blue. AC-017 through AC-019, AC-027 |
| Permit Editor | The current plate | Resident is read-only. Vehicle, plate, status, registration checkbox, then "Save permit". AC-021 through AC-026 |

The editor does not show permit type, even though the data has it. A reviewer cannot tell smart-decal from plate-based from temporary on this screen. The overview Smart Decals count is the only type readout.

Search does not announce results. The badge count is the only confirmation. A query with no matches leaves a blank list and the previous editor. AC-027.

### 6.4 Guest

Eyebrow "Guest Portal". Title "Simulate the QR registration experience". Description "This is the no-download guest flow: capture a plate, phone number, stay duration, and parking zone."

| Panel | Badge | Interaction |
| --- | --- | --- |
| Virtual Parking Attendant | QR entry | Form. "Start guest session" submits. Fields clear after a valid submit. AC-028, AC-029 |
| Guest activity | "{n} sessions" | Read-only rows: name, plate, host unit, "{n} min left", zone. AC-035, AC-036 |

There is no QR graphic, no code to scan, and no countdown. Rows with `expiresSoon: true` in the seed look the same as rows with it false. The 11-minute and 7-minute seed sessions are not visually urgent.

Required fields use browser validation. The spec does not restyle the validation bubble.

### 6.5 Enforcement

Eyebrow "Enforcement". Title "Verify plates, create incidents, and escalate repeat offenders". Description "Patrol activity updates the incident roster and flips related spots into violation state."

| Panel | Badge | Interaction |
| --- | --- | --- |
| LPR Scan | Camera-ready | A dark card with the pill "Live recognition", a frame showing the plate in wide letter-spacing, a decorative scan line, and the caption "Permit status checked against Zonr records". Under it, the form. AC-045, AC-050 |
| Incident Feed | "{n} incidents" | Rows: plate, reason, "{n} photo(s)", action, zone, GPS stamp. AC-049 |

The scan line does not move. CSS sets it at 34% from the top. "Live" is a label.

The form's initial plate `8GKF204` is a seed violation, so the first paint already looks like a hit. That is demo staging, not a lookup.

Actions are ordered Warning, Citation, Tow watchlist, Tow dispatched. Nothing on the screen explains the difference. Q-011.

## 7. Feedback and state

| State | What the person sees |
| --- | --- |
| Loading | One sentence in light text. No skeleton, no spinner. AC-007 |
| Ready | The workspace for that route |
| Save in flight | Lists and grids update when the 180ms write resolves. The button stays pressable. The guest form is the exception: its fields clear immediately, and the new session row appears when the write resolves. AC-010, AC-029, AC-056 |
| Guest validation error | The browser's built-in required-field UI. No custom error text |
| Assignment with no spot | The form submits and the dashboard does not change. No message. AC-040 |
| Successful guest, permit, assignment, or violation | The relevant list or grid updates in place. No confirmation banner |
| Reload | The seed scene returns. There is no "unsaved" warning. AC-009 |
| Missing provider | Not a designed screen. The hook throws. The shipped tree does not hit this |

There is no success toast. The updated row is the confirmation. That is easy to miss on the overview stat, which is not on the guest page. A person who stays on the guest page sees the new session and does not see the stat move until they open Overview.

## 8. Accessibility and viewport notes

IMPLEMENTED facts, not an audit:

| Topic | What the code does |
| --- | --- |
| Language | `index.html` sets `lang="en"` |
| Landmarks | A `header` and a `nav`. Pages are `section` elements. There is no `main` and no skip link |
| Names | Form fields are wrapped in `label` elements, so the visible caption is the accessible name. Icon-only controls do not exist |
| Keyboard | Links, buttons, inputs, selects, and the checkbox are native. Tab order follows the document. No shortcut keys |
| Focus | No custom `:focus` style. Selection uses `.active` and `.selected` outlines, which are click state, not focus state |
| Motion | Hover lifts links, buttons, and spots by 1px. `scroll-behavior: smooth` is set. The scan line does not animate. No `prefers-reduced-motion` rule |
| Breakpoints | 1080px collapses the hero, the section heading, and the workspace to one column and drops the stat, role, and spot grids to two columns. 720px stacks the header, panel headers, and list rows, and those grids become one column |
| Hit size | Text inputs and selects set `min-height: 44px`. Primary and secondary buttons set `min-height: 46px`. Spot buttons set `min-height: 112px` |
| Color | Status is a full-spot fill plus a legend on the manager screen only. Other screens spell the status in text |
| Live regions | Loading text and list updates are not `aria-live` |
| Contrast | Not measured in this spec. Do not claim WCAG conformance |

UNKNOWN: target language beyond English, a required conformance level, and whether patrol use is outdoors in sunlight. Those would change this section. They are not in the repo.

## 9. Content rules the UI already follows

| Rule | Where it shows up |
| --- | --- |
| Product name is "Zonr", one word, capital Z | Header, title, loading copy |
| Zone names are North Court, Clubhouse, East Garage | Seed, guest select, enforcement select, spot captions |
| Permit statuses display as Approved, Review needed, Revoked in the editor, and as the raw values `approved`, `review`, `revoked` in the directory and the manager queue | Resident editor versus the row renderers, which print `permit.status` |
| Violation actions display as the raw values `warning`, `citation`, `tow-watch`, `tow-dispatched` in lists. The editor labels them Warning, Citation, Tow watchlist, Tow dispatched | Enforcement list versus the select |
| Spot statuses are not printed as words on the grid. The assignment select uses Resident, Guest, Open, Violation | Manager |
| Plates are shown as stored | Uppercase when the guest or violation or permit write uppercased them. Assignment does not uppercase |

The raw-versus-labeled split is IMPLEMENTED. It is inconsistent. Whether list rows should use the same words as the selects is undecided. It is not one of Henry's product questions unless he wants a voice rule.

## 10. Open questions

Q-004 decides which badges and hero sentences must be redesigned or removed. Q-006 decides whether the resident editor should keep a status control. Q-008 and Q-009 decide whether the guest list needs urgency, extension, and expiry. Q-011 decides whether tow actions need a confirmation step. Q-012 and Q-013 decide whether the overview numbers should look like a dashboard or like a brochure. This spec does not pick for him.
