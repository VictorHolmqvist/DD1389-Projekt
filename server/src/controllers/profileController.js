const express = require('express');
const db = require('../database.js');
const sessionManager = require('../sessionManager.js');
const lobbyHandler = require('../handlers/lobbyHandler.js');
const socketManager = require('../socketManager.js');

const router = express.Router()


router.get('/activegames', async (req, res) => {

    const user = sessionManager.getUser(req.session.authToken);
    socketManager.joinRoom(`profile-${user.id}`, req.session.authToken);

    await lobbyHandler.getActiveGamesForUser(user).then((games) => {
        res.status(200).json({ list: games });
    }).catch((err) => {
        res.status(400);
    })
});

router.get('/gamehistory', async (req, res) => {

    const userId = sessionManager.getUser(req.session.authToken).id;

    await db.getGameHistoryForUser(userId).then((lobbies) => {
        console.log(`Game history for user with id: ${userId} games: ${lobbies}`);
        res.status(200).json({ list: lobbies });
    }).catch((err) => {
        console.error(err.message);
        res.status(500);
    });
});

router.get('/logout', async (req, res) => {
    if (req.session.authToken) {
        sessionManager.invalidateUser(req.session.authToken, req);
        res.sendStatus(200);
        // req.session.destroy((err) => {
        //     if (err) {
        //         console.error(err);
        //         res.sendStatus(401);
        //     } else {
        //         console.debug('Removed authToken from session');
        //         res.sendStatus(200);
        //     }
        // });
    } else {
        res.sendStatus(401);
    }
});



module.exports = { router };

