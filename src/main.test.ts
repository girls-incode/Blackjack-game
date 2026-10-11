import { describe, expect, it, vi } from "vitest";
import { run } from "./main";
import { cards, fetchReplying, jsonResponse } from "./testing";

describe("main", () => {
  it("runs the game end to end and prints the result", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const fetchFn = fetchReplying(jsonResponse(cards("H10,H7,S10,S6,SK")));

    await run(["https://example.com/deck"], {}, fetchFn);

    expect(fetchFn).toHaveBeenCalledWith(
      new URL("https://example.com/deck"),
      expect.objectContaining({ method: "GET" }),
    );
    expect(log).toHaveBeenCalledWith("Winner: Ivar\nDealer | 26 | S10,S6,SK\nIvar | 17 | H10,H7");
    log.mockRestore();
  });

  it("defaults to the sandbox shuffle endpoint when no URL is given", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const fetchFn = fetchReplying(jsonResponse(cards("HA,HK,S9,S8")));

    await run([], {}, fetchFn);

    expect(fetchFn).toHaveBeenCalledWith(
      new URL("https://sandbox.getunleash.io/blackjack/shuffle"),
      expect.objectContaining({ method: "GET" }),
    );
    log.mockRestore();
  });

  it("uses DECK_URL when no command-line URL is given", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const deckUrl = "https://example.com/from-env";
    const fetchFn = fetchReplying(jsonResponse(cards("HA,HK,S9,S8")));

    await run([], { DECK_URL: deckUrl }, fetchFn);

    expect(fetchFn).toHaveBeenCalledWith(
      new URL(deckUrl),
      expect.objectContaining({ method: "GET" }),
    );
    log.mockRestore();
  });
});
