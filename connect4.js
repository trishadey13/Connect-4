/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
const makeBoard = () => {
  board = Array(HEIGHT).fill().map(()=>Array(WIDTH).fill())
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');

  // Create column-top row,players will click column-tops to specify their move
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.classList = "spotsLeft";
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create board grid of HEIGHTxWIDTH size
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = x => {
  for (let y = HEIGHT-1; y>=0; y--) {
    if (board[y][x] === undefined) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => {
  // make a div and insert into correct table cell
  const newPiece = document.createElement('div');
  newPiece.classList = "piece";
  newPiece.classList.add(`player${currPlayer}`);
  const piecePlace = document.getElementById(`${y}-${x}`);
  piecePlace.append(newPiece);
}

/** endGame: announce game end */
const endGame = msg => alert(msg);

/** handleClick: handle click of column top to play piece */
const handleClick =evt => {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  } else if (y ===0) {
    evt.target.classList = "noSpotsLeft";
  }

  // place piece in board and add to HTML table and update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie, check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(val => val !== undefined))) {
    endGame('Tie!');
  }

  // switch players
  (currPlayer === 1) ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
const checkForWin = () => {
  const _win = cells =>
    /** Check four cells to see if they're all color of current player
    *  - cells: list of four (y, x) cells
    *  - returns true if all are legal coordinates & all match currPlayer
    */
    cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );


  // iterate through whole board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // for every cell, check 4 horizontal, vertical, and diagonal cells
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      // if any show up as the same color, then that player wins
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();