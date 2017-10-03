<template>
  <div class="login">
    <div class="container-fluid row loginBox">
      <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
        <form :action="action" method="post" id="login-form" class="lf">
          <div class="form-gorup">
            <label for="username">Username</label>
            <input type="text" v-model="username" class="form-control" placeholder="Enter Your Username" id="username">
          </div>
          <div class="form-gorup">
            <label for="e-mail">E-mail</label>
            <input type="email" v-model="eMail" class="form-control" placeholder="Enter Your Email" id="e-mail">
          </div>
          <div class="form-gorup">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control" placeholder="Enter Your Password" id="password">
          </div>
          <div class="btn-act">
            <button class="btn si" @click="ln($event)">Sign In</button>
            <router-link to="/f-pw" class="f-pw">忘记密码</router-link>
            <button class="btn btn-info su" @click="lu">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'login',
  data () {
    var loginIn = '/login/in'
    var loginUp = '/login/up'
    var loginAction = ''
    var username = ''
    var password = ''
    var eMail = ''
    return {in: loginIn, up: loginUp, action: loginAction, username: username, password: password, eMail: eMail}
  },
  methods: {
    ln: function (event) {
      // 登入
      event.preventDefault()
      var obj = {name: this.username, email: this.eMail, password: this.password}
      $.get('/login/check', obj, function (data) {
        console.log(data)
      })
    },
    lu: function () {
    // 注册
    }
  }
}
</script>

<style scoped>
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