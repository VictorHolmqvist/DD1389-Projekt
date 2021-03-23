
// abstract class
class Piece {
  constructor(pieceType, piecePosition, pieceColor) {
    this.pieceType = pieceType;
    this.piecePosition = piecePosition;
    this.pieceColor = pieceColor;
  }

  getPiecePosition() {
    return this.piecePosition;
  }

  getPieceType() {
    return this.pieceType;
  }

  getPieceColor() {
    return this.pieceColor;
  }

  // abstract
  calculateLegalMoves(board) {}

  // abstract
  movePiece(move) {}
}
