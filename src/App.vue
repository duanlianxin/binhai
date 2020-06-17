<template>
	<div id="app">
		<keep-alive include="Home">
			<router-view></router-view>
		</keep-alive>
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
                name:'App',
	}
</script>
<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		height: 100%;
	}

</style>
