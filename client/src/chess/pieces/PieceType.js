
const PieceType = {
  PAWN: 'P',
  KNIGHT: 'K',
  BISHOP: 'B',
  ROOK: 'R',
  QUEEN: 'Q',
  KING: 'K',
};

PieceType.toString = (pieceType) => {
  switch (pieceType) {
    case PieceType.PAWN:
      return PieceType.PAWN;

    case PieceType.KNIGHT:
      return PieceType.KNIGHT;

    case PieceType.BISHOP:
      return PieceType.BISHOP;

    case PieceType.ROOK:
      return PieceType.ROOK;

    case PieceType.QUEEN:
      return PieceType.QUEEN;

    case PieceType.KING:
      return PieceType.KING;
  }
};
