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
  persona: string;
  hooks: PlayerHook[];
}

export interface TeamGuide {
  name: string;
  shortName: string;
  shirtColor: string;
  shirtLabel: string;
  players: KeyPlayer[];
}

export interface MatchGuide {
  id: string;
  kickoffTime: string;
  homeTeam: TeamGuide;
  awayTeam: TeamGuide;
  oneLiner: string;
  conversationLines: string[];
  dontSay: string;
  sourceLinks: SourceLink[];
}

export interface PreviewMatch {
  id: string;
  kickoffTime: string;
  homeTeam: string;
  awayTeam: string;
}

export interface DailyGuide {
  date: string;
  displayDate: string;
  headline: string;
  matches: MatchGuide[];
  tomorrow: {
    displayDate: string;
    matches: PreviewMatch[];
  };
}

