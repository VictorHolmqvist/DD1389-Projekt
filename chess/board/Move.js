
class Move {

    constructor(board, movedPiece, destinationCoordinate) {
        this.board = board;
        this.movedPiece = movedPiece;
        this.destinationCoordinate = destinationCoordinate;
    }

    getDestinationCoordinate() {
        return this.destinationCoordinate;
    }

    getMovedPiece() {
        return this.movedPiece;
    }

    getCurrentCoordinate() {
        return this.movedPiece.getPiecePosition();
    }

    execute() {
        const builder = new Builder();
        // For every active piece for player set the pieces.

        // If the piece its not the moved piece
        for (const piece of this.board.getCurrentPlayer().getActivePieces()) {
            // if not the moved piece
            if (this.movedPiece !== piece) {
                builder.setPiece(piece);
            }
        }
        // For every active enemy piece --> build board
        for (const piece of this.board.getCurrentPlayer().getOpponent().getActivePieces()) {
            builder.setPiece(piece);
        }
        // for the moved piece, set piece. Pass in the move information in moved piece
        // Check the moved piece is a pawn and if it is a pawn promotion
        if (this.movedPiece.getPieceType() === PieceType.PAWN){
            // TODO casta till pawn?
            // const promotedPawn = (Pawn) this.movedPiece;
            const promotedPawn = this.movedPiece;
            if (promotedPawn.isPawnPromotion()){
                // set the piece to a queen piece.
                builder.setPiece(promotedPawn.getPromotionPiece().movePiece(this));
                // set Move maker to opponent
                builder.setMoveMaker(this.board.getCurrentPlayer().getOpponent().getPieceColor());
                return builder.build();
            }
        }
        // else do as usual
        // movePiece returns a new piece of the moved piece with new coordinates
        builder.setPiece(this.movedPiece.movePiece(this));
        // set move maker to the opponent
        builder.setMoveMaker(this.board.getCurrentPlayer().getOpponent().getPieceColor());

        return builder.build();
    }

}