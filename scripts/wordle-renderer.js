class WordleRenderer {
  #resultContainer;
  #guessedWordsContainer;
  #guessedInputContainer;
  #chancesContainer;
  #remainingAttemptsContainer;
  #correctWordHolder;
  #gameStatsContainer;

  constructor(
    resultContainer,
    guessedWordsContainer,
    guessedInputContainer,
    chancesContainer,
    remainingAttemptsContainer,
    correctWordHolder,
    gameStatsContainer
  ) {
    this.#resultContainer = resultContainer;
    this.#guessedWordsContainer = guessedWordsContainer;
    this.#guessedInputContainer = guessedInputContainer;
    this.#chancesContainer = chancesContainer;
    this.#remainingAttemptsContainer = remainingAttemptsContainer;
    this.#correctWordHolder = correctWordHolder;
    this.#gameStatsContainer = gameStatsContainer;
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
