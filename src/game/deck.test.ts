import { describe, expect, it } from "vitest";
import { Deck } from "./deck";
import { GameError } from "../errors";
import { cards } from "../testing";

describe("Deck", () => {
  it("draws cards in order", () => {
    const deck = new Deck(cards("H2,S3"));
    expect([deck.draw(), deck.draw()]).toEqual(cards("H2,S3"));
  });
  it("throws when empty", () => {
    expect(() => new Deck([]).draw()).toThrow(GameError);
  });
});
