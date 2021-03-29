const PieceColor = require('@/chess/pieces/PieceColor');

class WhitePlayer extends Player {
  constructor(board, whiteStandardLegalMoves, blackStandardLegalMoves) {
    super(board, whiteStandardLegalMoves, blackStandardLegalMoves);
  }

  getActivePieces() {
    return this.board.getWhitePieces();
  }

  getPieceColor() {
    return PieceColor.WHITE;
  }

  getOpponent() {
    return this.board.getBlackPlayer();
  }

  toString() {
    return 'WHITE';
  }
}

module.exports = WhitePlayer;
