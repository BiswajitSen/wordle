class GameStorage {
  #storage;

  constructor(storage) {
    this.#storage = storage;
  }

  lastGameScore() {
    return this.#storage.getItem('lastGameScore');
  }

  lastSecretWord() {
    return this.#storage.getItem('lastSecretWord');
  }

  storeGameScore(gameScore) {
    this.#storage.setItem('lastGameScore', gameScore);
  }

  storeSecretWord(secretWord) {
    this.#storage.setItem('lastSecretWord', secretWord);
  }
}
