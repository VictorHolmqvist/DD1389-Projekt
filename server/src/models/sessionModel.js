
class SessionModel {
    constructor(authToken, user) {
        this.authToken = authToken;
        this.user = user;
    }
}

module.exports = SessionModel;
