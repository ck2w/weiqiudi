# Player Roast Hooks Design

Date: 2026-06-14

## Summary

Add sharper, meme-aware player commentary to Weiqiudi without turning the site into abuse or unsourced gossip. The goal is to make each player card more memorable for casual viewers by adding "懂球圈嘴损" lines based on existing Chinese internet memes, public discussion, and search-visible talking points.

## Tone Target

The tone should be witty, slightly sarcastic, and easy to repeat at a watch party. It should feel like a football-aware friend giving the user a safe line, not like an angry forum thread.

Approved tone level: **B - football-fan sarcasm, not vulgar abuse**.

Examples of acceptable tone:

- "看起来像高级零件，有时候丝滑，有时候像装错机器。"
- "厉害的时候像答案，隐身的时候像没加载出来。"
- "你可以说他上限很高，但今天别先贷款封神。"

## Source Scope

Roast hooks must be based on public Chinese web signals. Acceptable source categories:

- Baidu search results
- Bilibili search or videos
- Baidu Baike or encyclopedia-style pages
- Hupu discussion pages or search results
- Zhihu pages or search results
- Weibo public search or public topic pages

Final copy must be rewritten in the site's own words. Do not copy community posts verbatim.

## Safety Boundaries

Roast hooks may target:

- Playing style
- On-field inconsistency
- Publicly known football memes
- Publicly visible match moments
- Repeated fan-discussion narratives
- The gap between reputation and visible performance

Roast hooks must not target:

- Race, nationality, ethnicity, religion, or region
- Family members or private relationships
- Body-shaming or appearance insults
- Injuries, mental health, or medical conditions
- Unverified rumors
- Sexual content
- Slurs, dehumanizing labels, or direct personal abuse
- Claims that cannot be backed by public search signals

Black nicknames should not be used as standalone content. If a nickname is too toxic, replace it with a safer paraphrase of the underlying football joke.

## Content Structure

Use the existing player `hooks` model unless implementation shows a strong reason for a separate field. Each key player should receive at least one new hook whose title clearly signals that it is a roast or sarcastic angle.

Recommended title patterns:

- "嘴损说法"
- "弹幕梗"
- "别贷款封神"
- "懂球圈吐槽"
- "今天别先吹满"

Each roast hook should include:

- A short title
- One concise Chinese line that users can repeat
- At least one source/search link from the approved Chinese source scope

Priority players may receive two roast hooks if there are enough public signals. Less-covered players should receive one safe, broader on-field joke rather than a forced meme.

## UI Behavior

No major layout change is required. Roast hooks should appear in the existing player hook list, using the current hook card style. The content should stay compact so each player card remains skimmable.

If later testing shows that roast hooks visually blend with ordinary hooks, a small label such as "吐槽" can be added to hook titles or link labels, but this is not required for the first implementation.

## Validation Rules

Published player roast hooks must follow the same link validation standards as other player hooks, with an expanded allowlist for approved Chinese community hosts if needed.

Before publishing:

- Every new roast hook must include at least one source/search link.
- The link must be a public Chinese source or search page.
- The text must be rewritten and safe under the boundaries above.
- If no public signal can be found for a player, use a general on-field sarcastic hook or leave that player unchanged rather than inventing a meme.

## Implementation Notes

The first implementation should update the current published day only. It should avoid changing the card layout unless necessary. The main work is content research, safe rewriting, and validator allowlist updates for new Chinese source hosts.

Because meme and public discussion data changes over time, research must use current web checks before adding claims. Do not rely only on memory for player memes.
