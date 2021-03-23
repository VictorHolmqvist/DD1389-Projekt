const { v4: uuidv4 } = require('uuid');


class SocketManager {

    constructor() {
        this.authenticatedSockets = {}
        this.unregisteredSockets = {}
        this.socketRooms = {} //Keeps track of what rooms each socket has joined
    }

    setIo(io) {
        this.io = io
    }

    updateUserSocket(authToken, socket) {
        this.authenticatedSockets[authToken] = socket;
    }

    addUnregisteredSocket(socket) {
        const socketID = uuidv4();
        this.unregisteredSockets[socketID] = socket;
        return socketID;
    }

    assignUnregisteredSocket(socketId, authToken) {
        const socket = this.unregisteredSockets[socketId];
        delete this.unregisteredSockets[socketId];
        this.authenticatedSockets[authToken] = socket;
    }

    emitEvent(room, event, message) {
        this.io.in(room).emit(event, message);
    }

    joinRoom(room, authToken) {
        if (this.authenticatedSockets[authToken]) {
            this.authenticatedSockets[authToken].join(room)
            try {
                this.socketRooms[authToken].push(room);
            } catch(e) {
                this.socketRooms[authToken] = [room];
            }

        }
    }

    leaveRoom(room, authToken) {
        if (this.authenticatedSockets[authToken]) {
            this.authenticatedSockets[authToken].leave(room);
        }
    }

}

module.exports = new SocketManager();
