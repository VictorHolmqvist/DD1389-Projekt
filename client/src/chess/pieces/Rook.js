
class Rook extends Piece {
  constructor(pieceColor, piecePosition) {
    super(PieceType.ROOK, piecePosition, pieceColor);
  }

  calculateLegalMoves(board) {
    const legalMoves = [];
    for (const candidateCoordinateOffset of Rook.CANDIDATE_MOVE_VECTOR_COORDINATES) {
      let candidateDestinationCoordinate = this.piecePosition;
      // while we are not outside the board yet
      while (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
        // check if special case
        if (Rook.isFirstColumnExclusion(candidateDestinationCoordinate, candidateCoordinateOffset)
                    || Rook.isEighthColumnExclusion(candidateDestinationCoordinate, candidateCoordinateOffset)) {
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
    return new Rook(move.getMovedPiece().getPieceColor(), move.getDestinationCoordinate());
  }

  toString() {
    return PieceType.ROOK;
  }
}

Rook.CANDIDATE_MOVE_VECTOR_COORDINATES = [-8, -1, 1, 8];


Rook.isFirstColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.FIRST_COLUMN[currentPosition] && (candidateOffset === -1);

Rook.isEighthColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.EIGHTH_COLUMN[currentPosition] && (candidateOffset === 1);
