import { Component } from "react";
import LetterSquare from "./Components/letterSquare";
import {
  createLetterGuess,
  createEmptyGuess,
  validateCurrentGuess,
  evaluateCurrentGuess,
  createEmptyGuessesArray,
} from "./Utils/gameUtils";
import {guessList} from "./Utils/wordList";
import "./App.css";

const numGuesses = 6;
const numLetters = 5;
const todaysWordIndex = 1812;
const min = 0;
const max = 12971;

class App extends Component {
  constructor(props) {
    super(props);
    const newGuessArray = createEmptyGuessesArray(numGuesses, numLetters);
    this.state = {
      guesses: newGuessArray,
      currentGuessNumber: 0,
      currentLetterNumber: 0,
      todaysWordIndex,
      gameStatusText: "",
      gameState: "playing",
    };
  }
  handleKeyPress = (e) => {
    const { guesses, currentGuessNumber, currentLetterNumber, gameState } =
      this.state;
    const keyPressed = String.fromCharCode(e.keyCode);
    console.log("keyPressed ", keyPressed);

    if (keyPressed === "\r") {
      if (currentLetterNumber < numLetters) {
        return;
      }
      this.handleSubmit();
      return;
    }
    if (keyPressed === "\b") {
      this.handleBackspace();
      return;
    }

    if (currentLetterNumber >= numLetters || !/[a-zA-Z]/.test(keyPressed)) {
      return;
    }

    if (gameState !== "playing") {
      return;
    }

    const updatedGuesses = [...guesses];
    const currentGuessLetter =
      updatedGuesses[currentGuessNumber].guessLetters[currentLetterNumber];
    currentGuessLetter.letter = keyPressed;
    this.setState({
      ...this.state,
      currentLetterNumber: currentLetterNumber + 1,
      guesses: updatedGuesses,
    });
  };
  handleSubmit = () => {
    const { guesses, currentGuessNumber, todaysWordIndex } = this.state;
    const isValidGuess = validateCurrentGuess(
      guesses,
      currentGuessNumber,
      todaysWordIndex,
    );
    console.log("isValidGuess ", isValidGuess)
    if (!isValidGuess) {
      this.handleInvalidGuess();
      return;
    }
    const updatedGuess = evaluateCurrentGuess(
      guesses,
      currentGuessNumber,
      todaysWordIndex,
    );
    const updatedGuesses = [...guesses];
    updatedGuesses.splice(currentGuessNumber, 1, updatedGuess);
    this.setState(
      {
        guesses: updatedGuesses,
        currentGuessNumber: currentGuessNumber + 1,
        currentLetterNumber: 0,
      },
      this.checkIsGameOver
    );
  };
  handleBackspace = () => {
    const { guesses, currentGuessNumber, currentLetterNumber } = this.state;
    if (currentLetterNumber === 0) {
      return;
    }
    const updatedGusses = [...guesses];
    updatedGusses[currentGuessNumber].guessLetters[currentLetterNumber - 1] =
      createLetterGuess();
    this.setState({
      guesses: updatedGusses,
      currentLetterNumber: currentLetterNumber - 1,
    });
  };
  handleInvalidGuess = () => {
    const { guesses, currentGuessNumber } = this.state;
    const updatedGuesses = [
      ...guesses
    ]
    updatedGuesses[currentGuessNumber] = createEmptyGuess(currentGuessNumber, numLetters);
    this.setState({
      guesses: updatedGuesses,
      currentLetterNumber: 0
    })
  }
  handleReset = (wordIndex) => {
    const newGuessArray = createEmptyGuessesArray(numGuesses, numLetters);
    let newWordIndex = todaysWordIndex;
    if (wordIndex && typeof(wordIndex) === "number") {
      newWordIndex = wordIndex
    }
    this.setState({
      guesses: newGuessArray,
      currentGuessNumber: 0,
      currentLetterNumber: 0,
      todaysWordIndex: newWordIndex,
      gameStatusText: "",
      gameState: "playing",
    });
  };
  handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * (max - min + 1) + min)
    this.handleReset(randomIndex)
  }
  handleGiveUp = () => {
    const { todaysWordIndex } = this.state;
    this.setState({
      gameState: "lost",
      gameStatusText: `Game Over. The word was: ${guessList[
        todaysWordIndex
      ].toUpperCase()}`,
    });
  }
  checkIsGameOver = () => {
    const { guesses, currentGuessNumber, todaysWordIndex } = this.state;
    console.log("check is game over")
    const mostRecentGuess = guesses[currentGuessNumber - 1];
    const incorrectLetters = mostRecentGuess.guessLetters.filter(
      ({ status }) => status !== "correct"
    );
    if (incorrectLetters.length === 0) {
      console.log("won game");
      this.setState({
        gameState: "won",
        gameStatusText: `Congratulations, you won!`,
      });
      return;
    }

    if (currentGuessNumber >= numGuesses) {
      console.log("Game over");
      this.setState({
        gameState: "lost",
        gameStatusText: `Game Over. The word was: ${guessList[
          todaysWordIndex
        ].toUpperCase()}`,
      });
      return;
    }
  };
  render() {
    const { guesses, gameState, gameStatusText, todaysWordIndex } = this.state;
    return (
      <div className="App" onKeyDown={this.handleKeyPress} tabIndex="0">
        <header className="App-header">
          <h2>Wordle Clone</h2>
          <div className="App-buttons">
            <button onClick={this.handleSubmit}>Enter</button>
            <button onClick={this.handleGiveUp}>Give Up</button>
            <button onClick={this.handleReset}>Reset</button>
            <button onClick={this.handleRandomize}>Randomize</button>
          </div>
          <h3 className={`game-info`}>Playing Word: {todaysWordIndex}</h3>
          <h3 className={`game-status-${gameState}`}>{gameStatusText}</h3>
          {guesses.map(({ guessLetters, guessNumber }, rowIdx) => {
            return (
              <div className="word-row" key={`letter-row-${rowIdx}`}>
                {guessLetters.map(({ letter, status }, letterIdx) => {
                  return (
                    <LetterSquare
                      letter={letter}
                      status={status}
                      key={`letter-square-${rowIdx}-${letterIdx}`}
                    />
                  );
                })}
              </div>
            );
          })}
          
        </header>
      </div>
    );
  }
}

export default App;
