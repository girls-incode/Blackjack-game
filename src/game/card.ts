export const SUITS = ["HEARTS", "CLUBS", "SPADES", "DIAMONDS"] as const;
export const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"] as const;

export type Suit = (typeof SUITS)[number];
export type Value = (typeof VALUES)[number];

export interface Card {
  suit: Suit;
  value: Value;
}

export const BLACKJACK = 21;

export const SUIT_SYMBOLS: Record<Suit, string> = { HEARTS: "H", CLUBS: "C", SPADES: "S", DIAMONDS: "D" };
const FACE_VALUES: ReadonlySet<Value> = new Set<Value>(["J", "Q", "K"]);
const ACE_VALUE = 11;
const FACE_CARD_VALUE = 10;

export const cardValue = (card: Card): number => {
  if (card.value === "A") return ACE_VALUE;
  if (FACE_VALUES.has(card.value)) return FACE_CARD_VALUE;
  return Number(card.value);
};

export const score = (cards: readonly Card[]): number => cards.reduce((sum, c) => sum + cardValue(c), 0);

export const isBust = (cards: readonly Card[]): boolean => score(cards) > BLACKJACK;

/** Blackjack only counts on the initial two-card hand. */
export const isBlackjack = (cards: readonly Card[]): boolean => cards.length === 2 && score(cards) === BLACKJACK;

export const formatCard = (card: Card): string => `${SUIT_SYMBOLS[card.suit]}${card.value}`;

/** Whether `value` has a valid suit and card value; the single definition of a valid card. */
export const isCard = (value: unknown): value is Card => {
  const { suit, value: cardValue } = (value ?? {}) as Record<string, unknown>;
  return SUITS.includes(suit as Suit) && VALUES.includes(cardValue as Value);
};
