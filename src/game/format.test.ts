import { describe, expect, it } from "vitest";
import { cards } from "../testing";
import { formatResult } from "./format";
import { createStandardBlackjackGame } from "./standardBlackjackGame";

describe("formatResult", () => {
  it("prints the required round output", () => {
    const result = createStandardBlackjackGame().play(
      cards("H10,H7,S10,S6,SK"),
    );

    expect(formatResult(result)).toBe(
      "Winner: Player\nDealer | 26 | S10,S6,SK\nPlayer | 17 | H10,H7",
    );
  });
});
