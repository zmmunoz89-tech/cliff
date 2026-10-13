import type { Tone, TropeId } from "@/lib/cliff/types";

export type Trope = {
  id: TropeId;
  name: string;
  heat: number;
  completion: number;
  hotUnlocks: number;
  city: string;
  pitch: string;
  why: string;
  audience: string;
  buyer: string;
  promise: Record<Tone, string>;
  logline: Record<Tone, string>;
  titles: Record<Tone, string>;
  heroineRole: string;
  leadRole: string;
  rivalRole: string;
  allyRole: string;
  heroineWant: string;
  heroineWound: string;
  leadWant: string;
  leadWound: string;
  rivalWant: string;
  allyWant: string;
};

export const TROPES: Trope[] = [
  {
    id: "contract",
    name: "Contract marriage",
    heat: 96,
    completion: 71,
    hotUnlocks: 70000,
    city: "Chicago",
    pitch: "A cruel clause, a late kiss, a marriage someone else already filed.",
    why: "Still the spine of vertical drama. Familiar works if the clause draws blood and the kiss waits.",
    audience: "Women 18–34 who already pay to unlock episode six.",
    buyer: "Coin-unlock apps and the scouts who buy seasons by the dozen.",
    promise: {
      whip: "The contract ends the night either of them falls in love. Someone intends to choose the night.",
      slow: "They can survive a year of photographs. They may not survive a quiet room.",
    },
    logline: {
      whip: "To keep her mother's house, {h} marries {l} for one year in {city}. Love voids the deal — and a second marriage is already on file.",
      slow: "In {city}, {h} agrees to a year of public dates with {l}. The contract is simple until the night she wants to stay.",
    },
    titles: { whip: "Clause Twelve", slow: "The Year She Signed" },
    heroineRole: "Protagonist",
    leadRole: "The husband on paper",
    rivalRole: "The ex who still has a key",
    allyRole: "The associate with the wrong draft",
    heroineWant: "Keep the house in her mother's name without begging her brother.",
    heroineWound: "She has already been the reasonable one in a room that sold her short.",
    leadWant: "A wife the board can see before Thursday's vote.",
    leadWound: "He has never been chosen without a signature attached.",
    rivalWant: "The seat, the name, and the photograph where she used to stand.",
    allyWant: "To stop being the person who only hands over bad paper.",
  },
  {
    id: "heir",
    name: "Hidden heir",
    heat: 93,
    completion: 68,
    hotUnlocks: 64000,
    city: "New York",
    pitch: "She was written out of the will. The will disagrees.",
    why: "Inheritance reveals spike completion because every episode can end on a new name in the document.",
    audience: "Viewers who want status, family war, and a woman walking into a room that owes her.",
    buyer: "Slate buyers who need a 'rich family' title that isn't another copy of last month.",
    promise: {
      whip: "She will take the company. They will call it theft. The paper calls it hers.",
      slow: "She came for a signature. She stays because the building still has her mother's keys.",
    },
    logline: {
      whip: "Disowned at nineteen, {h} walks into a {city} will reading and learns the company is already in her name. Her brother has until Friday to take it back.",
      slow: "{h} returns to {city} for a funeral and finds her name on a company she was told had forgotten her.",
    },
    titles: { whip: "Her Name on the Will", slow: "What They Owed" },
    heroineRole: "The written-out daughter",
    leadRole: "Counsel for the estate",
    rivalRole: "The brother who stayed",
    allyRole: "Her mother's old assistant",
    heroineWant: "To hear, once, that she was not the mistake.",
    heroineWound: "She left the city with one suitcase and a story everyone else got to edit.",
    leadWant: "To execute the will exactly, even if it ruins the family that pays him.",
    leadWound: "He has spent a decade being trusted and never believed.",
    rivalWant: "The company he actually ran while she was gone.",
    allyWant: "To put the letters she was told to burn into the right hands.",
  },
  {
    id: "revenge",
    name: "Divorce revenge",
    heat: 90,
    completion: 69,
    hotUnlocks: 66000,
    city: "Los Angeles",
    pitch: "She signed the divorce smiling. Then she bought his company.",
    why: "Revenge seasons travel because the viewer is waiting for the public scene. Give them one every five episodes.",
    audience: "Anyone who has rehearsed a speech they never got to give.",
    buyer: "Platforms programming a 'she wins' lane next to contract romance.",
    promise: {
      whip: "He will learn the price of the joke he made in the signing room.",
      slow: "She can ruin him. The question is whether she still wants the man underneath.",
    },
    logline: {
      whip: "{h} lets {l} have the divorce and the last word. A week later her fund buys the {city} company he said she could never understand.",
      slow: "After the papers, {h} builds a quiet life in {city} — until {l}'s company lands on her desk as a deal she can kill or keep.",
    },
    titles: { whip: "After the Signature", slow: "The Company She Bought" },
    heroineRole: "The ex-wife with the fund",
    leadRole: "The man who laughed",
    rivalRole: "His new fiancée and head of comms",
    allyRole: "Her analyst",
    heroineWant: "A win he has to watch with other people in the room.",
    heroineWound: "She spent the marriage translating herself into something smaller.",
    leadWant: "To get the company back before the board learns who owns it.",
    leadWound: "He mistakes control for care, and he did it out loud.",
    rivalWant: "The wedding, the narrative, and no ex in the cap table.",
    allyWant: "A bonus, and for {h} not to set herself on fire for a speech.",
  },
  {
    id: "bond",
    name: "Bond romance",
    heat: 88,
    completion: 74,
    hotUnlocks: 80000,
    city: "Seattle",
    pitch: "She smells the bond in an elevator and gets off three floors early.",
    why: "Bond stories still out-retain almost everything else with women under 35. Refusal, not chase, is the fresh cut.",
    audience: "Romance readers who want fate and also want her to have a choice.",
    buyer: "Vertical apps with a paranormal lane that is tired of the same chase.",
    promise: {
      whip: "The bond is real. Consent is the plot. He does not get to skip it.",
      slow: "Fate picked them. She is allowed to be unconvinced.",
    },
    logline: {
      whip: "In a {city} elevator, {h} recognizes {l} as the bond she swore she'd refuse. He lets the doors close when she asks. Someone else wants the bond more than he does.",
      slow: "{h} has one rule in {city}: never follow a bond. {l} is the reason the rule suddenly has a cost.",
    },
    titles: { whip: "Three Floors Early", slow: "What She Refused" },
    heroineRole: "The one who refuses",
    leadRole: "The bond she won't claim",
    rivalRole: "A pack heir who thinks fate is a contract",
    allyRole: "Her roommate, who keeps the salt and the spare key",
    heroineWant: "A life she picked, not one her blood announced.",
    heroineWound: "She watched her mother call a cage a destiny.",
    leadWant: "To be chosen, not owed.",
    leadWound: "Every room he enters has already decided what he is.",
    rivalWant: "The bond transferred, legally or otherwise, before the next moon.",
    allyWant: "Her friend home before midnight, unbitten and unbullied.",
  },
  {
    id: "loop",
    name: "Loop wedding",
    heat: 86,
    completion: 70,
    hotUnlocks: 58000,
    city: "New Orleans",
    pitch: "The night ends at 11:59. She wakes at the rehearsal, wearing the same lipstick.",
    why: "Loops give you a cliffhanger machine: each episode steals one new fact and resets the room.",
    audience: "Mystery-romance viewers who like to feel smarter than the couple for a minute.",
    buyer: "Buyers who want a high-concept hook they can cut a trailer from in one line.",
    promise: {
      whip: "She will find who ends the night. She may not like the hand she was holding.",
      slow: "Every loop she saves him a little sooner, and loses a little more of the truth.",
    },
    logline: {
      whip: "{h} dies at 11:59 on her wedding night in {city} and wakes at the rehearsal. Each loop she steals one fact. {l} is either the suspect or the only person who can leave with her.",
      slow: "The wedding in {city} will not stay finished. {h} keeps waking at the toast, and {l} is the only guest who starts to remember.",
    },
    titles: { whip: "11:59", slow: "Again, the Vows" },
    heroineRole: "The bride in the loop",
    leadRole: "The groom who starts to remember",
    rivalRole: "The best man with the toast",
    allyRole: "The planner who has seen this seating chart before",
    heroineWant: "One morning that is actually tomorrow.",
    heroineWound: "She has been performing the happy version of this family for years.",
    leadWant: "To get her out, even if he is the reason the clock breaks.",
    leadWound: "He said yes to a wedding that solved his father's debt.",
    rivalWant: "The loop closed with him as the widower the family can forgive.",
    allyWant: "To be believed the first time she says the flowers were already dead.",
  },
  {
    id: "ice",
    name: "Ice queen office",
    heat: 82,
    completion: 64,
    hotUnlocks: 48000,
    city: "Manhattan",
    pitch: "She fires people by calendar invite. He accepts, and shows up.",
    why: "Office romance is a reliable second slot on a slate: cheaper to shoot, easy to serialize, weaker unless the power stays with her.",
    audience: "Commute viewers who want competence, a glass office, and one crack in it.",
    buyer: "Brand-safer buyers who won't touch bond or revenge but will take a workplace title.",
    promise: {
      whip: "She will not be softened for him. He will have to survive her actual job.",
      slow: "The invite was a firing. He treats it like a meeting. She lets him talk.",
    },
    logline: {
      whip: "{h}, the {city} CEO who ends people by calendar hold, sends {l} a thirty-minute invite labeled 'exit.' He accepts and brings a counteroffer she didn't know her board had signed.",
      slow: "Everyone in {city} knows {h} doesn't take second meetings. {l} gets one, and uses it to tell her the truth about her own company.",
    },
    titles: { whip: "The Exit Hold", slow: "She Does Not Blink" },
    heroineRole: "The CEO",
    leadRole: "The hire who won't leave",
    rivalRole: "The COO who wants the chair",
    allyRole: "Her assistant, keeper of the real calendar",
    heroineWant: "A company that does not need her to be a rumor.",
    heroineWound: "The first time she was kind in that building, someone filed it as weakness.",
    leadWant: "Ten minutes where she hears the number, not the story about her.",
    leadWound: "He was hired as a weapon and is tired of being aimed.",
    rivalWant: "The vote, while she is busy not blinking.",
    allyWant: "A boss who goes home before the cleaning crew.",
  },
  {
    id: "amnesia",
    name: "Amnesia ring",
    heat: 79,
    completion: 66,
    hotUnlocks: 52000,
    city: "Boston",
    pitch: "He wakes with her ring and no memory. She remembers why she was leaving.",
    why: "Amnesia is a confession machine. She can tell the truth in pieces, and every piece is an episode.",
    audience: "Viewers who want ache more than spectacle, and a secret they can hold over the hero.",
    buyer: "Platforms filling a softer Friday slot that still needs a hard button.",
    promise: {
      whip: "She could rebuild him into the man she wanted. She might tell him who he was instead.",
      slow: "He falls in love with her again. She has to decide if that love belongs to a man who doesn't exist yet.",
    },
    logline: {
      whip: "{l} wakes in a {city} hospital with {h}'s ring and no memory of the night he ended things. She remembers every word. So does the person who was in the car.",
      slow: "In {city}, {h} is asked to reintroduce herself to the man she was an hour from leaving. {l} looks at her like a beginning.",
    },
    titles: { whip: "What the Ring Was For", slow: "He Forgets the Ending" },
    heroineRole: "The one who remembers",
    leadRole: "The man without the night",
    rivalRole: "The colleague who liked the old version of him",
    allyRole: "The nurse who heard the first lie",
    heroineWant: "To stop being the archivist of a relationship he got to forget.",
    heroineWound: "She had the leaving speech perfect, and then the world took the listener.",
    leadWant: "A self he can stand, built from whatever she is willing to hand him.",
    leadWound: "Everyone flinches at a man he has no access to.",
    rivalWant: "The old alliance, before she becomes the author of his new personality.",
    allyWant: "No more visitors who practice their grief in the hallway.",
  },
  {
    id: "harvest",
    name: "Harvest inheritance",
    heat: 76,
    completion: 63,
    hotUnlocks: 36000,
    city: "Sonoma",
    pitch: "A city lawyer inherits a failing vineyard and the vintner who will not sell.",
    why: "October is harvest. Lifestyle buyers want an outdoor season, and the fight over land shoots cheap and looks expensive.",
    audience: "Slightly older than the coin-app core, and willing to pay for a full season if the land feels real.",
    buyer: "Brand and streamer-adjacent desks that won't buy a bond title but will buy a place.",
    promise: {
      whip: "She came to sell. The valley has receipts. So does he.",
      slow: "The vintage is the last good one. Leaving would be easier if the light weren't like this.",
    },
    logline: {
      whip: "{h}, a {city} lawyer in name only when the will is read, inherits a vineyard the bank wants and {l} refuses to leave. Harvest starts Friday. The buyer is already in the drive.",
      slow: "{h} flies in to sign away a {city} valley she never asked for. {l} walks her through the vines and does not once say please.",
    },
    titles: { whip: "Buyer in the Drive", slow: "The Last Good Vintage" },
    heroineRole: "The heir who meant to sell",
    leadRole: "The vintner",
    rivalRole: "The developer with a clean offer",
    allyRole: "The cellar hand who knows which barrels lie",
    heroineWant: "A clean exit and no more family weather.",
    heroineWound: "This valley is where she learned that love can be a job you fail.",
    leadWant: "One more harvest under the old name, not a resort's.",
    leadWound: "He has kept the place alive for people who only visit to price it.",
    rivalWant: "The ridge, the water, and a tasting room by spring.",
    allyWant: "Pay for the crew before the fruit drops.",
  },
];

export function tropeById(id: TropeId): Trope {
  const found = TROPES.find((t) => t.id === id);
  if (!found) throw new Error(`Unknown trope ${id}`);
  return found;
}
