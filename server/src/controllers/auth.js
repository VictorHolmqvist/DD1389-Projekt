const express = require('express');
const db = require('../database.js');
const sessionManager = require('../sessionManager.js');
const { v4: uuidv4 } = require('uuid');


const router = express.Router();


router.post('/authenticate', (req, res) => {
    db.getUserByName(req.body.username).then((user) => {
        if (req.body.password && req.body.password === user.password) {
            // Update the userID of the currently active session
            const authToken = uuidv4();
            req.session.authToken = authToken;
            console.log(`NEW TOKEN: ${authToken}`);
            sessionManager.addAuthenticatedUser(authToken, user);
            req.session.save((err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.debug(`Saved authToken: ${req.session.authToken}`);
                    res.status(200).json({
                        username: user.name,
                    });
                }
            });
        } else {
            res.sendStatus(401);
        }
    }).catch((err) => {
        console.error(err.message);
        res.sendStatus(401);
    });
});

router.get('/isAuthenticated', (req, res) => {
    console.log(`Found Auth token: ${req.session.authToken}`);
    const user = sessionManager.getUser(req.session.authToken);
    console.log(`IsAuthenticated: ${user}`);

    res.status(200).json({
        isAuthenticated: user !== null,
        username: user !== null ? user.name : 'N/A',
    });
});


router.post('/register', (req, res) => {
    const { username } = req.body;
    const { password } = req.body;

    db.addUser(username, password).then((resp) => {
        console.log(`Success adding new user: ${resp}`);
        res.sendStatus(200);
    }).catch((err) => {
        console.error(err.message);
        res.sendStatus(400);
    });
});


module.exports = { router };
