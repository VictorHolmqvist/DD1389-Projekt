<template>
  <div id="container">
    <h1>Lobby Browser</h1>
    <button class="green-button" v-on:click="openLobbyCreator()">Create Game</button>

    <h4 v-if="empty">There are currently no games to join. Create one!</h4>
    <div v-if="!empty" class="row">
      <div class="well" v-for="lobby in lobbies" :key="lobby.gameId">
        <div class="row" style="text-align: center;">
          <h1>{{lobby.gameName}}</h1>
          <h2>{{lobby.gameId}}</h2>
          <p>
            <span>Opponent: {{ lobby.opponentName }}</span>
          </p>
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
  methods: {
    openLobbyCreator() {
      this.$refs.lobbyCreator.classList.remove('hidden');
    },
    closeLobbyCreator() {
      this.$refs.lobbyCreator.classList.add('hidden');
      this.lobbyNameTF = '';
    },
    createGame() {
      fetch('/api/lobby/creategame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lobbyName: this.lobbyNameTF,
        }),
      }).then((resp) => {
        if (resp.status === 200) {
          console.log('Successfully created game');
        } else {
          console.error('Failed creating new Game');
        }
        this.closeLobbyCreator();
      }).catch(console.error);
    },
    joinGame(id) {
      console.log(`Join game with id: ${id}`);
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
  },
  created() {
    fetch('/api/lobby/alljoinable')
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Unexpected failure when loading timeslots');
        }
        return resp.json();
      })
      .catch(console.error)
      .then((data) => {
        console.log(data.list);
        this.lobbies = data.list;
      });

    this.socket = this.$root.socket;
    this.socket.on('new', (game) => {
      console.log('NEW GAME');
      this.lobbies = [...this.lobbies, game];
    });
  },
};
</script>

<style scoped>
#container {
  text-align: center;
}

.row h1 {
  margin: 0;
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
