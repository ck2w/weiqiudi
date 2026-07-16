export type LinkType = "百科" | "B站" | "视频" | "社区" | "搜索";

export interface SourceLink {
  label: string;
  url: string;
  type: LinkType;
}

export interface PlayerHook {
  title: string;
  detail: string;
  links: SourceLink[];
}

export interface KeyPlayer {
  name: string;
  nameEn?: string;
  persona: string;
  rosterStatus?: "confirmed" | "needs-check";
  shirtNumber?: string;
  position?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageFocus?: string;
  imageStatus?: "licensed" | "placeholder";
  hooks: PlayerHook[];
}

export interface TeamGuide {
  name: string;
  nameEn?: string;
  shortName: string;
  shirtColor: string;
  shirtLabel: string;
  players: KeyPlayer[];
}

export interface PredictionOutcome {
  label: string;
  probability: number;
}

export interface PredictionMarket {
  source: "Polymarket";
  status: "available" | "unavailable";
  asOf: string;
  marketUrl?: string;
  note: string;
  outcomes: PredictionOutcome[];
}

export interface ExpertAnalysisItem {
  title: string;
  analyst: string;
  detail: string;
  links?: SourceLink[];
}

export interface MatchGuide {
  id: string;
  kickoffTime: string;
  homeTeam: TeamGuide;
  awayTeam: TeamGuide;
  oneLiner: string;
  predictionMarket?: PredictionMarket;
  expertAnalysis?: ExpertAnalysisItem[];
  conversationLines: string[];
  dontSay: string;
  sourceLinks: SourceLink[];
}

export interface PreviewMatch {
  id: string;
  kickoffTime: string;
  homeTeam: string;
  awayTeam: string;
  predictionMarket?: PredictionMarket;
}

export interface KnockoutFixtureTeam {
  name: string;
  flag?: string;
  status?: "confirmed" | "tbd";
}

export interface KnockoutFixture {
  id: string;
  matchNumber?: string;
  kickoffTime: string;
  teams: KnockoutFixtureTeam[];
}

export interface KnockoutRound {
  name: string;
  fixtures: KnockoutFixture[];
}

export interface KnockoutFixtures {
  updatedAt: string;
  sourceLabel: string;
  sourceUrl: string;
  rounds: KnockoutRound[];
}

export interface DailyGuide {
  date: string;
  displayDate: string;
  headline: string;
  matches: MatchGuide[];
  knockoutFixtures?: KnockoutFixtures;
  tomorrow: {
    displayDate: string;
    matches: PreviewMatch[];
  };
}
