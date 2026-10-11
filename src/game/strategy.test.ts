import { describe, expect, it } from "vitest";
import { BeatOpponentStrategy, StandOnScoreStrategy } from "./strategy";
import { cards } from "../testing";

describe("StandOnScoreStrategy", () => {
  const strategy = new StandOnScoreStrategy(17);
  it.each([
    ["draws below the stand score", "H10,H6", true],
    ["stands at the stand score", "H10,H7", false],
  ])("%s", (_description, hand, shouldDraw) => {
    expect(strategy.shouldDraw(cards(hand))).toBe(shouldDraw);
  });
});

describe("BeatOpponentStrategy", () => {
  const strategy = new BeatOpponentStrategy();
  it.each([
    ["behind", "H10,H8", 19, true],
    ["tied", "H10,H9", 19, true],
    ["ahead", "H10,H9", 18, false],
  ])("%s the opponent", (_description, hand, opponentScore, shouldDraw) => {
    expect(strategy.shouldDraw(cards(hand), opponentScore)).toBe(shouldDraw);
  });
});
