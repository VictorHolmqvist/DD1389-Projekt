const express = require('express');
const db = require('../database.js');

const router = express.Router()

router.get('/alljoinable', async (req, res) => {

    await db.getJoinableGames().then((lobbies) => {
        console.log(`Joinable games: ${lobbies}`);
        res.status(200).json({ list: lobbies });
    }).catch((err) => {
        console.error(err.message);
        res.status(500);
    });
});


router.post('/creategame', async (req, res) => {
    //const teacherId = sessionManager.getUser(req.session.authToken).id;
    const userId = 0;

    db.addGame(userId).then((resp) => {
        if (resp.status === 'OK') {
            console.log('Successfully created new game.');
            //sessionManager.newTimeSlot(resp.rowid);
            res.sendStatus(200);
        } else {
            console.error('Failed creating new game: Database issue');
            res.sendStatus(400);
        }
    }).catch(console.error);
});

router.post('/joingame', async (req, res) => {
    //const teacherId = sessionManager.getUser(req.session.authToken).id;
    const userId = 0;
    const { gameId } = req.body;
    console.log(`Join game with id: ${gameId}`);

    db.joinGame(gameId, userId).then((resp) => {
        if (resp === 'OK') {
            console.log(`Successfully joined game with id: ${gameId}`);
            res.sendStatus(200);
        } else {
            console.error(`Failed joining game with id: ${gameId}, database issue.`);
            res.sendStatus(400);
        }
    }).catch((err) => {
        console.error(`Error joining game with id: ${gameId}, error: ${err.message}`)
    });
});




module.exports = { router };
