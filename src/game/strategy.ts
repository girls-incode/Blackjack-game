import { score, type Card } from "./card";

/** Decides whether a player takes another card. */
export interface DrawStrategy {
  shouldDraw(hand: readonly Card[], opponentScore: number): boolean;
}

/** Draws until reaching a fixed score. */
export class StandOnScoreStrategy implements DrawStrategy {
  constructor(private readonly standScore: number) {}

  shouldDraw(hand: readonly Card[]): boolean {
    return score(hand) < this.standScore;
  }
}

/** Draws until strictly ahead of the opponent. */
export class BeatOpponentStrategy implements DrawStrategy {
  shouldDraw(hand: readonly Card[], opponentScore: number): boolean {
    return score(hand) <= opponentScore;
  }
}
