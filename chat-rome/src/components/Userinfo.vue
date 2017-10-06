<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div style="text-align: center;">{{getUser.name}}</div>
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
    ])
  }
}
</script>