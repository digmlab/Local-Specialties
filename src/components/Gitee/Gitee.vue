<template>
  <div>
    <img 
        src="https://gitee.com/chenxuyun/vue_blog/widgets/widget_card.svg?colors=4183c4,ffffff,ffffff,e3e9ed,666666,9b9b9b" 
        alt="" 
        title="点击去下载源码" 
        @click="goGitee" />
  </div>
</template>
<
<script>
export default {
  data() {
    return {}
  },
  mounted() {
    //在PC端,进入该页面时向下滚动, 如果移动端,则不进行操作
    if (!/(Android|iPhone|iPad|iOS|webOS|BlackBerry)/i.test(navigator.userAgent)) {
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      document.documentElement.scrollTop = windowHeight
    }
  },
  methods: {
    goGitee() {
      open('https://gitee.com/chenxuyun/vue_blog.git')
    }
  }
}
</script>
<style scoped>
div {
  margin: 0 auto;
  margin-top: 20px;
  min-height: 50px;
  width: 100%;
}
img {
  width: 100%;
}
img:hover {
  cursor: pointer;
}
</style>
