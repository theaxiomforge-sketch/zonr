# Zonr UX design spec — pilot

Code baseline: the five public pages at `main` `99d283e` (VERIFIED). Pilot screens below are the design. They are not in the build. S-1 and S-3 are accepted (D-092). S-2 is D-067. S-4, S-5, and S-6 stay UNAPPROVED (`PRD.md` section 4).

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. This spec does not design signage or a statute checklist. The §22658 list is PROPOSED (D-104) and is not screen copy. An attorney confirms it before the pilot goes live. Login is the magic-link screen in section 5 (D-097).

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
| Self-signup | Nobody | Not a screen. A request shows "There is no public sign-up." (D-097, PAC-073) |
| Sign in | An account that already exists | Email field only. The server sends a magic link. No password. No community picker (D-097) |

There is no community switcher and no delete control (non-goals).

## 3. Success

A resident adds, updates, and removes their own vehicle on the resident screen, with no approval control (D-067, S-2, PAC-020). A resident can issue a guest pass (S-1, D-092). A patroller can file a warning with a photo (S-3, D-092). S-4 and S-5 stay UNAPPROVED. A resident does not see another resident's plates (D-095).

## 4. Non-goals

| Non-goal | Reason |
| --- | --- |
| Restyle the marketing overview as the pilot home | The pilot starts at a task, not at the prototype hero (INFERRED) |
| Drag-and-drop stalls | Numbered spots are out |
| A camera viewfinder | Plate cameras are out. Photos are uploads |
| A "Dispatch tow" button | PAC-052 |
| Guest accounts, guest nav, or a list of other visits | PAC-009 |
| A password, a public sign-up form, or a screen that lets someone pick their community | D-097. PAC-073 |

## 5. Sign in and invite

| Region | Content | Rule |
| --- | --- | --- |
| Sign in | One email field. Submit | No password and no community list (D-097). A known email sends a magic link once the lifetime is configured. Until then, the screen says "This community's rules are not set." (Q-041). An unknown email says "No account uses that email." |
| Magic link | One page opened from the email | Single use. A used or expired link says "this link is not valid." A valid link opens that account's community |
| Public sign-up | Not offered | The error, if a request is sent, is "There is no public sign-up." |
| Accept invite | The invite token, and for a resident the proposed consent confirmation | Community, permissions, unit, household, email, and phone come from the invite. A resident invite shows the phone and asks the resident to confirm that the HOA may give that number to the vendor. That confirmation is PROPOSED. It is not a legal conclusion about Civil Code section 5230(c). The proposed behavior does not store the account until it is confirmed. Acceptance deletes the phone on the invite in that same transaction (PAC-067). The phone then lives only on the account |

## 6. Resident

This section is the screen for a session that has the resident permission, including when that session also has admin, patroller, or signer. A patroller, a signer, or an admin without resident does not get the vehicle regions, and an add from that session is refused (PAC-020). Pass regions on this screen are only for a session that has resident and does not have admin. A session with admin creates and revokes passes in section 9, and that naming rule wins when the session also has resident (PAC-004). Vehicle add, edit, and remove of the session's own vehicles stay here even when the session has admin (D-067).

| Region | Content | Rule |
| --- | --- | --- |
| Vehicles | Vehicles whose resident account is this session, and statuses `active`, `on_hold`, `removed` | No status control and no account picker. No copy that an admin must approve (D-067) |
| Add | Plate and description. Save | Resulting status is `active`. The resident account is this session, including when this session also has admin. A body account id, unit, household, or status is ignored (PAC-020). The screen shows no message about how many vehicles this account may have. Another vehicle on a different plate is saved (D-070) |
| Edit | Plate and description on an `active` vehicle whose resident account is this session | No status control. Status stays `active` (PAC-023). The save keeps the previous and new plate and description on the audit event. It does not change a warning already filed. The 1st, 2nd, and 3rd plate change save while each counted event is under 30 × 24 hours old (D-099). At exactly 30 × 24 hours the oldest no longer counts, and another plate change can be saved. The 4th is refused while three events still count, and the plate stays (D-073). The refusal text is "This vehicle has had 3 plate changes in the last 30 days." That refusal also alerts an admin (D-100). The resident screen does not choose how that alert is delivered (Q-038). A description-only save still stores the description and does not show that text. `on_hold` has no edit (D-069), including when this session also has admin. `removed` has no edit |
| Remove | On an `active` vehicle whose resident account is this session, with a confirm step | Status becomes `removed`. The row stays in the list. This removal does not tell the resident a notice was sent (D-072). `on_hold` has no resident remove (D-069), including when this session also has admin. `removed` has no remove. There is no hold control and no release control |
| Passes | Form: plate, start, end. No phone field. This region is omitted when the session has admin | No account picker. `for_account` is this session (PAC-004, D-082). Submit disabled, with the reason, when the stay, the month cap, or the daily cap would fail, or the household id is missing (PAC-003, PAC-004). The stay line is "This pass is longer than 72 hours." The month line is "This household has used its 4 guest passes for this month." The day line is "This household has reached today's guest-pass limit." When both household caps would fail, the pass is not saved and the screen does not pick which of those two lines to prefer (Q-035). A start in the future is allowed and is labeled scheduled, not permission to park (PAC-005) |
| Own list | This resident's vehicles and the passes whose `for_account` is this session, with start, end, and derived status. That includes a pass an admin issued for them. This region is omitted when the session has admin; section 9 lists passes | Nothing else (D-095). No other resident, no violation, no patroller photo. Revoke is shown only on a pass this resident issued (D-082) |

The prototype's Approved / Review needed / Revoked dropdown is not on this screen (VERIFIED that it exists today). This screen has no approval status.

## 7. Guest link

One page. No app nav. No status menu.

This page has no account and no actor. The token hash authorizes the read (I-2).

Not revoked and not yet started: plate, start, end, guest rules, and the pass is not permission to park yet. Not revoked and in the window: the same fields, and the pass is in effect. Not revoked and at or before 24 hours after the end, including exactly 24 hours: the same fields, plus "This pass has ended." (D-088). An over-limit lookup uses the invalid line below even when this token would otherwise be viewable (PAC-010).

A revoked pass, at any time, an unknown token, and a pass more than 24 hours after the end each show only: "this link is not valid." Those pages have no plate, no window, and no word that says which case it was. The sameness is a privacy choice, not a legal rule. The ended-but-still-viewable page is a different case and does show the plate.

The page does not show a phone, photos, the host's other passes, or a map of stalls. A guest phone is not collected (D-087).

## 8. Patroller

| Region | Content | Rule |
| --- | --- | --- |
| Plate check | One plate field and one result | The result shows the three parts in PAC-030 together: the non-removed vehicle (`active` or `on_hold`) or none, including that status, scheduled or current pass or none, and the open warning or none with its grace end and whether grace has ended. "No record" only when all three are empty (PAC-033). A warning past grace stays visible. When the vehicle is `on_hold`, the result is the state "on hold, don't act" (D-077, PAC-034). Status is `on_hold` and action is `none`. There is no warning button and no tow button. A pass or an existing warning may still be shown as information. They do not add a button. `on_hold` is not permission to park. A `removed` vehicle is not shown as the current registration |
| Hidden | Phone, photo bytes, any vehicle other than the one non-removed vehicle in the result, export, config, sign, hold, release, remove | PAC-031, D-075 |
| Warning | Plate (filled from the check), a reason picker, a description when the reason is Other, one or more photos, submit | The picker lists the labels in the PAC-047 table and submits that row's code as `warning_reason` (D-076). The codes and labels are PROPOSED. Choosing Other shows a text field. That text is `warning_reason_text` and must be non-empty after outer spaces are removed. Spaces only count as empty. Any other choice hides that field and sends no text. Submit stays unavailable until a photo is attached (D-086), a reason is chosen, and Other has text when Other is chosen. The server still refuses a bad reason. A missing or unknown code shows "Choose a warning reason." Other with empty text shows "Describe this warning." A reason other than Other sent with text shows "A note is only allowed when the reason is Other." No warning is filed on those refusals. A second violation row is refused while one is open (PAC-046). The plate stored is the plate submitted. There is no action menu of citation or tow dispatched. When this plate's vehicle is `on_hold`, this form is not shown. The result is "on hold, don't act" instead (D-077). A submit that is sent anyway shows that same line and files nothing |
| Second warning | Shown on an open warning that has no second warning yet. The same reason picker, the same Other rule, and at least one new photo | This is a step on the same warning, not a new violation (D-085). The patroller sees the first warning's reason and time, and this form. There is no tow button. The second reason does not have to match the first, and there is no wait before the form is offered (Q-033). Submit without a photo does nothing (D-086). While the vehicle is `on_hold`, this form is hidden and the line is "on hold, don't act" |
| Close | On a warning this patroller filed. Close reason required | Not on someone else's warning. The close reason is free text. It is a different field from the warning reason, and it is not the PAC-047 list (PAC-045, D-076) |
| After submit | Grace end time | No button that signs an authorization |

The prototype scanner that displays a typed plate and the sentence "Permit status checked against Zonr records" does not perform a lookup (VERIFIED). The pilot result list replaces that sentence. Do not keep the sentence if the lookup can fail. Show the failure (section 10).

## 9. Admin and signer

Admin. These controls match the admin column of the permissions table. Own-vehicle add, edit, and remove are section 5, and only when the session has resident:

| Region | Content |
| --- | --- |
| Community vehicles | Vehicles in this community, with status `active`, `on_hold`, or `removed`. No approval queue and no form that adds a vehicle for another account (D-067). A session that also has resident adds and edits its own vehicles in section 5 |
| Hold | On an `active` vehicle. Confirm. Status becomes `on_hold`. The confirm states that a plate check of this vehicle shows "on hold, don't act" and that a warning, including a second warning, and a tow are refused until an admin releases the hold (D-077, PAC-021). The confirm also states that the resident is notified by email and by text (D-072, D-098). It has no wording field (Q-037). No hold on `on_hold` or `removed` |
| Release hold | On an `on_hold` vehicle. Optional reason, which may be left empty. Confirm. Status becomes `active` (D-075). That target is derived from D-069, because resident edits exist only on `active`. Henry can correct the target status. The audit line stores this admin, the time, and the reason. The confirm states that the resident is notified by email and by text (D-102). After the release, a plate check of this vehicle no longer shows "on hold, don't act", and a warning and a tow follow their usual rules (D-077). No release on `active` or `removed`. This is not Remove. A resident screen and a patroller screen have no release control |
| Remove | On an `active` or `on_hold` vehicle, with a confirm step. Status becomes `removed`. The row stays (PAC-025). This is not the control that removes a hold. The confirm states that the resident is notified by email and by text (D-072, D-098). It has no wording field (Q-037). No remove of an already `removed` row |
| Plate changes | Every plate change in this community | The rows are the vehicle edit audit events whose previous plate and new plate differ (D-073, PAC-062). Each row shows the vehicle, the previous plate, the new plate, the actor, and the time. Description-only edits are not in this list. There is no second log and no control that changes the limit of 3. A resident, a patroller, and a signer do not get this list. A signer still receives the same events inside the export |
| Plate check | The same one-plate result as the patroller, including "on hold, don't act" and no warning or tow button when the vehicle is `on_hold` (PAC-030, D-077) |
| Edit resident unit and household | Unit and household on an account in this community that has the resident permission. Admin only (permissions table). The write is audited. It changes that account and later passes. It does not change ids already copied onto existing passes (PAC-075) |
| Passes | Plate, start, end, and the resident this pass is for. That account must have the resident permission. No unit or household fields. Those are copied from that resident. Revoke on any pass in this community (PAC-004, PAC-007) |
| Warning | The same photo warning form as the patroller, including the reason picker and the Other text field, for a plate in this community (PAC-040, D-076). Not offered when that plate's vehicle is `on_hold`. The result is "on hold, don't act" (D-077) |
| Violations | Close, with a close reason, on a warning in this community. That reason is free text and is separate from the warning-reason list (PAC-045, D-076) |
| Void | On a `signed` authorization. Reason required. Does not require the signer permission (PAC-054). There is still no Sign button unless this account also has signer |
| Config | Stay cap, month cap, month-cap subject, month window, timezone, daily cap, grace, upload maximum, guest-lookup limit, magic-link lifetime, guest-rule text. The pilot values shown for a new Bridgeway row are 72 hours, 4, household, calendar month, Pacific time, and 3 days. The daily cap and the magic-link lifetime are blank (Q-034, Q-041). Save refuses an empty cap, empty daily cap, empty grace, empty subject, empty window, empty timezone, empty upload maximum, empty lookup limit, or empty magic-link lifetime (PAC-100). The timezone is not prefilled when the row is missing. The plate-change limit is not a field here. It is 3 per vehicle per rolling 30 × 24 hours (D-073, D-099) |
| Export | One button for this community. The file is CSV plus photo files (D-089). Shows success or failure. Does not download another community (PAC-060) |
| Plate-change alerts | The admin alerts for refused 4th plate changes in this community | Each row names the vehicle, the resident, and the time (D-100). There is no send button, because the delivery channel is not chosen (Q-038) |
| Invite | Email, and an allow-list of resident, patroller, admin, and signer. Phone, unit, and household are required when resident is checked. No community picker. A request that names another community is refused (D-097). After save, the raw token is shown once. The accept step cannot send community, permissions, unit, household, email, or phone (PAC-073). Accepting deletes the phone on the invite. An admin may revoke the invite, and that revoke deletes the phone in the same transaction (PAC-067) |

Signer, only if the account has that permission. Export and void are on this screen too, because the permissions table allows them without admin:

| Region | Content |
| --- | --- |
| Eligible warnings | Warnings where server `now >= grace_ends_at`, the second warning exists, the warning is not closed, and there is no `signed` authorization (D-085). A warning whose plate is the current plate of an `on_hold` vehicle is not eligible (D-077). A warning with no second warning is listed separately as not eligible, with "A second warning is required before a tow authorization." The screen does not wait for a stored `grace_elapsed` status |
| Draft | Upload the writing. The screen does not claim the upload satisfies CVC §22658 (D-104). If the warning's plate is an `on_hold` vehicle, the screen shows "on hold, don't act" and does not keep a draft (D-077) |
| Sign | Confirm. Result is `signed`. The plate stored is the warning's plate at sign time. No "call tow" and no vendor name field that sends data. Sign on a warning whose plate is an `on_hold` vehicle shows "on hold, don't act" and does not sign (D-077) |
| Void | Reason required (PAC-054) |
| Export | The same one-community export as admin (PAC-060) |

If the same person is admin and signer, the nav shows both groups (D-093). The hold button, the remove button, and the sign button are not the same control. There is no control that deletes a community's plates or photos, and no control that deletes a `removed` vehicle row. There is no button that deletes an audit event. The retention jobs, including the 365-day purge, the closed-violation purge, and the photo purge, are jobs, not screens (D-074, D-101, D-103). An open violation is not deleted by a screen or by the age job. A photo's deadline is stored on the photo when the violation is closed. No screen changes that class afterward. None exists.

## 10. Feedback

| State | What the person sees | Label |
| --- | --- | --- |
| Loading | The task's own loading line. Not another community's data | PROPOSED |
| Cap refused | The cap name and that the pass was not created | PROPOSED |
| Plate change refused | "This vehicle has had 3 plate changes in the last 30 days." The plate on the vehicle is unchanged. A description-only save does not use this line | D-073 |
| Missing config | "This community's rules are not set." Admin sees a link to config. Others do not | PROPOSED |
| Scheduled pass | The pass is saved and is not permission to park until the start | PROPOSED |
| Photo failed | Warning not filed, including a refused type or a file over the maximum. Photos can be attached again | PROPOSED |
| Warning reason missing | "Choose a warning reason." No warning is filed | D-076 |
| Other with no description | "Describe this warning." No warning is filed | D-076 |
| Note on a listed reason | "A note is only allowed when the reason is Other." No warning is filed | D-076 |
| Warning already open | The new warning was not filed. The existing one remains | PROPOSED |
| Sign refused | Grace has not ended, or the account cannot sign. No partial signed state | PROPOSED |
| On hold | "on hold, don't act". No warning button and no tow button. A warning or a tow authorization sent anyway is not stored | D-077 |
| Export failed | No file, and a retry. The audit notes the failure | PROPOSED |
| Ended pass, still in the 24 hours | The plate and "This pass has ended." This is not the invalid line | D-088 |
| Dead guest link | "this link is not valid." The same line for unknown, revoked, more than 24 hours after the end, and rate-limited. Not used for the 24-hour ended view | D-088 |
| Reload | Pilot data remains (PAC-090). The mock's reload-to-seed behavior is not this product (VERIFIED for the mock) | PROPOSED |

## 11. Accessibility notes for the pilot

Not a conformance claim (UNKNOWN whether a level is required).

PROPOSED minimum: labeled fields, errors in text not only color, photo control is a real file input, guest link works without an account and without a hover-only action. The prototype's native labels are VERIFIED. Its status colors on spots are not reused, because stalls are not a pilot screen.

## 12. Questions

D-082, D-086, D-087, D-088, D-089, D-093, and D-095 decide the pass controls, the photo requirement, the resident phone, the guest-link cases, the export button, the combined admin and signer nav, and the resident's own-only lists. D-104 keeps the upload screen from saying the writing is legally sufficient. An attorney confirms the PROPOSED list before the pilot goes live. D-097 is the magic-link screen, and there is no public sign-up and no community picker. Q-020 is resolved by D-077: a plate check of an `on_hold` vehicle shows "on hold, don't act" and has no warning button, no second-warning button, and no tow button. The warning-reason list is PROPOSED in `PRD.md` section 11.2. Q-021 is resolved by D-069: an `on_hold` vehicle has no resident edit or remove. Q-022 is resolved by D-070: the add form has no message about how many vehicles this account may have. Q-023 is resolved by D-073 and D-099: the edit screen allows a plate change while fewer than 3 of that vehicle's plate-change events are under 30 × 24 hours old and, on the 4th while three still count, shows "This vehicle has had 3 plate changes in the last 30 days." At exactly 30 × 24 hours the oldest no longer counts. The admin plate-change list is the existing audit events. D-100 adds the admin-alert list and does not add a delivery control (Q-038). Q-024 is resolved by D-072 and D-098: admin hold and admin remove say the resident is notified by email and text. The wording is Q-037. A resident's own remove does not say a notice was sent. Q-026 is resolved by D-075: the admin screen has Release hold, and the resident and patroller screens do not. The resulting status is `active`, derived from D-069. D-102 says that confirm notifies the resident by email and text. Q-027 is resolved by D-076: the warning form uses the reason picker, Other requires a description, and an empty reason is an error. The codes and labels are PROPOSED in `FRD.md`. D-085 adds the second-warning form and keeps tow off that screen until the second warning exists. The proposed consent line on the resident invite is not a legal conclusion. Q-033 through Q-038 and Q-041 through Q-048 stay open and are why those screens do not invent a gap, a daily number, a combined-cap sentence, a login without email, notice wording, an alert channel, a magic-link lifetime, a text-failure fallback, or an outer limit for a case that never closes. The retention schedule is not a screen. The 36-month clock from closure is a proposed reading (Q-048).
