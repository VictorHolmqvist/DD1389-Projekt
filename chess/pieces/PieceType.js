class PieceType{

    constructor(pieceName) {
        this.pieceName = pieceName;
    }

    toString() {
        return this.pieceName;
    }

}

// försök till ENUM?
PieceType.PAWN = "P";
PieceType.KNIGHT = "K";
PieceType.BISHOP = "B";
PieceType.ROOK = "R";
PieceType.QUEEN = "Q";
PieceType.KING = "K";



