
class BlackPlayer extends Player {
  constructor(board, whiteStandardLegalMoves, blackStandardLegalMoves) {
    super(board, blackStandardLegalMoves, whiteStandardLegalMoves);
  }

  getActivePieces() {
    return this.board.getBlackPieces();
  }

  getPieceColor() {
    return PieceColor.BLACK;
  }

  getOpponent() {
    return this.board.getWhitePlayer();
  }

  toString() {
    return 'BLACK';
  }
}
