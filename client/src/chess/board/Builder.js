
class Builder {
  // build an instance of a board
  // This help class makes it easier to create the board
  constructor() {
    this.boardConfig = {};
    this.nextMoveMaker = null;
  }

  setPiece(piece) {
    this.boardConfig[piece.getPiecePosition()] = piece;
  }

  setMoveMaker(nextMoveMaker) {
    this.nextMoveMaker = nextMoveMaker;
  }

  getMoveMaker() {
    return this.nextMoveMaker;
  }

  build() {
    // Board takes Builder as parameter which holds the Map of pieces and PieceColor to make the move.
    return new Board(this);
  }
}
