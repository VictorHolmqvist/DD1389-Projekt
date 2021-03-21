
class OccupiedTile extends Tile {

    constructor(tileCoordinate, pieceOnTile) {
        super(tileCoordinate);
        this.pieceOnTile = pieceOnTile;
    }

    isTileOccupied() {
        return true;
    }

    getPiece() {
        return this.pieceOnTile;
    }
}


