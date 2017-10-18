<template>
  <div class="hello">
    <ul class="list-group" id="channel_list">
      <li class="list-group-item list" v-for="channel in room" @click="getInChannel(channel.id)">{{channel.name}}</li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      room: [{name: 'Animation', id: 1}, {name: 'Comic', id: 2}, {name: 'Music', id: 3}, {name: 'Film', id: 4}, {name: 'Games', id: 5}, {name: 'Novels', id: 6}]
    }
  },
  methods: {
    getInChannel: function (id) {
      this.$store.dispatch('getInChannel', {obj: this, id: id})
    }
  },
  created: function () {
    if (!this.getOnline) {
      this.$router.push('login')
    }
    if (!this.getWs) {
      this.$store.commit('connectWs')
    }
  },
  computed: {
    ...mapGetters([
      'getWs',
      'getOnline'
    ])
  }
}
</script>

<style scoped>
  .class{
    width: 1000px;
    height: 1000px;
    border: 2px solid #f00;
  }
  li{
    cursor: pointer;
  }
  .list{
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #fff;
    /*box-shadow: 0 0 10px #a0f;*/
    transition: all 0.3s;
  }
  .list:hover{
    font-size: 30px;
    padding: 20px 0;
    background-color: #f05;
    box-shadow: 0 0 50px #fff;
  }
  #channel_list{
    background-color: #f0f;
  }
</style>