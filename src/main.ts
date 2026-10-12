import { type DeckSource, HttpDeckSource } from "./deckSource/deckSource";
import { ConfigError, handleError } from "./errors";
import { formatResult } from "./game/format";
import { createStandardBlackjackGame } from "./game/standardBlackjackGame";

const DEFAULT_DECK_URL = "https://sandbox.getunleash.io/blackjack/shuffle";

type RunOptions = {
  fetchFn?: typeof fetch;
  log?: (message: string) => void;
  deckSource?: DeckSource;
};

const resolveDeckUrl = (
  args: readonly string[],
  env: NodeJS.ProcessEnv,
): string => {
  if (args.length > 1) {
    throw new ConfigError("Only one deck URL may be provided");
  }

  return args[0]?.trim() || env.DECK_URL?.trim() || DEFAULT_DECK_URL;
};

export const run = async (
  args = process.argv.slice(2),
  env: NodeJS.ProcessEnv = process.env,
  { fetchFn = fetch, log = console.log, deckSource }: RunOptions = {},
): Promise<void> => {
  const source =
    deckSource ?? new HttpDeckSource(resolveDeckUrl(args, env), fetchFn);
  const deck = await source.getDeck();
  const gameResult = createStandardBlackjackGame().play(deck);
  log(formatResult(gameResult));
};

// Run the CLI only when this module is executed directly, not when imported by tests.
if (import.meta.main) {
  void run().catch((err) => {
    process.exitCode = handleError(err);
  });
}
