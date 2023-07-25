class WordleController {
  #wordle;
  #inputController;
  #wordleRenderer;
  #gameStorage;

  constructor({ wordle, inputController, wordleRenderer, gameStorage }) {
    this.#wordle = wordle;
    this.#inputController = inputController;
    this.#wordleRenderer = wordleRenderer;
    this.#gameStorage = gameStorage;
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

      const { score } = this.#wordle.stats();
      this.#wordleRenderer.renderScore(this.#wordle.stats(score));

      this.#gameStorage.storeGameScore(score);
      this.#gameStorage.storeSecretWord(this.#wordle.secretWord);

      return;
    }

    if (this.#wordle.isGameOver) {
      this.#wordleRenderer.displayLostMessage();
      const { score } = this.#wordle.stats();

      this.#wordleRenderer.renderCorrectWord(this.#wordle.secretWord);
      this.#wordleRenderer.renderScore(score);

      this.#gameStorage.storeGameScore(score);
      this.#gameStorage.storeSecretWord(this.#wordle.secretWord);
    }
  }

  start() {
    const lastGameScore = this.#gameStorage.lastGameScore();
    const lastSecretWord = this.#gameStorage.lastSecretWord();

    if (lastSecretWord) {
      this.#wordleRenderer.renderLastSeasonResult({ lastGameScore, lastSecretWord });
    }

    this.#wordleRenderer.renderGameState(this.#wordle.stats());
    this.#inputController.onSubmit((guessedWord) => {
      this.#consolidateGameStats(guessedWord);
    });
  }
}
