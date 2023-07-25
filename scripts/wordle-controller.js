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

  #storeGameSeasonData(secretWord, score) {
    localStorage.setItem('seasonLog', JSON.stringify({ secretWord, score }));
  }

  #consolidateGameStats(guessedWord) {
    if (this.#isInvalidEntry(guessedWord)) return;
    if (this.#wordle.isGameOver) return;

    this.#updateAndRenderGameState(guessedWord.toUpperCase());

    if (this.#wordle.hasGuessedCorrectly()) {
      this.#wordleRenderer.displayWinMessage();
      const { score } = this.#wordle.stats();

      this.#wordleRenderer.renderScore(this.#wordle.stats(score));
      this.#storeGameSeasonData(this.#wordle.secretWord, score);

      return;
    }

    if (this.#wordle.isGameOver) {
      this.#wordleRenderer.displayLostMessage();
      const { score } = this.#wordle.stats();

      this.#wordleRenderer.renderCorrectWord(this.#wordle.secretWord);
      this.#wordleRenderer.renderScore(score);

      this.#storeGameSeasonData(this.#wordle.secretWord, score);
    }
  }

  #fetchPreviousSeasonData() {
    return (
      JSON.parse(localStorage.getItem('seasonLog')) || {
        score: 0,
        secretWord: "haven't play yet",
      }
    );
  }

  start() {
    const previousSeasonLog = this.#fetchPreviousSeasonData();
    this.#wordleRenderer.renderPreviousSeasonLog(previousSeasonLog);
    this.#wordleRenderer.renderGameState(this.#wordle.stats());
    this.#inputController.onSubmit((guessedWord) => {
      this.#consolidateGameStats(guessedWord);
    });
  }
}
