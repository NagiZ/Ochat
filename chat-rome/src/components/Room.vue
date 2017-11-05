<template>
  <div class="home">
    <div class="h-box row no-margin full-height">
      <div class="col-md-3 col-sm-3 hidden-xs panel panel-default user-list">
        <ul class="list-group" id="user-list">
          <li class="list-group-item l lfuinfo" v-for="item in getRoomInfo.users">
            <span>{{item.user}}</span><span @click="getDetail(item.info.email)" class="mdetail">More Detail</span>
            <div class="users-detail">
              <span class="users-detail-items text-info">E-mail: {{item.info.email}}</span>
              <span class="users-detail-items text-primary">Online: {{item.info.online}}</span>
            </div>
          </li>
        </ul>
        <div id="user-info" class="user-info" @mouseenter="showID" @mouseleave="hideID">
          <div id="info-basic" class="l">
            <span @click="goHostSetting">
              <img src="/static/image/avator.png" alt="Nagi">
              <span id="host">{{getUser.name}}</span>
            </span>
          </div>
          <div class="info-detail" id="info-detail">
          <ul class="list-group b-default" style="margin-bottom: 0;">
            <li class="list-group-item l bn un">{{getUser.name}}</li>
            <li class="list-group-item l bn sn">Signature</li>
            <li class="list-group-item l bn">{{getUser.email}}</li>
            <!-- <li class="list-group-item l bn"><router-link :to="ui">Detail</router-link></li> -->
            <li class="list-group-item l bn" @click="loginOut"><span class="text-danger">注销/Sign Out</span></li>
          </ul>
        </div>
        </div>
      </div>
      <!-- userlist end -->
      <div class="col-md-9 col-sm-9 panel panel-default" id="chat-area">
        <div id="msg-list">
          <div id="msg-items" v-for="msg in msgList" :class="[!msg.type ? 'm-right' : 'm-left','msg-box']">
            <div :class="[msg.type ? 'img-l' : 'img-r']">
              <img src="#" alt="avator">
              <p class="msg-from">{{msg.from}}</p>
            </div>
            <div class="msg-body-box">
              <span class="timestring">a timestamp or a readable timestring?</span>
              <div class="msg-body">
                <p>{{msg.msg}}</p>
              </div>
            </div>
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
import rAs from '../../config/roomActions.js'
export default {
  name: 'home',
  data () {
    var msgList = []
    var message = ''
    var ws = null
    return {msgList: msgList, message: message, ws}
  },
  methods: {
    sendMsg: function () {
// ms需要加入token
      var ms = {method: 'sendMessage', data: {message: this.message, from: this.getUser.name, type: 0, roomid: this.getRoomInfo.id, src: ''}}
      var local = {message: this.message, from: this.getUser.name, type: 1, roomid: this.getRoomInfo.id, src: ''}
      this.$store.dispatch('receiveMsg', local)
      ms = JSON.stringify(ms)
      this.ws.send(ms, (err) => {
        if (err) console.log(err)
      })
      rAs.addMessage(this.msgList, this.message, 1, this.getUser.name, $('#msg-list #msg-items'), $('#msg-list'))
      this.message = ''
    },
    showID: function () {
      rAs.showID($('#info-detail'), $('#info-basic').get(0).offsetHeight)
    },
    hideID: function () {
      rAs.hideID($('#info-detail'), -500)
    },
    // hostSetting: function () {
    //   this.$store.dispatch('hostSetting', this)
    // },
    getDetail: function (email) {
      this.$store.dispatch('getGuestDetail', {obj: this, email: email})
    },
    goHostSetting: function () {
      this.$store.dispatch('getHostDetail', {obj: this, email: this.getUser.email})
    },
    loginOut: function () {
      this.$store.dispatch('loginOut', this)
    }
  },
  created: function () {
    if (!this.getOnline) {
      this.$router.push('login')
    } else {
      if (!this.getIsChat) {
        this.$router.push('/')
      }
    }
    var that = this
    this.ws = this.getWs
    if (this.getRoomInfo.messageList[this.getRoomInfo.id - 1].length > 0) {
      for (var m of this.getRoomInfo.messageList[this.getRoomInfo.id - 1]) {
        this.msgList.push({msg: m.message, type: m.type, from: m.from})
      }
    }
    $('#msg-input textarea').focus()
    this.ws.onmessage = function (message) {
      // console.log('room receive Msg')
      var msg = JSON.parse(message.data)
      switch (msg.method) {
        case 'sendMessage':
          var msgdata = msg.data
          that.$store.dispatch('receiveMsg', msgdata)
          rAs.addMessage(that.msgList, msgdata.message, msgdata.type, msgdata.from, $('#msg-list #msg-items'), $('#msg-list'))
          break
        case 'getInChannel':
          // console.log(msg)
          that.$store.dispatch('updateUserlist', {data: msg.data, tag: 'in'})
          break
        case 'leaveChannel':
          that.$store.dispatch('updateUserlist', {data: msg.data, tag: 'out'})
          break
        default: break
      }
    }
    this.ws.onclose = function () {
      console.log('ws closing!')
    }
  },
  mounted: function () {
    if (this.getRoomInfo.messageList[this.getRoomInfo.id - 1].length > 0) {
      $('#msg-list').scrollTop(rAs.getHeight($('#msg-list #msg-items')))
    }
  },
  // 用计算属性实时更新dom
  computed: {
    ...mapGetters([
      'getUser',
      'getRoomInfo',
      'getWs',
      'getUserList',
      'getOnline',
      'getIsChat'
    ]),
    ui: function () {
      return '/userinfo/' + this.getUser.name
    }
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
  .un{
    font-weight: bold;
    font-size: 18px;
    columns: #22f;
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
  .users-detail{
    display: none;
    padding: 8px 10px;
  }
  .lfuinfo:hover .users-detail{
    display: block;
  }
  .mdetail{
    float: right;
    color: #50f;
    text-decoration: underline;
  }
  .users-detail-items{
    display: block;
    padding: 5px 8px;
    border-top: 1px solid #e8e8e8;
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
  .msg-box{
    display: flex;
    text-align: left;
    margin-bottom: 20px;
  }
  .m-left{
    justify-content: flex-start;
  }
  .m-right{
    justify-content: flex-end;
  }
  .img-l{
    order: 0;
    flex: 0 0 auto;
  }
  .img-r{
    order: 2;
    flex: 0 0 auto;
  }
  .msg-from{
    font-size: 20px;
    color: #f15;
    font-style: italic;
  }
  .msg-body-box{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .timestring{
    margin-bottom: 3px;
    color: #fff;
    font: italic bold 18px/20px arial;
  }
  .msg-body{
    margin: 3px 10px;
    padding: 3px 10px;
    word-break: break-all;
    background-color: #fff;
    box-shadow: 0 0 10px #e8e8e8;
    border-radius: 5px;
    flex: 0 1 auto;
  }
  .msglistitembox{
    word-break: break-all;
    word-wrap: break-word;
  }
  .msglistitem-box{
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
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
