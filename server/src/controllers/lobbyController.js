const express = require('express');
const sessionManager = require('../sessionManager.js');
const lobbyHandler = require('../handlers/lobbyHandler.js');
const socketManager = require('../socketManager.js');
const db = require('../database');

const router = express.Router();
const socketEventHandler = require('../handlers/socketEventHandler');

router.get('/alljoinable', async (req, res) => {
  const user = sessionManager.getUser(req.session.authToken);
  lobbyHandler.getJoinableGames(user.id).then((games) => {
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.send({ list: games });
  }).catch(() => {
    res.sendStatus(400);
  });
});


router.post('/creategame', async (req, res) => {
  const user = sessionManager.getUser(req.session.authToken);
  const { lobbyName } = req.body;
  await lobbyHandler.createGame(user, lobbyName).then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.sendStatus(400);
  });
});

router.post('/joingame', async (req, res) => {
  const user = sessionManager.getUser(req.session.authToken);
  const { gameId } = req.body;

  await db.getGameById(gameId).then((gamemodel) => {
    if (gamemodel.user1.userId === user.id || gamemodel.user2.userId === user.id) {
      console.log(`Successfully joined game with id: ${gameId}`);
      res.sendStatus(200);
    } else if (!gamemodel.user2.userName && !gamemodel.user2.userId) {
      db.joinGame(gameId, user.id).then((resp) => {
        if (resp.status === 'OK') {
          console.log(`Successfully joined game with id: ${gameId}`);
          socketEventHandler.playerJoinedGame(gameId);
          socketManager.emitEvent(`chesslobby/${gameId}/foundOpponent`, {userName: user.name, userId: user.id});
          res.sendStatus(200);
        } else {
          console.error(`Failed joining game with id: ${gameId}, database issue.`);
        }
      }).catch((err) => {
        console.error(`Error joining game with id: ${gameId}, error: ${err.message}`);
      });
    }
  });
});


module.exports = { router };
