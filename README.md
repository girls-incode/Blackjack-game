# Blackjack game

A command-line game of blackjack between a player and a daealer, written in TypeScript. The deck is fetched as JSON over HTTP, one round is played, and the result is printed.

## Requirements

- pnpm
- Node.js >= 22.9
- TypeScript 7.0.2
- Vitest 5.0.3


## Setup

```sh
pnpm install
```

### Development

```sh
pnpm test         # run the tests (vitest)
pnpm typecheck    # type-check with tsc
pnpm build        # bundle to dist/ with vite
```

### Run

```sh
pnpm start                      # uses the default deck URL
pnpm start <deck-url>           # uses the given deck URL
```

`pnpm start` builds the project first, then runs `dist/main.js`.
The URL should respond to a `GET` with a JSON list of cards, e.g. `{"suit":"HEARTS","value":"5"}`.
Suits are printed as `H`, `S`, `C`, `D`, followed by the card value as received (`S7` is the seven of spades).

## Game rules

- Ivar is dealt two cards, then the Dealer is dealt two.
- Blackjack is 21 with exactly two cards. If both have it, the Dealer wins. If only one has it, that side wins and the round ends.
- Otherwise Ivar draws until reaching 17 or more. Above 21 is a bust and Ivar loses, whatever the Dealer holds.
- Then the Dealer draws until strictly ahead of Ivar or bust. The Dealer wins unless busted.
- Face cards (J, Q, K) are worth 10, aces are always worth 11, and number cards are worth their number.

### Example output

```
Winner: Ivar
Dealer | 27 | S7,S10,CJ
Ivar | 19 | D2,H2,C6,H9
```

## Project layout

```
src/
├── main.ts                 # entry point: reads the URL, fetches the deck, plays, prints
├── game/
│   ├── game.ts             # round rules
│   ├── standardBlackjackGame.ts
│   ├── strategy.ts         # draw strategies
│   ├── card.ts             # cards and scoring
│   ├── deck.ts
│   └── format.ts           # output formatting
├── deckSource/             # fetching and validating the deck
├── errors/                 # error types and top-level error handling
└── testing/                # test helpers
```
