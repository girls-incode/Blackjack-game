import { DeckExhaustedError } from "../errors";
import type { Card } from "./card";

/** Draws cards in order from a fixed list without mutating it. */
export class Deck {
  private next = 0;

  constructor(private readonly cards: readonly Card[]) {}

  draw(): Card {
    const card = this.cards[this.next];
    if (!card) {
      throw new DeckExhaustedError(
        "Deck ran out of cards before the round finished",
      );
    }
    this.next++;
    return card;
  }
}
