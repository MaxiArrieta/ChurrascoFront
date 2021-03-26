<template>
  <v-app id="app">
    <router-view />
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-image: linear-gradient(
    180deg,
    rgb(56, 50, 116) 21.8%,
    rgb(42, 37, 86) 100.2%
  );
}

html,
body {
  margin: 0;
  padding: 0;
  background-image: linear-gradient(
    180deg,
    rgb(56, 50, 116) 21.8%,
    rgb(42, 37, 86) 100.2%
  );
}
</style>
