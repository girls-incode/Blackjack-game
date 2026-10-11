import { describe, expect, it } from "vitest";
import { cardValue, formatCard, isBlackjack, isBust, isCard, score, SUITS, VALUES } from "./card";
import { cards } from "../testing";

describe("card", () => {
  it("values face cards 10, aces 11, numbers face value", () => {
    expect(score(cards("HJ,CQ,SK"))).toBe(30);
    expect(score(cards("HA,D9"))).toBe(20);
    expect(score(cards("H2,C10"))).toBe(12);
  });
  it("values aces as 11, as required by the blackjack rules", () => {
    expect(score(cards("HA,DA,SK"))).toBe(32);
    expect(score(cards("HA,DA,SA,HK"))).toBe(43);
  });
  it("formats cards", () => {
    expect(formatCard({ suit: "SPADES", value: "7" })).toBe("S7");
    expect(formatCard({ suit: "DIAMONDS", value: "10" })).toBe("D10");
  });
  it("blackjack requires exactly two cards", () => {
    expect(isBlackjack(cards("HA,CK"))).toBe(true);
    expect(isBlackjack(cards("H7,C7,S7"))).toBe(false);
  });
  it("bust is strictly above 21", () => {
    expect(isBust(cards("H7,C7,S7"))).toBe(false);
    expect(isBust(cards("H10,C6,S6"))).toBe(true);
  });
  it("recognises valid cards only", () => {
    expect(isCard({ suit: "HEARTS", value: "10" })).toBe(true);
    expect(isCard({ suit: "STARS", value: "10" })).toBe(false);
    expect(isCard({ suit: "HEARTS", value: "1" })).toBe(false);
    expect(isCard(null)).toBe(false);
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
