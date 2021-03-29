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
      // holds what color the cient is. The creator of the room is black
      color: 'black',
      opponent: null,
      // turn is either 0 or 1. 0 == black. 1 == white
      turn: null,
      // fen holds the fen string for the board. It updates every move.
      // standard fen
      loadFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      sendFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      standardFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      turns: 0,
      gameId: this.$route.params.gameid,
    };
  },
  mounted() {
    fetch(`api/chesslobby/${this.gameId}`)
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Unexpected failure when loading game data');
        }
        return resp.json();
      })
      .catch(console.error)
      .then((data) => {
        // tjena Hannes
        // INT color = 0 eller 1.    0 = black. 1 = white.
        // color håller den färg som klienten är
        this.color = data.color;
        // INT turn =  0 eller 1     0 = black. 1 = white.
        this.turn = data.turn;
        // STRING fen = exempel: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        // fen håller game state och skickas mellan klient och server när drag genomförs
        this.loadFen = data.fen;
        // INT turns. Antal omgångar som genomförs.
        // när båda spelarna genomförs ett drag var ökas turns med +1
        this.turns = data.turns;
        // STRING opponent. Håller clientens motståndare.
        this.opponent = data.opponent;

        if (this.turn === this.color) {
          this.setClickable();
        }
      });
  },
  created() {
    this.socket = this.$root.socket;
    // listen on when opponent has made a move
    this.socket.on('---GAMEUPDATE---', (data) => {
      console.log('GAME UPDATE');
      this.fen = data.fen;
      this.turns = data.turns;
      this.setClickable();
    });
  },
  methods: {
    move(data) {
      console.log(data);
      console.log(data.fen);
      console.log(data.turn !== this.color);
      console.log(data.fen !== this.standardFen);
      // lägga till villkor om server-krasch och spelarens tur??
      if (data.turn !== this.color && data.fen !== this.standardFen) {
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
        });
      }
    },
    setClickable() {
      $('#chessboard').css('pointer-events', 'auto');
      console.log('clickable');
    },
    setNotClickable() {
      $('#chessboard').css('pointer-events', 'none');
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
