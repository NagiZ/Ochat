<template>
	<div class="hello">
		<ul class="list-group">
			<li class="list-group-items">{{id}}</li>
			<li class="list-group-items">2</li>
			<li class="list-group-items">3</li>
			<li class="list-group-items">4</li>
			<li class="list-group-items">5</li>
			<li class="list-group-items">6</li>
		</ul>
	</div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      id: 1325
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
</style>