# Calculator

Features:
- Adds a button to the Extra Deck to banish a random card face-up.
- Gives you a calculator you can use mid-duel.
  - Toggle on and off with the `[+]` button outlined in green.
  - Built upon [math.js](https://mathjs.org/)
  - Variables:
    - `name = value`
  - Functions:
    - `clear()` - Clears the calculator's screen
    - `lp()` - Returns your current LP
    - `lp(value)` - Sets your LP to `value`
    - `rand()` - Returns a random float between `0` and `1`
    - `rand(N)` - Returns a random integer between `1` and `N`
    - `rand(L,R)` - Returns a random integer between `L` and `R`
    - `my()` - Returns your LP
    - `opp()` - Returns your opponent's LP
    - `gain(N)` - Increases your LP by `N`
    - `lose(N)` - Decreases your LP by `N`
    - `bh()` or `banishhand()` - Banishes your entire hand
    - `dh()` or `discardhand()` - Discards your entire hand
    - `draw(N)` - Draws `N` cards
    - `mill(N)` - Sends the top `N` cards of your Deck to the GY
    - `banish(N)` - Banishes the top `N` cards of your Deck
    - `banishfd(N)` - Banishes the top `N` cards of your Deck face-down
    - `pause()` - Pauses the Duel
    - `reset()` - Resets the Deck
    - `banranfd()` - Banishes a random card from your Extra Deck face-down
    - `showrand(N)` - For given `N` (one of 2, 3, 4, 5, 6), generates a fair random number using DuelingBook's builtin RNG (coin or dice).