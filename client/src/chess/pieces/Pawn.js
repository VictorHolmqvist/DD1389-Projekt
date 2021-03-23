
class Pawn extends Piece {
  constructor(pieceColor, piecePosition) {
    super(PieceType.PAWN, piecePosition, pieceColor);
    this.isPawnPromotion = false;
  }


  calculateLegalMoves(board) {
    const legalMoves = [];

    for (const currentCandidateOffset of Pawn.CANDIDATE_MOVE_COORDINATE) {
      // for white -8, for black 8. Hold in PieceColor enum
      const candidateDestinationCoordinate = this.piecePosition + (PieceColor.getDirection(this.getPieceColor()) * currentCandidateOffset);

      if (!BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
        continue;
      }

      // if not attack move
      if (currentCandidateOffset === 8 && !board.getTile(candidateDestinationCoordinate).isTileOccupied()) {
        // check if pawn promotion
        if (PieceColor.isPawnPromotionSquare(candidateDestinationCoordinate, this.pieceColor)) {
          this.isPawnPromotion = true;
        }
        legalMoves.push(new Move(board, this, candidateDestinationCoordinate));

        // check if first move for the Pawn for both black and white colors
        // if pawn jump move
      } else if (currentCandidateOffset === 16
                && ((BoardUtils.SECOND_ROW[this.piecePosition] && PieceColor.isBlack(this.getPieceColor()))
                    || (BoardUtils.SEVENTH_ROW[this.piecePosition] && PieceColor.isWhite(this.getPieceColor())))) {
        // save variable for the next row between row 2 and row 0. Different for white and black.
        const behindCandidateDestinationCoordinate = this.piecePosition + (PieceColor.getDirection(this.getPieceColor()) * 8);
        // if that tile is not occupied and the tile after that is not occupied.
        if (!board.getTile(behindCandidateDestinationCoordinate).isTileOccupied()
                    && !board.getTile(candidateDestinationCoordinate).isTileOccupied()) {
          legalMoves.push(new Move(board, this, candidateDestinationCoordinate));
        }
        // if the tile want to go to its own right
      } else if (currentCandidateOffset === 7
                // if we are not in the edges of the board side turns.
                // exceptional conditions Black cant go to left if first column. White cant go to right if eighth column.
                && !((BoardUtils.EIGHTH_COLUMN[this.piecePosition] && PieceColor.isWhite(this.getPieceColor()))
                    || (BoardUtils.FIRST_COLUMN[this.piecePosition] && PieceColor.isBlack(this.getPieceColor())))) {
        if (board.getTile(candidateDestinationCoordinate).isTileOccupied()) {
          const pieceOnCandidate = board.getTile(candidateDestinationCoordinate).getPiece();
          if (this.pieceColor !== pieceOnCandidate.getPieceColor()) {
            // if Pawn promotion
            if (PieceColor.isPawnPromotionSquare(candidateDestinationCoordinate, this.pieceColor)) {
              this.isPawnPromotion = true;
            }
            legalMoves.push(new Move(board, this, candidateDestinationCoordinate));
          }
        }
        // if the tile wants to go to its own left
      } else if (currentCandidateOffset === 9
                && !((BoardUtils.EIGHTH_COLUMN[this.piecePosition] && PieceColor.isBlack(this.pieceColor()))
                    || (BoardUtils.FIRST_COLUMN[this.piecePosition] && PieceColor.isWhite(this.pieceColor())))) {
        if (board.getTile(candidateDestinationCoordinate).isTileOccupied()) {
          const pieceOnCandidate = board.getTile(candidateDestinationCoordinate).getPiece();
          if (this.pieceColor !== pieceOnCandidate.getPieceColor()) {
            // if pawn promotion
            if (PieceColor.isPawnPromotionSquare(candidateDestinationCoordinate, this.pieceColor)) {
              this.isPawnPromotion = true;
            }
            legalMoves.push(new Move(board, this, candidateDestinationCoordinate));
          }
        }
      }
    }
    return legalMoves;
  }

  checkPawnPromotion() {
    return this.isPawnPromotion;
  }

  getPromotionPiece() {
    return new Queen(this.pieceColor, this.piecePosition);
  }

  movePiece(move) {
    return new Pawn(move.getMovedPiece().getPieceColor(), move.getDestinationCoordinate());
  }

  toString() {
    return PieceType.PAWN;
  }
}


Pawn.CANDIDATE_MOVE_COORDINATE = [8, 16, 7, 9];
