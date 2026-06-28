# World Cup Fake Fan Guide Design

Date: 2026-06-14

## Summary

Build a Chinese static website for people who will watch World Cup matches socially but do not follow football. The site gives them a one-minute pre-match cheat sheet for each match so they can recognize the key players, understand the light social talking points, and join casual conversation without reading tactical or historical analysis.

The first version is a semi-automated static site. A scheduled job generates a daily draft from match schedules, curated team/player data, and public Chinese web signals. A human reviews the draft before publishing.

## Audience

Primary users are Chinese-speaking casual viewers and "fake fans" who may watch World Cup matches with friends, coworkers, partners, or family. They do not need deep football knowledge. They need quick, safe, funny, socially useful material.

The tone should feel like a friend handing over a match-day cheat sheet: playful, meme-aware, and easy to repeat in conversation.

## Non-Goals

The first version will not include:

- Tactical background
- Coach biographies
- Previous head-to-head history
- Advanced stats or data analysis
- Long-form editorial articles
- User accounts, saved favorites, or comments
- A full CMS or custom admin dashboard
- Automatically published unreviewed generated content
- Rehosted community images, long article excerpts, or copied video content

## Core Experience

The homepage is the daily page: "today's World Cup fake fan cheat sheet". It opens directly on the day's matches instead of a marketing hero.

The top of the page shows:

- Today's date
- Number of matches today
- A short positioning line such as "开赛前 1 分钟，够你加入聊天"

Today's matches are sorted by kickoff time. Each match is displayed as a shareable cheat-sheet card. A card can be linked directly through an anchor or dedicated route so users can send one match to a friend.

The bottom of the page shows tomorrow's preview. Tomorrow's matches only need kickoff time and teams; full cheat sheets are generated for today's matches.

When the tournament reaches the knockout phase, the daily page also shows a knockout fixtures bracket after today's match cards and before tomorrow's preview. This module is a scan-first tournament-state view, not another match analysis card. It should help casual viewers understand which confirmed teams are already in the bracket, which slots are still TBD, and how winners flow into later rounds.

## Match Card Content

Each match card is optimized for one-minute reading. It must include:

- Kickoff time
- Team names
- Shirt colors for both teams
- One sentence that summarizes how to "sound like you know this match"
- Three to five directly usable conversation lines
- Player sections grouped by team
- Public source links for deeper self-directed reading or watching
- A "别尬聊" warning for obvious mistakes or unsafe jokes

The card should prioritize social usefulness over football completeness.

## Knockout Fixtures Module

The knockout fixtures module appears only when the published daily guide includes bracket data. It should be omitted entirely for earlier group-stage dates without knockout context.

The module includes:

- A `Fixtures` label and Chinese heading such as `淘汰赛阶段`
- A source link for the bracket update
- Horizontally scrollable columns for each knockout round
- Match cards with kickoff time, match number, and two team slots
- Confirmed teams with flags where available
- `TBD` placeholders for unconfirmed teams or winner slots
- A short note explaining that TBD slots will be updated after group or prior-round results

The bracket should preserve tournament structure over chronological sorting. Round of 32 cards are positioned in bracket order, and later-round cards are vertically centered between the two prior matches feeding them. The connecting lines are part of the information architecture: they must align to card centers and show the path from one round to the next.

The module should stay compact and secondary to today's match cards. It is a tournament map for orientation, not a replacement for daily cheat sheets.

Once knockout context exists, every daily content update must refresh the knockout fixtures snapshot from the current official schedule or bracket source. Do not carry forward yesterday's bracket data without rechecking confirmed teams, kickoff times, match numbers, TBD slots, and later-round feeder labels.

## Team Player Sections

Every match card must show key players for each team separately.

For each team:

- Include one to three players worth watching.
- Each listed player must have a short Chinese persona line, such as "速度怪", "门前吃饼王", "中场发牌员", or another editor-safe label.
- Each player should include one to three Chinese memes, nicknames, famous moments, or public discussion hooks.
- Each player should include links where possible, such as encyclopedia pages, Bilibili searches, highlight searches, or public community discussion signals.

If automatic collection cannot find enough public signals for a team, the draft must mark that team as needing review instead of publishing a weak or invented player section.

## Content Style

The content language is Chinese only. The style is "friends can say this at a watch party":

- Light and funny
- Meme-aware
- Conversational
- Safe for general social settings
- No slurs, personal attacks, low-grade insults, or unverified private rumors
- No tactical jargon unless it is unavoidable and immediately explained

The highest-value content is:

- Conversation lines users can repeat
- Player personas and memes
- Famous moments and highlight links
- Basic visual recognition, especially shirt colors and key players

## Content Sources

The site uses public sources as signals, not as copied content.

Allowed first-version source categories:

- Official or stable schedule sources
- Chinese Wikipedia and other encyclopedia-style pages
- Baidu Baike where available
- Bilibili search or video links
- YouTube search or video links when useful
- Public Chinese community pages as link and title signals, including Weibo, Hupu, Zhihu, or similar sources where available

The site may store:

- Source title
- URL
- Short summary or tag
- Source type
- Our own rewritten conversation line or player note

The site must not store or display:

- Long copied excerpts
- Rehosted original community images
- Full article bodies
- Copied video content
- Claims without either a source link or an explicit manual-review marker

## Daily Workflow

The daily workflow is scheduled but not fully automatic publishing.

1. Fetch today's and tomorrow's World Cup schedule.
2. Normalize teams, kickoff times, and match identifiers.
3. Add curated local data such as team Chinese names, likely shirt colors, and known player candidates.
4. Collect public Chinese web signals for team and player keywords.
5. Refresh knockout fixtures when the tournament has reached knockout context, including confirmed teams, kickoff times, match numbers, TBD placeholders, and feeder labels.
6. Generate one-minute match-card drafts.
7. Validate the draft content, source links, and knockout fixture snapshot.
8. Open a draft pull request or write a draft file for review.
9. Human reviewer edits, approves, and publishes.

Publishing happens only after review. If a card has insufficient player or meme content, it remains marked for review.

## Technical Architecture

Use a static-site architecture for the first version.

Frontend:

- Static app that reads published content data at build time
- Daily homepage
- Date pages
- Direct share links for each match
- Mobile-first layout, with a simple desktop wide layout

Content files:

- Draft data under a dated drafts directory
- Published data under a dated published directory
- Curated team and player seed data under a versioned data directory
- Optional knockout fixture data on published daily guides once the tournament reaches knockout context

Automation scripts:

- `fetch-schedule`: fetch and normalize today/tomorrow matches
- `collect-signals`: collect public Chinese source signals for teams and players
- `generate-draft`: convert schedule, curated data, and source signals into draft cards
- `validate-content`: enforce schema, source, tone, and completeness checks
- `publish`: promote reviewed draft content to published content

Deployment:

- Vercel, Netlify, or GitHub Pages are all acceptable
- GitHub Actions is the preferred first-version scheduler
- The scheduled job should create a draft PR or equivalent review artifact
- Merging reviewed content triggers deployment

No database, login system, or custom CMS is required for the first version.

### Knockout Fixture Data Shape

Knockout fixture data is optional on `DailyGuide`:

- `knockoutFixtures.updatedAt`: ISO timestamp for the bracket snapshot
- `knockoutFixtures.sourceLabel`: short label shown on the source link
- `knockoutFixtures.sourceUrl`: source URL for the bracket state
- `knockoutFixtures.rounds[]`: ordered rounds such as `Round of 32`, `Round of 16`, `Quarterfinals`, `Semifinals`, and `Final`
- `round.fixtures[]`: match cards for that round
- `fixture.id`: stable match id
- `fixture.matchNumber`: tournament match number when known, such as `M73`
- `fixture.kickoffTime`: concise display time, or explicit `TBD` when not verified
- `fixture.teams[]`: two team slots, each with `name`, optional `flag`, and `status`

Only verified teams and times should be shown as confirmed. Unknown opponents, winner slots, and unverified kickoff times must remain explicit `TBD` values rather than inferred guesses.

## Data Validation Rules

Each published match card must satisfy:

- Has kickoff time
- Has both team names
- Has shirt colors for both teams
- Has one "一句话装懂" line
- Has three to five conversation lines
- Has at least one key player per team
- Each key player has at least one persona, meme, nickname, or famous-moment entry
- Player entries have source links where possible
- Unsourced manual additions are explicitly marked for review before publishing
- No long copied content
- No offensive or unsafe language
- Links are valid URL strings

Broken links should be flagged in drafts. They do not need to block generation, but unresolved broken links should not be silently published.

Knockout fixture validation should additionally check:

- The latest knockout guide includes expected rounds when bracket data is present.
- Round of 32 includes the expected number of fixture slots.
- The fixtures module renders before tomorrow's preview.
- Bracket cards use shared row positioning rather than independent per-column stacking.
- Known feeder pairs align to the following-round card center.

## Failure Handling

If there are no matches today, the homepage shows a no-match state and still displays tomorrow's preview if available.

If source collection fails, the generator produces a basic draft from curated data and marks public signals as missing.

If a single team's player signals are weak, the match card remains a draft with a review warning.

If a link check fails, the draft marks the specific link as suspicious.

If generated copy violates tone or safety rules, validation blocks publishing.

## Visual Direction

The visual style is a manga magazine cheat-sheet look.

Core traits:

- High-saturation yellow background
- Thick black outlines
- White content panels
- Sticker-like labels
- Exaggerated but legible titles
- Pink and blue accent tags
- Mobile-first card layout

Knockout fixtures use the same visual language, but with a quieter map-like treatment:

- The whole bracket sits inside a page-level card.
- Each round is a narrow column with a clear round heading.
- Individual fixtures use light grey cards with black outlines and modest radius.
- Confirmed teams use flag + team name.
- TBD teams use a neutral shield placeholder.
- Horizontal and vertical connector lines show bracket flow and must align to the center of the connected cards.
- The board scrolls horizontally inside the card on narrow screens instead of causing page-level overflow.
- Long team names can truncate inside cards; they must not resize cards or break the grid.

Initial palette:

- Yellow: `#FFD400`
- Black: `#111111`
- White: `#FFFFFF`
- Pink accent: `#FF5C8A`
- Blue accent: `#71D7FF`
- Soft paper yellow: `#FFF7C2`

The site should feel like a playful pre-match emergency cheat sheet, not a traditional sports news site.

Visual archives:

- `docs/superpowers/specs/assets/2026-06-14-world-cup-fake-fan-visual-style.svg`
- `docs/superpowers/specs/assets/2026-06-14-world-cup-fake-fan-visual-style.png`

## Testing Strategy

First-version testing should focus on the highest-risk surfaces:

- Content schema validation
- Draft generation fallback behavior
- Link and source metadata validation
- Published page rendering with many matches, one match, and no matches
- Mobile viewport readability
- Direct match share links
- Knockout bracket row alignment and horizontal scroll behavior when bracket data is present

Visual verification should check that the one-minute information is not buried under decoration.

## Open Implementation Decisions

The implementation plan should choose:

- Static framework
- Exact schedule source
- Exact source collection strategy
- Draft PR format
- Published content schema
- Deployment target

These are implementation choices, not product design blockers.
