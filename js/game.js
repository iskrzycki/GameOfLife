function Cell(row, col) {
    this.row = row;
    this.col = col;
    this.isAlive = false;
}

var CONFIG = {
    aliveCellColor: "yellow",
    deadCellColor: "black",
    rows: 20,
    cols: 40
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
        this.updateCell(this.getCell(row, col));
    },
    updateCell: function (cell) {
        var table = document.getElementById("board");
        var tableRow = table.rows[cell.row];
        var tableCell = tableRow.cells[cell.col];

        cell.isAlive = !cell.isAlive;
        if (cell.isAlive) {
            tableCell.style.backgroundColor = CONFIG.aliveCellColor;
        } else {
            tableCell.style.backgroundColor = CONFIG.deadCellColor;
        }
    },
    getCell: function (row, col) {
        return this.cells[CONFIG.cols * row + (col % CONFIG.cols)];
    }
};