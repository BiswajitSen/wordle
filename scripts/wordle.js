class Wordle {
  #secretWord;
  #guessesRecord;
  #chances;
  #currentGuess;
  #attempts;
  #score;
  #isGameOver;

  constructor(word, chances = 1) {
    this.#secretWord = word.toUpperCase();
    this.#guessesRecord = [];
    this.#chances = chances;
    this.#currentGuess = null;
    this.#attempts = 0;
    this.#isGameOver = false;
    this.#score = 0;
  }

  get secretWord() {
    return this.#secretWord;
  }

  get isGameOver() {
    return this.#isGameOver;
  }

  secretWordLength() {
    return this.#secretWord.length;
  }

  hasGuessedCorrectly() {
    return this.#currentGuess === this.#secretWord;
  }

  #outOfChances() {
    return this.#attempts >= this.#chances;
  }

  #frequenciesOfLettersInSecretWord() {
    const originalLettersFrequencies = new Frequency();

    [...this.#secretWord].forEach((letter) => {
      originalLettersFrequencies.addOrInsert(letter);
    });

    return originalLettersFrequencies;
  }

  validateAndRecordGuess(guessedWord) {
    const lettersStats = [];
    const originalLettersFrequencies = this.#frequenciesOfLettersInSecretWord();

    const updateMatchedLetters = (letter, position) => {
      const letterStats = {
        symbol: letter,
        isPresent: false,
        isInCorrectPosition: false,
      };

      if (this.#secretWord.charAt(position) === letter) {
        originalLettersFrequencies.decreaseCount(letter);
        letterStats.isInCorrectPosition = true;
        letterStats.isPresent = true;
      }

      lettersStats.push(letterStats);
    };

    const updatePresentLetters = (letter, id) => {
      const isInOriginalFrequency = letter in originalLettersFrequencies.frequencies;
      const arelettersPositionDifferent = this.#secretWord[id] !== letter;

      if (isInOriginalFrequency && arelettersPositionDifferent) {
        lettersStats[id].isPresent = true;
        originalLettersFrequencies.decreaseCount(letter);
      }
    };

    [...guessedWord].forEach(updateMatchedLetters);
    [...guessedWord].forEach(updatePresentLetters);

    return lettersStats;
  }

  #updateScore() {
    if (this.hasGuessedCorrectly()) {
      this.#score = (this.#chances - this.#attempts + 1) * 10;
    }
  }

  #add(guessedWord) {
    this.#currentGuess = guessedWord;
    const lettersStats = this.validateAndRecordGuess(guessedWord);

    this.#guessesRecord.push({ lettersStats });
  }

  register(guessedWord) {
    this.#add(guessedWord);
    this.#attempts++;
    this.#isGameOver = this.hasGuessedCorrectly() || this.#outOfChances();
    this.#updateScore();
  }

  stats() {
    return {
      guessesRecord: [...this.#guessesRecord],
      chances: this.#chances,
      attempts: this.#attempts,
      score: this.#score,
    };
  }
}
