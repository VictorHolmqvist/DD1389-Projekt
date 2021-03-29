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
        const rooms = this.socketRooms[authToken];

        if (rooms && rooms.length > 0) {
            const room = rooms[0];
            console.log(`Authtoken: ${authToken} has joined room: ${room}`);
            socket.join(room);
        }

    }

    addUnregisteredSocket(socket) {
        const socketID = uuidv4();
        this.unregisteredSockets[socketID] = socket;
        return socketID;
    }

    assignUnregisteredSocket(socketId, authToken) {
        const socket = this.unregisteredSockets[socketId];
        this.unregisteredSockets = Object.keys(this.unregisteredSockets)
            .filter((sockID) => sockID !== socketId)
            .reduce((res, sockID) => ({ ...res, [sockID]: this.unregisteredSockets[sockID] }), {});
        this.authenticatedSockets[authToken] = socket;
        console.log('unregistered socket has been assigned to user');
    }

    emitEvent(room, event, message) {
        console.log(`Emit ${event} to ${room}`);
        this.io.in(room).emit(event, message);
    }

    invalidateSocket(authToken, socketId) {

        // Make the socket unsubscribe to all rooms
        this.leaveAllRooms(authToken);

        // Clear the list of subscribed rooms for the socket
        this.socketRooms[authToken] = null;

        // Move the socket to unregistered sockets
        if (this.authenticatedSockets[authToken] && socketId) {
            //this.authenticatedSockets[authToken].handshake.session.destroy();
            //this.authenticatedSockets[authToken].disconnect(true);
            this.unregisteredSockets[socketId] = this.authenticatedSockets[authToken];
        }

        // Remove the socket from authenticated sockets
        this.authenticatedSockets[authToken] = null;
    }

    joinRoom(room, authToken) {
        this.leaveAllRooms(authToken);
        if (this.authenticatedSockets[authToken]) {
            this.authenticatedSockets[authToken].join(room)
            try {
                this.socketRooms[authToken].push(room);
                console.log(`authToken: ${authToken} has joined room: ${room}`);
            } catch(e) {
                this.socketRooms[authToken] = [room];
                console.log(`authToken: ${authToken} has joined room: ${room}`);
            }
        } else {
            console.log(`No authenticated socket for token: ${authToken}. Can't join room ${room}`);
        }
    }

    leaveAllRooms(authToken) {
        if (this.authenticatedSockets[authToken]) {
            const rooms = this.socketRooms[authToken]
            if (rooms) {
                rooms.forEach((room) => {
                    console.log(`authToken: ${authToken} has left room: ${room}`);
                    this.authenticatedSockets[authToken].leave(room);
                });
                this.socketRooms[authToken] = [];
            }
        }
    }

}

module.exports = new SocketManager();
