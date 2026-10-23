# Zonr UX design spec — pilot

Code baseline: the five public pages at `main` `99d283e` (VERIFIED). Pilot screens below are PROPOSED. They are not in the build. Success criteria are UNAPPROVED (`PRD.md` section 4).

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. This spec does not design signage or a statute checklist (UNKNOWN, RADAR, Q-016). The login screen is not designed here (Q-019).

## 1. Purpose

Describe the pilot screens and the prototype screens they must not copy by accident, especially resident self-approval and tow dispatch.

## 2. Scope

### 2.1 Prototype, still the only UI

VERIFIED: one shell, nav items Overview, Manager, Resident, Guest Portal, Enforcement. No login. The resident editor has a status dropdown including Approved. The enforcement form has Tow dispatched. The manager grid is numbered spots. Guest registration is a form on the same origin, not a private link, and submitting it assigns numbered spots (`FRD.md` section 5).

Open pull request #2 adds a yellow banner, text exactly "Demo — all names, plates, phones and locations are fictional." That banner is on the prototype branch, not merged (VERIFIED). The pilot is a different audience. Whether the pilot shows that sentence is PROPOSED: yes, on any non-production build. The production pilot shows a shorter privacy line only if counsel asks. Counsel has not (UNKNOWN).

### 2.2 Pilot surfaces

Controls come from the permissions table in `TECHNICAL_DESIGN.md` section 10. A role with a Yes in that table has the control on their screen.

| Surface | Who | Account |
| --- | --- | --- |
| Vehicle and own passes | Resident | Yes |
| Plate check, warning, close of their own warning | Patroller | Yes |
| Queue, config, export, any pass, close, void, invite | Admin | Yes |
| Authorization draft, sign, void, and export | Signer | Yes, extra permission. Export does not require admin |
| One pass | Guest | Link only |
| Tow company | Nobody | No screen |
| Self-signup | Nobody | Not a screen (PAC-073) |

There is no community switcher and no delete control (non-goals).

## 3. Success

A person in a role can finish S-1 through S-5 without seeing another community's plates (PROPOSED, UNAPPROVED). A resident never sees a control that approves their own vehicle (PAC-020).

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| Restyle the marketing overview as the pilot home | The pilot starts at a task, not at the prototype hero (INFERRED) |
| Drag-and-drop stalls | Numbered spots are out |
| A camera viewfinder | Plate cameras are out. Photos are uploads |
| A "Dispatch tow" button | PAC-052 |
| Guest accounts, guest nav, or a list of other visits | PAC-009 |
| A login method, or a screen that lets someone pick their community | Q-019. PAC-073 |

## 5. Resident

| Region | Content | Rule |
| --- | --- | --- |
| Vehicles | List of this resident's vehicles and statuses `pending_review`, `approved`, `rejected`, `revoked` | No status control. Copy explains that an admin approves (PROPOSED) |
| Submit | Plate and description. Save | Resulting status is pending. If they edit an approved row, the screen shows pending again (PAC-023) |
| Passes | Form: plate, start, end. Optional phone only if Q-008 is yes | Submit disabled, with the reason, when the cap would fail (PAC-003, PAC-004). A start in the future is allowed and is labeled scheduled, not permission to park (PAC-005) |
| Own list | Their passes, start, end, and derived status | Not other residents (PAC-031, Q-017). Revoke is on a pass this resident issued (PAC-007) |

The prototype's Approved / Review needed / Revoked dropdown is removed for this role (VERIFIED that it exists today).

## 6. Guest link

One page. No app nav. No status menu.

While the token matches, the link has not reached the pass end, and the pass is not revoked: show that pass's plate, start, end, and the community's guest-rule text. If `now < start`, say the pass is not permission to park yet. If `start <= now < end`, say it is in effect (PAC-009, PROPOSED).

An unknown token, a revoked pass, an expired pass, and an expired link all show the same line: "this link is not valid." That page has no plate, no window, and no word that distinguishes the four cases (PROPOSED). The sameness is a privacy choice, not a legal rule.

The page does not show phone, photos, the host's other passes, or a map of stalls.

## 7. Patroller

| Region | Content | Rule |
| --- | --- | --- |
| Plate check | One plate field and one result | The result shows the three parts in PAC-030 together: approved vehicle or none, scheduled or current pass or none, and the open warning or none with its grace end and whether grace has ended. "No record" only when all three are empty (PAC-033). A warning past grace stays visible |
| Hidden | Phone, photo bytes, other people's vehicles, export, config, sign | PAC-031 |
| Warning | Plate (filled from the check), reason, one or more photos, submit | Submit stays unavailable until a photo is attached (Q-007). Submit is refused, with a reason, when this plate already has an unclosed warning (PAC-046). There is no action menu of citation or tow dispatched |
| Close | On a warning this patroller filed. Reason required | Not on someone else's warning (PAC-045) |
| After submit | Grace end time | No button that signs an authorization |

The prototype scanner that displays a typed plate and the sentence "Permit status checked against Zonr records" does not perform a lookup (VERIFIED). The pilot result list replaces that sentence. Do not keep the sentence if the lookup can fail. Show the failure (section 9).

## 8. Admin and signer

Admin. These controls match the permissions table, including actions a resident also has:

| Region | Content |
| --- | --- |
| Vehicle queue | Pending rows. Actions: Approve, Reject. No bulk approve of a whole import (not in scope) |
| Revoke vehicle | On an approved vehicle, with a confirm step (PROPOSED, PAC-025) |
| Passes | The same fields as the resident pass form: plate, start, end. Revoke on any pass in this community, not only one the admin issued (PAC-007) |
| Warning | The same photo warning form as the patroller, for a plate in this community (PAC-040) |
| Violations | Close, with a reason, on a warning in this community (PAC-045) |
| Void | On a `signed` authorization. Reason required. Does not require the signer permission (PAC-054). There is still no Sign button unless this account also has signer |
| Config | Stay cap, month cap, month-cap subject, month window, timezone, grace, upload maximum, guest-lookup limit, guest-rule text. Save refuses an empty cap, empty grace, empty subject, empty window, empty timezone, empty upload maximum, or empty lookup limit (PAC-100). The timezone is not prefilled with a California zone |
| Export | One button for this community. Shows success or failure. Does not download another community (PAC-060) |
| Invite | Asks for the person and the permissions to grant in this community. No community picker (PAC-073) |

Signer, only if the account has that permission. Export and void are on this screen too, because the permissions table allows them without admin:

| Region | Content |
| --- | --- |
| Eligible warnings | Warnings where server `now >= grace_ends_at`, the warning is not closed, and there is no `signed` authorization. The screen does not wait for a stored `grace_elapsed` status |
| Draft | Upload the writing. The screen does not claim the upload satisfies CVC §22658 (Q-016) |
| Sign | Confirm. Result is `signed`. No "call tow" and no vendor name field that sends data |
| Void | Reason required (PAC-054) |
| Export | The same one-community export as admin (PAC-060) |

If the same person is admin and signer, the nav shows both groups (Q-014, PROPOSED). The approve button and the sign button are not the same control. There is no control that deletes a community's plates or photos.

## 9. Feedback

| State | What the person sees | Label |
| --- | --- | --- |
| Loading | The task's own loading line. Not another community's data | PROPOSED |
| Cap refused | The cap name and that the pass was not created | PROPOSED |
| Missing config | "This community's rules are not set." Admin sees a link to config. Others do not | PROPOSED |
| Scheduled pass | The pass is saved and is not permission to park until the start | PROPOSED |
| Photo failed | Warning not filed, including a refused type or a file over the maximum. Photos can be attached again | PROPOSED |
| Warning already open | The new warning was not filed. The existing one remains | PROPOSED |
| Sign refused | Grace has not ended, or the account cannot sign. No partial signed state | PROPOSED |
| Export failed | No file, and a retry. The audit notes the failure | PROPOSED |
| Dead guest link | "this link is not valid." The same line for unknown, revoked, expired, and rate-limited | PROPOSED |
| Reload | Pilot data remains (PAC-090). The mock's reload-to-seed behavior is not this product (VERIFIED for the mock) | PROPOSED |

## 10. Accessibility notes for the pilot

Not a conformance claim (UNKNOWN whether a level is required).

PROPOSED minimum: labeled fields, errors in text not only color, photo control is a real file input, guest link works without an account and without a hover-only action. The prototype's native labels are VERIFIED. Its status colors on spots are not reused, because stalls are not a pilot screen.

## 11. Questions

Q-003, Q-007, Q-008, Q-009, Q-010, Q-014, and Q-017 decide copy and which controls exist. Q-016 forbids a screen that says the upload is legally sufficient. Q-019 is why this spec has no login screen. Q-002 is why timezone and month window are required config fields with no default.
