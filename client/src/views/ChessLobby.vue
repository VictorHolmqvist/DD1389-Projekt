<template>

  <div >
    <div class = "container">
      <div class = "information">
        <h1>Lobby {{ this.getGameId() }}</h1>
        <h2 v-if="opponent !== null"> Opponent: {{ opponent.userName }} </h2>
        <h2 v-if="opponent === null"> Opponent: </h2>
        <h3 v-if="color === 0"> You are: black </h3>
        <h3 v-if="color === 1" > You are: <span style="color: white">white</span> </h3>
        <h3 v-if="turn === 0"> Turn: black </h3>
        <h3 v-if="turn === 1" > Turn: <span style="color: white">white  </span></h3>
        <button id = "giveUpButton" v-on:click="giveUp"> Give up </button>
        </div>
      <div id = "chessboard" class = "chessboard">
        <chessboard :fen="loadFen" @onMove="move" id = "board "/>
      </div>
    </div>
  </div>
</template>

<script>

import { chessboard } from 'vue-chessboard';

export default {
  name: 'ChessLobby',
  components: {
    chessboard,
  },
  data() {
    return {
      // holds what color the cient is. The creator of the room is black
      color: null,
      opponent: null,
      // turn is either 0 or 1. 0 == black. 1 == white
      turn: null,
      // fen holds the fen string for the board. It updates every move.
      // standard fen
      loadFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      sendFen: null,
      standardFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      beforeFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      gameId: '',
      isInstanitated: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    console.log(`Navigated from: ${from.path} to ${to.path}`);
    if (from.path !== '/') {
      next((vm) => {
        if (vm.isInstanitated) {
          vm.removeListeners();
          vm.addListeners();
          vm.getGameState();
        }
      });
    } else {
      next();
    }
  },
  methods: {
    removeListeners() {
      this.$root.socket.removeAllListeners();
    },
    addListeners() {
      this.socket = this.$root.socket;
      console.log(`Now listening for events for gameId: ${this.getGameId()}`);

      // listen on when opponent has made a move
      this.socket.on(`chesslobby/${this.getGameId()}/new_move`, (data) => {
        console.log('GAME UPDATE');
        setTimeout(() => {
          this.handleNewMove(data);
        }, 500);
      });
      this.socket.on(`chesslobby/${this.getGameId()}/gameOver`, () => {
        console.log('GAME OVER');
        this.$router.push('/profile');
      });
      this.socket.on(`chesslobby/${this.getGameId()}/foundOpponent`, (opponent) => {
        if (opponent.userId !== this.$store.state.userId) {
          console.log('FOUND OPPONENT');
          this.opponent = opponent;
        }
        this.socket.off('foundOpponent');
      });
    },
    giveUp() {
      console.log(`Opponent: ${this.opponent.userName}`);
      if (this.opponent.userName !== null) {
        console.log(`Opponent: ${this.opponent.userName}`);
        this.$http.post(`/api/chesslobby/${this.getGameId()}/giveUp`,
          {
            fen: this.sendFen,
            gameId: this.getGameId(),
            color: this.color,
            turn: this.turn,
            opponent: this.opponent,
          })
          .then((resp) => {
            if (!resp.ok) {
              throw new Error('Unexpected failure when sending game move');
            } else {
              this.$router.push('/profile');
            }
          }).catch((err) => {
            console.error(err);
          });
      }
    },
    getGameId() {
      this.gameId = this.$route.params.gameid;
      return this.gameId;
    },
    getGameState() {
      console.log('getGameState');
      return new Promise((resolve, reject) => {
        this.$http.get(`api/chesslobby/${this.getGameId()}`)
          .then((resp) => {
            if (!resp.ok) {
              throw new Error('Unexpected failure when loading game data');
            }
            return resp.json();
          })
          .then((data) => {
            this.handleInput(data);
            resolve();
          }).catch((err) => {
            console.error(err.message);
            reject();
          });
      });
    },
    checkColor(gameState) {
      const black = 0;
      const white = 1;
      const regex = /.*\/.* ([bw]) .*/;
      const color = gameState.match(regex)[1];
      if (color === 'w') {
        this.turn = white;
      } else if (color === 'b') {
        this.turn = black;
      }
    },
    handleNewMove(data) {
      // INT color = 0 eller 1.    0 = black. 1 = white.
      // color håller den färg som klienten är
      const { game } = data;
      // INT turn =  0 eller 1     0 = black. 1 = white.
      this.checkColor(game.gameState);
      // STRING fen = exempel: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      // fen håller game state och skickas mellan klient och server när drag genomförs
      this.loadFen = game.gameState;
      this.beforeFen = game.gameState;

      if (this.turn === this.color) {
        this.setClickable();
      }
    },
    handleInput(data) {
      const black = 0;
      const white = 1;

      const { game, color } = data;
      this.color = color;
      this.checkColor(game.gameState);
      if (this.loadFen !== game.gameState) {
        this.loadFen = game.gameState;
      }
      this.beforeFen = game.gameState;
      // STRING opponent. Håller clientens motståndare.
      if (this.color === black) {
        this.opponent = game.user2;
      } else if (this.color === white) {
        this.opponent = game.user1;
      }

      if (this.turn === this.color) {
        this.setClickable();
      }
    },
    move(data) {
      // lägga till villkor om server-krasch och spelarens tur??
      if (data.turn !== this.color
        && data.fen !== this.standardFen
        && this.loadFen !== data.fen) {
        console.log('MOVE-METHOD');
        this.sendFen = data.fen;
        this.setNotClickable();

        this.$http.post(`/api/chesslobby/${this.getGameId()}/new_move`,
          {
            fen: this.sendFen,
            gameId: this.getGameId(),
            color: this.color,
            turn: this.turn,
            opponent: this.opponent,
          }).then((resp) => {
          if (!resp.ok) {
            console.log('Failed posting game move');
            this.loadFen = this.beforeFen;
            this.$router.push('/profile');
            throw new Error('Unexpected failure when sending game move');
          } else {
            console.log('Successfully sent game move');
          }
        }).catch((err) => {
          console.log('Failed posting game move');
          this.loadFen = this.beforeFen;
          this.$router.push('/login');
          console.error(err);
        });
      }
    },
    setClickable() {
      document.getElementById('chessboard').setAttribute('style', 'pointer-events: auto');
      console.log('clickable');
    },
    setNotClickable() {
      document.getElementById('chessboard').setAttribute('style', 'pointer-events: none');
      console.log('not clickable');
    },
    loadFromFen() {
      this.loadFen = this.sendFen;
    },
  },
  mounted() {
    setTimeout(() => {
      this.isInstanitated = true;
    }, 500);

    this.removeListeners();
    this.addListeners();
    this.getGameState();
  },
};
</script>

<style scoped>

.chessboard {
  padding: 37px;
  margin: auto;
  left: 40%;
  top: 30%;
  position: absolute;
  width: 400px;
  height: 400px;
  background: grey;
}

.container {
  background: darkgrey;
  position: absolute;
  padding: 50px;
  top: 10%;
  left: 10%;
  width: 1500px;
  height: 700px;
}

#board {
  position: center;
  left: 50%;
  top: 50%;
}

.information {
  margin: 50px;
  position: center;
}

#giveUpButton {
  margin-top: 10px;
}

#chessboard {
  pointer-events: none;
}

</style>
