import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import lomds from '../../config/mds.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 当前登陆用户
    user: {
      name: '',
      email: '',
      avator: '',
      roomid: 0,
      online: false,
      ischat: false
    },
    roominfo: {
    // 当前房间信息
      users: [],
      id: '',
      messageList: [[], [], [], [], [], []]
    },
    guestDetail: {},
    hostDetail: {},
    ws: null
  },
  getters: {
    getUserList: state => state.roominfo.users,
    getUser: state => state.user,
    getWs: state => state.ws,
    getRoomInfo: state => state.roominfo,
    getOnline: state => state.user.online,
    getIsChat: state => state.user.ischat,
    getGuest: state => state.guestDetail
  },
  mutations: {
    setUser (state, data) {
      state.user.name = data.name
      state.user.avator = data.avator
      state.user.email = data.email
      state.user.online = data.online
    },
    setIsChat (state, data) {
      state.user.ischat = data
    },
    setRoomId (state, id) {
      state.user.roomid = id
    },
    setRoomInfo (state, data) {
      state.roominfo.users = []
      if (data.userList) {
        data.userList.forEach((v) => {
          var userDt = {
            user: v.name,
            info: {
              email: v.email,
              online: v.online
            }
          }
          state.roominfo.users.push(userDt)
        })
        state.roominfo.id = data.rid
      } else {
        state.roominfo.id = 0
        state.roominfo.messageList = [[], [], [], [], [], []]
      }
    },
    connectWs (state) {
      state.ws = new WebSocket('ws://127.0.0.1:3000')
    },
    closeWs (state) {
      try {
        if (state.ws !== null) {
          state.ws.terminate()
        }
      } catch (err) {
        console.log(err)
      } finally {
        state.ws = null
      }
    },
    setCondition (state, data) {
      state.user.online = data
    },
    setGuestDetail (state, data) {
      state.guestDetail = data
    },
    setHostDetail (state, data) {
      state.hostDetail = data
    },
    addToMessageList (state, data) {
      state.roominfo.messageList[data.roomid - 1].push(data)
    },
    updateUList (state, data) {
      console.log(data)
      switch (data.tag) {
        case 'in':
          var userInOut = {
            user: data.data.name,
            info: {
              email: data.data.email,
              online: data.data.online
            }
          }
          console.log(state.roominfo.users.indexOf(userInOut))
          if (state.roominfo.users.indexOf(userInOut) === -1) {
            state.roominfo.users.push(userInOut)
          }
          break
        case 'out':
          var ti = null
          state.roominfo.users.forEach((v, i) => {
            if (v.info.email === data.data.email) {
              ti = i
            }
          })
          state.roominfo.users.splice(ti, 1)
          break
        default: break
      }
    }
  },
  actions: {
    loginIn (ctx, vueObj) {
      console.log(vueObj)
      axios.get('/signin', {
        params: {
          name: vueObj.username,
          password: vueObj.password.trim(),
          eMail: vueObj.eMail.trim()
        }
      }).then(function (response) {
        if (response.data.code === '200') {
          // console.log(response.data)
          ctx.commit('setUser', response.data)
          ctx.commit('connectWs', response.data)
          var loginMsg = JSON.stringify({method: 'login', data: {token: response.data.token, email: response.data.email}})
          var ws = ctx.state.ws
          ws.onopen = function () {
            ws.send(loginMsg)
            ctx.commit('setCondition', response.data.online)
            vueObj.$router.push('/')
          }
        } else {
          console.log(response.data)
        }
      }).catch((err) => {
        console.log(err)
      })
      console.log(ctx.state.user.name)
    },
    loginOut (ctx, vueObj) {
      axios.get('/login_out', {
        params: {
          token: lomds.getCookie('token')
        }
      }).then((response) => {
        console.log(response.data)
        if (response.data.code === '200') {
          ctx.commit('setUser', {})
          ctx.commit('setRoomId', 0)
          ctx.commit('setRoomInfo', {})
          ctx.commit('setIsChat', false)
          ctx.commit('closeWs')
          if (!vueObj.isLoginPage) {
            vueObj.$router.push('login')
          }
        } else {
          console.log(response.data)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getOutRoom (ctx) {
      ctx.commit('setIsChat', false)
      ctx.commit('setRoomId', 0)
    },
    register (ctx, vueObj) {
      axios.post('/signup', {
        name: vueObj.username.trim(),
        password: vueObj.password.trim(),
        email: vueObj.eMail.trim()
      }).then((response) => {
        if (response.data.code === '200') {
          vueObj.formMds = 'post'
          ctx.commit('setUser', response.data)
          ctx.commit('connectWs', response.data)
          lomds.storePasswd(window.localStorage, vueObj, true)
          vueObj['form'].submit()
          vueObj.$router.push('/')
        } else {
          console.log(response.data)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getInChannel (ctx, data) {
      axios.get('/roominfoget_userlist', {
        params: {
          id: data.id
        }
      }).then((response) => {
        // 先退出当前房间，移除item，再加入另一个room
        var cri = ctx.state.user.roomid
        if (data.id !== cri && cri !== 0) {
          var leaveMsg = JSON.stringify({method: 'leaveChannel', data: {roomId: cri, email: data.obj.$store.state.user.email}})
          ctx.state.ws.send(leaveMsg)
        }
        var re = response.data
        // console.log(re)
        ctx.commit('setRoomInfo', re)
        ctx.commit('setRoomId', re.rid)
        ctx.commit('setIsChat', true)
        var joinMsg = JSON.stringify({method: 'getInChannel', data: {roomId: data.id, email: data.obj.$store.state.user.email}})
        ctx.state.ws.send(joinMsg)
        data.obj.$router.push('room')
      }).catch((err) => {
        console.log(err)
      })
      // data.obj.$router.push('room')
    },
    receiveMsg (ctx, data) {
      ctx.commit('addToMessageList', data)
    },
    getGuestDetail (ctx, data) {
      axios.get('/users/detail', {
        params: {
          email: data.email
        }
      }).then((response) => {
        if (response.data.code === '200') {
          console.log(response.data)
          ctx.commit('setGuestDetail', response.data.data)
          data.obj.$router.push('users/detail/' + response.data.data.name)
        }
      })
    },
    getHostDetail (ctx, data) {
      axios.get('/users/detail', {
        params: {
          email: data.email
        }
      }).then((response) => {
        if (response.data.code === '200') {
          console.log(response.data)
          ctx.commit('setHostDetail', response.data.data)
          data.obj.$router.push('hostsetting')
        }
      })
    },
    updateUserlist (ctx, data) {
      ctx.commit('updateUList', data)
    }
  }
})

export default store
