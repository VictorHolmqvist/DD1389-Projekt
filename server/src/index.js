// enhances log messages with timestamps etc
const betterLogging = require('better-logging');

const { Theme } = betterLogging;
betterLogging(console, {
    color: Theme.green,
});

const path = require('path'); // helper library for resolving relative paths
const expressSession = require('express-session');
const socketIOSession = require('express-socket.io-session');
const express = require('express');
const http = require('http');

console.logLevel = 4; // Enables debug output
const publicPath = path.join(__dirname, '..', '..', 'client', 'dist');
const port = 8989; // The port that the server will listen to
const app = express(); // Creates express app

const httpServer = http.Server(app);
const io = require('socket.io').listen(httpServer); // Creates socket.io app

// Setup middleware
app.use(betterLogging.expressMiddleware(console, {
    ip: { show: true, color: Theme.green.base },
    method: { show: true, color: Theme.green.base },
    header: { show: false },
    path: { show: true },
    body: { show: true },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup session
const session = expressSession({
    secret: 'Super secret! Shh! Do not tell anyone...',
    resave: true,
    saveUninitialized: true,
    key: 'authToken',
});

app.use(session);

io.use(socketIOSession(session, {
    autoSave: true,
    saveUninitialized: true,
}));

app.use(express.static(publicPath));

// Bind REST controllers to /api
const authController = require('./controllers/auth.js');
const lobbyController = require('./controllers/lobby.js');
const profileController = require('./controllers/profile.js');


app.use('/api', authController.router);
app.use('/lobby', lobbyController.router);


// All chat endpoints require the user to be authenticated
//app.use('/api/teacher', auth.requireAuth, teacher.router);
//app.use('/api', timeSlot.router);

// Init SessionManager
// const sessionManager = require('./sessionManager.js');
//
// sessionManager.setIo(io);

// Handle connected socket.io sockets
// io.on('connection', (socket) => {
//     // This function serves to bind socket.io connections to user models
//
//     if (socket.handshake.session.authToken
//         && sessionManager.getUser(socket.handshake.session.authToken) !== null
//     ) {
//         // If the current user already logged in and then reloaded the page
//         sessionManager.updateUserSocket(socket.handshake.session.authToken, socket);
//     } else {
//         socket.join('public');
//         socket.handshake.session.socketID = sessionManager.addUnregisteredSocket(socket);
//         socket.handshake.session.save((err) => {
//             if (err) console.error(err);
//             else console.debug(`Saved socketID: ${socket.handshake.session.socketID}`);
//         });
//     }
// });

// Start server
httpServer.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
