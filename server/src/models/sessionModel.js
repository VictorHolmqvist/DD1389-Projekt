
class SessionModel {
    constructor(authToken, user, socketRoom) {
        this.authToken = authToken;
        this.user = user;
        this.socketRoom = socketRoom;
    }
}

module.exports = SessionModel;
