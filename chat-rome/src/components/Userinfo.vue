<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div style="text-align: center;">
          <div>
            <img src="getGuest.avator" alt="avator">
          </div>
          <ul class="list-group">
            <li class="list-group item" v-for="(value, key) in getGuest">
              <span>{{key}}: {{value}}</span>
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
  name: 'userinfo',
  computed: {
    ...mapGetters([
      'getGuest',
      'getOnline'
    ]),
    gs: function () {
      return this.$route.params.name
    }
  },
  created: function () {
    if (!this.getOnline) {
      this.$router.push('login')
    }
  }
}
</script>