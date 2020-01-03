/* File contains the the code needed to run the AI in Connect Four game*/
import { heuristic1Evaluation } from "./heuristics/minimaxHeuristic1";
const BoardFunctions = require("./BoardHelperFunctions.js");

// constants representing dimensions of board
const numOfCols = 7;
const numOfRows = 6;

// function that enables AI to make a move based on Minimax Algorithm
// difficulty level represents the depth of the minimax algorithm
function aiTurn(currentBoard, difficultyLevel) {
  currentBoard = BoardFunctions.copyOfBoard(currentBoard);

  // from minimax result, get the column of best placement
  const minimaxResult = alphabeta(
    currentBoard,
    difficultyLevel,
    Number.NEGATIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    true
  );
  const bestColumn = minimaxResult[0];

  // return the (row,col) index that is returned from alphabeta()
  return [0, bestColumn];
}

// helper function for alphabeta to get a list of all non-filled columns
function availableColumns(currentBoard) {
  let availableCols = [];
  for (let col = 0; col < numOfCols; col++) {
    if (!BoardFunctions.isColFilled(currentBoard, col)) {
      availableCols.push(col);
    }
  }
  return availableCols;
}

/* helper function for alphabeta to randomly pick a column out of all available 
columns */
function randomAvailableCol(currentBoard) {
  const availableCols = availableColumns(currentBoard);

  // no available col case
  if (availableCols.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * availableCols.length);
  return availableCols[randomIndex];
}

// minimax algorithm with alpha beta pruning implemented; computer will be
// maximizing player; returns the best column and best score
function alphabeta(currentBoard, depth, a, b, maximizingPlayer) {
  // BASE CASES
  // Base Case 1: winner
  // if human player wins
  if (BoardFunctions.generalWinner(currentBoard, "red")) {
    return [null, Number.NEGATIVE_INFINITY];
  }
  // if computer wins
  if (BoardFunctions.generalWinner(currentBoard, "yellow")) {
    return [null, Number.POSITIVE_INFINITY];
  }

  // Base Case 2: No more moves (TIE)
  if (BoardFunctions.isBoardFilled(currentBoard)) {
    return [null, 0];
  }

  // Base Case 3: depth == 0
  if (depth === 0) {
    // subtract human's (red) total heuristic points from computer's (yellow) total heuristic points
    return [
      null,
      heuristic1Evaluation(currentBoard, "yellow") -
        heuristic1Evaluation(currentBoard, "red")
    ];
  }

  // if computer turn
  if (maximizingPlayer) {
    let bestVal = Number.NEGATIVE_INFINITY;
    let bestColumn = randomAvailableCol(currentBoard);
    // iterate over the possibility of inserting in each unfilled column
    for (let col = 0; col < numOfCols; col++) {
      if (!BoardFunctions.isColFilled(currentBoard, col)) {
        // update board with index(topRow,col) filled in
        const topRow = BoardFunctions.topRowFilledInCol(currentBoard, 0, col);
        let updatedBoard = BoardFunctions.copyOfBoard(currentBoard);
        updatedBoard = BoardFunctions.updateBoard(
          updatedBoard,
          topRow,
          col,
          -1
        );
        let newVal = alphabeta(updatedBoard, depth - 1, a, b, false)[1];
        if (newVal > bestVal) {
          bestVal = newVal;
          bestColumn = col;
        }

        // alpha beta pruning
        a = Math.max(a, bestVal);
        if (a >= b) {
          break;
        }
      }
    }
    return [bestColumn, bestVal];
  }

  // if human turn
  if (!maximizingPlayer) {
    let bestVal = Number.POSITIVE_INFINITY;
    let bestColumn = randomAvailableCol(currentBoard);

    // iterate over the possibility of inserting in each unfilled column
    for (let col = 0; col < numOfCols; col++) {
      if (!BoardFunctions.isColFilled(currentBoard, col)) {
        // update board with index(topRow,col) filled in
        const topRow = BoardFunctions.topRowFilledInCol(currentBoard, 0, col);
        let updatedBoard = BoardFunctions.copyOfBoard(currentBoard);
        updatedBoard = BoardFunctions.updateBoard(
          updatedBoard,
          topRow,
          col,
          +1
        );
        let newVal = alphabeta(updatedBoard, depth - 1, a, b, true)[1];
        if (newVal < bestVal) {
          bestVal = newVal;
          bestColumn = col;
        }

        // alpha beta pruning
        b = Math.min(b, bestVal);
        if (a >= b) {
          break;
        }
      }
    }
    return [bestColumn, bestVal];
  }
}

module.exports = {
  aiTurn
};
