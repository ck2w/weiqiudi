# Visual Noise Reduction Design

## Goal

Reduce visual noise by roughly 30% while keeping the current black-yellow anime/comic identity of "伪球帝".

## Current Problem

The page has a strong and memorable style, but too many elements use the same level of visual emphasis:

- Outer match cards, inner cards, source links, buttons, player photos, and labels all use heavy black borders.
- Hard shadows appear on many small elements, not just primary containers.
- Pink, blue, yellow, black, and white all compete at high contrast.
- Match sections feel stacked too tightly, especially inside each match card.

The result is energetic, but a little noisy for a "one-minute cheat sheet" reading flow.

## Direction

Use option B: preserve the comic identity, but soften secondary elements.

- Keep heavy borders and hard shadows on the main match cards and page-level cards.
- Reduce inner module borders from 5px to 3px or 4px.
- Remove or reduce shadows from secondary links and small controls.
- Add modest vertical spacing inside match cards, especially around the one-liner, market strip, and content grid.
- Keep Polymarket compact and visually subordinate.
- Keep player cards readable by letting player identity lead and hook boxes recede slightly.
- Preserve mobile behavior with no horizontal overflow.

## Non-Goals

- Do not change the content model.
- Do not redesign the brand, colors, typography, or layout from scratch.
- Do not remove the comic/anime black-yellow look.
- Do not add new dependencies.

## Acceptance Criteria

- The page still looks like "伪球帝", not a generic news site.
- Main match cards remain visually dominant.
- Inner cards, source links, and hook boxes feel lighter.
- Reading rhythm is clearer on desktop and mobile.
- `npm run validate:content` and `npm run build` pass.
- Browser verification confirms no horizontal overflow on desktop or mobile.
