const db = require('../database.js');
const socketManager = require('../socketManager.js');
const JoinableGameResultModel = require('../models/resultModels/joinableGameResultModel.js');


class SocketEventHandler {

    //A new game has been created, send an update to the lobbyBrowser room
    async gameCreated(gameId) {
        await db.getGameById(gameId).then((game) => {
            const resultModel = new JoinableGameResultModel(game.id, game.name, game.user1)
            socketManager.emitEvent('lobbyBrowser', 'new', resultModel);
        }).catch((err) => {
            console.error(err.message);
        })
    }

}

module.exports = new SocketEventHandler();
