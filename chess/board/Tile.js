
class Tile {

    constructor(tileCoordinate) {
        this.tileCoordinate = tileCoordinate;
    }

    getTileCoordinate() {
        return this.tileCoordinate;
    }

    isTileOccupied() {
        throw new Error('You have to implement the method isTileOccupied!');
    }

    getPiece() {
        throw new Error('You have to implement the method getPiece!');
    }


}

// static dict for empty tiles
Tile.EMPTY_TILES = Tile.createAllPossibleEmptyTiles();

Tile.createAllPossibleEmptyTiles = () => {
    const emptyTileMap = {}

    for (let i = 0; i < BoardUtils.NUM_TILES; i++) {
        emptyTileMap[i] = new EmptyTile(i);
    }
    return emptyTileMap;
}

//if given piece is null return empty tile. Else return occupied tile.
Tile.createTile = (tileCoordinate, piece) => {
    // if piece is not null --> return occupied tile. Else return empty tile.
    return piece !== null ? new OccupiedTile(tileCoordinate, piece) : Tile.EMPTY_TILES.get(tileCoordinate);
}
