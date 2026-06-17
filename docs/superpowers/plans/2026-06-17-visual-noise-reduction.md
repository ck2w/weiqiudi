# Visual Noise Reduction Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce page visual noise while preserving the current black-yellow comic identity.

**Architecture:** This is a CSS-only refinement. Keep React structure and content JSON unchanged; adjust spacing, border weights, shadows, and secondary element emphasis in `src/styles.css`.

**Tech Stack:** Vite, React, TypeScript, CSS.

---

## Chunk 1: CSS Visual Hierarchy

### Task 1: Tune Borders, Shadows, And Spacing

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Reduce secondary border weights**

Change inner modules such as `.one-liner`, `.talk-card`, `.team-panel`, `.warning-card`, `.hook`, `.source-links a`, `.prediction-card`, `.shirt-badge`, `.history-link`, and `.preview-match` to lighter border weights while preserving thick borders on `.match-card`, `.title-card`, `.today-stamp`, `.tomorrow-card`, `.history-card`, `.notice-card`, and `.empty-card`.

- [ ] **Step 2: Reduce secondary shadows**

Keep strong hard shadows on page-level cards and primary actions. Reduce or remove shadows from source links, compact buttons, history links, player photos, and small badges.

- [ ] **Step 3: Add modest breathing room**

Increase vertical spacing between match sections and within `.match-grid`, but avoid making the page much longer. Keep the one-liner compact.

- [ ] **Step 4: Preserve mobile density**

Adjust mobile CSS only if needed to avoid overflow and excessive card height.

- [ ] **Step 5: Verify**

Run:

```bash
npm run validate:content
npm run build
```

Expected: both pass.

- [ ] **Step 6: Browser check**

Open `/2026-06-16` locally and verify:

- Desktop has no horizontal overflow.
- Mobile width has no horizontal overflow.
- Main card still feels comic/black-yellow.
- One-liner copy button still sits inline.

- [ ] **Step 7: Commit and push**

```bash
git add src/styles.css docs/superpowers/specs/2026-06-17-visual-noise-reduction-design.md docs/superpowers/plans/2026-06-17-visual-noise-reduction.md
git commit -m "refine: reduce visual noise"
git push
```
