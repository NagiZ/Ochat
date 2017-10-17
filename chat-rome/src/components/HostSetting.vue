<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div style="text-align: center;">
          <div>
            <div>
              <img src="getUser.avator" alt="avator">
              <p class="modify">修改头像</p>
            </div>
          </div>
          <ul class="list-group">
            <li class="list-group-items" v-for="(value, key) in getUser">
              <span>{{key}}: {{value}}</span>
              <span class="modify">修改</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'host',
  computed: {
    ...mapGetters([
      'getUser'
    ])
  }
}
</script>

<style scoped>
  .modify{
    cursor: pointer;
    color: #55f;
  }
</style>