<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div style="text-align: center;">
          <img src="" alt="avator">{{name}}
          <ul class="list-group">
            <li class="list-group item">tab1</li>
            <li class="list-group item">tab2</li>
            <li class="list-group item">tab3 </li>
            <li class="list-group item">tab4</li>
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
      'getUser'
    ]),
    gs: function () {
      return this.$route.params.name
    }
  }
}
</script>