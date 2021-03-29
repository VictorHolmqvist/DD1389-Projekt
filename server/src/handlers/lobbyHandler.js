const db = require('../database.js');
const JoinableGameResultModel = require('../models/resultModels/joinableGameResultModel.js');
const ActiveGameResultModel = require('../models/resultModels/activeGameResultModel.js');
const socketEventHandler = require('./socketEventHandler.js');

class LobbyHandler {

    async getJoinableGames(userID) {
        return new Promise((resolve, reject) => {
            let joinableGames = [];

            db.getJoinableGames(userID).then((games) => {
                games.forEach((game) => {
                    joinableGames.push(new JoinableGameResultModel(game.id, game.name, game.user1))
                });
                resolve(joinableGames);
            }).catch((err) => {
                console.error(err.message);
                reject();
            });
        })
    }
    checkColor(gameState) {
        const black = 0;
        const white = 1;
        const regex = /.*\/.* ([bw]) .*/;
        const color = gameState.match(regex)[1];
        if (color === 'w') {
             return white;
        } else if (color === 'b') {
            return  black;
        }

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

                    const color = this.checkColor(game.gameState);
                    //Is it my turn?
                    let myTurn = false;
                    if(game.user1.id && game.user1.id === user.id && color === 0) {
                        myTurn = true;
                    } else if (game.user2.id && game.user2.id === user.id && color === 1) {
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



}

module.exports = new LobbyHandler();
