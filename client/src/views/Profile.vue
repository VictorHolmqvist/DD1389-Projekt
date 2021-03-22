<template>
  <div class="container">
    <h1>Profile</h1>
    <p>Page where users can view their match history, see their active games and logout</p>
    <p>Users that are not logged in will be redirected to /login</p>
    <button class="red-button" v-on:click="logout()">Logout</button>

    <h2>Active games</h2>
    <div class="row">
      <div class="well" v-for="game in activeGames" :key="game.id">
        <div class="row" style="text-align: center;">
          <h1>Game {{game.gameName}}</h1>
          <h2>Game ID: {{game.gameId}}</h2>
          <p>
            <span>Opponent: {{ game.opponentName }}</span>
          </p>
          <p>My Turn: {{game.myTurn}}</p>
          <button v-on:click="joinGame(game.id)">Join Game</button>
        </div>
      </div>
    </div>

    <h2>Game history</h2>


  </div>

</template>

<script>

export default {
  name: 'Profile',
  data() {
    return {
      activeGames: [],
      gameHistory: [],
    };
  },
  methods: {
    getActiveGames() {
      fetch('/api/profile/activegames')
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Unexpected failure when loading timeslots');
          }
          return resp.json();
        })
        .catch(console.error)
        .then((data) => {
          console.log(`Active games: ${data.list}`);
          this.activeGames = data.list;
        });
    },
    getGameHistory() {
      fetch('/api/profile/gamehistory')
        .then((resp) => {
          if (!resp.ok) {
            throw new Error('Unexpected failure when loading timeslots');
          }
          return resp.json();
        })
        .catch(console.error)
        .then((data) => {
          console.log(data.list);
          this.gameHistory = data.list;
        });
    },
    joinGame(id) {
      fetch('/api/lobby/joingame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: id,
        }),
      }).then((resp) => {
        if (resp.ok) {
          this.$router.push(`/chesslobby/${id}`);
        } else {
          console.log(`Failed joining game with id: ${id}`);
        }
      });
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/login');
      }).catch((err) => {
        console.log(`Error logging out: ${err.message}`);
      });
    },
  },
  created() {
    this.getActiveGames();
    this.getGameHistory();
  },
};
</script>

<style scoped>

p {
  text-align: center;
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

</style>
