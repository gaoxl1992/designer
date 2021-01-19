<!--
 * @Description: 
 * @props: 
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="scss">
html,
body {
  position: relative;
  height: 100%;
  margin: 0 !important;
  padding: 0 !important;
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    position: relative;
    height: 100%;
    overflow: hidden;
    background-color: #e4e7ee;
  }
  td span {
    padding: 0 !important;
  }
}
</style>
