class Wordle {
  #secretWord;
  #guessesRecord;
  #isGameOver;
  #currentGuess;
  #chances;
  #timesGuessed;

  constructor(word, chances = 1) {
    this.#secretWord = word;
    this.#guessesRecord = [];
    this.#currentGuess = null;
    this.#isGameOver = false;
    this.#chances = chances;
    this.#timesGuessed = 0;
  }

  get secretWord() {
    return this.#secretWord;
  }

  get isGameOver() {
    return this.#isGameOver;
  }

  hasGuessedCorrectly() {
    return this.#currentGuess === this.#secretWord;
  }

  #outOfChances() {
    return this.#timesGuessed >= this.#chances;
  }

  validateLettersPositions(guessedWord) {
    const originalLetters = this.#secretWord.split('');
    const guessedLetters = guessedWord.split('');

    return guessedLetters.map((letter, index) => {
      const stat = {
        symbol: letter,
        isPresent: false,
        isInCorrectPosition: false,
      };

      if (originalLetters.includes(letter)) {
        stat.isPresent = true;
      }

      const isInCorrectPosition = originalLetters[index] === letter;
      if (isInCorrectPosition) {
        stat.isInCorrectPosition = true;
      }

      return stat;
    });
  }

  #add(guessedWord) {
    this.#currentGuess = guessedWord;
    const lettersStats = this.validateLettersPositions(guessedWord);
    const correctGuesses = lettersStats.reduce(
      (totalMatched, letter) => totalMatched + (letter.isPresent ? 1 : 0),
      0
    );

    this.#guessesRecord.push({ lettersStats, correctGuesses });
  }

  register(guessedWord) {
    this.#add(guessedWord);
    this.#timesGuessed++;
    this.#isGameOver = this.hasGuessedCorrectly() || this.#outOfChances();
  }

  stats() {
    return {
      guessesRecord: [...this.#guessesRecord],
      chances: this.#chances,
      timesGuessed: this.#timesGuessed,
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
    };
  }
}

class Renderer {
  #resultContainer;
  #guessedWordsContainer;
  #guessedInputContainer;
  #chancesContainer;
  #remainingAttemptsContainer;
  #correctWordHolder;

  constructor(
    resultContainer,
    guessedWordsContainer,
    guessedInputContainer,
    chancesContainer,
    remainingAttemptsContainer,
    correctWordHolder
  ) {
    this.#resultContainer = resultContainer;
    this.#guessedWordsContainer = guessedWordsContainer;
    this.#guessedInputContainer = guessedInputContainer;
    this.#chancesContainer = chancesContainer;
    this.#remainingAttemptsContainer = remainingAttemptsContainer;
    this.#correctWordHolder = correctWordHolder;
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

  #renderAttemptsAndChances(chances, timesGuessed) {
    this.#chancesContainer.innerText = `chances: ${chances}`;
    const remainingChances = chances - timesGuessed;
    this.#remainingAttemptsContainer.innerText = `remaining: ${remainingChances}`;
  }

  renderGameState({ guessesRecord, chances, timesGuessed }) {
    this.#refreshGuessedWords();
    this.#renderAttemptsAndChances(chances, timesGuessed);

    this.#addHeader(this.#guessedWordsContainer, 'Your Guesses:');

    guessesRecord.forEach((record) => {
      const wordHolder = document.createElement('li');
      const correctGuesses = record.correctGuesses;

      const word = record.lettersStats.map(this.#addColorNotation);
      const hint = document.createElement('div');
      hint.innerText = `correctGuesses: ${correctGuesses}`;

      wordHolder.append(...word);
      wordHolder.appendChild(hint);

      this.#guessedWordsContainer.appendChild(wordHolder);
    });
  }
}

class WordleController {
  #wordle;
  #inputController;
  #renderer;

  constructor(wordle, inputController, renderer) {
    this.#wordle = wordle;
    this.#inputController = inputController;
    this.#renderer = renderer;
  }

  #updateAndRenderGameState(guessedWord) {
    this.#renderer.resetGuessInputBox();
    this.#wordle.register(guessedWord);

    this.#renderer.renderGameState(this.#wordle.stats());
  }

  #consolidateGameStats(guessedWord) {
    if (this.#wordle.isGameOver) return;

    this.#updateAndRenderGameState(guessedWord);

    if (this.#wordle.hasGuessedCorrectly()) {
      this.#renderer.displayWinMessage();
      return;
    }

    if (this.#wordle.isGameOver) {
      this.#renderer.displayLostMessage();
      this.#renderer.renderCorrectWord(this.#wordle.secretWord);
    }
  }

  start() {
    this.#renderer.renderGameState(this.#wordle.stats());
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
  const remainingAttemptsContainer = document.querySelector(
    '#remaining-attempts'
  );
  const guessedInputContainer = document.querySelector('.guess-holder');

  const renderer = new Renderer(
    resultContainer,
    guessedWordsContainer,
    guessedInputContainer,
    chancesContainer,
    remainingAttemptsContainer,
    correctWordHolder
  );

  return renderer;
};

const initiateMouseController = () => {
  const submitBtn = document.querySelector('.submit-guess-btn');
  const guessedInputContainer = document.querySelector('.guess-holder');

  const inputController = new MouseController(submitBtn, guessedInputContainer);

  return inputController;
};

const initiateGame = () => {
  const wordle = new Wordle('great', 3);
  const inputController = initiateMouseController();
  const renderer = initiateRenderer();

  const wordleController = new WordleController(
    wordle,
    inputController,
    renderer
  );

  wordleController.start();
};

window.onload = initiateGame;
