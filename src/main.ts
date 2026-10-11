import { createStandardBlackjackGame } from "./game/standardBlackjackGame";
import { HttpDeckSource, type DeckSource } from "./deckSource/deckSource";
import { handleError } from "./errors";
import { formatResult } from "./game/format";
import { pathToFileURL } from "node:url";

const DEFAULT_DECK_URL = "https://sandbox.getunleash.io/blackjack/shuffle";

export const run = async (
  args = process.argv.slice(2),
  env: NodeJS.ProcessEnv = process.env,
  fetchFn: typeof fetch = fetch,
): Promise<void> => {
  const url = args[0] || env.DECK_URL || DEFAULT_DECK_URL;

  const source: DeckSource = new HttpDeckSource(url, fetchFn);
  const deck = await source.getDeck();
  const gameResult = createStandardBlackjackGame().play(deck);
  console.log(formatResult(gameResult));
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((err) => {
    process.exitCode = handleError(err);
  });
}
