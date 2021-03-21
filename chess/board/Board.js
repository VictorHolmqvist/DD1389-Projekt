
class Board {

    constructor(builder) {
        // first create the game board which is an Array of Tiles.
        // Every tile holds tile id and if there is a Piece on the tile.
        this.gameBoard = Board.createGameBoard(builder);
        // store active white pieces and active black pieces.
        this.whitePieces = Board.calculateActivePieces(this.gameBoard, PieceColor.WHITE);
        this.blackPieces = Board.calculateActivePieces(this.gameBoard, PieceColor.BLACK);

        // get the stan
        // dard legal moves for the pieces.
        let whiteStandardLegalMoves = this.calculateLegalMoves(this.whitePieces);
        let blackStandardLegalMoves = this.calculateLegalMoves(this.blackPieces);

        // Initiate the players.
        this.whitePlayer = new WhitePlayer(this, whiteStandardLegalMoves, blackStandardLegalMoves);
        this.blackPlayer = new BlackPlayer(this, whiteStandardLegalMoves, blackStandardLegalMoves);

        // store the current player for the board.
        this.currentPlayer = builder.getMoveMaker().choosePlayer(this.whitePlayer, this.blackPlayer);
    }

    calculateLegalMoves(pieces) {
        const legalMoves = [];
        for (const piece of pieces) {
            for (const legalMove of piece.calculateLegalMoves(this)) {
                legalMoves.push(legalMove)
            }
        }
        return legalMoves;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getTile(tileCoordinate) {
        return this.gameBoard[tileCoordinate];
    }

    getBlackPieces() {
        return this.blackPieces;
    }

    getWhitePieces() {
        return this.whitePieces;
    }

    getWhitePlayer() {
        return this.whitePlayer;
    }

    getBlackPlayer() {
        return this.blackPlayer;
    }

    getAllLegalMoves() {
        const allLegalMoves = [];
        for (const whiteLegalMove of this.whitePlayer.getLegalMoves()) {
            allLegalMoves.push(whiteLegalMove)
        }
        for (const whiteLegalMove of this.blackPlayer.getLegalMoves()) {
            allLegalMoves.push(whiteLegalMove)
        }
        return allLegalMoves;
    }

}

Board.calculateActivePieces = (gameBoard, color) => {
    const activePieces = [];
    for (const tile of this.gameBoard) {
        if (tile.isTileOccupied()) {
            const piece = tile.getPiece();
            if (piece.getPieceColor() === color) {
                activePieces.push(piece);
            }
        }
    }
    return activePieces;
};

Board.createGameBoard = (builder) => {
    let tiles = []
    for (let i = 0; i < 64; i++) {
        tiles[i] = Tile.createTile(i, builder.getBoardConfig.get(i));
    }
    return tiles;
}

Board.createStandardBoard = () => {
    // creates an instance of a builder and put every piece in the builders map.
    // Each element of map is a Piece.
    builder = new Builder();

    builder.setPiece(new Rook(PieceColor.BLACK, 0));
    builder.setPiece(new Knight(PieceColor.BLACK, 1));
    builder.setPiece(new Bishop(PieceColor.BLACK, 2));
    builder.setPiece(new Queen(PieceColor.BLACK, 3));
    builder.setPiece(new King(PieceColor.BLACK, 4));
    builder.setPiece(new Bishop(PieceColor.BLACK, 5));
    builder.setPiece(new Knight(PieceColor.BLACK, 6));
    builder.setPiece(new Rook(PieceColor.BLACK, 7));
    builder.setPiece(new Pawn(PieceColor.BLACK, 8));
    builder.setPiece(new Pawn(PieceColor.BLACK, 9));
    builder.setPiece(new Pawn(PieceColor.BLACK, 10));
    builder.setPiece(new Pawn(PieceColor.BLACK, 11));
    builder.setPiece(new Pawn(PieceColor.BLACK, 12));
    builder.setPiece(new Pawn(PieceColor.BLACK, 13));
    builder.setPiece(new Pawn(PieceColor.BLACK, 14));
    builder.setPiece(new Pawn(PieceColor.BLACK, 15));

    // White Layout
    builder.setPiece(new Pawn(PieceColor.WHITE, 48));
    builder.setPiece(new Pawn(PieceColor.WHITE, 49));
    builder.setPiece(new Pawn(PieceColor.WHITE, 50));
    builder.setPiece(new Pawn(PieceColor.WHITE, 51));
    builder.setPiece(new Pawn(PieceColor.WHITE, 52));
    builder.setPiece(new Pawn(PieceColor.WHITE, 53));
    builder.setPiece(new Pawn(PieceColor.WHITE, 54));
    builder.setPiece(new Pawn(PieceColor.WHITE, 55));
    builder.setPiece(new Rook(PieceColor.WHITE, 56));
    builder.setPiece(new Knight(PieceColor.WHITE, 57));
    builder.setPiece(new Bishop(PieceColor.WHITE, 58));
    builder.setPiece(new Queen(PieceColor.WHITE, 59));
    builder.setPiece(new King(PieceColor.WHITE, 60));
    builder.setPiece(new Bishop(PieceColor.WHITE, 61));
    builder.setPiece(new Knight(PieceColor.WHITE, 62));
    builder.setPiece(new Rook(PieceColor.WHITE, 63));

    //set white the one to move
    builder.setMoveMaker(PieceColor.WHITE);

    // returns a new Board
    return builder.build();

}



