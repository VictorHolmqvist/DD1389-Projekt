
class ActiveGameResultModel {
    constructor(gameId, gameName, opponentName, myTurn, gameState) {
        this.gameId = gameId;
        this.gameName = gameName;
        this.opponentName = opponentName;
        this.myTurn = myTurn;
        this.gameState = gameState;
        this.gameOver = false;
    }

}

module.exports = ActiveGameResultModel;
