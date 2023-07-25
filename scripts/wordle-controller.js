class WordleController {
  #wordle;
  #inputController;
  #wordleRenderer;

  constructor(wordle, inputController, wordleRenderer) {
    this.#wordle = wordle;
    this.#inputController = inputController;
    this.#wordleRenderer = wordleRenderer;
  }

  #updateAndRenderGameState(guessedWord) {
    this.#wordleRenderer.resetGuessInputBox();
    this.#wordle.register(guessedWord);

    this.#wordleRenderer.renderGameState(this.#wordle.stats());
  }

  #isInvalidEntry(guessedWord) {
    return this.#wordle.secretWordLength() !== guessedWord.length;
  }

  #consolidateGameStats(guessedWord) {
    if (this.#isInvalidEntry(guessedWord)) return;
    if (this.#wordle.isGameOver) return;

    this.#updateAndRenderGameState(guessedWord.toUpperCase());

    if (this.#wordle.hasGuessedCorrectly()) {
      this.#wordleRenderer.displayWinMessage();
      this.#wordleRenderer.renderScore(this.#wordle.stats());
      return;
    }

    if (this.#wordle.isGameOver) {
      this.#wordleRenderer.displayLostMessage();
      this.#wordleRenderer.renderCorrectWord(this.#wordle.secretWord);
      this.#wordleRenderer.renderScore(this.#wordle.stats());
    }
  }

  start() {
    this.#wordleRenderer.renderGameState(this.#wordle.stats());
    this.#inputController.onSubmit((guessedWord) => {
      this.#consolidateGameStats(guessedWord);
    });
  }
}
