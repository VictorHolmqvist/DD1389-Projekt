
const PieceColor = {
  WHITE: 'WHITE',
  BLACK: 'BLACK',
};

PieceColor.getDirection = (pieceColor) => {
  switch (pieceColor) {
    case PieceColor.WHITE:
      return -1;
    case PieceColor.BLACK:
      return 1;
  }
};

PieceColor.isWhite = (pieceColor) => {
  switch (pieceColor) {
    case PieceColor.WHITE:
      return true;
    case PieceColor.BLACK:
      return false;
  }
};

PieceColor.isBlack = (pieceColor) => {
  switch (pieceColor) {
    case PieceColor.WHITE:
      return false;
    case PieceColor.BLACK:
      return true;
  }
};

PieceColor.isPawnPromotionSquare = (position, pieceColor) => {
  switch (pieceColor) {
    case PieceColor.WHITE:
      return BoardUtils.FIRST_ROW[position];
    case PieceColor.BLACK:
      return BoardUtils.EIGHTH_ROW[position];
  }
};

PieceColor.choosePlayer = (whitePlayer, blackPlayer, pieceColor) => {
  switch (pieceColor) {
    case PieceColor.WHITE:
      return whitePlayer;
    case PieceColor.BLACK:
      return blackPlayer;
  }
};

module.exports = PieceColor;
