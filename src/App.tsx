import { useState } from "react";
import guide20260614Data from "../content/published/2026-06-14.json";
import guide20260615Data from "../content/published/2026-06-15.json";
import guide20260616Data from "../content/published/2026-06-16.json";
import guide20260617Data from "../content/published/2026-06-17.json";
import guide20260618Data from "../content/published/2026-06-18.json";
import type {
  DailyGuide,
  KeyPlayer,
  MatchGuide,
  PredictionMarket,
  PreviewMatch,
  SourceLink,
  TeamGuide,
} from "./types";

const publishedGuides = [
  guide20260614Data,
  guide20260615Data,
  guide20260616Data,
  guide20260617Data,
  guide20260618Data,
] as DailyGuide[];

const guidesByDate = new Map(publishedGuides.map((guide) => [guide.date, guide]));
const latestGuide = publishedGuides[publishedGuides.length - 1];

function getDateFromPath() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return /^\d{4}-\d{2}-\d{2}$/.test(path) ? path : null;
}

function App() {
  const requestedDate = getDateFromPath();
  const dailyGuide = requestedDate ? guidesByDate.get(requestedDate) ?? latestGuide : latestGuide;
  const missingDate = requestedDate && !guidesByDate.has(requestedDate) ? requestedDate : null;

  return (
    <main className="page-shell">
      <header className="site-header">
        <div className="title-card">
          <p className="eyebrow">今晚装懂小抄</p>
          <h1>伪球帝</h1>
          <p>{dailyGuide.headline}</p>
        </div>
        <div className="today-stamp">
          <span>{dailyGuide.displayDate}</span>
          <strong>{dailyGuide.matches.length} 场</strong>
        </div>
      </header>

      {missingDate ? <MissingDateNotice date={missingDate} latestDate={latestGuide.displayDate} /> : null}

      {dailyGuide.matches.length > 0 ? (
        <section className="match-list" aria-label="今日比赛小抄">
          {dailyGuide.matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </section>
      ) : (
        <NoMatchesCard />
      )}

      <TomorrowPreview
        displayDate={dailyGuide.tomorrow.displayDate}
        matches={dailyGuide.tomorrow.matches}
      />

      <HistoryNav currentDate={dailyGuide.date} guides={publishedGuides} />

      <footer className="site-footer">
        <span>作者</span>
        <strong>CK</strong>
      </footer>
    </main>
  );
}

function MissingDateNotice({ date, latestDate }: { date: string; latestDate: string }) {
  return (
    <section className="notice-card" aria-label="日期未找到">
      <strong>{date} 还没有小抄</strong>
      <span>先给你看最新一期：{latestDate}</span>
    </section>
  );
}

function MatchCard({ match }: { match: MatchGuide }) {
  const sharePath = `#${match.id}`;
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopyOneLiner() {
    const didCopy = await copyTextToClipboard(match.oneLiner);
    setCopyState(didCopy ? "copied" : "failed");
    window.setTimeout(() => setCopyState("idle"), 1500);
  }

  return (
    <article className="match-card" id={match.id}>
      <div className="match-card__bar">
        <div>
          <p className="label">今日小抄</p>
          <h2>
            {match.homeTeam.shortName} vs {match.awayTeam.shortName}
          </h2>
        </div>
        <div className="kickoff">{match.kickoffTime}</div>
      </div>

      <div className="shirt-row" aria-label="球衣颜色">
        <ShirtBadge team={match.homeTeam} />
        <ShirtBadge team={match.awayTeam} />
      </div>

      <section className="one-liner">
        <span>一句话装懂</span>
        <p>
          {match.oneLiner}
          <button
            className="copy-one-liner"
            type="button"
            onClick={handleCopyOneLiner}
            aria-label={`复制${match.homeTeam.shortName}对${match.awayTeam.shortName}的一句话装懂`}
          >
            {copyState === "copied" ? "已复制" : copyState === "failed" ? "复制失败" : "复制"}
          </button>
        </p>
      </section>

      {match.predictionMarket ? (
        <PredictionMarketCard predictionMarket={match.predictionMarket} />
      ) : null}

      <div className="match-grid">
        <section className="talk-card">
          <div className="sticker sticker--pink">开口就能说</div>
          <ul>
            {match.conversationLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <TeamPanel team={match.homeTeam} />
        <TeamPanel team={match.awayTeam} />
      </div>

      <section className="warning-card">
        <span>别尬聊</span>
        <p>{match.dontSay}</p>
      </section>

      <footer className="match-footer">
        <SourceLinks links={match.sourceLinks} />
        <a className="share-link" href={sharePath}>
          分享这场
        </a>
      </footer>
    </article>
  );
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back below for browsers that expose Clipboard API but block it.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
}

function PredictionMarketCard({
  predictionMarket,
}: {
  predictionMarket: PredictionMarket;
}) {
  const summary =
    predictionMarket.status === "available"
      ? formatPredictionSummary(predictionMarket)
      : "暂无单场市场，不硬编";

  return (
    <section className="prediction-card">
      <span className="prediction-label">Polymarket</span>
      <strong>{summary}</strong>
      <span className="prediction-note">仅供看热度</span>
      {predictionMarket.marketUrl ? (
        <a href={predictionMarket.marketUrl} target="_blank" rel="noreferrer">
          看市场
        </a>
      ) : null}
    </section>
  );
}

function formatPredictionSummary(predictionMarket: PredictionMarket) {
  return predictionMarket.outcomes
    .map((outcome) => `${outcome.label} ${formatProbability(outcome.probability)}`)
    .join("｜");
}

function formatProbability(probability: number) {
  return `${Number.isInteger(probability) ? probability : probability.toFixed(1)}%`;
}

function NoMatchesCard() {
  return (
    <section className="empty-card" aria-label="今日无比赛">
      <div className="sticker sticker--pink">今天休息</div>
      <h2>今天没有需要装懂的世界杯比赛</h2>
      <p>
        可以先看明天预告。等有比赛的日期，页面会自动切回每场一张小抄。
      </p>
    </section>
  );
}

function ShirtBadge({ team }: { team: TeamGuide }) {
  return (
    <div className="shirt-badge">
      <span
        className="shirt-swatch"
        style={{ backgroundColor: team.shirtColor }}
        aria-hidden="true"
      />
      <span>
        {team.shortName} · {team.shirtLabel}
      </span>
    </div>
  );
}

function TeamPanel({ team }: { team: TeamGuide }) {
  return (
    <section className="team-panel">
      <div className="sticker sticker--blue">{team.shortName}看谁</div>
      {team.nameEn ? <span className="name-en team-name-en">{team.nameEn}</span> : null}
      <div className="player-list">
        {team.players.map((player) => (
          <PlayerCard key={player.name} player={player} />
        ))}
      </div>
    </section>
  );
}

function PlayerCard({ player }: { player: KeyPlayer }) {
  return (
    <article className="player-card">
      <div className="player-identity">
        <PlayerPhoto player={player} />
        <div className="player-copy">
          <div className="player-heading">
            <div>
              <h3>{player.name}</h3>
              {player.nameEn ? <span className="name-en">{player.nameEn}</span> : null}
            </div>
            {player.position ? <span className="position-pill">{player.position}</span> : null}
            {player.rosterStatus === "needs-check" ? (
              <span className="roster-pill">大名单待核验</span>
            ) : null}
          </div>
          <p className="persona">人设：{player.persona}</p>
        </div>
      </div>
      <div className="hook-list">
        {player.hooks.map((hook) => (
          <div className="hook" key={`${player.name}-${hook.title}`}>
            <strong>{hook.title}</strong>
            <p>{hook.detail}</p>
            <SourceLinks links={hook.links} compact />
          </div>
        ))}
      </div>
    </article>
  );
}

function PlayerPhoto({ player }: { player: KeyPlayer }) {
  const number = player.shirtNumber ?? "待确认";
  const initials = player.name.slice(0, 1);

  return (
    <div className="player-photo-wrap">
      <div className="number-badge">#{number}</div>
      {player.imageStatus === "licensed" && player.imageUrl ? (
        <img
          className="player-photo"
          src={player.imageUrl}
          alt={player.imageAlt ?? player.name}
          loading="lazy"
          style={{ objectPosition: player.imageFocus ?? "50% 20%" }}
        />
      ) : (
        <div className="player-photo player-photo--placeholder" aria-label={`${player.name} 占位头像`}>
          {initials}
        </div>
      )}
    </div>
  );
}

function SourceLinks({
  links,
  compact = false,
}: {
  links: SourceLink[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "source-links source-links--compact" : "source-links"}>
      {links.map((link) => (
        <a key={`${link.type}-${link.url}`} href={link.url} target="_blank" rel="noreferrer">
          <span>{link.type}</span>
          {link.label}
        </a>
      ))}
    </div>
  );
}

function HistoryNav({
  currentDate,
  guides,
}: {
  currentDate: string;
  guides: DailyGuide[];
}) {
  return (
    <nav className="history-card" aria-label="历史小抄">
      <div>
        <p className="label">历史小抄</p>
        <h2>往期入口</h2>
      </div>
      <div className="history-links">
        {[...guides].reverse().map((guide, index) => (
          <a
            key={guide.date}
            className={guide.date === currentDate ? "history-link history-link--active" : "history-link"}
            href={`/${guide.date}`}
            aria-current={guide.date === currentDate ? "page" : undefined}
          >
            <strong>{guide.displayDate}</strong>
            <span>{index === 0 ? "最新" : `${guide.matches.length} 场`}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function TomorrowPreview({
  displayDate,
  matches,
}: {
  displayDate: string;
  matches: PreviewMatch[];
}) {
  return (
    <section className="tomorrow-card">
      <div>
        <p className="label">明天预告</p>
        <h2>{displayDate}</h2>
      </div>
      <div className="preview-list">
        {matches.map((match) => (
          <div className="preview-match" key={match.id}>
            <strong>{match.kickoffTime}</strong>
            <span className="preview-copy">
              <span className="preview-teams">
                {match.homeTeam} vs {match.awayTeam}
              </span>
              {match.predictionMarket ? (
                <span className="preview-odds">
                  Polymarket：
                  {match.predictionMarket.status === "available"
                    ? formatPredictionSummary(match.predictionMarket)
                    : "暂无单场市场"}
                </span>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;
