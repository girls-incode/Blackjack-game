import { formatCard, score } from "./card";
import type { GameResult, PlayerState } from "./game";

const formatPlayerState = (state: PlayerState): string =>
  `${state.name} | ${score(state.cards)} | ${state.cards.map(formatCard).join(",")}`;

export const formatResult = (r: GameResult): string =>
  `Winner: ${r.winner}\n${formatPlayerState(r.dealer)}\n${formatPlayerState(r.player)}`;
