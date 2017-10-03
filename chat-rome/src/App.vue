<template>
  <div id="app" ref="wib">
    <router-view></router-view>
  </div>
</template>

<script>
import $ from 'jquery'
var height = $(window).height() - $('#navigation').height()
export default {
  name: 'app',
  mounted () {
    this.$refs.wib.style.height = height + 'px'
  }
}
console.log('abc 123')
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: -0px;
}
</style>
