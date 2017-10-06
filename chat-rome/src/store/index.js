import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 当前登陆用户
    user: {
      name: '',
      email: '',
      avator: '',
      roomid: '0',
      ischat: false
    },
    roominfo: {
    // 当前房间信息
      users: {},
      id: ''
    }
  },
  getters: {
    getUserList: state => state.roominfo.users,
    getUser: state => state.user
  },
  mutations: {
    setUser (state, data) {
      state.user.name = data.name
      state.user.avator = data.avator
    },
    setIsChat (state, data) {
      state.user.ischat = data
    },
    setRoomId (state, id) {
      state.user.roomid = id
    }
  },
  actions: {
    loginIn (ctx, data) {
      ctx.commit('setUser', data)
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
    }
  }
})

export default store
