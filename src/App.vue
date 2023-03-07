<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import home from "./home/Home.vue";

export default {
  name: 'App',
  components: {
    home,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  height: 100%;
}
html,
body {
  margin: 0;
  height: 100%;
}
</style>
