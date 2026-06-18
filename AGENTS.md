# Repository Agent Instructions

## Daily Content Updates

When adding or refreshing a daily guide, follow
[`docs/content-update-spec.md`](docs/content-update-spec.md). Treat it as the
source of truth for research, content fields, ordering, Polymarket data, player
photos, validation, and publishing.

The non-negotiable rules are:

- Verify facts from current sources. Never infer or invent schedules, rosters,
  shirt numbers, photos, links, or market probabilities.
- Store the guide in `content/published/YYYY-MM-DD.json` and add its import to
  `src/App.tsx` in chronological order.
- Sort both today's matches and tomorrow's preview by kickoff time, earliest
  first, using `America/New_York` for the displayed `ET` time.
- Every featured player must have a confirmed tournament roster status, shirt
  number, position, and a real licensed Wikimedia Commons photo. Use a
  placeholder only when no compliant photo can be verified, and say so
  explicitly in the data.
- Check Polymarket for every match, including tomorrow's preview. Search the
  Gamma API by likely event slug and team/date variants before marking a market
  unavailable. Record a fresh ISO `asOf` timestamp and the direct event URL.
- Keep Chinese-facing copy concise, conversational, and useful to casual
  viewers. Do not present market probabilities as betting advice.
- Run `npm run validate:content` and `npm run build` before committing. Do not
  commit or push when either command fails.
- Review the diff for accidental changes, then commit and push only the files
  belonging to the requested update.
