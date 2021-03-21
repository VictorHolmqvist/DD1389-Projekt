
class Piece {

    constructor(pieceType, piecePosition, pieceColor){
        this.pieceType = pieceType;
        this.piecePosition = piecePosition;
        this.pieceColor = pieceColor;
    }

    getPiecePosition() {
        return this.piecePosition;
    }

    getPieceType(){
        return this.pieceType;
    }

    getPieceColor() {
        return this.pieceColor;
    }

    // abstract
    calculateLegalMoves(board) {
        throw new Error('You have to implement the method calculateLegalMoves!');
    }

    // abstract
    movePiece (move) {
        throw new Error('You have to implement the method movePiece!');
    }

    


}