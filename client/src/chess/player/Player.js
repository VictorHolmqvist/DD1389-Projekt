
// abstract class
class Player {
  constructor(board, legalMoves, opponentMoves) {
    this.board = board;
    this.playerKing = this.establishKing();
    this.legalMoves = legalMoves;
    this.isInCheck = !(Player.calculateAttacksOnTile(this.playerKing.getPiecePosition(), opponentMoves).length === 0);
  }

  // Gets the King
  establishKing() {
    for (const piece of this.getActivePieces()) {
      if (piece.getPieceType() === PieceType.KING) {
        // TODO CAST TO KING
        return piece;
      }
    }
    throw new Error('Should not reach here! Not a valid board!');
  }

  getLegalMoves() {
    return this.legalMoves;
  }

  // check is legal move
  isMoveLegal(move) {
    return this.legalMoves.contains(move);
  }

  // check if in check
  isCheck() {
    return this.isInCheck;
  }

  makeMove(move) {
    // if the move is illegal. Pass in the current board and do nothing.
    // does not take us to a new board
    // if the move is not legal it will be equals null.
    // If the move is not in the list of legal moves for the player.
    if (!this.isMoveLegal(move)) {
      return new MoveTransition(this.board, false);
    }
    // if the move is not illegal
    // create a new board with the executed move
    const transitionBoard = move.execute();
    return new MoveTransition(transitionBoard, true);
  }

  // abstract
  getActivePieces() {}

  // abstract
  getPieceColor() {}

  // abstract
  getOpponent() {}
}


Player.calculateAttacksOnTile = (piecePosition, moves) => {
  const attackMoves = [];
  for (const move of moves) {
    if (piecePosition === move.getDestinationCoordinate()) {
      attackMoves.push(move);
    }
  }
  return attackMoves;
};
