const db = require('../database.js');
const JoinableGameResultModel = require('../models/resultModels/joinableGameResultModel.js');
const ActiveGameResultModel = require('../models/resultModels/activeGameResultModel.js');
const socketEventHandler = require('./socketEventHandler.js');

class LobbyHandler {

    async getJoinableGames(id) {
        return new Promise((resolve, reject) => {
            let joinableGames = [];

            db.getJoinableGames(id).then((games) => {
                games.  forEach((game) => {
                    joinableGames.push(new JoinableGameResultModel(game.id, game.name, game.user1.user1Name))
                });
                resolve(joinableGames);
            }).catch((err) => {
                console.error(err.message);
                reject();
            });
        })
    }

    async getActiveGamesForUser(user) {

        return new Promise((resolve, reject) => {
            let activeGames = [];

            db.getActiveGamesForUser(user.id).then((games) => {
                console.log(`Active games for user with id: ${user.id} games: ${games}`);

                games.forEach((game) => {
                    //Get the name of the opponent
                    let opponentName = 'Looking for opponent...';
                    if (game.user1.id && game.user1.id !== user.id) {
                       opponentName = game.user1.name;
                    } else if (game.user2.id && game.user2.id !== user.id) {
                        opponentName = game.user2.name;
                    } else if (game.user1.id && game.user2.id && game.user1.id === user.id && game.user2.id === user.id) {
                        opponentName = 'You are playing against yourself';
                    }

                    //Is it my turn?
                    let myTurn = false;
                    if(game.user1.id && game.user1.id === user.id && game.currentPlayer === 0) {
                        myTurn = true;
                    } else if (game.user2.id && game.user2.id === user.id && game.currentPlayer === 1) {
                        myTurn = true;
                    }

                    activeGames.push(new ActiveGameResultModel(game.id, game.name, opponentName, myTurn, game.gameState))
                });

                resolve(activeGames);
            }).catch((err) => {
                console.error(err.message);
                reject(err)
            });
        })


    }


    async createGame(user, lobbyName) {
        console.log(`Create game for user with id: ${user.id}, lobbyName: ${lobbyName}`);
        return new Promise((resolve, reject) => {
            db.addGame(user.id, lobbyName).then((resp) => {
                if (resp.status === 'OK') {
                    console.log('Successfully created new game.');
                    socketEventHandler.gameCreated(resp.rowid);
                    resolve();
                } else {
                    console.error('Failed creating new game: Database issue');
                    reject();
                }
            }).catch((err) => {
                console.error(`Error creating game: ${err.message}`);
            });
        })

    }

    async joinGame(user, gameId) {
        return new Promise((resolve, reject) => {
            db.joinGame(gameId, user.id).then((resp) => {
                if (resp.status === 'OK') {
                    console.log(`Successfully joined game with id: ${gameId}`);
                    socketEventHandler.playerJoinedGame(gameId);
                    resolve();
                } else {
                    console.error(`Failed joining game with id: ${gameId}, database issue.`);
                    reject();
                }
            }).catch((err) => {
                console.error(`Error joining game with id: ${gameId}, error: ${err.message}`)
                reject();
            });
        })

    }


}

module.exports = new LobbyHandler();
