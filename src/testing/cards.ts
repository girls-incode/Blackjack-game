import { type Card, isCard, SUIT_SYMBOLS, type Suit } from "../game/card";

// "H" -> "HEARTS", built from the app's own suit symbols so the two never drift apart.
const SUIT_BY_SYMBOL = Object.fromEntries(
  Object.entries(SUIT_SYMBOLS).map(([suit, symbol]) => [symbol, suit as Suit]),
);

/**
 * Builds cards from shorthand, e.g. "S7,HK" (same notation as the output format).
 * Each token is a suit letter followed by the value: "S7" -> { suit: "SPADES", value: "7" }.
 * Throws on an unknown suit or value, so typos in tests fail loudly.
 */
export const cards = (s: string): Card[] =>
  s.split(",").map((token) => {
    const card = { suit: SUIT_BY_SYMBOL[token[0]], value: token.slice(1) }; // first character is the suit letter
    if (!isCard(card)) throw new Error(`Invalid card token: ${token}`);
    return card;
  });
