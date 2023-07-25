const initiateRenderer = () => {
  const resultContainer = document.querySelector('.result-container');
  const guessedWordsContainer = document.querySelector('.guesses');
  const chancesContainer = document.querySelector('#max-chances');
  const correctWordHolder = document.querySelector('.correct-word');
  const remainingAttemptsContainer = document.querySelector('#remaining-attempts');
  const guessedInputContainer = document.querySelector('.guess-holder');
  const gameStatsContainer = document.querySelector('.game-stats');
  const previousLogContainer = document.querySelector('.about-previous-season');

  const wordleRenderer = new WordleRenderer({
    resultContainer,
    guessedWordsContainer,
    guessedInputContainer,
    chancesContainer,
    remainingAttemptsContainer,
    correctWordHolder,
    gameStatsContainer,
    previousLogContainer,
  });

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
  const wordle = new Wordle('there', 6);
  const inputController = initiateMouseController();
  const wordleRenderer = initiateRenderer();

  const wordleController = new WordleController(wordle, inputController, wordleRenderer);

  wordleController.start();
};

window.onload = initiateGame;
