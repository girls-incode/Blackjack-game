import { describe, expect, it } from "vitest";
import { DeckExhaustedError } from "../errors";
import { cards } from "../testing";
import { Deck } from "./deck";

describe("Deck", () => {
  it("draws cards in order", () => {
    const deck = new Deck(cards("H2,S3"));
    expect([deck.draw(), deck.draw()]).toEqual(cards("H2,S3"));
  });
  it("throws when empty", () => {
    expect(() => new Deck([]).draw()).toThrow(DeckExhaustedError);
  });
});
