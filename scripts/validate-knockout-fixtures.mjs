import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const guide = JSON.parse(await readFile("content/published/2026-06-26.json", "utf8"));
const appSource = await readFile("src/App.tsx", "utf8");

assert.ok(Array.isArray(guide.knockoutFixtures?.rounds), "latest guide includes knockoutFixtures.rounds");
assert.ok(guide.knockoutFixtures.rounds.length >= 2, "knockoutFixtures contains multiple rounds");

const roundOf32 = guide.knockoutFixtures.rounds.find((round) => round.name === "Round of 32");
assert.ok(roundOf32, "knockoutFixtures includes Round of 32");
assert.ok(roundOf32.fixtures.length >= 16, "Round of 32 includes 16 fixtures");
assert.ok(
  roundOf32.fixtures.some((fixture) =>
    fixture.teams.some((team) => team.name === "South Africa") &&
    fixture.teams.some((team) => team.name === "Canada"),
  ),
  "Round of 32 includes South Africa vs Canada",
);

const fixturesIndex = appSource.indexOf("<KnockoutFixtures");
const tomorrowIndex = appSource.indexOf("<TomorrowPreview");

assert.notEqual(fixturesIndex, -1, "App renders KnockoutFixtures");
assert.notEqual(tomorrowIndex, -1, "App renders TomorrowPreview");
assert.ok(fixturesIndex < tomorrowIndex, "KnockoutFixtures renders before TomorrowPreview");

assert.ok(appSource.includes("getFixtureGridRow"), "App positions fixture cards on shared bracket rows");

const styles = await readFile("src/styles.css", "utf8");
assert.ok(styles.includes("grid-auto-rows"), "fixture lists use shared row units for bracket alignment");
