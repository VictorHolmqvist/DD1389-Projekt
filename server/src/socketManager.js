const { v4: uuidv4 } = require('uuid');
const db = require('./database.js');

class SocketManager {
  constructor() {
    this.authenticatedSockets = {};
    this.unregisteredSockets = {};
  }

  setIo(io) {
    this.io = io;
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
    this.unregisteredSockets = Object.keys(this.unregisteredSockets)
      .filter((sockID) => sockID !== socketId)
      .reduce((res, sockID) => ({ ...res, [sockID]: this.unregisteredSockets[sockID] }), {});
    this.authenticatedSockets[authToken] = socket;
    console.log('unregistered socket has been assigned to user');
  }

  emitEvent(event, message) {
    console.log(`Emit ${event}`);
    this.io.emit(event, message);
  }

  invalidateSocket(authToken, socketId) {

    // Move the socket to unregistered sockets
    if (this.authenticatedSockets[authToken] && socketId) {
      // this.authenticatedSockets[authToken].handshake.session.destroy();
      // this.authenticatedSockets[authToken].disconnect(true);
      this.unregisteredSockets[socketId] = this.authenticatedSockets[authToken];
    }

    // Remove the socket from authenticated sockets
    this.authenticatedSockets[authToken] = null;
  }

}

module.exports = new SocketManager();
