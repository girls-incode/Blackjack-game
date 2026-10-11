import { isBlackjack, isBust, score, type Card } from "./card";
import { Deck } from "./deck";
import type { DrawStrategy } from "./strategy";

/** Who takes part in a game: a name plus the rule that decides when they draw. */
export interface Player {
  name: string;
  strategy: DrawStrategy;
}

/** A player's hand during and after a game. */
export interface Participant {
  name: string;
  cards: Card[];
}

/** Outcome of a game: the winner's name and both final hands. */
export interface GameResult {
  winner: string;
  dealer: Participant;
  player: Participant;
}

/**
 * Plays one round of blackjack between a player and a dealer.
 *
 * The class only knows the rules of a round (dealing, blackjack, bust, who wins).
 * *When* each side draws is decided by the `DrawStrategy` of its `Player`,
 * so draw rules can change without touching this class.
 */
export class Game {
  constructor(
    private readonly player: Player,
    private readonly dealer: Player,
  ) {}

  /**
   * Plays a round using `cards` as the deck, drawn in order from the first card.
   *
   * 1. The player and then the dealer are dealt two cards each.
   * 2. If either has blackjack (21 with two cards) the round ends: the dealer wins
   *    if it has one (including when both do), otherwise the player wins.
   * 3. The player draws according to their strategy. If they bust, the dealer wins.
   * 4. The dealer draws according to their strategy. If the dealer busts, the player
   *    wins; otherwise the dealer wins.
   *
   * @throws if the deck runs out of cards before the round ends.
   */
  play(cards: readonly Card[]): GameResult {
    const deck = new Deck(cards);
    const player = this.deal(this.player.name, deck);
    const dealer = this.deal(this.dealer.name, deck);
    const result = (winner: Participant): GameResult => ({ winner: winner.name, dealer, player });

    // Dealer wins when both have blackjack.
    if (isBlackjack(dealer.cards)) return result(dealer);
    if (isBlackjack(player.cards)) return result(player);

    this.drawUntilDone(player, this.player.strategy, score(dealer.cards), deck);
    if (isBust(player.cards)) return result(dealer);

    this.drawUntilDone(dealer, this.dealer.strategy, score(player.cards), deck);
    return result(isBust(dealer.cards) ? player : dealer);
  }

  /** Deals the opening two cards. */
  private deal(name: string, deck: Deck): Participant {
    return { name, cards: [deck.draw(), deck.draw()] };
  }

  /** Gives `who` cards from the deck until their strategy says stop or they bust. */
  private drawUntilDone(who: Participant, strategy: DrawStrategy, opponentScore: number, deck: Deck): void {
    while (!isBust(who.cards) && strategy.shouldDraw(who.cards, opponentScore)) {
      who.cards.push(deck.draw());
    }
  }
}
