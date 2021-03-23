
class Queen extends Piece {
  constructor(pieceColor, piecePosition) {
    super(PieceType.QUEEN, piecePosition, pieceColor);
  }

  calculateLegalMoves(board) {
    const legalMoves = [];
    for (const candidateCoordinateOffset of Queen.CANDIDATE_MOVE_VECTOR_COORDINATES) {
      let candidateDestinationCoordinate = this.piecePosition;
      // while we are not outside the board yet
      while (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
        // check if special case
        if (Queen.isFirstColumnExclusion(candidateDestinationCoordinate, candidateCoordinateOffset)
                    || Queen.isEighthColumnExclusion(candidateDestinationCoordinate, candidateCoordinateOffset)) {
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
    return new Queen(move.getMovedPiece().getPieceColor(), move.getDestinationCoordinate());
  }

  toString() {
    return PieceType.QUEEN;
  }
}

Queen.CANDIDATE_MOVE_VECTOR_COORDINATES = [-9, -8, -7, -1, 1, 7, 8, 9];

Queen.isFirstColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.FIRST_COLUMN[currentPosition] && (candidateOffset === -9 || candidateOffset === -1
        || candidateOffset === 7);

Queen.isEighthColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.EIGHTH_COLUMN[currentPosition] && (candidateOffset === 1 || candidateOffset === -7
        || candidateOffset === 9);
