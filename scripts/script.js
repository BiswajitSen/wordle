class Frequency {
  #keys;

  constructor() {
    this.#keys = {};
  }

  get frequencies() {
    return this.#keys;
  }

  #isPresent(key) {
    return key in this.#keys;
  }

  addOrInsert(key) {
    if (!this.#isPresent(key)) {
      this.#keys[key] = 0;
    }

    this.#keys[key] += 1;
  }

  removeKey(key) {
    if (!this.#isPresent(key)) return;

    this.#keys[key] -= 1;
    if (this.#keys[key] === 0) {
      delete this.#keys[key];
    }
  }
}

class Wordle {
  #secretWord;
  #guessesRecord;
  #chances;
  #currentGuess;
  #timesGuessed;
  #score;
  #isGameOver;

  constructor(word, chances = 1) {
    this.#secretWord = word.toUpperCase();
    this.#guessesRecord = [];
    this.#chances = chances;
    this.#currentGuess = null;
    this.#timesGuessed = 0;
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
    return this.#timesGuessed >= this.#chances;
  }

  #frequenciesOfLettersInSecretWord() {
    const originalLettersFrequencies = new Frequency();

    [...this.#secretWord].forEach((letter) => {
      originalLettersFrequencies.addOrInsert(letter);
    });

    return originalLettersFrequencies;
  }

  #updateIfLettersInPositions(lettersStats, originalLettersFrequencies, guessedWord) {
    [...guessedWord].forEach((letter, position) => {
      const letterStats = {
        symbol: letter,
        isPresent: false,
        isInCorrectPosition: false,
      };

      if (this.#secretWord.charAt(position) === letter) {
        originalLettersFrequencies.removeKey(letter);
        letterStats.isInCorrectPosition = true;
        letterStats.isPresent = true;
      }

      lettersStats.push(letterStats);
    });
  }

  #updateIfLettersPresent(lettersStats, originalLettersFrequencies, guessedWord) {
    [...guessedWord].forEach((letter, id) => {
      if (letter in originalLettersFrequencies.frequencies) {
        lettersStats[id].isPresent = true;
        originalLettersFrequencies.removeKey(letter);
      }
    });
  }

  validateAndRecordGuess(guessedWord) {
    const lettersStats = [];
    const originalLettersFrequencies = this.#frequenciesOfLettersInSecretWord();

    this.#updateIfLettersInPositions(
      lettersStats,
      originalLettersFrequencies,
      guessedWord
    );

    this.#updateIfLettersPresent(lettersStats, originalLettersFrequencies, guessedWord);

    return lettersStats;
  }

  #updateScore() {
    if (this.hasGuessedCorrectly()) {
      this.#score = (this.#chances - this.#timesGuessed + 1) * 10;
    }
  }

  #add(guessedWord) {
    this.#currentGuess = guessedWord;
    const lettersStats = this.validateAndRecordGuess(guessedWord);

    this.#guessesRecord.push({ lettersStats });
  }

  register(guessedWord) {
    this.#add(guessedWord);
    this.#timesGuessed++;
    this.#isGameOver = this.hasGuessedCorrectly() || this.#outOfChances();
    this.#updateScore();
  }

  stats() {
    return {
      guessesRecord: [...this.#guessesRecord],
      chances: this.#chances,
      timesGuessed: this.#timesGuessed,
      score: this.#score,
    };
  }
}

class MouseController {
  #submitBtn;
  #guessedInputContainer;

  constructor(submitBtn, guessedInputContainer) {
    this.#submitBtn = submitBtn;
    this.#guessedInputContainer = guessedInputContainer;
  }

  onSubmit(cb) {
    this.#submitBtn.onclick = () => {
      const word = this.#guessedInputContainer.value;
      cb(word);
      this.#guessedInputContainer.focus();
    };
  }
}

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

  #addHeader(parent, heading) {
    const header = document.createElement('header');
    header.innerText = heading;
    header.classList.add('guesses-header');
    parent.appendChild(header);
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

  #renderAttemptsAndChances(chances, timesGuessed) {
    this.#chancesContainer.innerText = `Chances: ${chances}`;
    const remainingChances = chances - timesGuessed;
    this.#remainingAttemptsContainer.innerText = `Remaining: ${remainingChances}`;
  }

  renderGameState({ guessesRecord, chances, timesGuessed }) {
    this.#refreshGuessedWords();
    this.#renderAttemptsAndChances(chances, timesGuessed);

    this.#addHeader(this.#guessedWordsContainer, 'Your Guesses:');

    guessesRecord.forEach((record) => {
      const wordHolder = document.createElement('li');

      const word = record.lettersStats.map(this.#addColorNotation);
      wordHolder.append(...word);

      this.#guessedWordsContainer.appendChild(wordHolder);
    });
  }
}

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

const initiateRenderer = () => {
  const resultContainer = document.querySelector('.result-container');
  const guessedWordsContainer = document.querySelector('.guesses');
  const chancesContainer = document.querySelector('#max-chances');
  const correctWordHolder = document.querySelector('.correct-word');
  const remainingAttemptsContainer = document.querySelector('#remaining-attempts');
  const guessedInputContainer = document.querySelector('.guess-holder');
  const gameStatsContainer = document.querySelector('.game-stats');

  const wordleRenderer = new WordleRenderer(
    resultContainer,
    guessedWordsContainer,
    guessedInputContainer,
    chancesContainer,
    remainingAttemptsContainer,
    correctWordHolder,
    gameStatsContainer
  );

  return wordleRenderer;
};

const initiateMouseController = () => {
  const submitBtn = document.querySelector('.submit-guess-btn');
  const guessedInputContainer = document.querySelector('.guess-holder');

  const inputController = new MouseController(submitBtn, guessedInputContainer);

  return inputController;
};

const fetchRandomWord = () => {
  const words = [
    'hello',
    'there',
    'great',
    'hover',
    'earth',
    'biswa',
    'glass',
    'valid',
    'break',
    'utsab',
    'guess',
    'glare',
    'delta',
    'token',
    'lexem',
    'bloom',
    'broom',
    'groom',
    'watch',
    'books',
  ];

  const wordId = Math.floor(Math.random() * words.length);
  return words[wordId];
};

const initiateGame = () => {
  const wordle = new Wordle(fetchRandomWord(), 6);
  const inputController = initiateMouseController();
  const wordleRenderer = initiateRenderer();

  const wordleController = new WordleController(wordle, inputController, wordleRenderer);

  wordleController.start();
};

window.onload = initiateGame;
