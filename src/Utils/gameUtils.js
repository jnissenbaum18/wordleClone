import acceptableGuesses from "./wordList";

export const createLetterGuess = (letter, hasGuessed, status) => {
  if (status !== undefined) {
    if (
      status !== "correct" &&
      status !== "partial" &&
      status !== "incorrect"
    ) {
      throw new Error(`Incorrect args passed to createLetterGuess: ${status}`);
    }
  }
  return {
    letter: letter ? letter : "",
    hasGuessed: hasGuessed ? hasGuessed : false,
    status: status ? status : "initial",
  };
};

export const createGuess = (guessNumber, guessLetters) => {
  return {
    guessNumber,
    guessLetters,
  };
};

export const createEmptyGuess = (guessNumber, numLetters) => {
  const newGuess = createGuess(
    guessNumber,
    Array.from({ length: numLetters }, () => createLetterGuess("", false))
  );
  return newGuess;
};

export const createEmptyGuessesArray = (numGuesses, numLetters) => {
  const guesses = [];
  for (let i = 0; i < numGuesses; i++) {
    const newGuess = createGuess(
      i + 1,
      Array.from({ length: numLetters }, () => createLetterGuess("", false))
    );
    guesses.push(newGuess);
  }
  return guesses;
};

export const validateCurrentGuess = (
  guesses,
  currentGuessNumber,
  todaysWordIndex
) => {
  const currentGuessWord = guesses[currentGuessNumber].guessLetters
    .map(({ letter }) => letter)
    .join("")
    .toLowerCase();
  if (!acceptableGuesses.includes(currentGuessWord)) {
    return false;
  }
  return true;
};

export const evaluateCurrentGuess = (
  guesses,
  currentGuessNumber,
  todaysWordIndex
) => {
  const currentGuessLetters = guesses[currentGuessNumber].guessLetters;
  const todaysWordArr = acceptableGuesses[todaysWordIndex].split("");
  const evaluatedLetters = currentGuessLetters.map(({ letter }, idx) => {
    const lowerLetter = letter.toLowerCase();
    if (lowerLetter === todaysWordArr[idx]) {
      return createLetterGuess(letter, true, "correct");
    }
    if (todaysWordArr.includes(lowerLetter)) {
      console.log("letter in word");
      return createLetterGuess(letter, true, "partial");
    }
    return createLetterGuess(letter, true, "incorrect");
  });
  const updatedGuess = createGuess(currentGuessNumber, evaluatedLetters);
  return updatedGuess;
};
