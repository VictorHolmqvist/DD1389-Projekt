<template>

  <div >
    <div class = "container">
      <div class = "information">
        <h1>Lobby {{gameId}}</h1>
        <h2> Opponent:  </h2>
        <h3> Turn: {{ positionInfo.turn }} </h3>
        <h3> Turns: {{ turns }} </h3>
        <button id = "giveUpButton"> Give up </button>
        <button v-on:click = "setClickable" > clickable </button>
        <button v-on:click = "setNotClickable()" > notClickable </button>
        <button v-on:click = "loadFromFen()" > LoadFromFen </button>
        </div>
      <div id = "chessboard" class = "chessboard">
        <chessboard :fen="fen" @onMove="move" id = "board "/>
      </div>
    </div>
  </div>
</template>

<script>

import { chessboard } from 'vue-chessboard';
// import 'vue-chessboard/dist/vue-chessboard.css';

export default {
  name: 'ChessLobby',
  components: {
    chessboard,
  },
  data() {
    return {
      // turn is true if it is the players turn
      turn: true,
      // fen holds the fen string for the board. It updates every move.
      // standard fen
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      clickable: 'clickable',
      turns: -1,
      positionInfo: '',
      gameId: this.$route.params.gameid,
    };
  },
  methods: {
    move(data) {
      this.turns = this.turns + 1;
      this.fen = data.fen;
      this.positionInfo = data;
      console.log(this.fen);
    },
    setClickable() {
      $("#chessboard").css("pointer-events","auto");
      console.log('clickable');
    },
    setNotClickable() {
      $("#chessboard").css("pointer-events","none");
      console.log('not clickable');
    },
    loadFromFen(){
      this.fen = 'rnbqkbnr/pp1ppppp/8/2p5/1P6/8/P1PPPPPP/RNBQKBNR w KQkq c6 0 2'
    }
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

.information {
  margin: 50px;
  position: center;
}

#giveUpButton {
  margin-top: 10px;
}

#board {
  position: center;
  left: 50%;
  top: 50%;
}

</style>
