<template>
  <div id="container">
    <h1>Lobby Browser</h1>
    <p>Page where authenticated users can join a game, or create a new one</p>
    <p>Users that are not authenticated will be redirected to /login</p>
    <button v-on:click="createGame()">Create Game</button>

    <div class="row">
      <div class="well" v-for="lobby in lobbies" :key="lobby.id">
        <div class="row" style="text-align: center;">
          <h1>Game {{lobby.id}}</h1>
          <p>
            <span>Opponent: {{ lobby.user1 }}</span>
          </p>
          <button v-on:click="joinGame(lobby.id)">Join Game</button>
        </div>
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
    };
  },
  methods: {
    createGame() {
      fetch('/lobby/creategame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      }).then((resp) => {
        if (resp.status === 200) {
          console.log('Successfully created game');
        } else {
          console.error('Failed creating new Game');
        }
      }).catch(console.error);
    },
    joinGame(id) {
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
</style>
