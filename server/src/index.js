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

const authController = require('./controllers/auth.js');
const lobbyController = require('./controllers/lobby.js');
const profileController = require('./controllers/profile.js');
const requireAuth = require('./controllers/requireAuth.js')

app.use('/api/auth', authController.router);
app.use('/api/lobby', requireAuth, lobbyController.router);
app.use('/api/profile', requireAuth, profileController.router);


//Setup SocketManager
const socketManager = require('./socketManager.js');
const sessionManager = require('./sessionManager.js');

socketManager.setIo(io);

// Handle connected socket.io sockets
io.on('connection', (socket) => {

    const authToken = socket.handshake.session.authToken;

    if (authToken
        && sessionManager.getUser(authToken) !== null
    ) {
        // If the current user already logged in and then reloaded the page
        socketManager.updateUserSocket(authToken, socket);
    } else {
        //The user is not authenticated. Assign a new socketId.
        socket.handshake.session.socketID = socketManager.addUnregisteredSocket(socket);
        socket.handshake.session.save((err) => {
            if (err) console.error(err);
            else console.debug(`Saved socketID: ${socket.handshake.session.socketID}`);
        });
    }
});

// Start server
httpServer.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
