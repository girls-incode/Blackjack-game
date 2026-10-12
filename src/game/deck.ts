import { DeckExhaustedError } from "../errors";
import type { Card } from "./card";

/** Provides cards in draw order without modifying the original list. */
export class Deck {
  private nextIndex = 0;

  constructor(private readonly deckCards: readonly Card[]) {}

  draw(): Card {
    if (this.nextIndex >= this.deckCards.length) {
      throw new DeckExhaustedError(
        "Deck ran out of cards before the round finished",
      );
    }

    return this.deckCards[this.nextIndex++];
  }
}
