<template>
  <div>
    <div class="container">
      <div class="detail">
        微信公众号:软件聚导航, QQ群:375072669(软件聚导航) ,本网站前端使用vue+elementui,后端使用php语言实现, 下面展示的图片是使用php定时每天自动爬取一张必应搜索壁纸。
      </div>
      <div class="image">
        <el-image v-for="(itme, i) in imageUrlList" :src="itme" :key="i" :preview-src-list="imageUrlList"> </el-image>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrlList: []
    }
  },
  created() {
    this.getImage()
  },
  mounted() {
    //在PC端,进入该页面时向下滚动当前可视窗体高度, 如果移动端,则不进行操作
    if (!/(Android|iPhone|iPad|iOS|webOS|BlackBerry)/i.test(navigator.userAgent)) {
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      document.documentElement.scrollTop = windowHeight
    }
    
},
  methods: {
    getImage() {
      this.$http.get('http://api-vueblog.czc.cool/allfile.php').then(res => {
        this.imageUrlList = res.data
      })
    }
  }
}
</script>

<style scoped>
/* 移动端 */
@media screen and (max-width: 639px) {
  .container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    -ms-flex-direction: column;
    flex-direction: column;
    justify-content: space-between;
  }
  .el-image {
    width: 45% !important;
  }
  .el-image {
    width: 45%;
    margin: 10px 5px 10px 0px;
    height: 200px;
  }

  .detail {
    font-size: 16px;
    min-height: 100px;
    padding-top: 10px;
  }
}

/*适应pad端*/
@media screen and (min-width: 640px) and (max-width: 1024px) {
  .detail {
    font-size: 1.4rem;
    min-height: 80px;
    padding: 30px
  }
  .el-image {
    width: 100%;
    min-height: 320px;
   margin-bottom: 10px;
  }
}

/* PC端 */
@media screen and (min-width: 1025px) {
  .container {
    display: flex;
    min-height: 500px;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    text-align: center;
  }
  .detail {
    display: flex;
    justify-content: center;
    align-content: center;
    text-align: center;
    line-height: 100px;
    min-height: 100px;
  }
  .el-image {
    width: 300px;
    height: 300px;
    margin: 0px 20px 15px 20px;
  }
}


.image {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>
