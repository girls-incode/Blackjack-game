import { describe, expect, it, vi } from "vitest";
import {
  ConfigError,
  DeckError,
  DeckFormatError,
  DeckHttpError,
  DeckRequestError,
  InvalidCardError,
} from "../errors";
import { cards, fetchReplying, jsonResponse } from "../testing";
import { HttpDeckSource } from "./deckSource";

const DECK_URL = "https://example.com/deck";
const FILE_URL = "file:///deck";
const INVALID_URL = "not-a-url";
const URL_WITH_CREDENTIALS = "https://user:pw@example.com/deck";
const URL_WITH_QUERY = "https://example.com/deck?token=abc";

const goodDeck = cards("H5,SA");

const getDeck = (fetchFn: typeof fetch, url = DECK_URL) =>
  new HttpDeckSource(url, fetchFn).getDeck();

describe("HttpDeckSource", () => {
  it("rejects non-http URLs", () => {
    expect(() => new HttpDeckSource(FILE_URL)).toThrow(ConfigError);
  });

  it("rejects malformed URLs without echoing them", () => {
    expect(() => new HttpDeckSource(INVALID_URL)).toThrow(ConfigError);
    expect(() => new HttpDeckSource(INVALID_URL)).not.toThrow(/not-a-url/);
  });

  it("returns the deck on success", async () => {
    expect(await getDeck(fetchReplying(jsonResponse(goodDeck)))).toEqual(
      goodDeck,
    );
  });

  it("uses GET with the exact URL", async () => {
    const fetchFn = fetchReplying(jsonResponse(goodDeck));
    await getDeck(fetchFn);
    expect(fetchFn).toHaveBeenCalledWith(
      new URL(DECK_URL),
      expect.objectContaining({
        method: "GET",
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it.each([
    ["a failed request", () => new Error("network down"), DeckRequestError],
    ["an error status", () => jsonResponse({}, 503), DeckHttpError],
    [
      "an invalid card",
      () => jsonResponse([{ suit: "X", value: "1" }]),
      InvalidCardError,
    ],
    ["malformed JSON", () => new Response("<html>"), DeckFormatError],
  ])(
    "fails with a specific DeckError on %s",
    async (_name, reply, ErrorType) => {
      const err = await getDeck(fetchReplying(reply())).catch(
        (e: unknown) => e,
      );
      expect(err).toBeInstanceOf(ErrorType);
      expect(err).toBeInstanceOf(DeckError);
    },
  );

  it("reports a body-reading failure as a request error", async () => {
    const err = await getDeck(
      fetchReplying({
        ok: true,
        json: () => Promise.reject(new Error("body read failed")),
      } as unknown as Response),
    ).catch((e: unknown) => e);

    expect(err).toBeInstanceOf(DeckFormatError);
    expect((err as Error).message).toBe("Deck response was not valid JSON");
  });

  it("rejects URLs with credentials without echoing them", () => {
    expect(() => new HttpDeckSource(URL_WITH_CREDENTIALS)).toThrow(ConfigError);
    expect(() => new HttpDeckSource(URL_WITH_CREDENTIALS)).not.toThrow(/pw/);
  });

  it("keeps the query string out of error messages", async () => {
    const err = await getDeck(
      fetchReplying(jsonResponse({}, 404)),
      URL_WITH_QUERY,
    ).catch((e: Error) => e);
    expect((err as Error).message).toContain("HTTP 404");
    expect((err as Error).message).not.toMatch(/token/);
  });

  it("reports an aborted request as a deck error", async () => {
    const controller = new AbortController();
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockImplementation((ms) => {
        expect(ms).toBe(5000);
        controller.abort();
        return controller.signal;
      });

    const fetchFn = vi.fn(
      (_: string | URL | Request, options?: RequestInit): Promise<Response> => {
        expect(options?.signal).toBe(controller.signal);
        expect(options?.signal?.aborted).toBe(true);
        return Promise.reject(new DOMException("timed out", "TimeoutError"));
      },
    );

    const err = await getDeck(fetchFn).catch((e: unknown) => e);

    expect(timeoutSpy).toHaveBeenCalledWith(5000);
    expect(fetchFn).toHaveBeenCalledOnce();
    expect(err).toBeInstanceOf(DeckRequestError);
    expect((err as Error).message).toMatch(/timed out after 5000 ms/);
    timeoutSpy.mockRestore();
  });
});
