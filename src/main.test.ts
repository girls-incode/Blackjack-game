import { describe, expect, it, vi } from "vitest";
import { run } from "./main";
import { cards, fetchReplying, jsonResponse } from "./testing";

describe("main", () => {
  it("runs the game end to end and prints the result", async () => {
    const log = vi.fn();
    const fetchFn = fetchReplying(jsonResponse(cards("H10,H7,S10,S6,SK")));

    await run([" https://example.com/deck "], {}, { fetchFn, log });

    expect(fetchFn).toHaveBeenCalledWith(
      new URL("https://example.com/deck"),
      expect.objectContaining({ method: "GET" }),
    );
    expect(log).toHaveBeenCalledWith(
      "Winner: Player\nDealer | 26 | S10,S6,SK\nPlayer | 17 | H10,H7",
    );
  });

  it("defaults to the sandbox shuffle endpoint when no URL is given", async () => {
    const log = vi.fn();
    const fetchFn = fetchReplying(jsonResponse(cards("HA,HK,S9,S8")));

    await run([], { DECK_URL: "  " }, { fetchFn, log });

    expect(fetchFn).toHaveBeenCalledWith(
      new URL("https://sandbox.getunleash.io/blackjack/shuffle"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("uses DECK_URL when no command-line URL is given", async () => {
    const log = vi.fn();
    const deckUrl = "https://example.com/from-env";
    const fetchFn = fetchReplying(jsonResponse(cards("HA,HK,S9,S8")));

    await run([], { DECK_URL: `  ${deckUrl}  ` }, { fetchFn, log });

    expect(fetchFn).toHaveBeenCalledWith(
      new URL(deckUrl),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("rejects more than one command-line URL", async () => {
    await expect(
      run(["https://example.com/one", "https://example.com/two"]),
    ).rejects.toThrow("Only one deck URL may be provided");
  });
});
