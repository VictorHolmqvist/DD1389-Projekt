
class FinishedGameResultModel {
    constructor(gameId, opponentName, result) {
        this.gameId = gameId;
        this.opponentName = opponentName;
        this.result = result;
    }
}

module.exports = FinishedGameResultModel;
