import type { Card } from "../game/card";
import { parseDeck } from "./deckParser";
import { ConfigError, DeckError } from "../errors";

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
    if (!parsed || !/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password) {
      throw new ConfigError("Deck URL must be a valid http(s) URL without credentials");
    }
    this.url = parsed;
  }

  async getDeck(): Promise<Card[]> {
    const shownUrl = this.url.origin + this.url.pathname; // no credentials or query string in messages
    try {
      const res = await this.fetchFn(this.url, { method: "GET", signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) throw new DeckError(`GET ${shownUrl} failed: ${res.status} ${res.statusText}`);
      return parseDeck(await res.json());
    } catch (err) {
      if (err instanceof DeckError) throw err;
      const reason = err instanceof Error ? err.message : String(err);
      throw new DeckError(`Failed to fetch deck from ${shownUrl}: ${reason}`, { cause: err });
    }
  }
}
