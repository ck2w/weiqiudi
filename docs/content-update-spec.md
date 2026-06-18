# Daily Content Update Specification

## Purpose

This document defines the repeatable workflow for publishing a new daily
World Cup guide or correcting an existing one. The goal is a current,
source-backed Chinese cheat sheet for casual viewers, not comprehensive match
analysis or betting guidance.

## Scope

A complete update covers:

- all matches on the requested calendar date;
- the following day's match preview;
- kickoff times displayed in US Eastern Time;
- confirmed key players and usable player photos;
- concise Chinese conversation hooks and source links;
- fresh Polymarket moneyline probabilities for every match where a market
  exists;
- repository validation, build, commit, and push.

Unless the user explicitly asks for a visual or schema change, update content
only. Preserve the existing React components, types, and page styling.

## Files

For a new date `YYYY-MM-DD`:

1. Create `content/published/YYYY-MM-DD.json`, using the most recent published
   file as the structural template.
2. Import the JSON file in `src/App.tsx`.
3. Add it to `publishedGuides` in chronological order. The final entry is the
   default latest guide.

For a correction, edit the existing dated JSON file and avoid unrelated code
or formatting changes.

## Research Order

Research before writing. Use current primary or authoritative sources when
available, and cross-check facts that affect what appears on the page.

1. Confirm the official match schedule and venue-local kickoff time.
2. Convert kickoff times to `America/New_York`, accounting for daylight saving
   time, and display them as `H:MM ET`.
3. Confirm tournament rosters, shirt numbers, positions, and likely notable
   players.
4. Find compliant Wikimedia Commons player photos and record attribution.
5. Find Chinese-language links for public context and conversation hooks.
6. Query Polymarket only after the teams and dates are confirmed.

Do not copy a previous day's preview blindly. Recheck every field when a match
moves from `tomorrow.matches` into the main `matches` array.

## Match Ordering and Time

- `matches` must be ordered by kickoff instant, earliest first.
- `tomorrow.matches` must also be ordered by kickoff instant, earliest first.
- Do not sort alphabetically, by importance, or by market popularity.
- Use the same `ET` display convention throughout the page.
- Resolve midnight and date-boundary cases using the actual kickoff instant,
  not the date embedded in a source headline.

## Main Match Content

Each main match must preserve the `MatchGuide` shape in `src/types.ts`:

- stable lowercase `id` based on both teams;
- verified `kickoffTime`;
- complete home and away team objects;
- one concise `oneLiner`;
- Polymarket data when available;
- short, speakable `conversationLines`;
- one useful `dontSay` warning;
- allowed Chinese-facing `sourceLinks`.

Copy should help someone participate in a watch-party conversation. Avoid long
tactical explanations, generic biography, unsupported predictions, and claims
that will become false if a player does not start.

## Players and Photos

### Player selection

- Feature players who are confirmed on the current tournament roster.
- Verify `shirtNumber` and `position`; never leave `待确认` in published data.
- Prefer recognizable or conversation-relevant players, but do not keep a star
  who is absent from the confirmed squad.
- Set `rosterStatus` to `confirmed` only after verification.

### Photo requirements

- Every featured player should have a real photo.
- Use a Wikimedia Commons file or file page hosted on
  `commons.wikimedia.org`.
- Set `imageStatus` to `licensed`, provide `imageUrl`, meaningful Chinese
  `imageAlt`, and `imageCredit` that identifies Wikimedia Commons and the
  creator or source when available.
- Use `imageFocus` only when the existing crop needs adjustment.
- Check that the URL resolves and depicts the correct player rather than a
  team, badge, namesake, or outdated unrelated subject.
- Use `imageStatus: "placeholder"` only after a compliant photo cannot be
  verified. Do not fabricate a URL or attribution.

The repository validator currently allows player images only from
`commons.wikimedia.org`. Changing that allowlist is a separate implementation
decision and must not be slipped into a daily content update.

## Hooks and Chinese Sources

- Keep hook titles short and details conversational.
- Paraphrase source material; do not reproduce long passages.
- Use the source host allowlist enforced by
  `scripts/validate-content.mjs`, currently Baidu and Bilibili properties.
- Do not use Guardian or Guardian-derived links.
- Confirm links are relevant and reachable before publishing.
- Keep jokes non-discriminatory and avoid sexual, hateful, or needlessly toxic
  material.

## Polymarket

### Required coverage

Check Polymarket for every match in both `matches` and `tomorrow.matches`.
Missing data is not acceptable merely because a normal web search did not find
the event.

### Discovery procedure

1. Build likely slugs using the competition prefix, team abbreviations, and
   ISO date. Current World Cup events commonly follow a form such as
   `fifwc-eng-hrv-2026-06-17`.
2. Query the Gamma API:
   `https://gamma-api.polymarket.com/events?slug=<event-slug>`.
3. If the first slug fails, retry reasonable FIFA/team abbreviation variants,
   reversed naming assumptions, and Polymarket event search.
4. Confirm the returned event title, teams, and `startTime` match the target
   fixture.
5. Select the three `moneyline` markets representing home win, draw, and away
   win. Do not substitute qualification, tournament winner, handicap, totals,
   or yes/no props.

### Recording values

- Set `source` to `Polymarket`.
- Set `status` to `available` when the correct event exists.
- Use the direct event URL:
  `https://polymarket.com/event/<event-slug>`.
- Convert each moneyline market's current Yes price to a percentage by
  multiplying by 100.
- Label outcomes with the two displayed team names and `平局`, in home/draw/away
  order.
- Record the actual retrieval time as an ISO timestamp in `asOf`; use one
  consistent timestamp when markets are fetched in the same batch.
- Write a neutral note describing the market shape. Do not recommend a bet or
  imply certainty.

Probabilities from three separate binary markets may not total exactly 100 due
to spread, liquidity, and rounding. Preserve the observed prices rather than
normalizing them unless the product requirements change.

### Unavailable markets

Set `status` to `unavailable` only after completing the discovery procedure.
An unavailable entry must have:

- a fresh ISO `asOf` timestamp;
- no `marketUrl`;
- an empty `outcomes` array;
- a note stating that no matching single-game moneyline market was found.

Never invent probabilities, reuse stale values from another fixture, or attach
a market whose teams/date do not match.

## Tomorrow Preview

Tomorrow's preview is part of the daily update, not optional filler.

- Include every scheduled match for the following date.
- Verify and display each kickoff time in ET.
- Sort the preview chronologically.
- Apply the same Polymarket discovery and freshness rules as today's matches.
- Keep preview objects limited to the existing `PreviewMatch` schema; player
  details belong in the next day's full guide.

## Validation and Review

Run both commands after editing:

```bash
npm run validate:content
npm run build
```

Then review the diff and manually confirm:

- the guide date, display dates, and tomorrow date are correct;
- today's and tomorrow's fixtures are complete and chronological;
- all displayed times are ET conversions of verified kickoff instants;
- player roster status, number, position, photo, and attribution are verified;
- every Polymarket event matches the fixture and uses fresh values;
- no stale `unavailable` entry remains without a full retry;
- links use allowed hosts and no unsupported claim was introduced;
- `src/App.tsx` includes a new guide exactly once and in date order;
- no unrelated files changed.

Validation passing is necessary but not sufficient: the validator cannot prove
that a photo shows the right person, a market belongs to the right match, or a
schedule source is current.

## Preview, Commit, and Push

Do not start a local development server, open a browser, or provide a preview
for a routine daily content update unless the user explicitly asks for one.
Validation and a production build are the default verification path.

Commit and push are the default final steps for every daily content update:

1. Check `git status` and inspect the diff.
2. Stage only files belonging to the update.
3. Use a focused commit message, for example
   `content: add june 18 guide` or `fix: refresh june 18 market data`.
4. Push the current branch to its configured upstream.
5. Confirm the worktree is clean and the local branch matches the upstream.

Do not discard or overwrite unrelated user changes. If unrelated changes are
present, leave them unstaged.
