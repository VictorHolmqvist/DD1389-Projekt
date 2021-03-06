const express = require('express');
const db = require('../database.js');
const sessionManager = require('../sessionManager.js');
const lobbyHandler = require('../handlers/lobbyHandler.js');

const router = express.Router();


router.get('/activegames', async (req, res) => {
  const user = sessionManager.getUser(req.session.authToken);

  await lobbyHandler.getActiveGamesForUser(user).then((games) => {
    res.status(200).json({ list: games });
  }).catch(() => {
    res.status(400);
  });
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
    // req.session.destroy((err) => {
    //   console.log(`Unable to destroy session: ${err}`);
    // });
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});


module.exports = { router };
