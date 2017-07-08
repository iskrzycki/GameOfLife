var CONFIG = {
    aliveCellColor: "yellow",
    deadCellColor: "black",
    rows: 20,
    cols: 30,
    animationInterval: 500
};

var GameOfLife = {
    cells: [],
    generateCells: function (rows, cols) {
        var i, j, len;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                this.cells.push(new Cell(i, j));
            }
        }
        for (i = 0, len = this.cells.length; i < len; i++) {
            this.cells[i].generateNeighbours();
            this.cells[i].redraw();
        }
    },
    table: undefined,
    getTable: function () {
        return this.table || document.getElementById("board");
    },
    prepareBoard: function () {
        var trString, tdString, i, j;
        for (i = 0; i < CONFIG.rows; i++) {
            trString += "<tr></tr>";
        }
        for (j = 0; j < CONFIG.cols; j++) {
            tdString += "<td></td>";
        }
        $("#board").append(trString).find("tr").append(tdString);
        this.generateCells(CONFIG.rows, CONFIG.cols);

         $("#board td").click(function (e) {
            GameOfLife.handleCellClick($(this));
            e.stopPropagation();
        });
    },
    handleCellClick: function (clickedCell) {
        var parent = clickedCell.parent();
        var col = parent.children().index(clickedCell);
        var row = parent.parent().children().index(parent);
        var selectedCell = this.getCell(row, col);
        selectedCell.toggleState();
        selectedCell.redraw();
    },
    getCell: function (row, col) {
        if (row >= 0 && row < CONFIG.rows && col >= 0 && col < CONFIG.cols) {
            return this.cells[CONFIG.cols * row + (col % CONFIG.cols)];
        }
        return null;
    },
    getNeighbours: function (cell) {
        var cellArray = [], i = 8;

        cellArray.push(this.getCell(cell.row - 1, cell.col));
        cellArray.push(this.getCell(cell.row, cell.col - 1));
        cellArray.push(this.getCell(cell.row - 1, cell.col - 1));
        cellArray.push(this.getCell(cell.row + 1, cell.col));
        cellArray.push(this.getCell(cell.row, cell.col + 1));
        cellArray.push(this.getCell(cell.row + 1, cell.col + 1));
        cellArray.push(this.getCell(cell.row + 1, cell.col - 1));
        cellArray.push(this.getCell(cell.row - 1, cell.col + 1));

        for (; i--;) {
            if (cellArray[i] === null) {
                cellArray.splice(i, 1);
            }
        }

        return cellArray;
    },
    setNextState: function (cell) {
        var liveNeighboursArray = cell.neighbours.filter(function (obj) {
            return obj.isAlive === true;
        });

        cell.nextIsAlive = false;

        if (cell.isAlive) {
            if (liveNeighboursArray.length == 2 || liveNeighboursArray.length == 3) {
                cell.nextIsAlive = true;
            }
        } else if (liveNeighboursArray.length == 3) {
            cell.nextIsAlive = true;
        }
    },
    play: function () {
        var i, len = this.cells.length, currentCell;
        for (i = 0; i < len; i++) {
            this.setNextState(this.cells[i]);
        }
        for (i = 0; i < len; i++) {
            currentCell = this.cells[i];
            currentCell.updateState();
            currentCell.redraw();
        }
    },
    playXTimes: function (howMany) {
        var i;
        for (i = 0; i < howMany; i++) {
            this.play();
        }
    },
    animate: function () {
        // TODO: toggle animation with clearInterval
        setInterval(function () {
            GameOfLife.play();
        }, CONFIG.animationInterval);
    },
    randomize: function () {
        var i, len;
        for (i = 0, len = this.cells.length; i < len; i++) {
            this.cells[i].isAlive = Math.random() > 0.9;
            this.cells[i].redraw();
        }
    }
};

function Cell (row, col) {
    this.row = row;
    this.col = col;
    this.isAlive = false;
    this.nextIsAlive = false;
    this.neighbours = [];
    this.table = GameOfLife.getTable();
    this.tdObject = GameOfLife.getTable().rows[this.row].cells[this.col];

    this.updateState = function () {
        this.isAlive = this.nextIsAlive;
    };

    this.redraw = function () {
        this.tdObject.style.backgroundColor = this.isAlive ? CONFIG.aliveCellColor : CONFIG.deadCellColor;
    };

    this.toggleState = function () {
        this.isAlive = !this.isAlive;
    };

    this.generateNeighbours = function () {
        this.neighbours = GameOfLife.getNeighbours(this);
    };
}

// TODO:
// let user to load some interesting presets (see wikipedia)