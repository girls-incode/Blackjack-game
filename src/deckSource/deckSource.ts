import {
  ConfigError,
  DeckError,
  DeckFormatError,
  DeckHttpError,
  DeckRequestError,
} from "../errors";
import type { Card } from "../game/card";
import { parseDeck } from "./deckParser";

/** Where a deck comes from (HTTP, file, fixture). */
export interface DeckSource {
  getDeck(): Promise<Card[]>;
}

const TIMEOUT_MS = 5000;

export class HttpDeckSource implements DeckSource {
  private readonly url: URL;

  constructor(
    url: string,
    private readonly fetchFn = fetch,
  ) {
    // Credentials are rejected (fetch would echo them in its error) and the input is never echoed.
    const parsed = URL.parse(url);
    if (
      !parsed ||
      !/^https?:$/.test(parsed.protocol) ||
      parsed.username ||
      parsed.password
    ) {
      throw new ConfigError(
        "Deck URL must be a valid http(s) URL without credentials",
      );
    }
    this.url = parsed;
  }

  async getDeck(): Promise<Card[]> {
    try {
      const res = await this.fetchFn(this.url, {
        method: "GET",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) {
        throw new DeckHttpError(
          `Deck endpoint returned HTTP ${res.status} ${res.statusText}`,
        );
      }

      let data: unknown;
      try {
        data = await res.json();
      } catch (err) {
        if (err instanceof Error && err.name === "TimeoutError") {
          throw err;
        }
        throw new DeckFormatError("Deck response was not valid JSON", {
          cause: err,
        });
      }

      return parseDeck(data);
    } catch (err) {
      if (err instanceof DeckError) throw err;
      if (err instanceof Error && err.name === "TimeoutError") {
        throw new DeckRequestError(
          `Deck request timed out after ${TIMEOUT_MS} ms`,
          { cause: err },
        );
      }
      const reason = err instanceof Error ? err.message : String(err);
      throw new DeckRequestError(`Deck request failed: ${reason}`, {
        cause: err,
      });
    }
  }
}
