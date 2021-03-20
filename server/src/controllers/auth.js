const express = require('express');

const router = express.Router();


router.post('/authenticate', (req, res) => {
    res.sendStatus(200);
    // db.getTeacher(null, req.body.username).then((teacher) => {
    //     if (req.body.password && req.body.password === teacher.password) {
    //         // Update the userID of the currently active session
    //         const authToken = uuidv4();
    //         req.session.authToken = authToken;
    //         console.log(`NEW TOKEN: ${authToken}`);
    //         sessionManager.addAuthenticatedUser(authToken, teacher, req.session.socketID);
    //         req.session.save((err) => {
    //             if (err) {
    //                 console.error(err);
    //             } else {
    //                 console.debug(`Saved authToken: ${req.session.authToken}`);
    //                 res.status(200).json({
    //                     username: teacher.name,
    //                 });
    //             }
    //         });
    //     } else {
    //         res.sendStatus(401);
    //     }
    // }).catch((err) => {
    //     console.error(err.message);
    //     res.sendStatus(401);
    // });
});

router.get('/isAuthenticated', (req, res) => {
    res.sendStatus(200)
    // console.log(`Found Auth token: ${req.session.authToken}`);
    // const user = sessionManager.getUser(req.session.authToken);
    // console.log(`IsAuthenticated: ${user}`);
    //
    // res.status(200).json({
    //     isAuthenticated: user !== null,
    //     username: user !== null ? user.name : 'N/A',
    // });
});


router.post('/register', (req, res) => {
    const { username } = req.body;
    const { password } = req.body;

    res.sendStatus(200)
    // db.addTeacher(username, password).then((resp) => {
    //     console.log(`Success adding new teacher: ${resp}`);
    //     res.sendStatus(200);
    // }).catch((err) => {
    //     console.error(err.message);
    //     res.sendStatus(400);
    // });
});


module.exports = { router };
