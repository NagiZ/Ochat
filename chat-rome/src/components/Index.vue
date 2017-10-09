<template>
  <div class="hello">
    <ul class="list-group" id="channel_list">
      <li class="list-group-item list" v-for="channel in room" @click="getInChannel(channel.id)">{{channel.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      room: [{name: 'Animation', id: 1}, {name: 'Comic', id: 2}, {name: 'Music', id: 3}, {name: 'Film', id: 4}, {name: 'Games', id: 5}, {name: 'Novels', id: 6}],
      ws: this.$store.state.ws
    }
  },
  methods: {
    getInChannel: (id) => {
      console.log(id)
      this.$store.dispatch('getInChannel', {obj: this, id: id})
    }
  },
  created: function () {
    var ws = this.ws
    ws = new WebSocket('ws://127.0.0.1:3000')
    ws.onopen = function () {
      console.log('open la')
    }
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