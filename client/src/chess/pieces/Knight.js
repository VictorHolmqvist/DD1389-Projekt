
class Knight extends Piece {
  constructor(pieceColor, piecePosition) {
    super(PieceType.KNIGHT, piecePosition, pieceColor);
  }

  calculateLegalMoves(board) {
    const legalMoves = [];

    for (const currentCandidateOffset of Knight.CANDIDATE_MOVE_COORDINATES) {
      const candidateDestinationCoordinate = this.piecePosition + currentCandidateOffset;

      // check if the move if within board
      if (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
        // check if tile is close to end of board
        if (Knight.isFirstColumnExclusion(this.piecePosition, currentCandidateOffset)
                    || Knight.isSecondColumnExclusion(this.piecePosition, currentCandidateOffset)
                    || Knight.isSeventhColumnExclusion(this.piecePosition, currentCandidateOffset)
                    || Knight.isEighthColumnExclusion(this.piecePosition, currentCandidateOffset)) {
          continue;
        }

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
    return new Knight(move.getMovedPiece().getPieceColor(), move.getDestinationCoordinate());
  }

  toString() {
    return PieceType.KNIGHT;
  }
}

Knight.CANDIDATE_MOVE_COORDINATES = [-17, -15, -10, -6, 6, 10, 15, 17];


Knight.isFirstColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.FIRST_COLUMN[currentPosition] && ((candidateOffset === -17) || (candidateOffset === -10)
        || (candidateOffset === 6) || (candidateOffset === 15));


Knight.isSecondColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.SECOND_COLUMN[currentPosition] && ((candidateOffset === -10) || (candidateOffset === 6));

Knight.isSeventhColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.SEVENTH_COLUMN[currentPosition] && ((candidateOffset === -6) || (candidateOffset === 10));

Knight.isEighthColumnExclusion = (currentPosition, candidateOffset) => BoardUtils.EIGHTH_COLUMN[currentPosition] && ((candidateOffset === -15) || (candidateOffset === -6)
        || (candidateOffset === 10) || (candidateOffset === 17));
