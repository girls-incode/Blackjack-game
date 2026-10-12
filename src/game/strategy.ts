import { type Card, score } from "./card";

/** Defines how a participant decides whether to draw another card. */
export interface CardDrawStrategy {
  shouldDraw(currentHand: readonly Card[], opponentScore: number): boolean;
}

/**
 * Draws while the current hand is below a target score.
 * The standard Player uses a target of 17, so it stops at 17 or higher.
 */
export class StandOnScoreStrategy implements CardDrawStrategy {
  constructor(private readonly standScore: number) {}

  shouldDraw(currentHand: readonly Card[]): boolean {
    return score(currentHand) < this.standScore;
  }
}

/**
 * Draws while the current hand is tied with or behind the opponent.
 * The standard Dealer therefore stops only after exceeding the Player's score.
 */
export class BeatOpponentStrategy implements CardDrawStrategy {
  shouldDraw(currentHand: readonly Card[], opponentScore: number): boolean {
    return score(currentHand) <= opponentScore;
  }
}
