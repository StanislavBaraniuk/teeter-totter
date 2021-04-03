<template>
  <div id="app">
    <game-interface/>
    <teeter-totter/>
  </div>
</template>

<script>
import TeeterTotter from './components/TeeterTotter/index'
import GameInterface from './components/GameInterface'
export default {
  name: 'App',
  components: {
    TeeterTotter,
    GameInterface
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
