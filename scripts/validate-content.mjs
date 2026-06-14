import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const publishedDir = "content/published";
const blockedUrlPatterns = [
  /theguardian\.com/i,
  /guardian/i,
];

const allowedExternalHosts = [
  "www.baidu.com",
  "baidu.com",
  "search.bilibili.com",
  "www.bilibili.com",
  "bilibili.com",
];
const allowedImageHosts = ["commons.wikimedia.org"];
const allowedPredictionMarketHosts = ["polymarket.com", "www.polymarket.com"];

const errors = [];

const files = (await readdir(publishedDir)).filter((file) => file.endsWith(".json"));

for (const file of files) {
  const filePath = join(publishedDir, file);
  const data = JSON.parse(await readFile(filePath, "utf8"));

  validateDailyGuide(data, filePath);
}

if (errors.length > 0) {
  console.error("Content validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Content validation passed for ${files.length} published file(s).`);

function validateDailyGuide(data, filePath) {
  if (!Array.isArray(data.matches)) {
    errors.push(`${filePath}: matches must be an array`);
    return;
  }

  for (const match of data.matches) {
    validateMatch(match, filePath);
  }
}

function validateMatch(match, filePath) {
  const matchLabel = `${filePath} ${match.id ?? "(missing match id)"}`;
  const teams = [match.homeTeam, match.awayTeam];

  for (const team of teams) {
    if (!team?.name) {
      errors.push(`${matchLabel}: each match must include both teams`);
      continue;
    }

    if (!Array.isArray(team.players) || team.players.length === 0) {
      errors.push(`${matchLabel}: ${team.name} must include at least one key player`);
      continue;
    }

    for (const player of team.players) {
      validatePlayer(player, team.name, matchLabel);
    }
  }

  validateLinks(match.sourceLinks, `${matchLabel} sourceLinks`);
  validatePredictionMarket(match.predictionMarket, `${matchLabel} predictionMarket`);
}

function validatePlayer(player, teamName, matchLabel) {
  if (!player?.name) {
    errors.push(`${matchLabel}: ${teamName} has a player without a name`);
    return;
  }

  if (player.rosterStatus !== "confirmed") {
    errors.push(
      `${matchLabel}: ${teamName} player ${player.name} must be confirmed on the national-team roster before publishing`,
    );
  }

  validatePlayerImage(player, `${matchLabel} ${teamName} ${player.name}`);

  if (!Array.isArray(player.hooks) || player.hooks.length === 0) {
    errors.push(`${matchLabel}: ${teamName} player ${player.name} must include at least one hook`);
    return;
  }

  for (const hook of player.hooks) {
    validateLinks(hook.links, `${matchLabel} ${teamName} ${player.name} hook ${hook.title}`);
  }
}

function validatePlayerImage(player, context) {
  if (!player.shirtNumber || player.shirtNumber === "待确认") {
    errors.push(`${context}: verified shirtNumber is required before publishing`);
  }

  if (!player.position) {
    errors.push(`${context}: position is required before publishing`);
  }

  if (!["licensed", "placeholder"].includes(player.imageStatus)) {
    errors.push(`${context}: imageStatus must be licensed or placeholder`);
    return;
  }

  if (player.imageStatus === "licensed") {
    if (!player.imageUrl) {
      errors.push(`${context}: licensed image requires imageUrl`);
      return;
    }

    let host;
    try {
      host = new URL(player.imageUrl).hostname;
    } catch {
      errors.push(`${context}: invalid imageUrl ${player.imageUrl}`);
      return;
    }

    if (!allowedImageHosts.includes(host)) {
      errors.push(`${context}: image host ${host} is not allowed for player photos`);
    }

    if (!player.imageCredit) {
      errors.push(`${context}: licensed image requires imageCredit`);
    }
  }
}

function validatePredictionMarket(predictionMarket, context) {
  if (!predictionMarket) return;

  if (predictionMarket.source !== "Polymarket") {
    errors.push(`${context}: source must be Polymarket`);
  }

  if (!["available", "unavailable"].includes(predictionMarket.status)) {
    errors.push(`${context}: status must be available or unavailable`);
    return;
  }

  if (!predictionMarket.asOf) {
    errors.push(`${context}: asOf is required`);
  } else if (Number.isNaN(Date.parse(predictionMarket.asOf))) {
    errors.push(`${context}: asOf must be an ISO timestamp`);
  }

  if (!predictionMarket.note) {
    errors.push(`${context}: note is required`);
  }

  if (!Array.isArray(predictionMarket.outcomes)) {
    errors.push(`${context}: outcomes must be an array`);
    return;
  }

  if (predictionMarket.status === "unavailable") {
    if (predictionMarket.outcomes.length > 0) {
      errors.push(`${context}: unavailable market must not include outcomes`);
    }
    return;
  }

  if (!predictionMarket.marketUrl) {
    errors.push(`${context}: available market requires marketUrl`);
  } else {
    let host;
    try {
      host = new URL(predictionMarket.marketUrl).hostname;
    } catch {
      errors.push(`${context}: invalid marketUrl ${predictionMarket.marketUrl}`);
      return;
    }

    if (!allowedPredictionMarketHosts.includes(host)) {
      errors.push(`${context}: marketUrl host ${host} must be Polymarket`);
    }
  }

  if (predictionMarket.outcomes.length === 0) {
    errors.push(`${context}: available market must include outcomes`);
  }

  for (const outcome of predictionMarket.outcomes) {
    if (!outcome?.label) {
      errors.push(`${context}: outcome is missing label`);
    }

    if (typeof outcome?.probability !== "number" || !Number.isFinite(outcome.probability)) {
      errors.push(`${context}: outcome ${outcome?.label ?? "(missing label)"} probability must be a number`);
    } else if (outcome.probability < 0 || outcome.probability > 100) {
      errors.push(`${context}: outcome ${outcome.label} probability must be between 0 and 100`);
    }
  }
}

function validateLinks(links, context) {
  if (!Array.isArray(links)) return;

  for (const link of links) {
    if (!link?.url) {
      errors.push(`${context}: link is missing url`);
      continue;
    }

    if (blockedUrlPatterns.some((pattern) => pattern.test(link.url) || pattern.test(link.label ?? ""))) {
      errors.push(`${context}: blocked non-Chinese reference link ${link.url}`);
    }

    let host;
    try {
      host = new URL(link.url).hostname;
    } catch {
      errors.push(`${context}: invalid link url ${link.url}`);
      continue;
    }

    if (!allowedExternalHosts.includes(host)) {
      errors.push(`${context}: ${host} is not in the Chinese-source allowlist`);
    }
  }
}
