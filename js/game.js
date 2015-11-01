function Cell(row, col) {
    this.row = row;
    this.col = col;
    this.isAlive = false;
    this.nextIsAlive = false;

    this.updateState = function () {
        this.isAlive = this.nextIsAlive;
    };
}




var CONFIG = {
    aliveCellColor: "yellow",
    deadCellColor: "black",
    rows: 40,
    cols: 60
};

var GameOfLife = {
    cells: [],
    generateCells: function (rows, cols) {
        var i, j;
        for (i = 0; i < rows; i = i + 1) {
            for (j = 0; j < cols; j = j + 1) {
                this.cells.push(new Cell(i, j));
            }
        }
    },
    table: undefined,
    getTable: function () {
        if (this.table === undefined) {
            this.table = document.getElementById("board");
        }
        return this.table;
    },
    drawCells: function (table) {
        var trString, tdString, i, j;
        for (i = 0; i < CONFIG.rows; i = i + 1) {
            trString += "<tr></tr>";
        }
        for (j = 0; j < CONFIG.cols; j = j + 1) {
            tdString += "<td></td>";
        }
        table.append(trString).find("tr").append(tdString);
    },
    handleCellClick: function (clickedCell) {
        var col = clickedCell.parent().children().index(clickedCell);
        var row = clickedCell.parent().parent().children().index(clickedCell.parent());
        this.updateCell(this.getCell(row, col), true);
        this.getNeighbours(this.getCell(row, col));
    },
    updateCell: function (cell, changeState) {
        var tableRow = this.getTable().rows[cell.row];
        var tableCell = tableRow.cells[cell.col];

        if (changeState) {
            cell.isAlive = !cell.isAlive;
        }

        if (cell.isAlive) {
            tableCell.style.backgroundColor = CONFIG.aliveCellColor;
        } else {
            tableCell.style.backgroundColor = CONFIG.deadCellColor;
        }
    },
    getCell: function (row, col) {
        if (row >= 0 && row < CONFIG.rows && col >= 0 && col < CONFIG.cols) {
            return this.cells[CONFIG.cols * row + (col % CONFIG.cols)];
        } else {
            return null;
        }
    },
    getNeighbours: function (cell) {
        var cellArray = [];

        cellArray.push(this.getCell(cell.row - 1, cell.col));
        cellArray.push(this.getCell(cell.row, cell.col - 1));
        cellArray.push(this.getCell(cell.row - 1, cell.col - 1));
        cellArray.push(this.getCell(cell.row + 1, cell.col));
        cellArray.push(this.getCell(cell.row, cell.col + 1));
        cellArray.push(this.getCell(cell.row + 1, cell.col + 1));
        cellArray.push(this.getCell(cell.row + 1, cell.col - 1));
        cellArray.push(this.getCell(cell.row - 1, cell.col + 1));

        for (var i = cellArray.length; i--;) {
            if (cellArray[i] === null) {
                cellArray.splice(i, 1);
            }
        }
        return cellArray;
    },
    setNextState: function (cell) {
        var liveNeighboursArray = this.getNeighbours(cell).filter(function (obj) {
            return obj.isAlive === true;
        });

        cell.nextIsAlive = false;

        if (cell.isAlive) {
            if (liveNeighboursArray.length == 2 || liveNeighboursArray.length == 3) {
                cell.nextIsAlive = true;
            }
        } else {
            if (liveNeighboursArray.length == 3) {
                cell.nextIsAlive = true;
            }

        }
    },
    play: function () {
        for (var i = 0, len = this.cells.length; i < len; i = i + 1) {
            this.setNextState(this.cells[i]);
        }
        for (var i = 0, len = this.cells.length; i < len; i = i + 1) {
            var currentCell = this.cells[i];
            currentCell.updateState();
            this.updateCell(currentCell, false);
        }
    },
    playXTimes: function (howMany) {
        var i;
        for (i = 0; i < howMany; i++) {
            this.play();
        }
    }
};


(function () {

}());

// TODO list:
// setInterval
// randomize
// load presets
// color picker
// let user to config something