
class EmptyTile extends Tile {
  constructor(tileCoordinate) {
    super(tileCoordinate);
  }

  isTileOccupied() {
    return false;
  }

  getPiece() {
    return null;
  }
}
