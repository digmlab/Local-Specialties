<template>
  <div>
    <el-card>
      <div class="main-box" v-for="(itme, i) in blogList" :key="i">
        <div v-show="itme.isHide !== 'yes'" style="display: flex;width:100%">
          
          <div class="left" @click="goBlogPage(itme.id)" v-show="itme.id !==''">
            <div class="box-left">
              <img :src="itme.imgUrl" alt="" :style="{'visibility': image ? 'visible': 'hidden' }"/>
            </div>
            <div class="box-right">
              <div class="box-right-title">
                <h3>
                  {{ itme.title }}
                </h3>
                <el-badge value="顶置" class="istop" v-show="itme.istop==='yes'"></el-badge>
              </div>
              <div class="box-right-container">
                <h4 style="font-size:15px;color:green;">介绍</h4>
                <span v-html="itme.description"></span>
              </div>
              <div class="box-right-info">
                <div><i class="el-icon-user-solid"></i> {{ itme.author }}</div>
                <div>发布日期: <i class="el-icon-time"></i>{{ itme.createdate | timeDataFormat }}</div>
                <div v-if="itme.lastdate">最后修改: <i class="el-icon-time"></i>{{ itme.lastdate | timeDataFormat }}</div>
                <!-- 用来展示评论数量 -->
                <!-- <div><i class="el-icon-chat-dot-square"></i>5条</div> -->
                <!-- 展示查看数量  -->
                <div><i class="el-icon-view"></i> {{ itme.views }}</div> 
                <!-- 展示文章类型 -->
                <div class="type_tag" style="font-size:14px;color:green"><i class="el-icon-price-tag"></i>{{ itme.tag }}</div>
              </div>
            </div>
          </div>
          <div style="width:100%;min-height:300px;text-align:center;" v-show="itme.id === ''">
            <img src="../../assets/404.jpg" alt="404 not found" width="200" height="250"/>
          </div>
          <!-- <div class="right" v-html="itme.container">
          </div> -->
        </div>
      </div>
    </el-card>
    <!-- 分页区 -->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      blogList: [],
      total: 0,
      // 图片
      image: '',
      // 获取帖子参数对象
      queryInfo: {
        // 文章分类
        tag: '',
        // 搜索提交参数
        query: '',
        // 当前的页数（控制分页）
        pagenum: 0,
        // 每页显示多少条数据
        pagesize: 20
      }
    }
  },
  created() {
    const params = this.$route.params
    this.$set(this.queryInfo, 'query', params.keyWords || '')
    this.$set(this.queryInfo, 'tag', params.tag || '')
    this.getBlogs()
    this.getImage()
    this.isScroll()
  },
  filters: {
    // 格式化时间,保留年月日
    timeDataFormat(str) {
      // 将字符串转换为Date格式
      let mt = new Date(str);
      //获取年份
      let year = mt.getFullYear();
      //从0开始 获取月份 padStart(2,'0') 头部补全,列如 01,02...,11,12
      let month = (mt.getMonth() + 1).toString().padStart(2,'0');
      // 获取天数
      let day = mt.getDate().toString().padStart(2,'0');
      return `${year}-${month}-${day}`;
    }
  },
  methods: {
    // 获取博客内容
    async getBlogs() {
      console.log('Main', this.queryInfo.pagenum)
      const { data: res } = await this.$http.get('getBlogs.php', {
        params: this.queryInfo
      })
      if (res === 0) {
        return this.$message.error('获取数据失败')
      }
      this.blogList = res
      this.total = res[0]['total'] || 0
      if (this.queryInfo.tag !== '') {
        this.queryInfo.query = ''
      } else if (this.queryInfo.query !== '') {
        this.queryInfo.tag = ''
      }
    },
    // 监听 page-size 改变事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      // 当改变每页显示的数量时，页码重新回到第一页
      this.queryInfo.pagenum = 0
      this.getBlogs()
    },
    // 监听页码值对的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getBlogs()
    },
    // 页面跳转
    goBlogPage(id) {
     
      // this.$router.push('/BlogPage');
      this.$router.push({name:'BlogPage', query: { blog_id: id }})
      // 用于记录查看帖子次数
      this.$http.get('countViews.php',{ params: {blog_id: id} })
    },
    getImage() {
      // 获取远程图片
      this.$http.get('BingImages.php').then(res => {
        const {imgUrl, desc} = res?.data || {};
        this.image = imgUrl;
        this.desc = desc;
      }).catch(()=> {
        this.image = require('../../assets/bg.jpg');
      })
    },
    isScroll() {
      // 在搜索 和 选择分类时触发
      const isScroll =  window.sessionStorage.getItem('scroll')
      if (isScroll) {
        //在PC端,进入该页面时向下滚动当前可视窗体高度, 如果移动端,则不进行操作
        if (!/(Android|iPhone|iPad|iOS|webOS|BlackBerry)/i.test(navigator.userAgent)) {
          let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
          document.documentElement.scrollTop = windowHeight
          window.sessionStorage.removeItem('scroll')
        }
      }
    }
  }
}
</script>

<style scoped>
/*适应移动端*/
@media screen and (max-width: 639px) {
  .el-card__body {
    padding: 10px !important;
  }
  .el-card {
    display: flex;
    min-width: 100%;
    padding: 0px !important;
    margin: 0px !important;
    justify-content: center;
  }
  .main-box {
    display: flex;
    padding: 0;
    margin-top: 5%;
    width: 100%;
    max-height: 250px;
    border: 2px solid #eee;
    border-radius: 10px;
  }
  .main-box:hover {
    cursor: pointer;
    box-shadow: 0 0 7px 3px #998;
  }
  .left {
    width: 100%;
    display: flex;
  }

  .box-left {
    display: none;
    /* flex: 4; */
    height: 250px;
    width: 280px;
    justify-content: center;
    border-radius: 15px;
    overflow: hidden;
  }

  /* .box-left img:hover {
    cursor: pointer;
    transform: scale(1.2);
  } */

  .box-right {
    display: flex;
    justify-items: center;
    flex-direction: column;
    overflow: hidden;
    min-width: 100%;
  }
  .box-right-title {
    flex: 1;
    position: relative;
    padding: 10px;
    font-size: 16px;
  }
  .istop {
    position: absolute;
    top: 3px;
    right: 5px;
  }
  .box-right-container {
    flex: 8;
    overflow-y: auto;
    font-size: 15px;
    border-left: 8px solid green;
    padding-left: 10px;
    background-color: #eee;
  }
  .box-right-container::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
  .box-right-info {
    display: flex;
    flex: 1;
    padding: 5px;
    font-size: 13px;
    margin-top: 8px;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    width: 80%;
    display: flex;
    margin-top: 30px;
    font-size: 10px;
    justify-content: flex-start;
    transform: scale(0.7);
  }
  
}

/* 适应pad端*/
@media screen and (min-width: 640px) and (max-width: 1024px) {
  .el-card {
    display: flex;
    min-width: 90%;
    justify-content: center;
    
  }
  .main-box {
    display: flex;
    padding: 0;
    margin-top: 25px;
    width: 100%;
    max-height: 250px;
    border: 1px solid #eee;
    /* border-radius: 10px; */
  }
  .left {
    width: 100%;
    display: flex;
    margin: 0 auto;
  }
  .box-left {
    display: none;
  }
  .box-right {
    display: flex;
    /* padding: 5px; */
    justify-items: center;
    flex-direction: column;
    overflow: hidden;
    flex: 6;
    width: 100%;
  }
  .box-right-title {
    flex: 1;
    position: relative;
    font-size: 20px;
  }
  .istop {
    position: absolute;
    top: 3px;
    right: 5px;
  }
  .box-right-container {
    flex: 8;
    overflow-y: auto;
    font-size: 19px;
    border-left: 8px solid green;
    padding-left: 20px;
    background-color: #eee;
  }
  .box-right-container::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
  .box-right-info {
    display: flex;
    flex: 1;
    padding: 5px;
    font-size: 18px;
    margin-top: 8px;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination {
    display: flex;
    margin-top: 30px;
    transform: translateX(10%);
    justify-content: flex-start;
  }
  .type_tag {
    font-size: 17px !important;
  }
}

/* PC端 */
@media screen and (min-width: 1025px) {
  .el-card {
    display: flex;
    min-width: 90%;
    justify-content: center;
    margin: 25px 90px 0px 90px;
  }
  .main-box {
    display: flex;
    padding: 0;
    margin-top: 25px;
    width: 100%;
    max-height: 250px;
    border: 1px solid #eee;
    border-radius: 10px;
  }
  .main-box:hover {
    cursor: pointer;
    box-shadow: 0 0 7px 3px #998;
  }
  .left {
    width: 100%;
    display: flex;
    margin: 0 auto;
    flex: 6;
  }
  /* .right {
  display: flex;
  flex: 4;
  padding: 5px;
  overflow: hidden;
  background-color:#eee;
} */
  .box-left {
    display: flex;
    /* flex: 4; */
    height: 250px;
    width: 280px;
    justify-content: center;
    border-radius: 15px;
    overflow: hidden;
  }

  .box-left img {
    width: 250px;
    height: 240px;
    /* object-fit: scale-down; */
    transition: all 1s;
  }
  .box-left img:hover {
    cursor: pointer;
    transform: scale(1.2);
  }

  .box-right {
    display: flex;
    padding: 5px;
    justify-items: center;
    flex-direction: column;
    overflow: hidden;
    flex: 6;
    min-width: 80%;
  }
  .box-right-title {
    flex: 1;
    position: relative;
    padding: 10px;
    font-size: 16px;
  }
  .istop {
    position: absolute;
    top: 3px;
    right: 5px;
  }
  .box-right-container {
    flex: 8;
    overflow-y: auto;
    font-size: 14px;
    border-left: 8px solid green;
    padding-left: 20px;
    background-color: #eee;
  }
  .box-right-container::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
  .box-right-info {
    display: flex;
    flex: 1;
    padding: 5px;
    font-size: 13px;
    margin-top: 8px;
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    display: flex;
    margin-left: 90px;
    margin-top: 20px;
    justify-content: center;
  }
}

h3:hover {
  color: green;
}
</style>
