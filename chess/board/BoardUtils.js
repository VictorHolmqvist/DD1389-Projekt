
class BoardUtils {
}

BoardUtils.FIRST_COLUMN = BoardUtils.initColumn(0);
BoardUtils.SECOND_COLUMN = BoardUtils.initColumn(1);
BoardUtils.SEVENTH_COLUMN = BoardUtils.initColumn(6);
BoardUtils.EIGHTH_COLUMN = BoardUtils.initColumn(7);
BoardUtils.FIRST_ROW = BoardUtils.initRow(0);
BoardUtils.SECOND_ROW = BoardUtils.initRow(8);
BoardUtils.THIRD_ROW = BoardUtils.initRow(16);
BoardUtils.FOURTH_ROW = BoardUtils.initRow(24);
BoardUtils.FIFTH_ROW = BoardUtils.initRow(32);
BoardUtils.SIXTH_ROW = BoardUtils.initRow(40);
BoardUtils.SEVENTH_ROW = BoardUtils.initRow(48);
BoardUtils.EIGHTH_ROW = BoardUtils.initRow(56);
BoardUtils.NUM_TILES = 64;
BoardUtils.NUM_TILES_PER_ROW = 8;

BoardUtils.isValidTileCoordinate = (coordinate) => {
    return coordinate >= 0 && coordinate < 64;
};

//fill up the given column with true values
BoardUtils.initColumn = (columnNumber) => {
    const column = [];
    do {
        column[columnNumber] = true;
        columnNumber += 8;

    } while (columnNumber < 64);
    return column;
}

//fill up the given row with true values
BoardUtils.initRow = (rowNumber) => {
    const row = [];
    do {
        row[rowNumber] = true;
        rowNumber ++;
    } while (rowNumber % BoardUtils.NUM_TILES_PER_ROW !== 0);
    return row;
}

BoardUtils.isValidTileCoordinate = (coordinate) => {
    return coordinate >= 0 && coordinate < 64;
}
