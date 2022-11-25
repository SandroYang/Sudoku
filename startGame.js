const sudokuBoard = document.querySelector("#sudoku");
const squares = 81;
const board_size = 9;
const boxs = [];
var numSelected = null;
var cellSelected = null;
var errors = 0;
var board = [
    [2, 0, 6, 8, 5, 0, 0, 0, 0],
    [5, 8, 0, 0, 0, 0, 2, 0, 1],
    [0, 0, 0, 9, 0, 2, 8, 0, 0],
    [6, 0, 0, 0, 0, 0, 4, 0, 0],
    [8, 0, 1, 4, 0, 0, 0, 0, 9],
    [0, 7, 4, 0, 2, 8, 3, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [4, 9, 3, 1, 8, 5, 0, 0, 0],
    [0, 0, 0, 0, 9, 0, 0, 3, 4]
];
var copiedBoard = [
    [2, 0, 6, 8, 5, 0, 0, 0, 0],
    [5, 8, 0, 0, 0, 0, 2, 0, 1],
    [0, 0, 0, 9, 0, 2, 8, 0, 0],
    [6, 0, 0, 0, 0, 0, 4, 0, 0],
    [8, 0, 1, 4, 0, 0, 0, 0, 9],
    [0, 7, 4, 0, 2, 8, 3, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [4, 9, 3, 1, 8, 5, 0, 0, 0],
    [0, 0, 0, 0, 9, 0, 0, 3, 4]
];

const cells = [];
var c = 0;

function nextEmptySpot(board) {
    for (var i = 0; i < board_size; i++) {
        for (var j = 0; j < board_size; j++) {
            if (board[i][j] === 0) 
                return [i, j];
        }
    }
    return [-1, -1];
}

function isNumberInTheRow(board, row, value) {
    for (let i = 0; i < board[row].length; i++) {
        if (board[row][i] === value) {
            return false;
        }
    }
    return true;
}

function isNumberInTheColumn(board, column, value) {
    for (let i = 0; i < board.length; i++) {
        if (board[i][column] === value) {
            return false;
        }
    }
    return true;
}

function isNumberInTheBox(board, row, column, value) {
    let boxRow = Math.floor(row / 3) * 3;
    let boxColumn = Math.floor(column / 3) * 3; 
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRow + i][boxColumn + j] === value) {
                return false;
            }
        }
    }
    return true;
}

function isPlacementValid (board, row, column, value) {
    if (isNumberInTheRow(board, row, value) && isNumberInTheColumn(board, column, value) && isNumberInTheBox(board, row, column, value)) {
        return true;
    }
    return false;
}

function solveBoard(board) {
    var emptySpot = nextEmptySpot(board);
    var row = emptySpot[0];
    var column = emptySpot[1];
    if (row === -1) {
        return board;
    } 
    for (let num = 1; num <= board_size; num++) {
        if (isPlacementValid(board, row, column, num)) {
            board[row][column] = num;
            solveBoard(board);
        }
    }
    if (nextEmptySpot(board)[0] !== -1) {
        board[row][column] = 0;
    }
    return board;
}

function selectCell() {
    if (cellSelected != null) {
        cellSelected.classList.remove("cell-selected");
    }
    cellSelected = this;
    cellSelected.classList.add("cell-selected");
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    } 
    numSelected = this;
    numSelected.classList.add("number-selected");
}

for(let i = 0; i < board_size; i++){
    const newDiv = document.createElement("div");
    newDiv.classList.add('sudoku__box');
    boxs.push(newDiv);
    sudokuBoard.appendChild(boxs[i]);
}

for (let i  = 0; i < squares; i++) {
    const inputElelemt = document.createElement("input");
    inputElelemt.setAttribute('cell', 'true');
    inputElelemt.setAttribute('type', 'String');
    inputElelemt.setAttribute('min', '1');
    inputElelemt.setAttribute('max', '9');
    inputElelemt.addEventListener("click", selectCell);
    inputElelemt.addEventListener("click", putNumber);
    boxs[Math.floor(i / 9)].appendChild(inputElelemt);
}

for(let boxOffset = 0; boxOffset < 3; boxOffset++) {
    for(let offset = 0; offset < 3; offset++) {
        boxs.slice(boxOffset * 3, boxOffset * 3 + 3).forEach(box => {
            const cells_ = box.querySelectorAll('input[cell]');
            cells.push(cells_[offset * 3]);
            cells.push(cells_[offset * 3 + 1]);
            cells.push(cells_[offset * 3 + 2]);
        });   
    }
}

cells.forEach((cell, i) => {
    cell.setAttribute('id', i);
});

cells.forEach((cell, i) => {
    cell.setAttribute('r', Math.floor(i / 9));
    cell.setAttribute('c', c);
    c++
    if (c == 9) {
        c = 0;
    }
})

function render(board) {
    for(let i = 0; i < board.length; i++)
        for(let j = 0; j < board[i].length; j++) {
            if (board[i][j] != 0) {
                sudokuBoard.querySelector('input[id="'+(i*9 + j)+'"]').value = board[i][j];
            }
        }
}

render(board);

for (let i = 1; i <= board_size; i++) {
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    document.getElementById("numbers").appendChild(number);
}

function showResult() {
    var solvedBoard = solveBoard(board);
    render(solvedBoard);
}

function putNumber() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }
        var r = this.getAttribute('r');
        var c = this.getAttribute('c');
        var solvedBoard = solveBoard(board);
        if (solvedBoard[r][c] == numSelected.id) {
            this.value = numSelected.id;
        }
        else {
            errors += 1;
            document.getElementById("errorCounter").innerText = errors;
        }
    }
}




