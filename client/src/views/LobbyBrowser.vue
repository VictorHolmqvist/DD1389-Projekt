<template>
  <div id="container">
    <h1>Lobby Browser</h1>
    <p>Page where authenticated users can join a game, or create a new one</p>
    <p>Users that are not authenticated will be redirected to /login</p>
    <button v-on:click="openLobbyCreator()">Create Game</button>

    <div class="row">
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
  methods: {
    openLobbyCreator() {
      this.$refs.lobbyCreator.classList.remove('hidden');
    },
    closeLobbyCreator() {
      this.$refs.lobbyCreator.classList.add('hidden');
      this.lobbyNameTF = '';
    },
    createGame() {
      fetch('/lobby/creategame', {
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
      }).catch(console.error);
    },
    joinGame(id) {
      console.log(`Join game with id: ${id}`);
      fetch('/lobby/joingame', {
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
    fetch('/lobby/alljoinable')
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
