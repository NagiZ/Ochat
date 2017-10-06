<template>
  <div class="home">
    <div class="h-box row no-margin full-height">
      <div class="col-md-3 col-sm-3 hidden-xs panel panel-default user-list">
        <ul class="list-group" id="user-list">
          <li class="list-group-item l" v-for="item in userList.chatto">{{item.user}}
          </li>
        </ul>
        <div id="user-info" class="user-info" @mouseenter="showID" @mouseleave="hideID">
          <div id="info-basic" class="l">
            <router-link to="/index" @click.native='console.log("aabbcc")'>
              <img src="/static/image/avator.png" alt="Nagi">
              <span id="host">{{getUser.name}}</span>
            </router-link>
          </div>
          <div class="info-detail" id="info-detail">
          <ul class="list-group b-default" style="margin-bottom: 0;">
            <li class="list-group-item l bn">{{getUser.name}}</li>
            <li class="list-group-item l bn">address</li>
            <li class="list-group-item l bn">e a</li>
            <li class="list-group-item l bn"><router-link :to="ui">Detail</router-link></li>
          </ul>
        </div>
        </div>
      </div>
      <!-- userlist end -->
      <div class="col-md-9 col-sm-9 panel panel-default" id="chat-area">
        <div id="msg-list">
          <p class="dn">{{message}}</p>
          <div id="msg-items" v-for="msg in msgList" :class="[msg.type ? 'm-right' : 'm-left', 'msg-items']">
            <img v-if="!msg.type" src="#" alt="avator" class="vtp">
            <div style="display: inline-block;">
              <div style="display: inline-block;">
                <span>{{msg.from}}</span>
                <span class="msg-block" style="text-align: left;"><pre v-text="msg.msg"></pre></span>
              </div>
            </div>
            <img v-if="msg.type" src="#" alt="avator" class="vtp">
          </div>
          <!-- 要优化写法...目前还不熟悉 -->
        </div>
        <div id="msg-input"><textarea v-model="message"></textarea><button class="btn btn-info btn-send" @click="sendMsg"><span class="glyphicon glyphicon-send"></span></button></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {mapGetters} from 'vuex'
import cmds from '../../config/mds.js'
export default {
  name: 'home',
  data () {
    var chatto = [{user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}]
    var userList = {chatto: chatto, host: this.$store.state.user.name}
    var msgList = [{msg: 'i am coming!', from: '路人甲', type: 0}, {msg: 'i am coming!', from: '路人甲', type: 0}, {msg: 'i am coming!', from: '路人甲', type: 0}, {msg: 'i am host!', from: '主角啦', type: 1}]
    var message = ''
    return {userList: userList, msgList: msgList, message: message}
  },
  methods: {
    sendMsg: function () {
      var ms = JSON.stringify({message: this.message, from: this.getUser.name, type: 0, roomid: this.getUser.roomid, src: ''})
      ws.send(ms, (err) => {
        if (err) console.log(err)
      }
      )
      addMsg(this.msgList, this.message, 1, this.getUser.name)
      this.message = ''
    },
    showID: sID,
    hideID: hID
  },
  created: function () {
    isSignIn()
    var that = this
    ws = new WebSocket('ws://127.0.0.1:3000')
    ws.onopen = function () {
      $('#msg-input textarea').focus()
      console.log('open la')
    }

    ws.onmessage = function (message) {
      console.log(message.data)
      var msg = JSON.parse(message.data)
      addMsg(that.msgList, msg.message, msg.type, msg.from)
    }
  },
  // 用计算属性实时更新dom
  computed: {
    ...mapGetters([
      'getUser'
    ]),
    ui: function () {
      return '/userinfo/' + this.getUser.name
    }
  }
}
// 两个选择，一个是不用双向绑定；一个是双向绑定。后者增大渲染开销。and then socket send
function addMsg (list, msg, type, from) {
  var srh = gh() > $('#msg-list').height() ? gh() : $('#msg-list').height()
  if (msg.length === 0 || !msg) {
    return
  }
  list.push({msg: msg, type: type, from: from})
  $('#msg-list').animate({
    scrollTop: srh
  })
}

// get height of msg-list area
function gh () {
  var hA = [].map.call($('#msg-list #msg-items'), function (cv, i) {
    return cv.offsetHeight
  })
  var tH = hA.reduce(function (pree, cure, index) {
    return pree + cure
  }, 0)
  return tH
}

function sID () {
  $('#info-detail').animate({
    'bottom': $('#info-basic').get(0).offsetHeight
  })
}

function hID () {
  $('#info-detail').animate({
    'bottom': -500
  })
}
// ws
var ws = null

function isSignIn () {
  console.log(document.cookie)
  var token = cmds.getCookie('token')
  if (token === undefined || token === '') {
    alert('未登录！')
    window.location.href = '/#/login'
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*common*/
  html{
    height: 100%;
  }
  body{
    height: 100%;
  }
  .full-height{
    height: 100%;
  }
  .l{
    cursor: pointer;
    transition: all 0.3s;
  }
  .l:hover{
    background-color: #fa0;
  }
  .dn{
    display: none;
  }
  .bn{
    border: none;
    border-radius: 0;
  }
  .b-default{
    border: 1px solid #e8e8e8;
  }
/*userlist*/
  .home{
    width: 100%;
    height: 100%;
  }
  .user-list{
    position: relative;
    height: 100%;
    margin: 0;
    overflow: hidden;
  }
  #user-list{
    
  }
  .user-info{
    position: absolute;
    width: 100%;
    bottom: 0;
    margin: 0 -15px;
    padding: 0 15px;
    cursor: pointer;
  }
  #info-basic{
    padding: 10px 0;
    border-top: 1px solid #e8e8e8;
    bottom: 0;
  }
  #info-basic img{
    max-width: 34px;
    max-height: 34px;
    border-radius: 34px;
  }
  .info-detail{
    width: 100%;
    margin-left: -15px;
    padding: 0 15px;
    position: absolute;
    bottom: -500px;
  }
  /*chat area*/
  #chat-area{
    height: 100%;
    background-color: #f00;
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
  }
  #msg-list{
    background-color: #000;
    order: 0;
    min-height: 30%;
    flex: 5 3 auto;
    overflow-y: scroll;
  }
  #msg-list::-webkit-scrollbar{
    display: none;
  }
  #msg-input{
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    order: 1;
    height: 10%;
    min-height: 10%;
    flex: 0 1 auto;
    padding: 5px 15px;
    background-color: #666;
  }
  #msg-input>textarea{
    display: block;
    flex-grow: 1;
    height: 100%;
    border: none;
  }
  #msg-input>textarea:focus{
    outline: none;
  }
  .msg-items{
    margin-bottom: 15px;
    padding: 10px;
  }
  .m-left{
    text-align: left;
  }
  .m-right{
    text-align: right;
  }
  .vtp{
    vertical-align: top;
    cursor: pointer;
  }
  .msg-block{
    padding: 5px;
    margin: 0 10px;
  }
  .btn-send{
    display: block;
    text-align: center;
    font-size: 25px;
    height: 100%;
    min-width: 50px;
    border-radius: 0;
  }
</style>
