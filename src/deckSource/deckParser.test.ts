import { describe, expect, it } from "vitest";
import { cards } from "../testing";
import { parseDeck } from "./deckParser";

const goodDeck = cards("H5,SA");

describe("parseDeck", () => {
  it("accepts valid cards", () =>
    expect(parseDeck(goodDeck)).toEqual(goodDeck));
  it("rejects non-lists", () =>
    expect(() => parseDeck({})).toThrow(/not a JSON list/));
  it("rejects invalid suit or value", () => {
    expect(() => parseDeck([{ suit: "STARS", value: "5" }])).toThrow(/index 0/);
    expect(() => parseDeck([{ suit: "HEARTS", value: "1" }])).toThrow(
      /index 0/,
    );
    expect(() => parseDeck([null])).toThrow(/index 0/);
  });
});
