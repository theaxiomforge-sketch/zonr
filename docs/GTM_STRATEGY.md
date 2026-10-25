# Zonr go-to-market — pilot first

Design baseline: `PRD.md`. This file does not size a market. The pilot price is free (D-091). S-1 and S-3 are accepted (D-092). S-2 is D-067. S-4, S-5, and S-6, and G-1 through G-3, stay PROPOSED and UNAPPROVED.

Labels: VERIFIED, INFERRED, UNKNOWN, PROPOSED. Market sizing is UNKNOWN and goes to RADAR. Do not import figures from RADAR's 2026-10-22 research brief into a pitch. That brief's existence on Henry's Drive is VERIFIED. Its numbers are not repeated here.

## 1. Purpose

Record the sequence Henry stated, and stop the prototype's marketing sentences from being used as traction.

## 2. Scope

In scope: the order pilot, then a reference case, then other HOAs. The buyer and users in `PRD.md` section 3.2. The conflict flag.

Out of scope: a competitor matrix, a price list, a forecast, and any claim about California HOA demand. Those are UNKNOWN.

## 3. Success

There is no approved commercial target.

| Id | PROPOSED criterion | UNAPPROVED |
| --- | --- | --- |
| G-1 | The pilot community can run S-1 through S-5 before any second community is offered the product | Yes |
| G-2 | A reference case, if one is published, uses only facts the board agrees to release | Yes |
| G-3 | Outreach to other HOAs waits on that reference and on Henry | Yes |

G-1 through G-3 are not acceptance of a launch.

## 4. Non-goals

| Non-goal | Why |
| --- | --- |
| Quote the overview stats (1,284 permits, 98.4%, and the rest) | VERIFIED: they are seed strings, not usage |
| Name a price other than free for this pilot | The pilot is free (D-091). A later price is not in this file |
| Claim a wedge against other parking products | UNKNOWN. RADAR's brief argues the category is crowded. This file does not adopt or fight that argument |
| Sell tow dispatch or cameras | Out of the pilot build |
| Use the public Pages URL as a sales system of record | VERIFIED: it is a static mock |

## 5. Sequence

Henry's words, given for 2026-10-22: after piloting at his own community, he will market Zonr to other communities, and he is open to selling the company (VERIFIED as that statement).

| Step | What it is | What it is not |
| --- | --- | --- |
| 1. Pilot | Bridgeway HOA. About 700 homes and about 75 unnumbered guest spots (D-094). Those counts are Henry's profile, not a new audit | A multi-community product |
| 2. Reference case | A story the board can stand behind, after the pilot has run | A case study written before the pilot |
| 3. Other HOAs | Later marketing, using the reference case | A build of signup, billing, or a directory in the pilot |
| Sale of the company | Open, as intent | A process, a buyer, or a valuation (UNKNOWN) |

Step 3 is why `community_id` and per-community export exist in the design. Building step 3 now is a non-goal (`PRD.md` section 8).

## 6. Who pays and who uses

| Party | Commercial role | Label |
| --- | --- | --- |
| HOA board | Buyer, on the committee's recommendation | Approved scope |
| Residents, volunteer patrollers, admins | Users | Approved scope |
| Guests | Link holders, not customers | Approved scope |
| Tow company | Not a customer and not a user | Approved scope |
| Later HOAs | Not in the pilot offer | Henry's sequence. No count of them (UNKNOWN) |

## 7. Offer that stays inside the facts

| Statement | Label |
| --- | --- |
| The pilot offer is guest passes by plate and time, with a 72-hour stay and 4 passes per household per Pacific month, a vehicle registry that residents keep themselves and that an admin can hold or remove, 3 plate changes per vehicle per 30 × 24 hours, a notice by email and text when an admin holds, removes, or releases a vehicle, a patroller plate check, a warning with a photo and a 3-day grace, a second warning before a tow authorization, a stored tow authorization, and an export as CSV plus photo files | Scope of this design, including D-067, D-080, D-081, D-084, D-085, D-098, and D-102. The notice wording is not chosen. The software is not built (VERIFIED: the repo is still the mock) |
| Zonr does not dispatch a tow | Approved scope |
| The current website is a demo of an earlier mock | VERIFIED |

INFERRED and not for a slide: a board that already tows will care about the written authorization record. Whether this board does is UNKNOWN (Q-016, the HOA's actual practice).

## 8. Price and conflict

The pilot is free (D-091). That is the price for this pilot, not a later price list.

INFERRED: Henry sits on the pilot HOA's committee and would also be the vendor. D-091: the board gets a written disclosure and a short board-signed pilot agreement before resident plates are collected. Those documents already exist outside this repository and are not copied here. Do not describe the pilot as an arm's-length sale. The price of this pilot is zero.

## 9. Claim register

| Claim | Label | Allowed in outreach now |
| --- | --- | --- |
| One HOA pilot, then other communities | VERIFIED as Henry's stated intent | Only as intent, not as a pipeline |
| Bridgeway HOA, about 700 homes and about 75 guest spots | D-094. Henry's profile, not a new audit | Only as that community's description |
| Residents are moving off stickers. 1,284 permits. 98.4% occupancy | VERIFIED as UI copy on the mock. Not measurements | No |
| Zonr dispatches tows or reads plates with a camera | False relative to the approved scope. The mock's labels suggest both (VERIFIED) | No |
| Market size, typical HOA budget, or competitor price | UNKNOWN. RADAR | No |
| Ready to sell the company | Intent only (VERIFIED as the statement). Terms UNKNOWN | No |
| Legally sufficient under CVC §22658 | UNKNOWN | No |

## 10. What has to be true before step 3

1. S-1 and S-3 are accepted (D-092). S-2 is D-067. S-4, S-5, and S-6 are still not accepted.
2. Henry accepts or replaces G-1 through G-3 in section 3 of this file. Those gates are separate from Q-013 and are also UNAPPROVED.
3. The pilot has run S-1 through S-5, or Henry explicitly waives that (not waived).
4. The board has the written disclosure and has signed the short pilot agreement. Both stay outside this repository (D-091). The pilot is free.
5. RADAR has been asked for sizing only if a number will be said aloud. No number is cleared today.
6. A reference case, if used, is approved by the board (G-2).

## 11. Questions

Q-016 stays open. Do not say the product meets CVC §22658. Market sizing is not a question for this file to answer. It is RADAR's. Q-012, Q-013, and Q-015 are resolved by D-091, D-092, and D-094.
