import { describe, expect, it } from "vitest";
import { formatCard, score } from "./card";
import { createStandardBlackjackGame } from "./standardBlackjackGame";
import { formatResult } from "./format";
import { Game } from "./game";
import { StandOnScoreStrategy } from "./strategy";
import { cards } from "../testing";

const play = (deck: string) => createStandardBlackjackGame().play(cards(deck));

describe("standard game", () => {
  it("dealer wins when both have blackjack", () => {
    expect(play("HA,HK,SA,SQ").winner).toBe("Dealer");
  });
  it("player wins with only blackjack", () => {
    const r = play("HA,HK,S9,S8");
    expect(r.winner).toBe("Ivar");
    expect(r.dealer.cards).toHaveLength(2);
  });
  it("dealer wins with only blackjack", () => {
    expect(play("H9,H8,SA,SQ").winner).toBe("Dealer");
  });
  it("player busts and loses without dealer drawing", () => {
    const r = play("H10,H6,S2,S3,HK");
    expect(r.winner).toBe("Dealer");
    expect(score(r.player.cards)).toBe(26);
    expect(r.dealer.cards).toHaveLength(2);
  });
  it("player stops at 17 or higher", () => {
    expect(play("H10,H7,S2,S3,SK,S9").player.cards).toHaveLength(2);
  });
  it("player draws below 17", () => {
    const r = play("H10,H6,S2,S3,H2,S5,S6,S7");
    expect(r.player.cards.map(formatCard)).toEqual(["H10", "H6", "H2"]);
  });
  it("dealer draws until higher than player and wins", () => {
    const r = play("H10,H9,S2,S3,S4,S5,S6,S7");
    expect(r.dealer.cards.map(formatCard)).toEqual(["S2", "S3", "S4", "S5", "S6"]);
    expect(r.winner).toBe("Dealer");
  });
  it("dealer wins ties by drawing on", () => {
    const r = play("H10,H8,S10,S8,S2");
    expect(r.winner).toBe("Dealer");
    expect(score(r.dealer.cards)).toBe(20);
  });
  it("player wins when dealer busts", () => {
    const r = play("H10,H7,S10,S6,SK");
    expect(r.winner).toBe("Ivar");
    expect(score(r.dealer.cards)).toBe(26);
  });
  it("throws if the deck runs out", () => {
    expect(() => play("H2,H3,S2")).toThrow(/Deck ran out/);
  });
  it("throws if the deck is empty", () => {
    expect(() => createStandardBlackjackGame().play([])).toThrow(/Deck ran out/);
  });
  it("can finish with the minimum four-card deck", () => {
    const r = play("HA,HK,S9,S8");
    expect(r.winner).toBe("Ivar");
    expect(r.player.cards).toHaveLength(2);
    expect(r.dealer.cards).toHaveLength(2);
  });
  it("does not mutate the input deck", () => {
    const deck = cards("H10,H7,S10,S6,SK");
    createStandardBlackjackGame().play(deck);
    expect(deck).toHaveLength(5);
  });
  it("can play multiple rounds with the same game instance", () => {
    const game = createStandardBlackjackGame();
    expect(game.play(cards("HA,HK,S9,S8")).winner).toBe("Ivar");
    expect(game.play(cards("H9,H8,SA,SQ")).winner).toBe("Dealer");
  });
});

describe("Game with custom players", () => {
  it("uses the injected names and strategies", () => {
    const stand = new StandOnScoreStrategy(0);
    const r = new Game({ name: "Bob", strategy: stand }, { name: "House", strategy: stand }).play(cards("H10,H5,S10,S6"));
    expect(r.winner).toBe("House");
    expect(r.player.name).toBe("Bob");
    expect(r.player.cards).toHaveLength(2);
  });
});

describe("formatResult", () => {
  it("matches the required output format", () => {
    const r = play("H10,H7,S10,S6,SK");
    expect(formatResult(r)).toBe("Winner: Ivar\nDealer | 26 | S10,S6,SK\nIvar | 17 | H10,H7");
  });
});
