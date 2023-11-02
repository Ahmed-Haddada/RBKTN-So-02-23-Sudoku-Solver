class Board extends EventEmitter {
  constructor(board) {
    super();

    this.board = board || [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }

  getRow(index) {
    return this.board[index];
  }

  updateBoard(newBoard) {
    this.board = newBoard;
  }

  getCol(index) {
    const result = [];
    for (let i = 0; i < this.board.length; i++) {
      result.push(this.board[i][index]);
    }
    return result;
  }

  generateBoard() {
    const hardPuzzle = [
      ["", "", 2, "", "", "", "", "", ""],
      ["", "", 9, "", "", "", "", "", ""],
      ["", 4, "", "", "", "", "", 6, ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", 5, 9, "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      [7, "", "", "", "", "", 4, "", 2],
      ["", 8, "", "", "", "", "", "", ""],
    ];

    this.board = hardPuzzle;
    this.emit("boardGenerated", hardPuzzle);
  }

  clearBoard() {
    const emptyPuzzle = [
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", ""],
    ];
    this.board = emptyPuzzle;
    this.emit("boardcleared", emptyPuzzle);
  }

  getBox(rowIndex, colIndex) {
    const result = [];
    const boxRowStart = rowIndex - (rowIndex % 3);
    const boxColStart = colIndex - (colIndex % 3);

    for (let r = boxRowStart; r < boxRowStart + 3; r++) {
      for (let d = boxColStart; d < boxColStart + 3; d++) {
        result.push(this.board[r][d]);
      }
    }
    return result;
  }

  getBoxByIndex(index) {
    const result = [];
    const startingRow = Math.floor(index / 3) * 3;
    const startingCol = Math.floor(index % 3) * 3;
    for (let r = startingRow; r < startingRow + 3; r++) {
      for (let d = startingCol; d < startingCol + 3; d++) {
        result.push(this.board[r][d]);
      }
    }
    return result;
  }
  /*
           _             _     _
       ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
      / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
      \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
      |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)
  
   */

  /*=========================================================================
  =                 TODO: fill in these Checker Functions                    =
  =========================================================================*/

  rowSafe(row, num) {
    return !this.getRow(row).includes(num);
  }
  colSafe(col, num) {
    return !this.getCol(col).includes(num);
  }

  boxSafe(row, col, num) {
    return !this.getBox(row, col).includes(num);
  }

  rowValidAt(rowIndex) {
    var row = this.getRow(rowIndex);
    for (let i = 0; i < row.length; i++) {
      // if(row[i] === '')return false

      if (row.indexOf(row[i]) !== i && row[i]) {
        return false;
      }
    }
    return true;
  }

  colValidAt(colIndex) {
    //check if a column is valid at a given index
    var col = this.getCol(colIndex);
    for (let i = 0; i < col.length; i++) {
      if (col.lastIndexOf(col[i]) !== i && col[i]) {
        return false;
      }
    }
    return true;
  }

  boxValidAt(boxIndex) {
    //check if a box is valid at a given index
    var cube = this.getBoxByIndex(boxIndex);
    for (let i = 0; i < cube.length; i++) {
      // if (cube[i] === '') return false

      if (cube.indexOf(cube[i]) !== i && cube[i]) {
        return false;
      }
    }
    return true;
  }

  allRowsValid() {
    //check if all the rows in the board are valid
    for (let i = 0; i <= 8; i++) {
      if (!this.rowValidAt(i)) return false;
    }
    return true;
  }
  allColsValid() {
    for (let i = 0; i <= 8; i++) {
      if (!this.colValidAt(i)) return false;
    }
    return true;
  }

  allBoxesValid() {
    //check if all the boxes in the board are valid
    for (let i = 0; i <= 8; i++) {
      if (!this.boxValidAt(i)) return false;
    }
    return true;
  }

  validBoard() {
    return this.allBoxesValid() && this.allColsValid() && this.allRowsValid();
  }

  isSafe(row, col, num) {
    return (
      this.rowSafe(row, num) &&
      this.colSafe(col, num) &&
      this.boxSafe(row, col, num)
    );
  }

  /*=========================================================================
  =                 TODO: fill in these Solver Functions                    =
  =========================================================================*/

  solve(row = 0, col = 0, num = 1) {
    /*  solve(row = 0, col = 0, num = 1) {
      if (col == 9) {
        return true;
      } else if (row == 9) {
        return this.solve(0, col + 1);
      } else {
        if (
          this.board[row][col] === 0 ||
          this.board[row][col] === "" ||
          this.board[row][col] > 9
        ) {
          while (num <= 9) {
            if (this.isSafe(row, col, num)) {
              this.board[row][col] = num;
              this.updateBoard(this.board);

              if (this.solve(row + 1, col)) {
                return true;
              } else {
                this.board[row][col] = 0;
                this.updateBoard(this.board);
              }
            }
            num++;
          }
          return false;
        } else {
          return this.solve(row + 1, col);
        }
      }
    } */
    // -------------------------------------------------------------------------------------------------------------
    /* //BaseCases{
    //  If num is greater than 9, no solution is possible for the current cell
    if (num > 9) {
      return false;
    }
    // If colIndex reaches 9, move to the next row
    if (col === 9) {
      row++;
      col = 0;
    }
    //  If rowIndex reaches 9, the puzzle is solved
    if (row === 9) {
      return true;
    }
    //}

    // If the current cell is not empty, move to the next cell
    if (this.getRow(row)[col]) {
      return this.solve(row, col + 1);
    }
    // If the current number is safe, update the cell and move to the next cell
    if (this.isSafe(row, col, num)) {
      this.getRow(row)[col] = num;
      // Recursive call: Check if the current number leads to a solution
      if (this.solve(row, col + 1)) return this.board;
      // If the current number doesn't lead to a solution, undo the last   change
      this.getRow(row)[col] = 0;
    }
    // Try the next number in the current cell
    return this.solve(row, col, num + 1); */
  }

  solveBoard() {
    while (this.validBoard()) {
      if (this.solve()) {
        this.emit("validBoard", this.board);
        return true;
      }
      return false;
    }
    this.emit("invalidBoard");
    return false;
    // dont forget to add a small change here 😉
  }
}

// if (
//   this.board[row][col] === 0
//  || this.board[row][col] === ""
//   ||this.board[row][col] > 9
// ) {
//   return false;
// }
//   if(num>9){
//     return
//   }
//   if (col === 9) {
//     row++
//     col=0

//   }
//   if (row === 9) {
//     return true
//   }

//   if (this.getRow[row][col] ) {
//     return this.solve(row, col+1)
//   }

//   if (this.isSafe(row, col, num)) {
//     this.board[row][col] = num
//     if (this.solve(row, col+1)) {
//       return this.board
//     }
//     this.board[row][col]=0

// }

//  return this.solve(row, col, num++)
