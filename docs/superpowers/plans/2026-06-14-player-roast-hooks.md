# Player Roast Hooks Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add safe, sourced, Chinese internet-style roast hooks to current player cards so every key player has more memorable commentary.

**Architecture:** Reuse the existing `hooks` array on `KeyPlayer` rather than adding new UI structure. Expand content validation only where new approved Chinese community source hosts are needed. Keep the current card layout unchanged unless the final page becomes visibly too dense.

**Tech Stack:** React, TypeScript, Vite, static JSON content, Node content validator.

---

## Chunk 1: Source Policy And Validator

### Task 1: Add Approved Chinese Community Hosts

**Files:**
- Modify: `/Users/kenchen/Projects/weiqiudi/scripts/validate-content.mjs`

- [ ] **Step 1: Identify which hosts are needed**

Research current public Chinese source/search URLs for roast hooks. Prefer search pages that are stable and do not require login:

```text
https://www.baidu.com/s?wd=...
https://search.bilibili.com/all?keyword=...
https://www.zhihu.com/search?type=content&q=...
https://bbs.hupu.com/search?q=...
https://s.weibo.com/weibo?q=...
```

Expected: final host list only includes hosts actually used in `content/published/2026-06-14.json`.

- [ ] **Step 2: Update validator allowlist**

Add needed hosts to `allowedExternalHosts` in `/Users/kenchen/Projects/weiqiudi/scripts/validate-content.mjs`.

Expected candidate additions:

```js
"www.zhihu.com",
"zhihu.com",
"bbs.hupu.com",
"m.hupu.com",
"s.weibo.com",
"weibo.com",
```

Do not add broad unrelated hosts.

- [ ] **Step 3: Run validation**

Run:

```bash
npm run validate:content
```

Expected: PASS before content changes or fail only for known new URLs added later.

## Chunk 2: Player Roast Hook Content

### Task 2: Research And Add Roast Hooks

**Files:**
- Modify: `/Users/kenchen/Projects/weiqiudi/content/published/2026-06-14.json`

- [ ] **Step 1: Research each player using current web checks**

For each current key player, search Chinese web signals before writing:

```text
凯·哈弗茨 梗
穆西亚拉 梗 盘带
莱安德罗·巴库纳 库拉索 足球
科迪·加克波 梗
范戴克 梗 防守
久保建英 梗
扬·迪奥曼德 科特迪瓦
西蒙·阿丁格拉 梗
皮耶罗·因卡皮耶 梗
威廉·帕乔 梗
亚历山大·伊萨克 梗
维克托·约克雷斯 梗
伊莱斯·斯希里 突尼斯
汉尼拔·梅布里 梗
```

Use Baidu/Bilibili first. Use Hupu/Zhihu/Weibo only when they provide a useful public signal.

- [ ] **Step 2: Add one safe roast hook per player**

Append one hook to each player’s existing `hooks` array. Use short titles such as:

```json
{
  "title": "懂球圈吐槽",
  "detail": "写一条可复述、嘴损但不骂街的中文句子。",
  "links": [
    {
      "label": "百度搜索：球员名 梗",
      "url": "https://www.baidu.com/s?wd=...",
      "type": "搜索"
    }
  ]
}
```

Expected content requirements:

- One concise line per hook.
- No direct abuse, slurs, private rumors, body-shaming, injury jokes, or nationality/ethnicity attacks.
- No unsourced claims.
- For players with weak meme signals, use a broader on-field sarcastic hook and a search link.

- [ ] **Step 3: Check JSON syntax**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('content/published/2026-06-14.json','utf8')); console.log('json ok')"
```

Expected: `json ok`.

## Chunk 3: Verification And Delivery

### Task 3: Validate, Build, And Inspect

**Files:**
- Verify: `/Users/kenchen/Projects/weiqiudi/content/published/2026-06-14.json`
- Verify: `/Users/kenchen/Projects/weiqiudi/src/App.tsx`
- Verify: `/Users/kenchen/Projects/weiqiudi/src/styles.css`

- [ ] **Step 1: Run content validation**

Run:

```bash
npm run validate:content
```

Expected: `Content validation passed for 1 published file(s).`

- [ ] **Step 2: Run full build**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build complete with exit code 0.

- [ ] **Step 3: Inspect page density**

Run local dev server:

```bash
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/` in the browser and check:

- Player cards are still scannable.
- Hook text does not overflow or overlap.
- Mobile width has no horizontal page overflow.
- Roast hooks read as playful commentary, not harassment.

- [ ] **Step 4: Commit and push**

Run:

```bash
git add content/published/2026-06-14.json scripts/validate-content.mjs
git commit -m "content: add sourced player roast hooks"
git push
```

Expected: changes pushed to `main`.
