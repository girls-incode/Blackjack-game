import { describe, expect, it } from "vitest";
import { BeatOpponentStrategy, StandOnScoreStrategy } from "./strategy";
import { cards } from "../testing";

describe("StandOnScoreStrategy", () => {
  const strategy = new StandOnScoreStrategy(17);
  it("draws below the stand score", () => expect(strategy.shouldDraw(cards("H10,H6"))).toBe(true));
  it("stands at the stand score", () => expect(strategy.shouldDraw(cards("H10,H7"))).toBe(false));
});

describe("BeatOpponentStrategy", () => {
  const strategy = new BeatOpponentStrategy();
  it("draws when behind or tied", () => {
    expect(strategy.shouldDraw(cards("H10,H8"), 19)).toBe(true);
    expect(strategy.shouldDraw(cards("H10,H9"), 19)).toBe(true);
  });
  it("stands when ahead", () => expect(strategy.shouldDraw(cards("H10,H9"), 18)).toBe(false));
});
