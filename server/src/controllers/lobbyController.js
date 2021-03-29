const express = require('express');
const sessionManager = require('../sessionManager.js');
const lobbyHandler = require('../handlers/lobbyHandler.js');
const socketManager = require('../socketManager.js');

const router = express.Router()

router.get('/alljoinable', async (req, res) => {
    const user = sessionManager.getUser(req.session.authToken);
    socketManager.joinRoom('lobbyBrowser', req.session.authToken);
    lobbyHandler.getJoinableGames(user.id).then((games) => {
        res.set('Content-Type', 'application/json')
        res.status(200);
        res.send({ list: games });
    }).catch((err) => {
        res.sendStatus(400);
    })

});


router.post('/creategame', async (req, res) => {
    const user = sessionManager.getUser(req.session.authToken);
    const { lobbyName } = req.body;

    await lobbyHandler.createGame(user, lobbyName).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.sendStatus(400);
    })
});

router.post('/joingame', async (req, res) => {
    const user = sessionManager.getUser(req.session.authToken);
    const { gameId } = req.body;

    await lobbyHandler.joinGame(user, gameId).then(() => {
        console.log(`Successfully joined game with id: ${gameId}`);
        socketManager.joinRoom(`chesslobby/${gameId}`, req.session.authToken);
        res.sendStatus(200);
    }).catch((err) => {
        console.error(`Failed joining game with id: ${gameId}, err: ${err.message}`);
        res.sendStatus(400);
    })
});


module.exports = { router };
