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
