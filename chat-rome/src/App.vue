<template>
  <div id="app" ref="wib">
    <router-view></router-view>
  </div>
</template>

<script>
import $ from 'jquery'
import cmds from '../config/mds.js'
var height = $(window).height() - $('#navigation').height()
export default {
  name: 'app',
  mounted () {
    this.$refs.wib.style.height = height + 'px'
  },
  created: function () {
    isSignIn()
  }
}

function isSignIn () {
  var token = cmds.getCookie('token')
  if (token === undefined || token === '') {
    alert('未登录！')
    window.location.href = '/#/login'
  }
}
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
