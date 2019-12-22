import React from "react";
import ReactDOM from "react-dom";
import Title from "./components/title";
import Board from "./components/board";
import HistoryButton from "./components/historyButton";

import "./styles.css";

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
      // records which board entry in history should be displayed
      historyIndex: 0
    };
  }

  // helper function to check top row currently filled in column
  topRowFilledInCol(row, col) {
    let currRow;

    // retrieve index of top row of column
    for (currRow = 0; currRow < this.numOfRows; currRow++) {
      if (
        this.state.history[this.state.historyIndex].currentBoard[currRow][col]
      ) {
        return currRow;
      }
    }

    return currRow;
  }

  // update function for when square is clicked
  squareClicked(row, col) {
    // return from function if square has already been clicked or if
    // game has been won
    if (
      this.state.history[this.state.historyIndex].currentBoard[row][col] !=
        null ||
      this.state.isGameWon
    )
      return;

    // update currentBoard array element color
    const currentBoard = this.state.history[
      this.state.historyIndex
    ].currentBoard.map(function(arr) {
      return arr.slice();
    });
    const topRow = this.topRowFilledInCol(row, col);
    if (this.state.isRedTurn) {
      currentBoard[topRow - 1][col] = "red";
    } else {
      currentBoard[topRow - 1][col] = "yellow";
    }

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

    this.setState(
      {
        history: history.concat([{ currentBoard: currentBoard }]),
        historyIndex: historyIndex + 1
      },
      // check for winner; if no winner, update whose turn it is
      function() {
        if (this.checkWinner(topRow - 1, col)) {
          this.setState({ isGameWon: true });
        } else {
          const isRedTurn = !this.state.isRedTurn;
          this.setState({ isRedTurn: isRedTurn });
        }
      }
    );
  }

  // helper function for checkWinner() in checking column 4-in-a-rows
  checkColWinner(row, col) {
    // if index out of bounds, return false
    if (row + 3 > this.numOfRows - 1) return false;

    const currentBoard = this.state.history[this.state.historyIndex]
      .currentBoard;

    // check if there is a 4-in-a-row downwards
    if (
      currentBoard[row][col] != null &&
      currentBoard[row][col] === currentBoard[row + 1][col] &&
      currentBoard[row][col] === currentBoard[row + 2][col] &&
      currentBoard[row][col] === currentBoard[row + 3][col]
    ) {
      return true;
    }
    return false;
  }

  // helper function for checkWinner() in checking row 4-in-a-rows
  checkRowWinner(row, col) {
    const currentBoard = this.state.history[this.state.historyIndex]
      .currentBoard;

    // check if there is a 4-in-a-row in the following row
    for (let currCol = 0; currCol < this.numOfCols - 3; currCol++) {
      if (
        currentBoard[row][currCol] != null &&
        currentBoard[row][currCol] === currentBoard[row][currCol + 1] &&
        currentBoard[row][currCol] === currentBoard[row][currCol + 2] &&
        currentBoard[row][currCol] === currentBoard[row][currCol + 3]
      ) {
        return true;
      }
    }
    return false;
  }

  /* helper function for checkDiagonalWinner() to get starting row,col
  index of diagonal A (top left to bottom right direction) */
  findStartIndexOfDiagonalA(row, col) {
    while (row !== 0 && col !== 0) {
      row--;
      col--;
    }
    return [row, col];
  }
  /* helper function for checkDiagonalWinner() to get starting row,col
  index of diagonal B (bottom left to top right direction) */
  findStartIndexOfDiagonalB(row, col) {
    while (row !== this.numOfRows - 1 && col !== 0) {
      row++;
      col--;
    }
    return [row, col];
  }

  /* helper function for checkDiagonalWinner() to check if row,col indices 
  are in range*/
  indexInRange(row, col) {
    return row < this.numOfRows && row >= 0 && col < this.numOfCols && col >= 0;
  }

  /* helper function for checkDiagonalWinner() to check for 4-in-a-rows in 
  boolean array */
  checkFourInARow(booleanArray) {
    // iterate through boolean array to determine if there are 4
    // trues in a row
    let booleanCounter = 0;

    for (let i = 0; i < this.maxPossibleEntriesInDiagonal; i++) {
      if (booleanArray[i] === true) {
        booleanCounter++;
      } else {
        booleanCounter = 0;
      }

      // check if 4-in-a-row has appeared
      if (booleanCounter >= 4) return true;
    }

    return false;
  }

  // helper function for checkWinner() in checking diagonal 4-in-a-rows
  checkDiagonalWinner(row, col) {
    const currentBoard = this.state.history[this.state.historyIndex]
      .currentBoard;
    /* boolean array to record color matches for diagonal A
    (top left to bottom right direction) and diagonal B (bottom
      left to top right) */
    const diagonalA = [];
    const diagonalB = [];

    /* push true into diagonalA if color match at currRow,currCol with
    color at row,col*/
    let currRow = this.findStartIndexOfDiagonalA(row, col)[0];
    let currCol = this.findStartIndexOfDiagonalA(row, col)[1];

    for (let index = 0; index < this.maxPossibleEntriesInDiagonal; index++) {
      if (
        this.indexInRange(currRow, currCol) &&
        currentBoard[row][col] === currentBoard[currRow][currCol]
      ) {
        diagonalA.push(true);
      } else {
        diagonalA.push(false);
      }
      currRow++;
      currCol++;
    }

    /* push true into diagonalB if color match at currRow,currCol with
    color at row,col*/
    currRow = this.findStartIndexOfDiagonalB(row, col)[0];
    currCol = this.findStartIndexOfDiagonalB(row, col)[1];

    for (let index = 0; index < this.maxPossibleEntriesInDiagonal; index++) {
      if (
        this.indexInRange(currRow, currCol) &&
        currentBoard[row][col] === currentBoard[currRow][currCol]
      ) {
        diagonalB.push(true);
      } else {
        diagonalB.push(false);
      }
      currRow--;
      currCol++;
    }

    // check if 4-in-a-row has appeared in diagonalA or diagonalB
    return this.checkFourInARow(diagonalA) || this.checkFourInARow(diagonalB);
  }

  // check if there is a winner (four-in-a-row)
  checkWinner(row, col) {
    return (
      this.checkColWinner(row, col) ||
      this.checkRowWinner(row, col) ||
      this.checkDiagonalWinner(row, col)
    );
  }

  // function for HistoryButton to allow user to go back to a previous state of the board
  jumpBackwards() {
    // return if historyIndex would go out of range or if game has been won
    const historyIndex = this.state.historyIndex - 1;
    if (historyIndex < 0 || this.state.isGameWon) return;

    this.setState({
      historyIndex: this.state.historyIndex - 1,
      isRedTurn: !this.state.isRedTurn
    });
  }

  // function for HistoryButton to allow user to go back to a previous state of the board
  jumpForwards() {
    // return if historyIndex would go out of range or if game has been won
    const historyIndex = this.state.historyIndex + 1;
    if (historyIndex > this.state.history.length - 1 || this.state.isGameWon)
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
      historyIndex: 0
    });
  }
  /*
        <div className="top-row">
          <Title
            className=""
            isRedTurn={this.state.isRedTurn}
            isGameWon={this.state.isGameWon}
          />
        </div>
*/
  render() {
    const history = this.state.history;
    const currentBoard = history[this.state.historyIndex].currentBoard;
    return (
      <div className="game">
        <Title
          className=""
          isRedTurn={this.state.isRedTurn}
          isGameWon={this.state.isGameWon}
        />
        <Board
          className=""
          currentBoard={currentBoard}
          history={this.state.history}
          historyIndex={this.state.historyIndex}
          isGameWon={this.state.isGameWon}
          isRedTurn={this.state.isRedTurn}
          squareClicked={(row, col) => this.squareClicked(row, col)}
        />

        <HistoryButton
          className="historyButton"
          jumpBackwards={() => this.jumpBackwards()}
          jumpForwards={() => this.jumpForwards()}
          reset={() => this.reset()}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Game />, rootElement);
