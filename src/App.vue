<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
  watch: {
    '$route' () {
      document.title = this.$route.meta.title || '地方特产分享网站' // 设置网页标题
    }
  }
}
</script>

<style>

</style>
