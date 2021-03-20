<template>
  <div id="container">
    <h1>Lobby Browser</h1>
    <p>Page where authenticated users can join a game, or create a new one</p>
    <p>Users that are not authenticated will be redirected to /login</p>
  </div>
</template>

<script>
export default {
  name: 'LobbyBrowser',
};
</script>

<style scoped>
#container {
  text-align: center;
}
</style>
