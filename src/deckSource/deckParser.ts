import { isCard, type Card } from "../game/card";
import { DeckError } from "../errors";

/** Validates untrusted JSON and returns it as cards, keeping only the suit and value of each. */
export const parseDeck = (data: unknown): Card[] => {
  if (!Array.isArray(data)) throw new DeckError("Deck response is not a JSON list");
  return data.map((item, i) => {
    if (!isCard(item)) throw new DeckError(`Invalid card at index ${i}: ${JSON.stringify(item)}`);
    return { suit: item.suit, value: item.value };
  });
};
