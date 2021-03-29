const db = require('../database.js');
const socketManager = require('../socketManager.js');
const JoinableGameResultModel = require('../models/resultModels/joinableGameResultModel.js');
const ActiveGameResultModel = require('../models/resultModels/activeGameResultModel.js');

class SocketEventHandler {

    //A new game has been created, send an update to the lobbyBrowser room
    async gameCreated(gameId) {
        await db.getGameById(gameId).then((game) => {
            const resultModel = new JoinableGameResultModel(game.id, game.name, game.user1)
            try {
                socketManager.emitEvent('lobbyBrowser', 'new', resultModel);
                console.log('Emit new-event to lobbyBrowser successful');
            } catch (e) {
                console.log(`Failed sending: new to lobbyBrowser: ${e}`);
            }
        }).catch((err) => {
            console.error(err.message);
        })
    }

    // A player has joined a game, send an update to the lobbyBrowser room to make it unjoinable, also update the
    // game owner's profile room
    async playerJoinedGame(gameId) {

        // Remove the game from the list of joinable games in the lobbyBrowser view
        socketManager.emitEvent('lobbyBrowser', 'removed', gameId);

        // Update the game owner's list of active games
        await db.getActiveGameById(gameId).then((game) => {
            const activeGameRM = new ActiveGameResultModel(
                game.id,
                game.name,
                game.user2.name,
                game.currentPlayer === 0,
                game.gameState
                )
            socketManager.emitEvent(`profile-${game.user1.id}`, 'update', activeGameRM);
        })
    }


    playerMadeMove(id, gamemodel) {
        let otherUser;
        if (gamemodel.user1.userId === id) {
            otherUser = gamemodel.user2;
        } else if (gamemodel.user2.userId === id) {
            otherUser = gamemodel.user1;
        }
        const updatedActiveGame = new ActiveGameResultModel(gamemodel.id, gamemodel.name, otherUser.userName, true, gamemodel.gameState);
        socketManager.emitEvent(`profile-${otherUser.userId}`, 'update', updatedActiveGame);
    }
}

module.exports = new SocketEventHandler();
