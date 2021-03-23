<template>

  <div >
    <div class = "container">
      <h1>Lobby {{gameId}}</h1>
        <div v-for = "row in 8" :key="row" class = "cell">
          <div v-for = "column in 8" :key="column" class = "cell" v-bind:id =
            decideColor(row,column)
               @click = "move(8*row+column-8)">
            </div>
        </div>
    </div>

  </div>

</template>

<script>
// const chessGame = require('./chess/ChessGame.js');
export default {
  name: 'ChessLobby',
  data() {
    return {
      gameId: this.$route.params.gameid,
    };
  },
  mounted() {
  },
  methods: {
    move(tileId) {
      console.log(tileId);
    },
    decideColor(row, column) {
      const tileId = 8 * row + column - 8;
      if (row === 1 || row === 3 || row === 5 || row === 7) {
        return (tileId % 2 === 0 ? 'whiteCell' : 'blackCell');
      } return (tileId % 2 === 0 ? 'blackCell' : 'whiteCell');
    },
  },
};
</script>

<style scoped>
:root {
  --height: 0;
  --width: 0;
}
td:hover {
  background-color: blanchedalmond;
}
body {
  display: flex;
  justify-content: center;
}

.container {
  border-radius: 25px;
  margin: 50px;
  padding: 50px;
  background: bisque;
}
.title {
  text-align: center;
}

.cell {
  float: left;
  text-align: center;
  font-size: 60px;
  height: 70px;
  width: 70px;
  background: bisque;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
}
.cell:hover {
  background: blanchedalmond;
}

#blackCell{
  background: #B58862;
}

#whiteCell{
  background: #F0D9B5;
}

</style>
