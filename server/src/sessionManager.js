const db = require('./database.js');
const socketManager = require('./socketManager.js');

class SessionManager {
  constructor() {
    this.authenticatedUsers = {};
    this.timeouts = {};

    // Load the sessions from database
    db.getSessions().then((sessions) => {
      sessions.forEach((session) => {
        this.authenticatedUsers[session.authToken] = session.user;
        socketManager.socketRooms[session.authToken] = [session.socketRoom];
      });
    }).catch((err) => {
      console.log(err.message);
    });
  }

  // A user has made a request - update the sessions timeout
  registerActivity(authToken, req) {
    if (this.timeouts[authToken]) {
      clearTimeout(this.timeouts[authToken]);
    }

    this.timeouts[authToken] = setTimeout(() => {
      this.invalidateUser(authToken, req);
    }, 500000);
  }

  addAuthenticatedUser(token, user) {
    this.authenticatedUsers[token] = user;

    db.addSession(token, user.id).then((resp) => {
      if (resp === 'OK') {
        console.log('Successfully added session to db');
      }
    }).catch((err) => {
      console.log(err.message);
    });
  }

  getUser(token) {
    const user = this.authenticatedUsers[token];
    if (user) {
      return user;
    }
    return null;
  }

  invalidateUser(authToken, req) {
    if (this.timeouts[authToken]) {
      clearTimeout(this.timeouts[authToken]);
    }

    const socketId = req.session.socketID;
    // req.session.destroy();
    req.session.authToken = null;
    socketManager.invalidateSocket(authToken, socketId);

    this.authenticatedUsers[authToken] = null;

    db.removeSession(authToken).catch((err) => {
      console.log(err.message);
    });
  }
}


module.exports = new SessionManager();
