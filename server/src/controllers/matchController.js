const express = require('express');
const sessionManager = require('../sessionManager.js');
const lobbyHandler = require('../handlers/lobbyHandler.js');
const socketManager = require('../socketManager.js');
const res = require("express");
const db = require('../database.js');


const router = express.Router();

router.get('/:game_id', async (req, res) => {
  const game_id = req.params.game_id;
  const user = sessionManager.getUser(req.session.authToken);
  await db.getGameById(game_id).then((gamemodel) => {
    console.log(`Successfully retrieved game:${game_id}`);
    socketManager.joinRoom(`chesslobby/${game_id}`, req.session.authToken);
    res.status(200).json({game: gamemodel});
  }).catch((err) => {
    console.error(`failed retreiving game:${game_id}`);
    res.sendStatus(400);
  })
});

router.post('/:game_id/new_move',async (req, res) => {
  const game_id = req.params.game_id;
  const { fen, turns } = req.body;
  const user = sessionManager.getUser(req.session.authToken);
  await db.updateGame(game_id, fen, turns).then((err) => {
    console.log(`Successfully updated game:${game_id}`);
    socketManager.emitEvent()
    res.status(200).json({game: gamemodel});
  }).catch((err) => {
    console.error(`failed retreiving game:${game_id}`);
    res.sendStatus(400);
  })
});


module.exports = {router};
