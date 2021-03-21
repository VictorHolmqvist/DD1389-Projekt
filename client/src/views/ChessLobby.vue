<template>
<h1>Lobby {{gameId}}</h1>
</template>

<script>
export default {
  name: 'ChessLobby',
  data() {
    return {
      gameId: this.$route.params.gameid,
    };
  },
};
</script>

<style scoped>

</style>
