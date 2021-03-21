
class Bishop extends Piece {

    constructor(pieceColor, piecePosition) {
        super(PieceType.BISHOP, piecePosition, pieceColor)
    }

    calculateLegalMoves(board) {
        let legalMoves = []
        for (let candidateCoordinateOffset of Bishop.CANDIDATE_MOVE_VECTOR_COORDINATES) {
            let candidateDestinationCoordinate = this.piecePosition;
            while (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {
                //check if special case
                if (isFirstColumnExclusion(candidateDestinationCoordinate, candidateCoordinateOffset) ||
                    isEighthColumnExclusion(candidateDestinationCoordinate, candidateCoordinateOffset)) {
                    break;
                }
                // go one step further in direction of vector
                candidateDestinationCoordinate += candidateCoordinateOffset;
                if (BoardUtils.isValidTileCoordinate(candidateDestinationCoordinate)) {

                    let candidateDestinationTile = board.getTile(candidateDestinationCoordinate);
                    if (!candidateDestinationTile.isTileOccupied()) {
                        legalMoves.push(new Move(board, this, candidateDestinationCoordinate));

                    } else {
                        const pieceAtDestination = candidateDestinationTile.getPiece();
                        const pieceColor = pieceAtDestination.getPieceColor();
                        //check if enemy piece
                        if (this.pieceColor !== pieceColor) {
                            legalMoves.push(new Move(board, this, candidateDestinationCoordinate));
                        }
                        //break if there is a piece blocking the way
                        break;
                    }
                }
            }
        }
        return legalMoves;
    }

}



Bishop.CANDIDATE_MOVE_VECTOR_COORDINATES = [-9, -7, 7, 9]