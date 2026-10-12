import { Game } from "./game";
import { BeatOpponentStrategy, StandOnScoreStrategy } from "./strategy";

const PLAYER_STAND_SCORE = 17;

/** Builds the game from the requirements: Player draws until 17 or higher, the dealer draws until ahead of Player or bust. */
export const createStandardBlackjackGame = (): Game =>
  new Game(
    {
      name: "Player",
      strategy: new StandOnScoreStrategy(PLAYER_STAND_SCORE),
    },
    { name: "Dealer", strategy: new BeatOpponentStrategy() },
  );
