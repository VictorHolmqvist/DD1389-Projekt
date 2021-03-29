const db = require('./database.js');


class SessionManager {
    constructor() {
        this.authenticatedUsers = {};

        //Load the sessions from database
        db.getSessions().then((sessions) => {
            sessions.forEach((session) => {
                this.authenticatedUsers[session.authToken] = session.user;
            });
        }).catch((err) => {
            console.log(err.message);
        });
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

    invalidateUser(authToken) {
        this.authenticatedUsers[authToken] = null;

        db.removeSession(authToken).catch((err) => {
            console.log(err.message);
        });
    }

}


module.exports = new SessionManager();
