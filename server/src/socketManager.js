const { v4: uuidv4 } = require('uuid');
const sessionManager = require('./sessionManager.js');

class SocketManager {
  constructor() {
    this.authenticatedSockets = {};
    this.unregisteredSockets = {};
    this.authTokenToSocketId = {};
    this.expirationTimes = {};
  }

  setIo(io) {
    this.io = io;
  }

  updateUserSocket(authToken, socket) {
    this.authenticatedSockets[authToken] = socket;
    socket.join('auth');
  }

  updateExpirationTime(authToken, time) {
    this.expirationTimes[authToken] = time;
  }

  addUnregisteredSocket(socket) {
    const socketID = uuidv4();
    this.unregisteredSockets[socketID] = socket;
    return socketID;
  }

  assignUnregisteredSocket(socketId, authToken) {
    const socket = this.unregisteredSockets[socketId];
    if (socket) {
      this.unregisteredSockets = Object.keys(this.unregisteredSockets)
          .filter((sockID) => sockID !== socketId)
          .reduce((res, sockID) => ({ ...res, [sockID]: this.unregisteredSockets[sockID] }), {});
      socket.join('auth');
      this.authenticatedSockets[authToken] = socket;
      this.authTokenToSocketId[authToken] = socketId;
      console.log('unregistered socket has been assigned to user');
    } else {
      console.log('unable to find socket');
    }
  }

  emitEvent(event, message) {
    console.log(`Emit ${event}`);

    Object.keys(this.authenticatedSockets).forEach((key) => {
      if (!this.expirationTimes[key] || this.expirationTimes[key] < Date.now()) {
        if (this.authenticatedSockets[key]) {
          const socketId = this.authTokenToSocketId[key];
          this.authenticatedSockets[key].leave('auth');
          this.unregisteredSockets[socketId] = this.authenticatedSockets[key];
          this.authenticatedSockets[key] = null;
        }
      }
    })

    this.io.in('auth').emit(event, message);
  }

  invalidateSocket(authToken, socketId) {
    // Move the socket to unregistered sockets
    if (this.authenticatedSockets[authToken] && socketId) {
      this.authenticatedSockets[authToken].leave('auth');
      this.unregisteredSockets[socketId] = this.authenticatedSockets[authToken];
    }

    // Remove the socket from authenticated sockets
    this.authenticatedSockets[authToken] = null;
  }
}

module.exports = new SocketManager();
