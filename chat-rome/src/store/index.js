import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 当前登陆用户
    user: {
      name: '',
      email: '',
      avator: '',
      roomid: '0',
      online: false,
      ischat: false
    },
    roominfo: {
    // 当前房间信息
      users: [{user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}, {user: '路人甲', user_info: '#'}],
      id: ''
    },
    ws: new WebSocket('ws://127.0.0.1:3000')
  },
  getters: {
    getUserList: state => state.roominfo.users,
    getUser: state => state.user,
    getWs: state => state.ws,
    getRoomInfo: state => state.roominfo
  },
  mutations: {
    setUser (state, data) {
      state.user.name = data.name
      state.user.avator = data.avator
      state.user.email = data.email
    },
    setIsChat (state, data) {
      state.user.ischat = data
    },
    setRoomId (state, id) {
      state.user.roomid = id
    },
    setRoomInfo (state, data) {
      state.roominfo.users = data.userList
      state.roominfo.id = data.id
    }
  },
  actions: {
    loginIn (ctx, vueObj) {
      console.log(vueObj)
      axios.get('/signin', {
        params: {
          name: vueObj.username,
          password: vueObj.password,
          eMail: vueObj.eMail
        }
      }).then(function (response) {
        if (response.data.code === '200') {
          console.log(response.data)
          ctx.commit('setUser', response.data)
          vueObj.$router.push('room')
        } else {
          console.log(response.data)
        }
      }).catch((err) => {
        console.log(err)
      })
      console.log(ctx.state.user.name)
    },
    loginOut (ctx) {
      ctx.commit('setUser', {})
    },
    getInRoom (ctx, id) {
      ctx.commit('setIsChat', true)
      ctx.commit('setRoomId', id)
    },
    getOutRoom (ctx) {
      ctx.commit('setIsChat', false)
      ctx.commit('setRoomId', 0)
    },
    register (ctx, vueObj) {
      axios.post('/signup', {
        name: vueObj.username,
        password: vueObj.password,
        email: vueObj.eMail
      }).then((response) => {
        if (response.data.code === '200') {
          vueObj.formMds = 'post'
          ctx.commit('setUser', response.data)
          vueObj['form'].submit()
          vueObj.$router.push('index')
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
        var re = response.data
        ctx.commit('setRoomInfo', re)
        ctx.commit('setRoomId', data.id)
        ctx.commit('setIsChat', true)
        data.obj.$router.push('room')
      }).catch((err) => {
        console.log(err)
      })
    }
  }
})

export default store
