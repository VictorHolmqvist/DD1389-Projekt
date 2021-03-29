
class SessionManager {
    constructor() {
        this.authenticatedUsers = {};
    }

    addAuthenticatedUser(token, user) {
        this.authenticatedUsers[token] = user;
    }

    getUser(token) {
        const user = this.authenticatedUsers[token];
        if (user) {
            return user;
        }
        return null;
    }



    invalidateUser(authToken) {
        const user = this.authenticatedUsers[authToken];
        this.authenticatedUsers[authToken] = null;
    }

}


module.exports = new SessionManager();
