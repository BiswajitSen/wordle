class WordleRenderer {
  #resultContainer;
  #guessedWordsContainer;
  #guessedInputContainer;
  #chancesContainer;
  #remainingAttemptsContainer;
  #correctWordHolder;
  #gameStatsContainer;
  #previousLogContainer;

  constructor({
    resultContainer,
    guessedWordsContainer,
    guessedInputContainer,
    chancesContainer,
    remainingAttemptsContainer,
    correctWordHolder,
    gameStatsContainer,
    previousLogContainer,
  }) {
    this.#resultContainer = resultContainer;
    this.#guessedWordsContainer = guessedWordsContainer;
    this.#guessedInputContainer = guessedInputContainer;
    this.#chancesContainer = chancesContainer;
    this.#remainingAttemptsContainer = remainingAttemptsContainer;
    this.#correctWordHolder = correctWordHolder;
    this.#gameStatsContainer = gameStatsContainer;
    this.#previousLogContainer = previousLogContainer;
  }

  displayLostMessage() {
    this.#resultContainer.innerText = 'You Lost !!!';
  }

  displayWinMessage() {
    this.#resultContainer.innerText = 'You Won !!!';
  }

  resetGuessInputBox() {
    this.#guessedInputContainer.value = null;
  }

  #refreshGuessedWords() {
    const guessedWords = Array.from(this.#guessedWordsContainer.children);

    guessedWords.forEach((child) => {
      this.#guessedWordsContainer.removeChild(child);
    });
  }

  #addColorNotation(letter) {
    let color = 'red';

    if (letter.isPresent) {
      color = 'yellow';
    }

    if (letter.isInCorrectPosition) {
      color = 'green';
    }

    const letterWithHint = document.createElement('span');
    letterWithHint.classList.add(color, 'guessed-letter');
    letterWithHint.innerText = letter.symbol;

    return letterWithHint;
  }

  renderCorrectWord(word) {
    this.#correctWordHolder.innerText = `correct word: ${word}`;
  }

  renderScore({ score }) {
    const scoreContainer = document.createElement('div');
    scoreContainer.innerText = `Score: ${score}`;
    this.#gameStatsContainer.appendChild(scoreContainer);
  }

  #renderAttemptsAndChances(chances, attempts) {
    this.#chancesContainer.innerText = `Chances: ${chances}`;
    const remainingChances = chances - attempts;
    this.#remainingAttemptsContainer.innerText = `Remaining: ${remainingChances}`;
  }

  renderLastSeasonResult({ lastGameScore, lastSecretWord }) {
    const scoreHolder = document.createElement('div');
    const secretWordHolder = document.createElement('div');

    scoreHolder.innerText = `Last Score: ${lastGameScore}`;
    secretWordHolder.innerText = `Secret Word: ${lastSecretWord}`;

    this.#previousLogContainer.appendChild(scoreHolder);
    this.#previousLogContainer.appendChild(secretWordHolder);
  }

  renderGameState({ guessesRecord, chances, attempts }) {
    this.#refreshGuessedWords();
    this.#renderAttemptsAndChances(chances, attempts);

    guessesRecord.forEach((record) => {
      const wordHolder = document.createElement('li');

      const word = record.lettersStats.map(this.#addColorNotation);
      wordHolder.append(...word);

      this.#guessedWordsContainer.appendChild(wordHolder);
    });
  }
}
