<template>

  <div >
    <div class = "container">
      <div class = "information">
        <h1>Lobby {{ gameId }}</h1>
        <h2> Opponent: {{ opponent }} </h2>
        <h3> You are: {{ color }} </h3>
        <h3> Turn: {{ turn }} </h3>
        <h3> Turns: {{ turns }} </h3>
        <button id = "giveUpButton"> Give up </button>
        <button v-on:click = "setClickable" > clickable </button>
        <button v-on:click = "setNotClickable()" > notClickable </button>
        <button v-on:click = "loadFromFen()" > LoadFromFen </button>
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
      listenForMove: true,
      isInstanitated: false,
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
      turns: 0,
      gameId: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    console.log(`Navigated from: ${from.path} to ${to.path}`);
    if (to.path.includes('/chesslobby/')) {
      next((vm) => {
        if (vm.isInstanitated) {
          console.log('this listen for move = false');
          vm.getGameState();
        }
      });
    } else {
      next();
    }
  },
  mounted() {
    this.getGameState().then(() => {
      setTimeout(() => {
        this.isInstanitated = true;
      }, 1000);
    }).catch(console.error);
  },
  created() {
    console.log(document.getElementsByClassName('cg-board-wrap')[0]);
    document.getElementsByClassName('cg-board-wrap')[0].style.width = '100px';
    document.getElementsByClassName('cg-board-wrap')[0].style.height = '100px';

    this.socket = this.$root.socket;
    // listen on when opponent has made a move
    this.socket.on(`${this.gameId}/new_move`, (data) => {
      console.log('GAME UPDATE');
      this.handleNewMove(data);
    });
  },
  methods: {
    getGameId() {
      this.gameId = this.$route.params.gameid;
    },
    getGameState() {
      console.log('getGameState');
      this.getGameId();
      return new Promise((resolve, reject) => {
        fetch(`api/chesslobby/${this.gameId}`)
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
      this.listenForMove = false;
      this.loadFen = game.gameState;
      this.listenForMove = true;

      if (this.turn === this.color) {
        this.setClickable();
      }
    },
    handleInput(data) {
      const black = 0;
      const white = 1;
      // tjena Hannes
      // INT color = 0 eller 1.    0 = black. 1 = white.
      // color håller den färg som klienten är
      const { game, color } = data;
      this.color = color;
      // INT turn =  0 eller 1     0 = black. 1 = white.
      this.checkColor(game.gameState);
      // STRING fen = exempel: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      // fen håller game state och skickas mellan klient och server när drag genomförs
      this.listenForMove = false;
      this.loadFen = game.gameState;
      this.listenForMove = true;

      // STRING opponent. Håller clientens motståndare.
      if (this.color === black) {
        this.opponent = game.user2.user2Name;
      } else if (this.color === white) {
        this.opponent = game.user1.user1Name;
      }

      if (this.turn === this.color) {
        this.setClickable();
      }
    },
    move(data) {
      this.turns += 1;
      // lägga till villkor om server-krasch och spelarens tur??
      if (data.turn !== this.color && data.fen !== this.standardFen
        && this.listenForMove === true) {
        console.log('MOVE-METHOD');
        this.sendFen = data.fen;
        this.setNotClickable();
        fetch(`/api/chesslobby/${this.gameId}/new_move`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fen: this.sendFen,
            gameId: this.gameId,
            // är dessa nödvändiga?
            color: this.color,
            turn: this.turn,
            turns: this.turns,
            opponent: this.opponent,
          }),
        }).then((resp) => {
          if (!resp.ok) {
            throw new Error('Unexpected failure when sending game move');
          } else {
            console.log('Successfully sent game move');
          }
        }).catch((err) => {
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
