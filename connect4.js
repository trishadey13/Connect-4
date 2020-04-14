/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 class Game {
   constructor(height, width, player1, player2) {
    this.width = width;
    this.height = height;
    this.board = [];
    this.player1 = player1;
    this.player2 = player2;
    this.currPlayer = this.player1;
    this.makeBoard();
    this.makeHtmlBoard();
   }

  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    this.parentHandleClick = this.handleClick.bind(this)
    top.addEventListener('click', this.parentHandleClick);
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.classList = "spotsLeft";
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    board.append(top);
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.playerColor;
    piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    const top = document.querySelector('#column-top');
    top.removeEventListener('click', this.parentHandleClick);
    alert(msg);
    const boardRows = document.querySelectorAll('#board tr');
    for (let row of boardRows) {
      row.remove();
    }
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    } else if (y ===0){
      evt.target.classList = "noSpotsLeft";
    }
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.playerColor} player wins!`);
    }
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    } 
    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player {
  constructor(playerColor) {
    this.playerColor = playerColor;
  }
}

const startButton = document.querySelector('#start-button');
startButton.addEventListener('click', () => {
  // color validation to make sure players aren't the same color or invalid colors
  let player1Color = document.querySelector('#player1-color').value;
  let player2Color = document.querySelector('#player2-color').value;
  let checkColor1 = new Option().style;
  let checkColor2 = new Option().style;
  checkColor1.color = player1Color;
  checkColor2.color = player2Color;
  if(checkColor1.color  !== player1Color || checkColor2.color !== player2Color ||
    player1Color === "" || player2Color === "") {
    alert('Both players need to be valid colors!');
  } else if (player1Color === player2Color) {
    alert('Both players cannot be the same color!');
  } else {
    new Game (6,7, new Player(player1Color), new Player(player2Color));
  }
});