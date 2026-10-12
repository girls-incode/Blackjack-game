import { type Card, isBlackjack, isBust, score } from "./card";
import { Deck } from "./deck";
import type { CardDrawStrategy } from "./strategy";

/** Defines a player's name and card-drawing strategy for a game. */
export interface PlayerConfig {
  name: string;
  strategy: CardDrawStrategy;
}

/** Stores a player's name and cards during and after a round. */
export interface PlayerState {
  name: string;
  cards: Card[];
}

/** Outcome of a game: the winner's name and both final hands. */
export interface GameResult {
  winner: string;
  dealer: PlayerState;
  player: PlayerState;
}

/**
 * Plays one round of blackjack between a player and a dealer.
 *
 * The class only knows the rules of a round (dealing, blackjack, bust, who wins).
 * *When* each side draws is decided by the `CardDrawStrategy` in its `PlayerConfig`,
 * so draw rules can change without touching this class.
 */
export class Game {
  constructor(
    private readonly playerConfig: PlayerConfig,
    private readonly dealerConfig: PlayerConfig,
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
    const playerState = this.deal(this.playerConfig.name, deck);
    const dealerState = this.deal(this.dealerConfig.name, deck);
    const result = (winner: PlayerState): GameResult => ({
      winner: winner.name,
      dealer: dealerState,
      player: playerState,
    });

    // Dealer wins when both have blackjack.
    if (isBlackjack(dealerState.cards)) return result(dealerState);
    if (isBlackjack(playerState.cards)) return result(playerState);

    this.drawUntilDone(
      playerState,
      this.playerConfig,
      score(dealerState.cards),
      deck,
    );
    if (isBust(playerState.cards)) return result(dealerState);

    this.drawUntilDone(
      dealerState,
      this.dealerConfig,
      score(playerState.cards),
      deck,
    );
    return result(isBust(dealerState.cards) ? playerState : dealerState);
  }

  /** Deals the opening two cards. */
  private deal(name: string, deck: Deck): PlayerState {
    return { name, cards: [deck.draw(), deck.draw()] };
  }

  /** Gives the player cards until their strategy says stop or they bust. */
  private drawUntilDone(
    state: PlayerState,
    config: PlayerConfig,
    opponentScore: number,
    deck: Deck,
  ): void {
    const currentHand = state.cards;

    while (
      !isBust(currentHand) &&
      config.strategy.shouldDraw(currentHand, opponentScore)
    ) {
      currentHand.push(deck.draw());
    }
  }
}
