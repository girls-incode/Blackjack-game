import type { Card } from "./card";
import { GameError } from "../errors";

/** Draws cards in order from a fixed list without mutating it. */
export class Deck {
  private next = 0;

  constructor(private readonly cards: readonly Card[]) {}

  draw(): Card {
    const card = this.cards[this.next];
    if (!card) throw new GameError("Deck ran out of cards");
    this.next++;
    return card;
  }
}
