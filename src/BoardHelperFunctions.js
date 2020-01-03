/* Contains helper functions related to board win checks, copying boards, filled columns
IMPORTANT NOTE: FILE IS DIVIDED INTO THREE PARTS:
  PART 1 PERTAINS TO WIN CHECKS WHEN A ROW,COL IS PRESSED DURING THE GAME
  PART 2 PERTAINS TO WIN CHECKS DURING THE AI's MINIMAX ALGORITHM
  PART 3 PERTAINS TO EXTRA FUNCTIONS REGARDING TIES, FILLED COLUMNS, BOARD COPYING, AND BOARD UPDATING
The reason Part 1 and Part 2 are split is due to the fact that when a player
presses a specific row or column, we can optimize our code to check only 
4-in-a-rows pertaining to that added piece. However, with our Minimax algorithm 
structure, it becomes necessary to search the entire board */

// constants representing dimensions of board
const numOfCols = 7;
const numOfRows = 6;
const maxPossibleEntriesInDiagonal = 6;

// ------------------------------------------------------------------------------
// PART 1
// helper function for checkWinner() in checking column 4-in-a-rows
function specificCheckColWinner(board, row, col) {
  // if index out of bounds, return false
  if (row + 3 > numOfRows - 1) return false;

  // check if there is a 4-in-a-row downwards
  if (
    board[row][col] != null &&
    board[row][col] === board[row + 1][col] &&
    board[row][col] === board[row + 2][col] &&
    board[row][col] === board[row + 3][col]
  ) {
    return true;
  }
  return false;
}

// helper function for checkWinner() in checking row 4-in-a-rows
function specificCheckRowWinner(board, row, col) {
  // check if there is a 4-in-a-row in the following row
  for (let currCol = 0; currCol < numOfCols - 3; currCol++) {
    if (
      board[row][currCol] != null &&
      board[row][currCol] === board[row][currCol + 1] &&
      board[row][currCol] === board[row][currCol + 2] &&
      board[row][currCol] === board[row][currCol + 3]
    ) {
      return true;
    }
  }
  return false;
}

/* helper function for checkDiagonalWinner() to get starting row,col
  index of diagonal A (top left to bottom right direction) */
function findStartIndexOfDiagonalA(row, col) {
  while (row !== 0 && col !== 0) {
    row--;
    col--;
  }
  return [row, col];
}
/* helper function for checkDiagonalWinner() to get starting row,col
  index of diagonal B (bottom left to top right direction) */
function findStartIndexOfDiagonalB(row, col) {
  while (row !== numOfRows - 1 && col !== 0) {
    row++;
    col--;
  }
  return [row, col];
}

/* helper function for checkDiagonalWinner() to check if row,col indices 
  are in range*/
function indexInRange(row, col) {
  return row < numOfRows && row >= 0 && col < numOfCols && col >= 0;
}

/* helper function for checkDiagonalWinner() to check for 4-in-a-rows in 
  boolean array */
function checkFourInARow(booleanArray) {
  // iterate through boolean array to determine if there are 4
  // trues in a row
  let booleanCounter = 0;

  for (let i = 0; i < maxPossibleEntriesInDiagonal; i++) {
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
function specificCheckDiagonalWinner(board, row, col) {
  /* boolean array to record color matches for diagonal A
    (top left to bottom right direction) and diagonal B (bottom
      left to top right) */
  const diagonalA = [];
  const diagonalB = [];

  /* push true into diagonalA if color match at currRow,currCol with
    color at row,col*/
  let currRow = findStartIndexOfDiagonalA(row, col)[0];
  let currCol = findStartIndexOfDiagonalA(row, col)[1];

  for (let index = 0; index < maxPossibleEntriesInDiagonal; index++) {
    if (
      indexInRange(currRow, currCol) &&
      board[row][col] === board[currRow][currCol]
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
  currRow = findStartIndexOfDiagonalB(row, col)[0];
  currCol = findStartIndexOfDiagonalB(row, col)[1];

  for (let index = 0; index < maxPossibleEntriesInDiagonal; index++) {
    if (
      indexInRange(currRow, currCol) &&
      board[row][col] === board[currRow][currCol]
    ) {
      diagonalB.push(true);
    } else {
      diagonalB.push(false);
    }
    currRow--;
    currCol++;
  }

  // check if 4-in-a-row has appeared in diagonalA or diagonalB
  return checkFourInARow(diagonalA) || checkFourInARow(diagonalB);
}

// check if there is a winner (four-in-a-row)
function specificCheckWinner(board, row, col) {
  return (
    specificCheckColWinner(board, row, col) ||
    specificCheckRowWinner(board, row, col) ||
    specificCheckDiagonalWinner(board, row, col)
  );
}
// ------------------------------------------------------------------------------
// PART 2
// checks entire board for column 4-in-a-row
function generalRowWinner(board, color) {
  for (let row = 0; row < numOfRows; row++) {
    for (let col = 0; col < numOfCols - 3; col++) {
      if (
        indexInRange(row, col) &&
        indexInRange(row, col + 1) &&
        indexInRange(row, col + 2) &&
        indexInRange(row, col + 3) &&
        board[row][col] === color &&
        board[row][col + 1] === color &&
        board[row][col + 2] === color &&
        board[row][col + 3] === color
      )
        return true;
    }
  }
  return false;
}

// checks entire board for row 4-in-a-row
function generalColWinner(board, color) {
  for (let col = 0; col < numOfCols; col++) {
    for (let row = 0; row < numOfRows - 3; row++) {
      if (
        indexInRange(row, col) &&
        indexInRange(row + 1, col) &&
        indexInRange(row + 2, col) &&
        indexInRange(row + 3, col) &&
        board[row][col] === color &&
        board[row + 1][col] === color &&
        board[row + 2][col] === color &&
        board[row + 3][col] === color
      )
        return true;
    }
  }
  return false;
}

/* helper function for generalDiagonalWinner() for negatively
angled diagonals */
function generalNegativeDiagonalWinner(board, color) {
  for (let col = 0; col < numOfCols - 3; col++) {
    for (let row = 0; row < numOfRows - 3; row++) {
      if (
        indexInRange(row, col) &&
        indexInRange(row + 1, col + 1) &&
        indexInRange(row + 2, col + 2) &&
        indexInRange(row + 3, col + 3) &&
        board[row][col] === color &&
        board[row + 1][col + 1] === color &&
        board[row + 2][col + 2] === color &&
        board[row + 3][col + 3] === color
      )
        return true;
    }
  }
  return false;
}

/* helper function for generalDiagonalWinner() for positively
angled diagonals */
function generalPositiveDiagonalWinner(board, color) {
  for (let col = 0; col < numOfCols - 3; col++) {
    for (let row = numOfRows - 3; row < numOfRows; row++) {
      if (
        indexInRange(row, col) &&
        indexInRange(row - 1, col + 1) &&
        indexInRange(row - 2, col + 2) &&
        indexInRange(row - 3, col + 3) &&
        board[row][col] === color &&
        board[row - 1][col + 1] === color &&
        board[row - 2][col + 2] === color &&
        board[row - 3][col + 3] === color
      )
        return true;
    }
  }
  return false;
}
// checks entire board for diagonal 4-in-a-row
function generalDiagonalWinner(board, color) {
  return (
    generalPositiveDiagonalWinner(board, color) ||
    generalNegativeDiagonalWinner(board, color)
  );
}

// checks entire board for 4-in-a-row
function generalWinner(board, color) {
  return (
    generalColWinner(board, color) ||
    generalRowWinner(board, color) ||
    generalDiagonalWinner(board, color)
  );
}
// ------------------------------------------------------------------------------
// PART 3
// helper function for checkFilled that returns whether a column is filled
function isColFilled(board, col) {
  if (board[0][col] != null) return true;
  return false;
}

// check if all squares have been filled
function isBoardFilled(board) {
  for (let col = 0; col < numOfCols; col++) {
    if (!isColFilled(board)) return false;
  }
  return true;
}

// helper function to check top row currently filled in column
function topRowFilledInCol(board, row, col) {
  let currRow;

  // retrieve index of top row of column
  for (currRow = 0; currRow < numOfRows; currRow++) {
    if (board[currRow][col]) {
      return currRow;
    }
  }

  return currRow;
}

// helper function to return copy of a board
function copyOfBoard(board) {
  return board.map(function(arr) {
    return arr.slice();
  });
}

/* helper function to update color of square on board
  Takes in the topRow and col (index where piece is inserted as arguments)
  For color argument: -1 is yellow, 0 is null, +1 is red */
function updateBoard(board, topRow, col, color) {
  // update currentBoard array element color
  if (color === 1) {
    board[topRow - 1][col] = "red";
  } else if (color === -1) {
    board[topRow - 1][col] = "yellow";
  } else {
    board[topRow - 1][col] = null;
  }
  return board;
}

module.exports = {
  specificCheckWinner,
  isColFilled,
  isBoardFilled,
  generalWinner,
  topRowFilledInCol,
  copyOfBoard,
  updateBoard
};
