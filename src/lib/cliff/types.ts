export type TropeId =
  | "contract"
  | "heir"
  | "revenge"
  | "bond"
  | "loop"
  | "ice"
  | "amnesia"
  | "harvest";

export type Tone = "slow" | "whip";
export type PlanId = "reader" | "room" | "slate";
export type PayModel = "unlock" | "buyout";
export type View = "heat" | "room" | "desk";

export type Episode = {
  n: number;
  slug: string;
  title: string;
  coldOpen: string;
  turn: string;
  button: string;
  beats: string[];
};

export type CastMember = {
  name: string;
  role: string;
  want: string;
  wound: string;
};

export type Series = {
  id: string;
  createdAt: number;
  tropeId: TropeId;
  tone: Tone;
  title: string;
  city: string;
  logline: string;
  promise: string;
  audience: string;
  buyer: string;
  cast: CastMember[];
  episodes: Episode[];
  polished: boolean;
};

export type Assumptions = {
  episodes: number;
  freeEpisodes: number;
  costPerEp: number;
  unlockPrice: number;
  unlocks: number;
  sharePct: number;
  buyoutPerEp: number;
  model: PayModel;
};
