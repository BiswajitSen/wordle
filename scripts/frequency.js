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

  decreaseCount(key) {
    if (!this.#isPresent(key)) return;

    this.#keys[key] -= 1;
    if (this.#keys[key] === 0) {
      delete this.#keys[key];
    }
  }
}
