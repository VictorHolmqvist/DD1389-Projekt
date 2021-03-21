
class Game {
    constructor(id, user1, user2, currentPlayer, gameState, gameOver, draw, winner) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;
        this.currentPlayer = currentPlayer;
        this.gameState = gameState;
        this.gameOver = gameOver;
        this.draw = draw;
        this.winner = winner;
    }
}

module.exports = Game;
