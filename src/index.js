import React from "react";
import ReactDOM from "react-dom";
import Title from "./components/title";
import Board from "./components/board";
import GameButton from "./components/gameButton";
import GameLevel from "./components/gameLevel";
import "./styles.css";
const AI = require("./AI.js");
const BoardFunctions = require("./BoardHelperFunctions.js");

class Game extends React.Component {
  constructor(props) {
    super(props);

    // dimensions of connect-four board
    this.numOfCols = 7;
    this.numOfRows = 6;
    this.maxPossibleEntriesInDiagonal = 6;
    const colArr = Array(this.numOfCols).fill(null);

    this.state = {
      // stores boards made in connect four game; each entry in the array is
      // a state of the board; elements in the board can be accessed by
      // row then col index
      history: [
        {
          currentBoard: Array(this.numOfRows)
            .fill(null)
            .map(() => colArr.slice())
        }
      ],
      // boolean to record whose turn it is
      isRedTurn: true,
      // boolean to record whether game has been won
      isGameWon: false,
      // boolean to record whether game has been tied
      isGameTied: false,
      // int to record which board entry in history to display
      historyIndex: 0,
      // boolean to record whether it is 2-player mode of CPU mode
      isCPUMode: true,
      // integer choosing level of game (by changing depth of minimax algorithm) (easy:2,normal:4,hard:7)
      difficultyLevel: 4
    };
  }

  // helper function to add currentBoard to the history array
  updateHistory(currentBoard) {
    /* add current board to history and increment history index
     *** if historyIndex is less than historyLength-1, it 
     means that a move has been played after the user has 
     used the jump backwards button. Therefore, all elements in history after
     where historyIndex currently is should be erased *** 
     */
    const historyIndex = this.state.historyIndex;
    const historyLength = this.state.history.length;
    var history = this.state.history;
    if (historyIndex < historyLength - 1) {
      history = this.state.history.splice(0, historyIndex + 1);
    }

    return history.concat([{ currentBoard: currentBoard }]);
  }

  /* helper function to update the game status (won, tied, continue play)
  takes in the top row and the column (where the piece was inserted)
  as arguments */
  updateGameStatus(topRow, col) {
    let currentBoard = this.state.history[this.state.historyIndex].currentBoard;
    // win check
    if (
      BoardFunctions.generalWinner(currentBoard, "red") ||
      BoardFunctions.generalWinner(currentBoard, "yellow")
    ) {
      this.setState({ isGameWon: true });
    }
    /*    if (BoardFunctions.specificCheckWinner(currentBoard, topRow - 1, col)) {
      this.setState({ isGameWon: true });
    } */
    // tie check
    else if (BoardFunctions.isBoardFilled(currentBoard)) {
      this.setState({ isGameTied: true });
    }
    // change turn; if red turn ended, call aiTurn
    else {
      const isRedTurn = !this.state.isRedTurn;
      this.setState({ isRedTurn: isRedTurn }, function() {
        // checks if CPU Mode AND if it is yellow's (CPU) turn
        if (this.state.isCPUMode && !isRedTurn) {
          const AIIndex = AI.aiTurn(currentBoard, this.state.difficultyLevel);
          this.squareClicked(AIIndex[0], AIIndex[1]);
        }
      });
    }
  }

  // update function for when square is clicked
  squareClicked(row, col) {
    // return from function if square has already been clicked or if game over
    if (
      this.state.history[this.state.historyIndex].currentBoard[row][col] !=
        null ||
      this.state.isGameWon ||
      this.state.isGameTied
    )
      return;

    // update board and history
    let currentBoard = this.state.history[this.state.historyIndex].currentBoard;
    currentBoard = BoardFunctions.copyOfBoard(currentBoard);
    const topRow = BoardFunctions.topRowFilledInCol(currentBoard, row, col);

    // color used by updateBoard() to color square red (+1), yellow (-1), or null (0)
    let color;
    if (this.state.isRedTurn) {
      color = +1;
    } else if (!this.state.isRedTurn) {
      color = -1;
    }

    const updatedBoard = BoardFunctions.updateBoard(
      currentBoard,
      topRow,
      col,
      color
    );
    const history = this.updateHistory(updatedBoard);

    this.setState(
      {
        history: history,
        historyIndex: this.state.historyIndex + 1
      },

      () => this.updateGameStatus(topRow, col)
    );
  }

  // function for HistoryButton to allow user to go back to a previous state of the board
  jumpBackwards() {
    // return if historyIndex would go out of range or if game has been won
    const historyIndex = this.state.historyIndex - 1;
    if (historyIndex < 0 || this.state.isGameWon || this.state.isGameTied)
      return;

    this.setState({
      historyIndex: this.state.historyIndex - 1,
      isRedTurn: !this.state.isRedTurn
    });
  }

  // function for HistoryButton to allow user to go back to a previous state of the board
  jumpForwards() {
    // return if historyIndex would go out of range or if game has been won
    const historyIndex = this.state.historyIndex + 1;
    if (
      historyIndex > this.state.history.length - 1 ||
      this.state.isGameWon ||
      this.state.isGameTied
    )
      return;

    this.setState({
      historyIndex: this.state.historyIndex + 1,
      isRedTurn: !this.state.isRedTurn
    });
  }

  // function for HistoryButton to allow user to reset game
  reset() {
    const colArr = Array(this.numOfCols).fill(null);
    this.setState({
      history: [
        {
          currentBoard: Array(this.numOfRows)
            .fill(null)
            .map(() => colArr.slice())
        }
      ],
      isRedTurn: true,
      isGameWon: false,
      isGameTied: false,
      historyIndex: 0
    });
  }

  // function for gameModeButton to allow user to select CPU mode
  selectCPUMode() {
    this.setState({ isCPUMode: true });
    this.reset();
  }

  // function for gameModeButton to allow user to select 2 player mode
  selectTwoPlayerMode() {
    this.setState({ isCPUMode: false });
    this.reset();
  }

  // function to change game levels via GameLevel
  changeGameLevel(difficultyLevel) {
    this.setState({ difficultyLevel: difficultyLevel });
    this.reset();
  }

  render() {
    const history = this.state.history;
    const currentBoard = history[this.state.historyIndex].currentBoard;
    return (
      <div className="game">
        <Title
          isRedTurn={this.state.isRedTurn}
          isGameWon={this.state.isGameWon}
          isGameTied={this.state.isGameTied}
        />
        <Board
          currentBoard={currentBoard}
          history={this.state.history}
          historyIndex={this.state.historyIndex}
          isGameWon={this.state.isGameWon}
          isRedTurn={this.state.isRedTurn}
          squareClicked={(row, col) => this.squareClicked(row, col)}
        />
        <GameLevel
          changeToEasy={() => this.changeGameLevel(2)}
          changeToNormal={() => this.changeGameLevel(4)}
          changeToHard={() => this.changeGameLevel(7)}
          isCPUMode={this.state.isCPUMode}
        />
        <GameButton
          jumpBackwards={() => this.jumpBackwards()}
          jumpForwards={() => this.jumpForwards()}
          reset={() => this.reset()}
          selectCPUMode={() => this.selectCPUMode()}
          selectTwoPlayerMode={() => this.selectTwoPlayerMode()}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Game />, rootElement);
