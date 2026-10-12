import { describe, expect, it } from "vitest";
import { cards } from "../testing";
import {
  type Card,
  cardValue,
  formatCard,
  isBlackjack,
  isBust,
  isCard,
  SUITS,
  score,
  VALUES,
} from "./card";

const formatCases: readonly [Card, string][] = [
  [{ suit: "SPADES", value: "7" }, "S7"],
  [{ suit: "DIAMONDS", value: "10" }, "D10"],
];
const rankValues: Record<(typeof VALUES)[number], number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 10,
  Q: 10,
  K: 10,
  A: 11,
};

describe("card", () => {
  it.each([
    ["number cards", "H2,C10", 12],
    ["face cards", "HJ,CQ,SK", 30],
    ["an ace as 11", "HA,D9", 20],
    ["multiple aces as 11 each", "HA,DA,SK", 32],
    ["three aces as 11 each", "HA,DA,SA,HK", 43],
  ])("scores %s", (_description, hand, expected) => {
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
  it("recognises every valid suit/value combination", () => {
    for (const suit of SUITS) {
      for (const value of VALUES) {
        expect(isCard({ suit, value })).toBe(true);
      }
    }
  });
  it("gives every rank its required value", () => {
    for (const value of VALUES) {
      expect(cardValue({ suit: "HEARTS", value })).toBe(rankValues[value]);
    }
  });
});
