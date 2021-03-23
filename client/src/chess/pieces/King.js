
class King extends Piece {
  constructor(pieceColor, piecePosition) {
    super(PieceType.KING, piecePosition, pieceColor);
  }

  calculateLegalMoves(board) {
    const legalMoves = [];

    for (const currentCandidateOffset of King.CANDIDATE_MOVE_COORDINATE) {
      const candidateDestinationCoordinate = this.piecePosition + currentCandidateOffset;

      // if the king is on the first or eighth row. King can not move to specific directions.
      if (isFirstColumnExclusion(this.piecePosition, candidateDestinationCoordinate)
                || isEighthColumnExclusion(this.piecePosition, candidateDestinationCoordinate)) {
        continue;
      }

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
        }
      }
    }
    return legalMoves;
  }

  movePiece(move) {
    return new King(move.getMovedPiece().getPieceColor(), move.getDestinationCoordinate());
  }

  toString() {
    return PieceType.KING;
  }
}

King.CANDIDATE_MOVE_COORDINATE = [-9, -8, -7, -1, 1, 7, 8, 9];

King.isFirstColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.FIRST_COLUMN[currentPosition] && (candidateOffset === -9 || candidateOffset === -1
        || candidateOffset === 7);

King.isEighthColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.SECOND_COLUMN[currentPosition] && (candidateOffset === -7 || candidateOffset === 1
        || candidateOffset === 9);
