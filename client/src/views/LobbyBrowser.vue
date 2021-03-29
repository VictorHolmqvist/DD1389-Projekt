<template>
  <div id="container">
    <h1>Lobby Browser</h1>
    <button class="green-button" v-on:click="openLobbyCreator()">Create Game</button>

    <h4 v-if="empty">There are currently no games to join. Create one!</h4>
    <div v-if="!empty" class="row">
      <div class="well" v-for="lobby in lobbies" :key="lobby.gameId">
        <div class="row" style="text-align: center;">
          <h1>{{lobby.gameName}}</h1>
          <p>GameId: {{lobby.gameId}}</p>
          <p>Opponent: {{ lobby.opponentName }}</p>
          <button v-on:click="joinGame(lobby.gameId)">Join Game</button>
        </div>
      </div>
    </div>

    <div ref="lobbyCreator" class="lobby-creator hidden">
      <div class="lobby-creator-content">
        <label>Lobby name</label>
        <input v-model="lobbyNameTF" class="form-control" type="text"/>
        <button class="green-button" v-on:click="createGame()">Create Game</button>
        <button class="red-button" v-on:click="closeLobbyCreator()">Cancel</button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'LobbyBrowser',
  data() {
    return {
      lobbies: [],
      lobbyNameTF: '',
      isInstanitated: false,
    };
  },
  computed: {
    empty: function empt() {
      if (!this.lobbies) {
        return true;
      }
      if (this.lobbies.length === 0) {
        return true;
      }
      return false;
    },
  },
  beforeRouteEnter(to, from, next) {
    console.log(`Navigated from: ${from.path} to ${to.path}`);
    if (to.path === '/lobbybrowser' && from.path !== '/lobbybrowser') {
      next((vm) => {
        if (vm.isInstanitated) {
          vm.getAllJoinable();
        }
      });
    } else {
      next();
    }
  },
  methods: {
    openLobbyCreator() {
      this.$refs.lobbyCreator.classList.remove('hidden');
    },
    closeLobbyCreator() {
      this.$refs.lobbyCreator.classList.add('hidden');
      this.lobbyNameTF = '';
    },
    createGame() {
      this.$http.post('/api/lobby/creategame', { lobbyName: this.lobbyNameTF })
        .then((resp) => {
          if (resp.status === 200) {
            console.log('Successfully created game');
          } else {
            console.error('Failed creating new Game');
          }
          this.closeLobbyCreator();
        }).catch((err) => {
          console.error(err.message);
        });
    },
    joinGame(id) {
      console.log(`Join game with id: ${id}`);
      this.$http.post('/api/lobby/joingame', { gameId: id })
        .then((resp) => {
          if (resp.ok) {
            this.$router.push(`/chesslobby/${id}`);
          } else {
            console.log(`Failed joining game with id: ${id}`);
          }
        });
    },
    getAllJoinable() {
      console.log('alljoinable');
      return new Promise((resolve, reject) => {
        this.$http.get('/api/lobby/alljoinable').then((resp) => {
          console.log('alljoinable then');
          if (!resp.ok) {
            console.log('LobbyBrowser: failed loading joinable games, status is not ok');
          }
          const respJson = resp.json();
          console.log(`resp.json = ${respJson}`);
          return respJson;
        }).then((data) => {
          console.log(data.list);
          this.lobbies = data.list;
          resolve();
        }).catch((err) => {
          console.log(`LobbyBrowser: failed loading joinable games: ${err.message}, ${err.status}`);
          reject();
        });
      });
    },
  },
  created() {
    this.getAllJoinable().then(() => {
      setTimeout(() => {
        this.isInstanitated = true;
      }, 1000);
    }).catch(console.error);

    this.socket = this.$root.socket;

    this.socket.on('new', (game) => {
      console.log('NEW GAME');
      this.lobbies = [...this.lobbies, game];
    });

    this.socket.on('removed', (gameId) => {
      console.log('REMOVED');
      this.lobbies.forEach((game, index) => {
        if (game.gameId === gameId) {
          this.lobbies.splice(index, 1);
        }
      });
    });
  },
};
</script>

<style scoped>
#container {
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

.hidden {
  display: none;
}

.lobby-creator {
  position: absolute;
  width: 500px;
  height: 200px;
  top: 200px;
  left: 50%;
  transform: translateX(-250px);
  background-color: white;
  z-index: 10;
  margin: auto;
}

.lobby-creator input{
  width: 60%;
  margin: auto;
}

.lobby-creator-content {
  margin: auto;
}

.red-button {
  background-color: red;
  color: white;
}

.green-button {
  background-color: green;
  color: white;
}

</style>
