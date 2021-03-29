const express = require('express');
const sessionManager = require('../sessionManager.js');
const socketManager = require('../socketManager.js');
const socketEventHandler = require('../handlers/socketEventHandler');
const db = require('../database.js');


const router = express.Router();
const black = 0;
const white = 1;
router.get('/:gameId', async (req, res) => {
  const { gameId } = req.params;
  const user = sessionManager.getUser(req.session.authToken);
  await db.getGameById(gameId).then((gamemodel) => {
    console.log(`Successfully retrieved game:${gameId}`);
    if (user.id === gamemodel.user1.userId) {
      res.status(200).json({ game: gamemodel, color: black });
    } else if (user.id === gamemodel.user2.userId) {
      res.status(200).json({ game: gamemodel, color: white });
    } else {
      console.error('something went wrong');
    }
    // socketManager.joinRoom(`chesslobby/${game_id}`, req.session.authToken);'
  }).catch(() => {
    console.error(`failed retreiving game:${gameId}`);
    res.sendStatus(400);
  });
});

router.post('/:gameId/new_move', async (req, res) => {
  console.log('got a post!');
  const { gameId } = req.params;
  const { fen } = req.body;
  const user = sessionManager.getUser(req.session.authToken);
  db.updateGame(gameId, fen).then(() => {
    console.log(`Successfully updated game:${gameId}`);
    db.getGameById(gameId).then((gamemodel) => {
      console.log(`Successfully retrieved game:${gameId}`);
      res.sendStatus(200);
      socketEventHandler.playerMadeMove(user.id, gamemodel);
      socketManager.emitEvent(`chesslobby/${gameId}`, 'new_move', { game: gamemodel });
    }).catch(() => {
      console.error(`failed retreiving game:${gameId}`);
      res.sendStatus(400);
    });
  }).catch((err) => {
    console.error(`failed updating game:${gameId} ${err}`);
    res.sendStatus(400);
  });
});

router.post('/:gameId/giveUp', async (req, res) => {
  console.log('got a give up post!');
  const { gameId } = req.params;
  const { opponent } = req.body;

  db.userGaveUp(gameId, opponent).then(() => {
    console.log(`Successfully updated won game:${gameId}`);
    res.sendStatus(200);
  }).catch((err) => {
    console.error(`failed updating won game:${gameId} ${err}`);
    res.sendStatus(400);
  });
});


module.exports = { router };
