import { describe, expect, it } from "vitest";
import { cardValue, formatCard, isBlackjack, isBust, isCard, score, SUITS, VALUES, type Card } from "./card";
import { cards } from "../testing";

const formatCases: readonly [Card, string][] = [
  [{ suit: "SPADES", value: "7" }, "S7"],
  [{ suit: "DIAMONDS", value: "10" }, "D10"],
];

describe("card", () => {
  it.each([
    ["face cards", "HJ,CQ,SK", 30],
    ["aces", "HA,D9", 20],
    ["number cards", "H2,C10", 12],
    ["multiple aces", "HA,DA,SK", 32],
    ["multiple aces and a face card", "HA,DA,SA,HK", 43],
  ])("scores %s correctly", (_description, hand, expected) => {
    expect(score(cards(hand))).toBe(expected);
  });
  it.each(formatCases)("formats %j as %s", (card, expected) => {
    expect(formatCard(card)).toBe(expected);
  });
  it("blackjack requires exactly two cards", () => {
    expect(isBlackjack(cards("HA,CK"))).toBe(true);
    expect(isBlackjack(cards("H7,C7,S7"))).toBe(false);
  });
  it("bust is strictly above 21", () => {
    expect(isBust(cards("H7,C7,S7"))).toBe(false);
    expect(isBust(cards("H10,C6,S6"))).toBe(true);
  });
  it.each([
    [{ suit: "HEARTS", value: "10" }, true],
    [{ suit: "STARS", value: "10" }, false],
    [{ suit: "HEARTS", value: "1" }, false],
    [null, false],
  ])("recognises %j as %s", (value, expected) => {
    expect(isCard(value)).toBe(expected);
  });
  it("recognises and values every suit/value combination", () => {
    const expectedValues: Record<string, number> = { J: 10, Q: 10, K: 10, A: 11 };

    for (const suit of SUITS) {
      for (const value of VALUES) {
        const card = { suit, value };
        expect(isCard(card)).toBe(true);
        expect(cardValue(card)).toBe(expectedValues[value] ?? Number(value));
      }
    }
  });
});
