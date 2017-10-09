<template>
  <div class="login">
    <div class="container-fluid row loginBox">
      <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
        <form :action="action" method="formMds" id="login-form" class="lf">
          <div class="form-gorup">
            <label for="username">Username</label>
            <input type="text" v-model="username" name="name" class="form-control" placeholder="Enter Your Username" id="username">
          </div>
          <div class="form-gorup">
            <label for="e-mail">E-mail</label>
            <input type="email" v-model="eMail" class="form-control" name="email" placeholder="Enter Your Email" id="e-mail">
          </div>
          <div class="form-gorup">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control" name="password" placeholder="Enter Your Password" id="password">
          </div>
          <div class="btn-act">
            <button class="btn si" @click="ln($event)">Sign In</button>
            <router-link to="/f-pw" class="f-pw" @click="">忘记密码</router-link>
            <button class="btn btn-info su" @click="lu">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
// import axios from 'axios'
// import {mapActions} from 'vuex'
export default {
  name: 'login',
  data () {
    var loginIn = '/login/in'
    var loginUp = '/login/up'
    var loginAction = ''
    var username = ''
    var password = ''
    var eMail = ''
    var formMethods = ''
    var mp = false
    var form = $('#login-form')
    return {in: loginIn, up: loginUp, action: loginAction, username: username, password: password, eMail: eMail, formMds: formMethods, form, mp}
  },
  methods: {
    ln: function (event) {
      // 登入
      var that = this
      event.preventDefault()
      that.formMds = 'get'
      that.$store.dispatch('loginIn', that)
    },
    lu: function () {
    // 注册
      var that = this
      event.preventDefault()
      that.$store.dispatch('register', that)
    }
  },
  created: function () {
    var storage = window.localStorage
    if (storage['u-email'] && storage.password) {
      $('#e-mail').val(storage['u-email'])
      $('#password').val(storage.password)
    }
  }
}
</script>

<style scoped>
  .dn{
    display: none;
  }
  .lf{
    text-align: left;
  }
  .lf>div{
    margin-bottom: 20px;
  }
  .loginBox{
    margin-top: 50px;
  }
  /*button in form*/
  .btn-act{
    display: flex;
    overflow: hidden;
    justify-content: space-around;
    height: 90px;
    padding: 8px 30px;
  }
  .si, .su{
    align-self: flex-start;
  }
  .f-pw{
    align-self: flex-end;
  }
</style>