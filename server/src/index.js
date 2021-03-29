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
const SQLiteStore = require('connect-sqlite3')(expressSession);
const http = require('http');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');

console.logLevel = 4; // Enables debug output
const publicPath = path.join(__dirname, '..', '..', 'client', 'dist');
const port = 8989; // The port that the server will listen to
const app = express(); // Creates express app

const httpsServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '..', 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'cert', 'cert.pem')),
}, app);

// const httpServer = http.Server(app);
const io = require('socket.io').listen(httpsServer); // Creates socket.io app

// Setup Helmet
app.use(helmet());

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
app.use(cors());

// Setup session
const session = expressSession({
    store: new SQLiteStore,
    secret: 'Super secret! Shh! Do not tell anyone...',
    resave: true,
    saveUninitialized: true,
    key: 'authToken',
    cookie: {maxAge: 100000, domain: 'localhost'},
    rolling: true,
});

app.use(session);

io.use(socketIOSession(session));

// io.use(socketIOSession(session, {
//     autoSave: true,
//     saveUninitialized: true,
// }));

app.use(express.static(publicPath));

const authController = require('./controllers/authController.js');
const lobbyController = require('./controllers/lobbyController.js');
const profileController = require('./controllers/profileController.js');
const requireAuth = require('./controllers/requireAuth.js')
const matchController = require('./controllers/matchController.js');

app.use('/api/auth', authController.router);
app.use('/api/lobby', requireAuth, lobbyController.router);
app.use('/api/profile', requireAuth, profileController.router);
app.use('/api/chesslobby', requireAuth, matchController.router);


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
        console.log('io on connection: authenticated user, will update socket');
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
// httpServer.listen(port, () => {
//     console.log(`Listening on http://localhost:${port}`);
// });


httpsServer.listen(port, () => {
    console.log(`(HTTPS) Listening on https://localhost:${port}`);
})
