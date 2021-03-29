const express = require('express');
const sessionManager = require('../sessionManager.js');
const lobbyHandler = require('../handlers/lobbyHandler.js');
const socketManager = require('../socketManager.js');
const socketEventHandler = require('../handlers/socketEventHandler');
const res = require("express");
const db = require('../database.js');


const router = express.Router();
const black = 0;
const white = 1;
router.get('/:game_id', async (req, res) => {
  const game_id = req.params.game_id;
  const user = sessionManager.getUser(req.session.authToken);
  await db.getGameById(game_id).then((gamemodel) => {
    console.log(`Successfully retrieved game:${game_id}`);
    if (user.id === gamemodel.user1.userId) {
      res.status(200).json({game: gamemodel, color:black});
    } else if (user.id === gamemodel.user2.userId) {
      res.status(200).json({game: gamemodel, color:white});
    } else {
      console.error('something went wrong');
    }
    // socketManager.joinRoom(`chesslobby/${game_id}`, req.session.authToken);'
  }).catch((err) => {
    console.error(`failed retreiving game:${game_id}`);
    res.sendStatus(400);
  })
});

router.post('/:game_id/new_move',async (req, res) => {
  console.log('got a post!')
  const game_id = req.params.game_id;
  const { fen } = req.body;
  const user = sessionManager.getUser(req.session.authToken);
   db.updateGame(game_id, fen).then(() => {
    console.log(`Successfully updated game:${game_id}`);
    db.getGameById(game_id).then((gamemodel) => {
      console.log(`Successfully retrieved game:${game_id}`);
      res.sendStatus(200);
      socketEventHandler.playerMadeMove(user.id, gamemodel);
      socketManager.emitEvent(`chesslobby/${game_id}`, 'new_move', { game: gamemodel });
    }).catch((err) => {
      console.error(`failed retreiving game:${game_id}`);
      res.sendStatus(400);
    })
  }).catch((err) => {
    console.error(`failed updating game:${game_id} ${err}`);
    res.sendStatus(400);
  })
});


module.exports = {router};
