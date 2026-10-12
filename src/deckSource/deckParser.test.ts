import { describe, expect, it } from "vitest";
import { DeckFormatError, InvalidCardError } from "../errors";
import { cards } from "../testing";
import { parseDeck } from "./deckParser";

const goodDeck = cards("H5,SA");

describe("parseDeck", () => {
  it("accepts valid cards", () =>
    expect(parseDeck(goodDeck)).toEqual(goodDeck));
  it("rejects non-lists", () => {
    expect(() => parseDeck({})).toThrow(DeckFormatError);
  });
  it("rejects invalid suit or value", () => {
    expect(() => parseDeck([{ suit: "STARS", value: "5" }])).toThrow(
      InvalidCardError,
    );
    expect(() => parseDeck([{ suit: "HEARTS", value: "1" }])).toThrow(
      InvalidCardError,
    );
    expect(() => parseDeck([null])).toThrow(InvalidCardError);
  });
});
