# Weiqiudi

Weiqiudi is a Chinese World Cup companion site for casual viewers who want to sound prepared before watching matches with friends. It is intentionally built for "fake fans": people who do not follow football closely, but need quick player recognition, safe conversation starters, meme-aware hooks, and pre-match context they can read in about a minute.

The current product name is **伪球帝**, a parody-style nod to Chinese football media naming. The page uses a manga cheat-sheet visual style with yellow backgrounds, thick black borders, sticker labels, and compact match cards.

## What It Shows

The current static page includes:

- Today's World Cup matches
- Kickoff times
- Team shirt colors
- One-line match summaries
- Key players for each team
- Player photos, shirt numbers, positions, personas, and public hooks
- Chinese source links, mainly Baidu and Bilibili search links
- Compact Polymarket pre-match implied probabilities
- A tomorrow preview with kickoff times and Polymarket odds
- A small author footer: `CK`

The content is designed for social usefulness, not football completeness. It deliberately avoids tactical breakdowns, coach resumes, detailed head-to-head history, and serious betting advice.

## Tech Stack

- React
- TypeScript
- Vite
- Static JSON content under `content/published`
- Custom content validation script under `scripts/validate-content.mjs`

## Project Structure

```text
content/published/      Published daily match data
docs/superpowers/       Product/design notes and visual direction
scripts/                Content validation scripts
src/                    React app, styles, and TypeScript types
```

## Development

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Build the site:

```bash
npm run build
```

Validate published content only:

```bash
npm run validate:content
```

## Content Rules

Published content is manually reviewed before being shipped. The validator currently enforces important constraints, including:

- Key players must be confirmed on the national-team roster.
- Player shirt numbers and positions must be present.
- Player photos must be either approved Wikimedia Commons images or explicit placeholders.
- Public source links must stay within the current Chinese-source allowlist.
- The Guardian and Guardian-derived links are blocked.
- Polymarket data must use Polymarket URLs, valid timestamps, and valid probability values.

Polymarket probabilities are shown as market-implied pre-match probabilities for lightweight context only. They are not betting advice.

## Current Status

This is an early static prototype. The page is already deployable as a Vite static site, but the daily content workflow is still mostly manual. Future work may include schedule fetching, automated draft generation, stronger source collection, and a review pipeline that opens daily draft pull requests instead of publishing automatically.
