# Zonr go-to-market strategy

Baseline: main `99d283e`. Henry asked for this document. The repository does not contain a market, a price, a competitor set, or a launch plan. This file refuses to invent them.

Every claim is tagged.

| Tag | Meaning in this file |
| --- | --- |
| IN-PRODUCT COPY | A sentence that already appears in the UI or the GitHub repo description. It is evidence of positioning text, not evidence that the positioning is true |
| UNKNOWN | No source in the repo. Henry has to supply it or delete the row |
| ASSUMPTION | An inference someone might draw from the copy. It is not a finding |

No row in this document is a verified market fact.

## 1. Purpose

Stop the prototype's marketing sentences from being repeated as a strategy. Record the one distribution channel the repo actually has. List the decisions Q-017 requires before anyone sells Zonr.

## 2. Scope

### 2.1 In scope

The words the product uses about itself. The public Pages URL as a distribution fact. A claim register. The questions that block a real strategy.

### 2.2 Out of scope

Personas with jobs, budget, and pains. Pricing. A sales motion. A competitive matrix stated as fact. Forecasts. A launch date. Case studies. Those items are UNKNOWN. Drafting them here would be an ASSUMPTION presented as a plan, which this file does not do.

## 3. Success

This document succeeds when a reader can tell a copy sentence from a market claim, and when no outbound material is justified by these pages alone.

A commercial go-to-market succeeds only under a definition Henry has not written. UNKNOWN. See Q-016 and Q-017.

## 4. Non-goals

| Non-goal | Why it is refused |
| --- | --- |
| Name a beachhead customer | UNKNOWN. Q-001 |
| Claim a city, country, or property type beyond the words on the screen | The seed GPS is a number in the fixture. It is not a launch market |
| Treat "1,284 permits" or "98.4% occupancy accuracy" as traction | They are stat-card strings. The editable dataset is 8 spots and 3 permits. Q-012 |
| Position tow, citations, or decals as a legal or hardware product | Those behaviors are labels. Q-005, Q-011 |
| Describe GitHub Pages as a customer channel | It is the deploy target. Whether it is also marketing is UNKNOWN. Q-019 |

## 5. Positioning that exists as copy

These lines are IN-PRODUCT COPY. Repeating them in a pitch repeats the prototype. It does not add proof.

| Source | Line | Tag |
| --- | --- | --- |
| `index.html` title | "Zonr \| Smart Parking Operations" | IN-PRODUCT COPY |
| Header | "Smart parking operations for residential communities." | IN-PRODUCT COPY |
| GitHub repository description | Focuses on the "parking zones" managed within the app. | IN-PRODUCT COPY |
| Overview eyebrow | "Proptech parking orchestration" | IN-PRODUCT COPY |
| Overview headline | "Zonr turns every residential lot into a live, enforceable system." | IN-PRODUCT COPY |
| Overview paragraph | The product replaces "hangtags, disconnected spreadsheets, and manual patrol ambiguity" with "digital permits, smart guest sessions, interactive maps, and enforcement-grade verification." | IN-PRODUCT COPY |
| Smart Decals card | "Residents are moving from stickers and office visits to self-managed permits." | IN-PRODUCT COPY |
| Role cards | Manager drag-and-drop, resident document upload, guest QR with extension-ready timing, enforcement plate verification | IN-PRODUCT COPY |

The two descriptions do not match. The repo talks about parking zones. The UI talks about smart parking operations for residential communities. Which one is the offer is UNKNOWN. Q-020.

## 6. What a reader might infer

Each inference is an ASSUMPTION. None is approved.

| Id | ASSUMPTION | Why it is not a finding |
| --- | --- | --- |
| A-1 | The buyer is a property manager or HOA, and the users are residents, guests, and patrol staff | The screens are labeled that way. Nobody in the repo says who pays |
| A-2 | The problem is paper permits and inconsistent enforcement in multifamily or HOA lots | The hero says hangtags, spreadsheets, and patrol ambiguity. There is no customer evidence |
| A-3 | The alternative is the incumbent habit named in the hero, not a named software competitor | No competitor is named anywhere |
| A-4 | "Smart decal" is a physical product bundled with software | The data model has a permit type string. No hardware, cost, or install step exists |
| A-5 | Los Angeles is a target geography | Seed GPS values sit near 34.05, -118.24, and the sample phones use 310, 424, and 800. Fixture flavor is not a territory |
| A-6 | The Pages site is a public demo for sales | It is a public URL produced by the deploy workflow. Intent is UNKNOWN |

Do not promote A-1 through A-6 into slides.

## 7. Audience

UNKNOWN.

The prototype can be operated by one anonymous person pretending to be four roles. That is a demo shape, not a segment. Q-001 and Q-003 have to name the economic buyer, the daily user, and the excluded user before a message can be written.

## 8. Offer

UNKNOWN.

What the prototype can honestly be offered as, today, is a public click-through of a mock. Wording that stays inside the facts:

| Statement | Tag |
| --- | --- |
| Zonr at this commit is a front-end prototype of residential parking operations | This is a description of the repo, not a market claim |
| A visitor can edit permits, spots, guest sessions, and violations in one browser until they reload | IMPLEMENTED behavior. See `FRD.md` |
| The same visitor cannot invite a colleague into that data, take payment, scan a QR code, or dispatch a tow | IMPLEMENTED absence. AC-052, AC-053 |

Anything about time saved, violations prevented, occupancy accuracy, or fewer office visits is IN-PRODUCT COPY sitting on the stat cards and the Smart Decals card. It is not an offer.

## 9. Pricing and packaging

UNKNOWN. The repo has no plan, no seat model, no per-stall price, no hardware price, and no free tier. Inventing one would violate this document's rule. Q-017.

## 10. Channel and proof

| Fact | Tag |
| --- | --- |
| Source is the public GitHub repo `theaxiomforge-sketch/zonr` | Distribution of the code, not a marketing program |
| The demo URL is `https://theaxiomforge-sketch.github.io/zonr/` | IMPLEMENTED deploy output. Live as of this writing. Ownership of the audience is UNKNOWN. Q-019 |
| There is no analytics snippet in `index.html` or the app | No acquisition or activation number can be read from the product |
| There is no testimonial, logo, case study, or security page | UNKNOWN whether any exist outside the repo. They are not here |
| The sample metrics on the overview are not product analytics | IN-PRODUCT COPY. Q-012 |

A credible proof point the prototype can support in a conversation: a reviewer can watch one shared mock update across the four workspaces. That is a demonstration of the UI, not a proof of enforcement outcomes. Calling it "enforcement-grade" uses the hero's words. Those words are IN-PRODUCT COPY. The demonstration does not make them true.

## 11. Claim register

Use this table before reusing a Zonr sentence externally. "Allowed now" means the sentence does not over-claim the prototype. It is still not a market claim.

| Claim | Tag | Allowed now |
| --- | --- | --- |
| Zonr is smart parking operations software for residential communities | IN-PRODUCT COPY | Only as a quote of the header, with the prototype qualifier |
| Zonr manages parking zones | IN-PRODUCT COPY | Only as a quote of the repo description |
| The product replaces hangtags and spreadsheets | IN-PRODUCT COPY | No. The prototype does not replace an incumbent in any measured site |
| Residents move from stickers to self-managed permits | IN-PRODUCT COPY | No. One checkbox and three fake residents |
| 1,284 active permits, 312 guest sessions, 87 violations prevented, 98.4% occupancy accuracy, +9.2%, +14%, -22 min avg response, +6.1 pts | IN-PRODUCT COPY | No. Not measurements |
| Interactive map and drag-and-drop assignments | IN-PRODUCT COPY | No. The screen is a button grid. AC-044 |
| QR guest sessions with no download and extension-ready timing | IN-PRODUCT COPY | No. AC-036, AC-053. "No download" is trivially true of a web form and is easy to misuse |
| Camera-ready LPR and permit checks | IN-PRODUCT COPY | No. AC-050 |
| PMS sync | IN-PRODUCT COPY | No. The badge says "next" |
| Tow dispatch | IN-PRODUCT COPY | No. It is a select value |
| Zonr is a multi-property SaaS platform | ASSUMPTION | No. Q-002 |
| Zonr is ready to sell | ASSUMPTION | No. Q-016, Q-017 |
| Competitors are hangtags or a named vendor | ASSUMPTION | No. A-2 and A-3 |
| The market is Los Angeles multifamily | ASSUMPTION | No. A-5 |

## 12. Risks of talking about the prototype as a product

| Risk | Why it is real |
| --- | --- |
| A buyer believes patrol data is shared and durable | It dies on reload, and it is not shared. AC-009 |
| A buyer believes the product can tow a car | The control only stores a string. Q-011 |
| Sample plates and phone numbers on a public URL get treated as a privacy posture | They are seed values. A later real dataset would be a different decision. Q-015 |
| The overview numbers are screenshotted as traction | They are constants in `seed.ts` |

## 13. What has to be true before a strategy exists

Henry's answers, in order:

1. Q-020, so the sentence on the cover is one sentence.
2. Q-001 and Q-002, so there is an audience.
3. Q-004, so the pitch stops listing features the build does not have.
4. Q-016, so success is a condition rather than a vibe.
5. Q-017, so price, geography, competitors, and channel are either supplied or explicitly out of bounds.
6. Q-005 and Q-011, if the offer includes hardware or towing. Otherwise the strategy should not mention them.
7. Q-015 and Q-019, before the public URL is used as a sales link with anything other than the seed.

Until those answers exist, the go-to-market strategy is: do not market past section 11.

## 14. Open questions

Q-001, Q-002, Q-004, Q-005, Q-011, Q-012, Q-015, Q-016, Q-017, Q-019, and Q-020. They are written in `PRD.md` section 8. This file adds no further product questions.
