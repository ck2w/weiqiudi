import dailyGuideData from "../content/published/2026-06-14.json";
import type {
  DailyGuide,
  KeyPlayer,
  MatchGuide,
  PreviewMatch,
  SourceLink,
  TeamGuide,
} from "./types";

const dailyGuide = dailyGuideData as DailyGuide;

function App() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <div className="title-card">
          <p className="eyebrow">世界杯伪球迷急救包</p>
          <h1>今晚装懂小抄</h1>
          <p>{dailyGuide.headline}</p>
        </div>
        <div className="today-stamp">
          <span>{dailyGuide.displayDate}</span>
          <strong>{dailyGuide.matches.length} 场</strong>
        </div>
      </header>

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
    </main>
  );
}

function MatchCard({ match }: { match: MatchGuide }) {
  const sharePath = `#${match.id}`;

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
        <p>{match.oneLiner}</p>
      </section>

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
      <h3>{player.name}</h3>
      <p className="persona">人设：{player.persona}</p>
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
            <span>
              {match.homeTeam} vs {match.awayTeam}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;
