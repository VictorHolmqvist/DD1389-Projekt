
class Bishop extends Piece {
  constructor(pieceColor, piecePosition) {
    super(PieceType.BISHOP, piecePosition, pieceColor);
  }

  calculateLegalMoves(board) {
    const legalMoves = [];
    for (const candidateCoordinateOffset of Bishop.CANDIDATE_MOVE_VECTOR_COORDINATES) {
      let candidateDestinationCoordinate = this.piecePosition;
      while (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
        // check if special case
        if (Bishop.isFirstColumnExclusion(candidateDestinationCoordinate, candidateCoordinateOffset)
                    || Bishop.isEighthColumnExclusion(candidateDestinationCoordinate, candidateCoordinateOffset)) {
          break;
        }
        // go one step further in direction of vector
        candidateDestinationCoordinate += candidateCoordinateOffset;
        if (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
          const candidateDestinationTile = board.getTile(candidateDestinationCoordinate);
          if (!candidateDestinationTile.isTileOccupied()) {
            legalMoves.push(new Move(board, this, candidateDestinationCoordinate));
          } else {
            const pieceAtDestination = candidateDestinationTile.getPiece();
            const pieceColor = pieceAtDestination.getPieceColor();
            // check if enemy piece
            if (this.pieceColor !== pieceColor) {
              legalMoves.push(new Move(board, this, candidateDestinationCoordinate));
            }
            // break if there is a piece blocking the way
            break;
          }
        }
      }
    }
    return legalMoves;
  }

  movePiece(move) {
    return new Bishop(move.getMovedPiece().getPieceColor(), move.getDestinationCoordinate());
  }

  toString() {
    return PieceType.BISHOP;
  }
}

Bishop.CANDIDATE_MOVE_VECTOR_COORDINATES = [-9, -7, 7, 9];


Bishop.isFirstColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.FIRST_COLUMN[currentPosition] && (candidateOffset === -9 || candidateOffset === 7);

Bishop.isEighthColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.EIGHTH_COLUMN[currentPosition] && (candidateOffset === -7 || candidateOffset === 9);
