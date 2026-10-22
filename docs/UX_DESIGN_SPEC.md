# Zonr UX design spec — pilot

Code baseline: the five public pages at `main` `99d283e` (VERIFIED). Pilot screens below are PROPOSED. They are not in the build. Success criteria are UNAPPROVED (`PRD.md` section 4).

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. This spec does not design signage or a statute checklist (UNKNOWN, RADAR, Q-016).

## 1. Purpose

Describe the pilot screens and the prototype screens they must not copy by accident, especially resident self-approval and tow dispatch.

## 2. Scope

### 2.1 Prototype, still the only UI

VERIFIED: one shell, nav items Overview, Manager, Resident, Guest Portal, Enforcement. No login. The resident editor has a status dropdown including Approved. The enforcement form has Tow dispatched. The manager grid is numbered spots. Guest registration is a form on the same origin, not a private link.

Open pull request #2 adds a yellow banner, text exactly "Demo — all names, plates, phones and locations are fictional." That banner is on the prototype branch, not merged (VERIFIED). The pilot is a different audience. Whether the pilot shows that sentence is PROPOSED: yes, on any non-production build. The production pilot shows a shorter privacy line only if counsel asks. Counsel has not (UNKNOWN).

### 2.2 Pilot surfaces

| Surface | Who | Account |
| --- | --- | --- |
| Vehicle and passes | Resident | Yes |
| Plate check and warning | Patroller | Yes |
| Queue, config, export | Admin | Yes |
| Authorization draft and sign | Signer | Yes, extra permission |
| One pass | Guest | Link only |
| Tow company | Nobody | No screen |

There is no community switcher (non-goal).

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

## 5. Resident

| Region | Content | Rule |
| --- | --- | --- |
| Vehicles | List of this resident's vehicles and statuses `pending_review`, `approved`, `rejected`, `revoked` | No status control. Copy explains that an admin approves (PROPOSED) |
| Submit | Plate and description. Save | Resulting status is pending. If they edit an approved row, the screen shows pending again (PAC-023) |
| Passes | Form: plate, start, end. Optional phone only if Q-008 is yes | Submit disabled, with the reason, when the cap would fail (PAC-003, PAC-004) |
| Own list | Their passes and times | Not other residents (PAC-031, Q-017) |

The prototype's Approved / Review needed / Revoked dropdown is removed for this role (VERIFIED that it exists today).

## 6. Guest link

One page. No app nav. Shows plate, start, end, status (`active`, `expired`, `revoked`), and the community's guest-rule text (PAC-009, PROPOSED).

Does not show phone, photos, the host's other passes, or a map of stalls. A dead or unknown token is a single "this link is not valid" line, the same for unknown and revoked, so the page does not reveal which (PROPOSED). That sameness is a privacy choice, not a legal rule.

## 7. Patroller

| Region | Content | Rule |
| --- | --- | --- |
| Plate check | One plate field and a result | Result is approved vehicle, active pass with end time, warning with grace end, or no record (PAC-030, PAC-033) |
| Hidden | Phone, other people's vehicles, export, config, sign | PAC-031 |
| Warning | Plate (filled from the check), reason, one or more photos, submit | Submit stays unavailable until a photo is attached (Q-007). There is no action menu of citation or tow dispatched |
| After submit | Grace end time | No button that signs an authorization |

The prototype scanner that displays a typed plate and the sentence "Permit status checked against Zonr records" does not perform a lookup (VERIFIED). The pilot result list replaces that sentence. Do not keep the sentence if the lookup can fail. Show the failure (section 9).

## 8. Admin and signer

Admin:

| Region | Content |
| --- | --- |
| Vehicle queue | Pending rows. Actions: Approve, Reject. No bulk approve of a whole import (not in scope) |
| Revoke | On an approved vehicle, with a confirm step (PROPOSED) |
| Config | Stay cap, month cap, month-cap subject, grace, guest-rule text. Save refuses an empty cap or empty grace (PAC-100) |
| Export | One button for this community. Shows success or failure. Does not download another community (PAC-060) |

Signer, only if the account has that permission:

| Region | Content |
| --- | --- |
| Eligible warnings | Violations in `grace_elapsed` that have no `signed` authorization |
| Draft | Upload the writing. The screen does not claim the upload satisfies CVC §22658 (Q-016) |
| Sign | Confirm. Result is `signed`. No "call tow" and no vendor name field that sends data |
| Void | Reason required |

If the same person is admin and signer, the nav shows both groups (Q-014, PROPOSED). The approve button and the sign button are not the same control.

## 9. Feedback

| State | What the person sees | Label |
| --- | --- | --- |
| Loading | The task's own loading line. Not another community's data | PROPOSED |
| Cap refused | The cap name and that the pass was not created | PROPOSED |
| Missing config | "This community's rules are not set." Admin sees a link to config. Others do not | PROPOSED |
| Photo failed | Warning not filed. Photos can be attached again | PROPOSED |
| Sign refused | Grace has not ended, or the account cannot sign. No partial signed state | PROPOSED |
| Export failed | No file, and a retry. The audit notes the failure | PROPOSED |
| Reload | Pilot data remains (PAC-090). The mock's reload-to-seed behavior is not this product (VERIFIED for the mock) | PROPOSED |

## 10. Accessibility notes for the pilot

Not a conformance claim (UNKNOWN whether a level is required).

PROPOSED minimum: labeled fields, errors in text not only color, photo control is a real file input, guest link works without an account and without a hover-only action. The prototype's native labels are VERIFIED. Its status colors on spots are not reused, because stalls are not a pilot screen.

## 11. Questions

Q-003, Q-007, Q-008, Q-009, Q-010, Q-014, and Q-017 decide copy and which controls exist. Q-016 forbids a screen that says the upload is legally sufficient.
