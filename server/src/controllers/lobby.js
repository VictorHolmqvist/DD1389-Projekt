const express = require('express');
const sessionManager = require('../sessionManager.js');
const lobbyHandler = require('../handlers/lobbyHandler.js');

const router = express.Router()

router.get('/alljoinable', async (req, res) => {
    const user = sessionManager.getUser(req.session.authToken);

    await lobbyHandler.getJoinableGames(user).then((games) => {
        res.status(200).json({ list: games });
    }).catch((err) => {
        res.sendStatus(400);
    })

});


router.post('/creategame', async (req, res) => {
    const user = sessionManager.getUser(req.session.authToken);
    const { lobbyName } = req.body;
    console.log(`Create game with name: ${lobbyName}`);

    await lobbyHandler.createGame(user, lobbyName).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.sendStatus(400);
    })
});

router.post('/joingame', async (req, res) => {
    const user = sessionManager.getUser(req.session.authToken);
    const { gameId } = req.body;
    console.log(`Join game with id: ${gameId}`);

    await lobbyHandler.joinGame(user, gameId).then(() => {
        console.log(`Successfully joined game with id: ${gameId}`);
        res.sendStatus(200);
    }).catch((err) => {
        console.error(`Failed joining game with id: ${gameId}, err: ${err.message}`);
        res.sendStatus(400);
    })
});


module.exports = { router };
