<template>
  <div class="container">
    <h1>Profile</h1>
    <h2>Active games</h2>
    <h4 v-if="activeEmpty">You have currently no active games.</h4>
    <div v-if="!activeEmpty" class="row">
      <div class="well" v-for="game in activeGames" v-bind:key="game.gameId">
        <div class="row" style="text-align: center;">
          <h1>Game {{game.gameName}}</h1>
          <p>Game ID: {{game.gameId}}</p>
          <p>
            <span>Opponent: {{ game.opponentName }}</span>
          </p>
          <p>My Turn: {{game.myTurn}}</p>
          <button v-on:click="joinGame(game.gameId)">Join Game</button>
          <div class = "boardPreview" >
            <chessboard :fen="game.gameState" id = "board "/>
          </div>
        </div>
      </div>
    </div>

    <h2>Game history</h2>

  </div>

</template>

<script>
import { chessboard } from 'vue-chessboard';

export default {
  components: {
    chessboard,
  },
  name: 'Profile',
  computed: {
    activeEmpty: function ae() {
      if (!this.activeGames) {
        return true;
      }
      if (this.activeGames.length === 0) {
        return true;
      }
      return false;
    },
    historyEmpty: function he() {
      if (!this.gameHistory) {
        return true;
      }
      if (this.gameHistory.length === 0) {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      activeGames: [],
      gameHistory: [],
      isInstanitated: false,
      fen: '5rr1/3nqpk1/p3p2p/Pp1pP1pP/2pP1PN1/2P1Q3/2P3P1/R4RK1 b - f3 0 28',
    };
  },
  beforeRouteEnter(to, from, next) {
    console.log(`Navigated from: ${from.path} to ${to.path}`);
    if (to.path === '/profile') {
      next((vm) => {
        if (vm.isInstanitated) {
          vm.getActiveGames();
          vm.getGameHistory();
        }
      });
    } else {
      next();
    }
  },
  methods: {
    getActiveGames() {
      console.log('getActiveGames');
      this.$http.get('/api/profile/activegames')
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Unexpected failure when loading timeslots');
          }
          return resp.json();
        })
        .then((data) => {
          if (data && data.list) {
            this.activeGames = data.list;
          }
        }).catch(console.error);
    },
    getGameHistory() {
      console.log('getGameHistory');

      this.$http.get('/api/profile/gamehistory')
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Unexpected failure when loading timeslots');
          }
          return resp.json();
        })
        .then((data) => {
          if (data && data.list) {
            this.gameHistory = data.list;
          }
        }).catch(console.error);
    },
    joinGame(id) {
      this.$http.post('/api/lobby/joingame', { gameId: id })
        .then((resp) => {
          if (resp.ok) {
            this.$router.push(`/chesslobby/${id}`);
          } else {
            console.log(`Failed joining game with id: ${id}`);
          }
        });
    },
  },
  created() {
    this.getActiveGames();
    this.getGameHistory();

    this.socket = this.$root.socket;
    this.socket.on('update', (updatedGame) => {
      console.log('GAME UPDATED');
      this.activeGames.forEach((activeGame, index) => {
        if (activeGame.gameId === updatedGame.gameId) {
          console.log('Found game to update');
          this.$set(this.activeGames, index, updatedGame);
        }
      });
    });

    setTimeout(() => {
      this.isInstanitated = true;
    }, 1000);
  },
};
</script>

<style scoped>

p {
  text-align: center;
}

.well {
  padding: 10px;
  margin: 5px auto;
}

.row {
  margin: 0px auto;
  width: 600px;
}

.row h1 {
  font-size: 25px;
  margin: 0 0 10px;
}

h1 {
  text-align: center;
}

.green {
  color: green;
}

.red {
  color: red;
}

.hidden {
  display: none;
}

.red-button {
  display: inline-block;
  background-color: red;
  color: white;
  margin: auto;
  text-align: center;
}


.editor {
  margin: 0 auto;
  height: 300px;
}

.editor timeselector {
  width: 50%;
}

.boardPreview {
  pointer-events: none;
  padding: 37px;
  margin: auto;
  left: 40%;
  top: 30%;
  text-align: right;
  width: 400px;
  height: 400px;
}

#board {
  transform: scale(0.5, 0.5);
}

</style>
