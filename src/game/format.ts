import { formatCard, score } from "./card";
import type { GameResult, Participant } from "./game";

const formatParticipant = (p: Participant): string =>
  `${p.name} | ${score(p.cards)} | ${p.cards.map(formatCard).join(",")}`;

export const formatResult = (r: GameResult): string =>
  `Winner: ${r.winner}\n${formatParticipant(r.dealer)}\n${formatParticipant(r.player)}`;
