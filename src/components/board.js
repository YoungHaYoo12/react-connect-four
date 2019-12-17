import React from "react";
import Square from "./square";
import Title from "./title";
import "./board.css";

// connect-four board
class Board extends React.Component {
  constructor(props) {
    super(props);

    // dimensions of connect-four board
    this.numOfCols = 7;
    this.numOfRows = 6;
    this.maxPossibleEntriesInDiagonal = 6;

    const colArr = Array(this.numOfCols).fill(null);
    this.state = {
      /* currentBoard represents board state; can access elements
      by row index then col index 
      */
      currentBoard: Array(this.numOfRows)
        .fill(null)
        .map(() => colArr.slice()),
      // boolean to record whose turn it is
      isRedTurn: true,
      isGameWon: false
    };
  }

  // function to render square with row and col values
  renderSquare(row, col) {
    return (
      <Square
        value={this.state.currentBoard[row][col]}
        onClick={() => this.squareClicked(row, col)}
      />
    );
  }
  // helper function to check top row currently filled in column
  topRowFilledInCol(row, col) {
    let currRow;

    // retrieve index of top row of column
    for (currRow = 0; currRow < this.numOfRows; currRow++) {
      if (this.state.currentBoard[currRow][col]) {
        return currRow;
      }
    }

    return currRow;
  }

  // update function for when square is clicked
  squareClicked(row, col) {
    // return from function if square has already been clicked or if
    // game has been won
    if (this.state.currentBoard[row][col] != null || this.state.isGameWon)
      return;

    // update currentBoard array element color
    const currentBoard = this.state.currentBoard.slice();
    const topRow = this.topRowFilledInCol(row, col);

    /* change state of square which is right above the topmost
    filled row in column */
    if (this.state.isRedTurn) {
      currentBoard[topRow - 1][col] = "red";
    } else {
      currentBoard[topRow - 1][col] = "yellow";
    }
    this.setState({ currentBoard: currentBoard });

    // check for winner; if no winner, update whose turn it is
    if (this.checkWinner(topRow - 1, col)) {
      this.setState({ isGameWon: true });
    } else {
      const isRedTurn = !this.state.isRedTurn;
      this.setState({ isRedTurn: isRedTurn });
    }
  }

  // helper function for checkWinner() in checking column 4-in-a-rows
  checkColWinner(row, col) {
    // if index out of bounds, return false
    if (row + 3 > this.numOfRows - 1) return false;

    // check if there is a 4-in-a-row downwards
    if (
      this.state.currentBoard[row][col] != null &&
      this.state.currentBoard[row][col] ===
        this.state.currentBoard[row + 1][col] &&
      this.state.currentBoard[row][col] ===
        this.state.currentBoard[row + 2][col] &&
      this.state.currentBoard[row][col] ===
        this.state.currentBoard[row + 3][col]
    ) {
      return true;
    }
    return false;
  }

  // helper function for checkWinner() in checking row 4-in-a-rows
  checkRowWinner(row, col) {
    // check if there is a 4-in-a-row in the following row
    for (let currCol = 0; currCol < this.numOfCols - 3; currCol++) {
      if (
        this.state.currentBoard[row][currCol] != null &&
        this.state.currentBoard[row][currCol] ===
          this.state.currentBoard[row][currCol + 1] &&
        this.state.currentBoard[row][currCol] ===
          this.state.currentBoard[row][currCol + 2] &&
        this.state.currentBoard[row][currCol] ===
          this.state.currentBoard[row][currCol + 3]
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
        this.state.currentBoard[row][col] ===
          this.state.currentBoard[currRow][currCol]
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
        this.state.currentBoard[row][col] ===
          this.state.currentBoard[currRow][currCol]
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

  render() {
    return (
      <div className="board-wrapper">
        <div className="top-row">
          <Title
            isRedTurn={this.state.isRedTurn}
            isGameWon={this.state.isGameWon}
          />
        </div>
        <div className="row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
          {this.renderSquare(0, 3)}
          {this.renderSquare(0, 4)}
          {this.renderSquare(0, 5)}
          {this.renderSquare(0, 6)}
        </div>
        <div className="row">
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
          {this.renderSquare(1, 3)}
          {this.renderSquare(1, 4)}
          {this.renderSquare(1, 5)}
          {this.renderSquare(1, 6)}
        </div>
        <div className="row">
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
          {this.renderSquare(2, 3)}
          {this.renderSquare(2, 4)}
          {this.renderSquare(2, 5)}
          {this.renderSquare(2, 6)}
        </div>
        <div className="row">
          {this.renderSquare(3, 0)}
          {this.renderSquare(3, 1)}
          {this.renderSquare(3, 2)}
          {this.renderSquare(3, 3)}
          {this.renderSquare(3, 4)}
          {this.renderSquare(3, 5)}
          {this.renderSquare(3, 6)}
        </div>
        <div className="row">
          {this.renderSquare(4, 0)}
          {this.renderSquare(4, 1)}
          {this.renderSquare(4, 2)}
          {this.renderSquare(4, 3)}
          {this.renderSquare(4, 4)}
          {this.renderSquare(4, 5)}
          {this.renderSquare(4, 6)}
        </div>
        <div className="row">
          {this.renderSquare(5, 0)}
          {this.renderSquare(5, 1)}
          {this.renderSquare(5, 2)}
          {this.renderSquare(5, 3)}
          {this.renderSquare(5, 4)}
          {this.renderSquare(5, 5)}
          {this.renderSquare(5, 6)}
        </div>
      </div>
    );
  }
}

export default Board;
