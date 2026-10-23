# Zonr UX design spec — pilot

Code baseline: the five public pages at `main` `99d283e` (VERIFIED). Pilot screens below are PROPOSED. They are not in the build. S-2 is D-067. The other success criteria are UNAPPROVED (`PRD.md` section 4).

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. This spec does not design signage or a statute checklist (UNKNOWN, RADAR, Q-016). The login screen is not designed here (Q-019).

## 1. Purpose

Describe the pilot screens and the prototype screens they must not copy by accident, especially the prototype's vehicle status dropdown and tow dispatch. Residents keep their own vehicles (D-067). There is no admin approval queue.

## 2. Scope

### 2.1 Prototype, still the only UI

VERIFIED: one shell, nav items Overview, Manager, Resident, Guest Portal, Enforcement. No login. The resident editor has a status dropdown including Approved. The enforcement form has Tow dispatched. The manager grid is numbered spots. Guest registration is a form on the same origin, not a private link, and submitting it assigns numbered spots (`FRD.md` section 5).

Open pull request #2 adds a yellow banner, text exactly "Demo — all names, plates, phones and locations are fictional." That banner is on the prototype branch, not merged (VERIFIED). The pilot is a different audience. Whether the pilot shows that sentence is PROPOSED: yes, on any non-production build. The production pilot shows a shorter privacy line only if counsel asks. Counsel has not (UNKNOWN).

### 2.2 Pilot surfaces

Controls come from the permissions table in `TECHNICAL_DESIGN.md` section 10. A column is a permission. A session sees each control that one of its permissions allows. Create pass uses the admin rule when the session has admin. Add, edit, and remove of a vehicle use the resident rule whenever the session has resident, including when it also has admin (D-067).

| Surface | Who | Account |
| --- | --- | --- |
| Own vehicles | Resident permission, including when the session also has admin | Yes |
| Own passes | Resident permission, and not admin | Yes |
| Plate check, warning, close of their own warning | Patroller | Yes |
| Community vehicles (hold, remove), plate check, unit and household, config, export, any pass, close, void, invite | Admin | Yes |
| Authorization draft, sign, void, and export | Signer | Yes, extra permission. Export does not require admin |
| One pass | Guest | Link only |
| Tow company | Nobody | No screen |
| Self-signup | Nobody | Not a screen (PAC-073) |

There is no community switcher and no delete control (non-goals).

## 3. Success

A resident adds, updates, and removes their own vehicle on the resident screen, with no approval control (D-067, S-2, PAC-020). A person in a role can finish S-1 through S-5 without seeing another community's plates (PROPOSED, UNAPPROVED for every success row except S-2).

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

This section is the screen for a session that has the resident permission, including when that session also has admin, patroller, or signer. A patroller, a signer, or an admin without resident does not get the vehicle regions, and an add from that session is refused (PAC-020). Pass regions on this screen are only for a session that has resident and does not have admin. A session with admin creates and revokes passes in section 8, and that naming rule wins when the session also has resident (PAC-004). Vehicle add, edit, and remove of the session's own vehicles stay here even when the session has admin (D-067).

| Region | Content | Rule |
| --- | --- | --- |
| Vehicles | Vehicles whose resident account is this session, and statuses `active`, `on_hold`, `removed` | No status control and no account picker. No copy that an admin must approve (D-067) |
| Add | Plate and description. Save | Resulting status is `active`. The resident account is this session, including when this session also has admin. A body account id, unit, household, or status is ignored (PAC-020) |
| Edit | Plate and description on an `active` vehicle whose resident account is this session | No status control. Status stays `active` (PAC-023). `on_hold` and `removed` have no edit on this screen (Q-021) |
| Remove | On an `active` vehicle whose resident account is this session, with a confirm step | Status becomes `removed`. The row stays in the list. `on_hold` and `removed` have no remove on this screen (Q-021, PAC-025). There is no hold control here |
| Passes | Form: plate, start, end. Optional phone only if Q-008 is yes. This region is omitted when the session has admin | No account picker. `for_account` is this session (PAC-004). Submit disabled, with the reason, when the cap would fail or the configured subject id is missing on this account (PAC-003, PAC-004). A start in the future is allowed and is labeled scheduled, not permission to park (PAC-005) |
| Own list | Passes whose `for_account` is this session, with start, end, and derived status. That includes a pass an admin issued for them. This region is omitted when the session has admin; section 8 lists passes | Not other residents' passes or vehicles (PAC-007, Q-017). Revoke is shown only on a pass this resident issued (PAC-007) |

The prototype's Approved / Review needed / Revoked dropdown is not on this screen (VERIFIED that it exists today). This screen has no approval status.

## 6. Guest link

One page. No app nav. No status menu.

This page has no account and no actor. The token hash authorizes the read (I-2).

While the token matches, the link has not reached the pass end, and the pass is not revoked: show that pass's plate, start, end, and the community's guest-rule text. If `now < start`, say the pass is not permission to park yet. If `start <= now < end`, say it is in effect (PAC-009, PROPOSED). An over-limit lookup uses the dead-link line below even when this token would otherwise be live (PAC-010).

An unknown token, a revoked pass, an expired pass, and an expired link all show the same line: "this link is not valid." That page has no plate, no window, and no word that distinguishes the four cases (PROPOSED). The sameness is a privacy choice, not a legal rule.

The page does not show phone, photos, the host's other passes, or a map of stalls.

## 7. Patroller

| Region | Content | Rule |
| --- | --- | --- |
| Plate check | One plate field and one result | The result shows the three parts in PAC-030 together: the non-removed vehicle (`active` or `on_hold`) or none, including that status, scheduled or current pass or none, and the open warning or none with its grace end and whether grace has ended. "No record" only when all three are empty (PAC-033). A warning past grace stays visible. The screen does not say that `on_hold` is permission to park, a warning, or a tow (Q-020). A `removed` vehicle is not shown as the current registration |
| Hidden | Phone, photo bytes, any vehicle other than the one non-removed vehicle in the result, export, config, sign, hold, remove | PAC-031 |
| Warning | Plate (filled from the check), reason, one or more photos, submit | Submit stays unavailable until a photo is attached (Q-007). Submit is refused, with a reason, when this plate already has an unclosed warning (PAC-046). There is no action menu of citation or tow dispatched |
| Close | On a warning this patroller filed. Reason required | Not on someone else's warning (PAC-045) |
| After submit | Grace end time | No button that signs an authorization |

The prototype scanner that displays a typed plate and the sentence "Permit status checked against Zonr records" does not perform a lookup (VERIFIED). The pilot result list replaces that sentence. Do not keep the sentence if the lookup can fail. Show the failure (section 9).

## 8. Admin and signer

Admin. These controls match the admin column of the permissions table. Own-vehicle add, edit, and remove are section 5, and only when the session has resident:

| Region | Content |
| --- | --- |
| Community vehicles | Vehicles in this community, with status `active`, `on_hold`, or `removed`. No approval queue and no form that adds a vehicle for another account (D-067). A session that also has resident adds and edits its own vehicles in section 5 |
| Hold | On an `active` vehicle. Confirm. Status becomes `on_hold`. The screen does not say what hold does to enforcement (Q-020, PAC-021). No hold on `on_hold` or `removed`. No control that takes a vehicle off hold (Q-026). No notice is sent (Q-024) |
| Remove | On an `active` or `on_hold` vehicle, with a confirm step. Status becomes `removed`. The row stays (PAC-025). No remove of an already `removed` row. No notice is sent (Q-024) |
| Plate check | The same one-plate result as the patroller (PAC-030) |
| Edit resident unit and household | Unit and household on an account in this community that has the resident permission. Admin only (permissions table). The write is audited. It changes that account and later passes. It does not change ids already copied onto existing passes (PAC-075) |
| Passes | Plate, start, end, and the resident this pass is for. That account must have the resident permission. No unit or household fields. Those are copied from that resident. Revoke on any pass in this community (PAC-004, PAC-007) |
| Warning | The same photo warning form as the patroller, for a plate in this community (PAC-040) |
| Violations | Close, with a reason, on a warning in this community (PAC-045) |
| Void | On a `signed` authorization. Reason required. Does not require the signer permission (PAC-054). There is still no Sign button unless this account also has signer |
| Config | Stay cap, month cap, month-cap subject, month window, timezone, grace, upload maximum, guest-lookup limit, guest-rule text. Save refuses an empty cap, empty grace, empty subject, empty window, empty timezone, empty upload maximum, or empty lookup limit (PAC-100). The timezone is not prefilled with a California zone |
| Export | One button for this community. Shows success or failure. Does not download another community (PAC-060) |
| Invite | Person, and an allow-list of resident, patroller, admin, and signer. Unit and household are required when resident is checked. No community picker. After save, the raw token is shown once. The accept step cannot send community, permissions, unit, or household (PAC-073) |

Signer, only if the account has that permission. Export and void are on this screen too, because the permissions table allows them without admin:

| Region | Content |
| --- | --- |
| Eligible warnings | Warnings where server `now >= grace_ends_at`, the warning is not closed, and there is no `signed` authorization. The screen does not wait for a stored `grace_elapsed` status |
| Draft | Upload the writing. The screen does not claim the upload satisfies CVC §22658 (Q-016) |
| Sign | Confirm. Result is `signed`. No "call tow" and no vendor name field that sends data |
| Void | Reason required (PAC-054) |
| Export | The same one-community export as admin (PAC-060) |

If the same person is admin and signer, the nav shows both groups (Q-014, PROPOSED). The hold button, the remove button, and the sign button are not the same control. There is no control that deletes a community's plates or photos, and no control that deletes a `removed` vehicle row.

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

Q-003, Q-007, Q-008, Q-009, Q-010, Q-014, and Q-017 decide copy and which controls exist. Q-016 forbids a screen that says the upload is legally sufficient. Q-019 is why this spec has no login screen. Q-002 is why timezone and month window are required config fields with no default. Q-020 is why hold does not describe an enforcement result. Q-021 is why `on_hold` has no resident edit or remove. Q-022 and Q-023 are why this spec has no vehicle-count cap and no plate-change limit. Q-024 is why hold and remove send no notice. Q-026 is why there is no release-hold control.
