const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('../database.js');
const sessionManager = require('../sessionManager.js');
const socketManager = require('../socketManager.js');

const router = express.Router();


router.post('/authenticate', async (req, res) => {
  db.getUserByName(req.body.username).then(async (user) => {
    if (req.body.password && await bcrypt.compare(req.body.password, user.password)) {
      // Update the userID of the currently active session
      const authToken = uuidv4();
      req.session.authToken = authToken;
      req.session.expiration = Date.now() + 30000;

      console.log(`NEW TOKEN: ${authToken}`);
      sessionManager.addAuthenticatedUser(authToken, user);
      socketManager.updateExpirationTime(authToken, req.session.expiration)

      if (req.session.socketID) {
        console.log(`/authenticate found socketId: ${req.session.socketID}`);
        socketManager.assignUnregisteredSocket(req.session.socketID, authToken);
      } else {
        console.log(`Unable to find socketID: ${req.session.socketID}`);
      }

      req.session.save((err) => {
        if (err) {
          console.error(err);
        } else {
          console.debug(`Saved authToken: ${req.session.authToken}`);
          res.status(200).json({
            username: user.name,
            userId: user.id,
          });
        }
      });
    } else {
      console.log('login failed');
      res.sendStatus(401);
    }
  }).catch((err) => {
    console.error(err.message);
    res.sendStatus(401);
  });
});

router.get('/isAuthenticated', (req, res) => {
  const user = sessionManager.getUser(req.session.authToken);
  res.status(200).json({
    isAuthenticated: user !== null,
    username: user !== null ? user.name : 'N/A',
    userId: user !== null ? user.id : undefined,
  });
});


router.post('/register', async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  // Hash the password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  db.addUser(username, hashedPassword).then((resp) => {
    console.log(`Success adding new user: ${resp}`);
    res.sendStatus(200);
  }).catch((err) => {
    console.error(err.message);
    res.sendStatus(400);
  });
});


module.exports = { router };
