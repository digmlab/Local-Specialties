<template>
  <div>
    <div class="main-box">
      <div class="main-container">
        <!-- 文章简述 -->
        <div class="description">
          <h4 style="font-size: 15px; color: #67cc86">介绍</h4>
          <span v-html="BlogContainerData[3]"></span>
        </div>
        <!-- 文章标题 -->
        <div class="blog-title">
          <h3 v-html="BlogContainerData[2]"></h3>
        </div>
        <!-- 文章主体内容 -->
        <div class="ql-snow">
          <div class="blog-container ql-editor" v-html="BlogContainerData[4]"></div>
          <!-- 文章底部【相关文章】 -->
          <SimilarContent :similarContent="similarContent"/>
        </div>
        <!-- 显示评论弹窗按钮 -->
        <div class="addBtns">
          <div></div>
          <el-button type="primary" @click="showCommentDrawer = true">评论</el-button>
        </div>
        <div v-for="(itme, i) in commentList" :key="i">
          <!-- 展示评论区 -->
          <div class="show-comment">
            <div class="header-ifo">
              <!-- 头像 -->
              <div class="header-img">
                <img src="../../assets/blog_log.png" alt="" />
              </div>
              <div class="header-top">
                <div>
                  <span>{{ itme[2] }}</span>
                  <el-tag type="primary" size="mini" v-if="itme[2] === BlogContainerData[1]">作者</el-tag>
                  &nbsp;
                  <el-tag type="info" size="mini" v-if="itme[7]">{{ itme[7] }}</el-tag>
                  &nbsp;
                  <el-tag type="info" size="mini" v-if="itme[8]">{{ itme[8] }}</el-tag>
                </div>
                <div class="header-footer">
                  <span style="font-size: 13px">{{ itme[4] }}</span>
                  <el-tag class="cursor" type="info" @click="commentReply(itme[0], itme[2])">回复</el-tag>
                </div>
              </div>
            </div>
            <div class="show-container" v-html="itme[3]"></div>
          </div>
          <!-- 二级评论  statr -->
          <div :style="{display:(childrenComment.length > 0 ? 'block': 'none')}">
            <div class="show-comment" style="margin-left: 55px" v-for="(children, i2) in childrenComment" :key="i2">
              <!-- 判断子评论的id与根评论的id是否一致，成立，则列出与该根id有关的所有评论 -->
              <div v-if="children[1] === itme[0]">
                <div class="header-ifo">
                  <div class="header-img">
                    <img src="../../assets/comment_second.png" alt="" />
                  </div>
                  <div class="header-top">
                    <div>
                      <span>{{ children[2] }}</span>
                      <el-tag type="primary" size="mini" v-if="children[2] === BlogContainerData[1]">作者</el-tag>
                      &nbsp;
                      <el-tag type="info" size="mini">{{ children[7] }}</el-tag>
                      &nbsp;
                      <el-tag type="info" size="mini">{{ children[8] }}</el-tag>
                    </div>
                    <div class="header-footer">
                      <span style="font-size: 13px">{{ children[4] }}</span>
                      <el-tag class="cursor" type="info" @click="commentReply(itme[0], children[2])">回复</el-tag>
                    </div>
                  </div>
                </div>
                <div class="show-container" v-html="children[3]"></div>
              </div>
            </div>
          </div>
          <!--二级评论 end  -->
        </div>
      </div>
    </div>
    <!-- 下拉弹窗 -->
    <el-drawer :title="showCommentDrawerTitle" :visible.sync="showCommentDrawer" direction="btt" size="33%" :before-close="handleClose" :wrapperClosable="false">
      <el-form :model="commentForm" :rules="commentFormRules" ref="commentFormRef" style="margin: 10px">
        <el-form-item prop="comment">
          <el-input
            type="textarea"
            v-model="commentForm.comment"
            :placeholder="objUsername == '' ? '留下你的精彩评论吧!' : objUsername"
            :rows="3"
            @keyup.ctrl.enter.native="objUsername == '' ? addComment() : addReplay()"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="addBtns">
        <el-tag type="success" class="ismobile">按【ctrl+enter】键可以快速发送</el-tag>
        <el-button type="primary" class="addBtn" @click="addComment" v-if="!isReplay">发 布</el-button>
        <el-button type="primary" class="addBtn" @click="addReplay" v-else>回 复</el-button>
      </div>
    </el-drawer>
    <!-- 图片放大预览 -->
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen
      modal
      :center="true"
      lock-scroll
      :close="handleClose">
      <div class="demo-image__preview" @click="dialogVisible = false">
        <el-image 
          :src="url" 
          :preview-src-list="srcList">
        </el-image>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SimilarContent from './components/SimilarContentBar.vue'
export default {
  components: {
    SimilarContent,
  },
  data() {
    return {
      url: '',
      srcList: [],
      dialogVisible: false,
      showCommentDrawer: false,
      deviceIfon: '',

      showCommentDrawerTitle: '',

      BlogContainerData: [],
      // 相关文章
      similarContent: [], 

      commentForm: {
        // 帖子ID
        blog_id: 0,
        // 上级评论ID
        parent_id: 0,
        topic_title: '',
        comment: '',
        username: '',
        osName: '',
        osVersion: '',
      },
      commentList: [],
      // 回复评论对象名称 回复 xxx:
      objUsername: '',
      isReplay: false,
      childrenComment: [],

      commentFormRules: {
        comment: [
          { required: true, message: '请输内容', trigger: 'blur' },
          { min: 1, max: 300, message: '标题长度在 1-300 个字符', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    // 获取系统信息
    this.getSysIfo()
    this.commentForm.username = window.sessionStorage.getItem('username')

    this.getBlogContainer()
    this.getComment()

    if (!window.sessionStorage.getItem('username')) {
      this.showCommentDrawerTitle = '你未登录，将以【游客】的身份发布'
    } else {
      this.showCommentDrawerTitle = '嗨' + `【${this.commentForm.username}】你好！`
    }

    // 获取所有回复评论
    this.getCommentReplay()
  },
  methods: {
    // 图片预览弹出关闭
    handleClose () {
      this.dialogVisible = false;
    },
    // 由于mounted 不会承诺所有的子组件也都一起被挂载,
    // 这个时候dom元素还有没挂载完毕。如果希望等到整个视图都渲染完毕,
    // 需要在博客内容获取成功后之后在this.$nextTick调用这个函数
    getElementImg () {
      // 获取文章所有img标签
      // 给每个img元素添加点击事件来实现图片放大预览
      let imgList = document.querySelectorAll('.ql-editor')[0].getElementsByTagName('img');
      if (!!imgList) {
        for(let i = 0; i < imgList.length; i++) {
          this.srcList.push(imgList[i].src);
          imgList[i].onclick =  () => {
            this.url = imgList[i].src;
            this.dialogVisible = true;
            //自动点击进入图片预览 因为图片加载需要时间,所以使用延时，否则无法获取dom元素
            setTimeout(() => document.querySelector('.el-image>.el-image__inner.el-image__preview')?.click(), 50);
          }
        }
      }
    },
    // 抽屉弹窗关闭调事件
    handleClose(done) {
      this.$refs.commentFormRef.clearValidate()
      this.objUsername = ''
      this.isReplay = false
      this.$refs.commentFormRef.resetFields()
      done()
    },
    getSysIfo() {
      // 获取设备信息
      let agent = navigator.userAgent
      // 根据括号进行分割
      let left = agent.indexOf('(')
      let right = agent.indexOf(')')
      // 获取括号里面的内容
      let str = agent.substring(left + 1, right)
      // 以分号(;)分割字符串
      let Str = str.split(';')
      // 获取系统名称
      this.commentForm.osName = Str[0].replace('NT', '')
      // 获取系统版本
      this.commentForm.osVersion = Str[1]
    },
    // 根据blog_id获取博客内容
    getBlogContainer() {
      const blog_id = this.$route.query.blog_id;
      this.$http.get(`getBlogContainer.php?blog_id=${blog_id}`).then(res => {
        if (res.data.status === 1) {
          this.BlogContainerData = res.data.data;
          this.similarContent = res.data.similarContent;
          this.$nextTick(() => {
            this.getElementImg();
          })
          return;
        }
        this.$message.error(res.data.message || '获取数据失败')
      })
    },
    // 获取评论
    async getComment() {
      const blog_id = this.$route.query.blog_id;
      const { data: res } = await this.$http.get('http://api-vueblog.czc.cool/addComment.php', { params: { blog_id } })
      if (res.result.status != 1) {
        return
        // this.$message.error('获取评论失败！')
      }
      // this.$message.success('获取评论成功！')
      this.commentList = this.commentList.concat(res.result.commentList)
      this.showCommentDrawer = false
    },
    // 发布评论
    addComment() {
      this.$refs.commentFormRef.validate(async (valid) => {
        console.log(this.commentForm)
        if (!valid) {
          return
        }
        this.commentForm.topic_title = this.BlogContainerData[2];
        this.commentForm.blog_id = this.BlogContainerData[0];
        const { data: res } = await this.$http.post('http://api-vueblog.czc.cool/addComment.php', { commentForm: this.commentForm })
        if (res.result.status != 1) {
          return this.$message.error('评论失败！')
        }
        this.$message.success('评论成功！')
        this.commentList = this.commentList.concat(res.result.commentList)
        this.showCommentDrawer = false
        // 清除表单验证
        this.$refs.commentFormRef.clearValidate()
        // 重置表单初始值
        this.$refs.commentFormRef.resetFields()
        this.objUsername = ''
      })
    },
    // 点击 回复按钮 事件
    commentReply(parent_id, objUsername) {
      this.showCommentDrawer = true
      this.isReplay = true
      this.objUsername = '回复' + objUsername + ': '
      this.commentForm.parent_id = parent_id
      // this.commentForm.comment = this.objUsername + this.commentForm.comment
    },
    // 获取所有回复
    async getCommentReplay() {
      const blog_id = this.$route.query.blog_id;
      const { data: res } = await this.$http.get('http://api-vueblog.czc.cool/commentReplay.php', { params: { blog_id } })
      if (res.result.status != 1) {
        return
      }
      this.childrenComment = this.childrenComment.concat(res.result.childrenComment)
      this.showCommentDrawer = false
    },
    // 回复评论触发事件
    addReplay() {
      this.$refs.commentFormRef.validate(async (valid) => {
        console.log(this.commentForm)
        if (!valid) {
          return
        }
        this.commentForm.topic_title = this.BlogContainerData[2];
        this.commentForm.blog_id = this.BlogContainerData[0];
        this.commentForm.comment = this.objUsername + this.commentForm.comment
        const { data: res } = await this.$http.post('http://api-vueblog.czc.cool/commentReplay.php', { commentForm: this.commentForm })
        if (res.result.status != 1) {
          return this.$message.error('回复失败！')
        }
        this.$message.success('回复成功！')
        this.childrenComment = this.childrenComment.concat(res.result.childrenComment)
        console.log(res.result.childrenComment)
        this.showCommentDrawer = false
        // 重置表单验证
        this.$refs.commentFormRef.clearValidate()
        this.$refs.commentFormRef.resetFields()
        this.isReplay = false
        this.objUsername = ''
      })
    },
  },
}
</script>
<style scoped>
/* 移动端 */
@media screen and (max-width: 639px) {
  .main-box {
    display: flex;
    position: relative;
    width: 100%;
    margin-top: 25px;
    letter-spacing: 0.5px;
  }
  .ismobile {
    display: none;
  }
  .main-container {
    margin: 0 auto;
    min-height: 300px;
    width: 100%;
    /* width: 60%; */
  }
  .description {
    font-size: 14px;
    padding: 15px;
    border-left: 8px solid #67cc86;
    padding-left: 20px;
    min-height: 100px;
    width: calc(100% - 8px - 20px -15px);
    /* 换行 */
    word-wrap: break-word;
    background-color: #f3f4f4;
  }
  .description::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
  .blog-title {
    margin-top: 30px;
    min-height: 50px;
    line-height: 30px;
    padding-left: 10px;
    border-left: 6px solid #67cc86;
  }
  .blog-container {
    font-size: 14px;
    margin-top: 20px;
  }
  .addBtns {
    display: flex;
    padding: 10px;
    justify-content: space-between;
  }
  .show-comment {
    display: flex;
    /* 竖向排列 */
    flex-direction: column;
    /* justify-content: center; */
    justify-items: center;
    margin: 5px 5px 3px 5px;
  }
  .header-ifo {
    display: flex;
    height: 60px;
    flex-direction: row;
  }
  .header-img {
    width: 50px;
    height: 50px;
  }
  .header-img img {
    width: 50px;
    height: 50px;
  }
  .header-top {
    display: flex;
    width: 100%;
    height: 60px;
    flex-direction: column;
    margin: 0px 10px 5px 5px;
  }
  .header-footer {
    display: flex;
    margin-top: 5px;
    justify-content: space-between;
  }
  .show-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    margin: 5px 10px 0px 55px;
    min-height: 60px;
    padding: 5px;
    background-color: #f3f4f4;
  }
}

/*适应pad端*/
@media screen and (min-width: 640px) and (max-width: 1024px) {
  .main-box {
    display: flex;
    position: relative;
    width: 100%;
    margin-top: 25px;
    letter-spacing: 0.5px;
  }
  .ismobile {
    display: none;
  }
  .main-container {
    padding: 28px;
    min-height: 300px;
  }
  /* 文章介绍 */
  .description {
    font-size: 18px;
    padding: 15px;
    border-left: 8px solid #67cc86;
    padding-left: 20px;
    min-height: 100px;
    width: 100%;
    /* 换行 */
    word-wrap: break-word;
    background-color: #f3f4f4;
  }
  .description h4 {
    font-size: 20px !important;
  }
  .description::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
  /* 文章标题 */
  .blog-title {
    margin-top: 60px;
    min-height: 50px;
    line-height: 50px;
    padding-left: 10px;
    font-size: 23px;
    border-left: 6px solid #67cc86;
  }
  /* 文章内容展示区 */
  .blog-container {
    font-size: 20px;
    margin-top: 40px;
  }
  /* 添加评论按钮 */
  .addBtns {
    display: flex;
    margin: 10px;
    justify-content: space-between;
  }
  .addBtns button {
    font-size: 18px;
  }
  /* 评论区 */
  .show-comment {
    display: flex;
    /* 竖向排列 */
    font-size: 18px;
    flex-direction: column;
    /* justify-content: center; */
    justify-items: center;
    padding: 5px 5px 3px 5px;
  }
  .header-ifo {
    display: flex;
    height: 60px;
    flex-direction: row;
  }
  .header-img {
    width: 50px;
    height: 50px;
  }
  .header-img img {
    width: 50px;
    height: 50px;
  }
  .header-top {
    display: flex;
    width: 100%;
    height: 60px;
    flex-direction: column;
    margin: 0px 10px 5px 5px;
  }
  .header-footer {
    display: flex;
    margin-top: 5px;
    justify-content: space-between;
  }
  .header-top span:first {
    font-size: 1.2rem;
  }
  .header-top span:nth-child(2) {
    font-size: 1.1rem;
  }
  .header-top span:nth-child(3) {
    font-size: 1.1rem;
  }
  .header-top span:nth-child(4) {
    font-size: 1.1rem;
  }
  .header-footer span {
    font-size: 1.2rem !important;
  }
  .show-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    margin: 5px 10px 0px 55px;
    min-height: 60px;
    padding: 5px;
    background-color: #f3f4f4;
  }
}

/* PC端 */
@media screen and (min-width: 1025px) {
  .main-box {
    display: flex;
    position: relative;
    width: 100%;
    margin-top: 25px;
    letter-spacing: 0.5px;
  }

  .main-container {
    margin: 0 auto;
    min-height: 300px;
    width: 900px;
    /* width: 60%; */
  }
  .description {
    font-size: 14px;
    padding: 15px;
    border-left: 8px solid #67cc86;
    padding-left: 20px;
    min-height: 100px;
    width: 100%;
    /* 换行 */
    word-wrap: break-word;
    background-color: #f3f4f4;
  }
  /* .description::-webkit-scrollbar {
    height: 0;
    width: 0;
} */
  .blog-title {
    margin-top: 60px;
    min-height: 50px;
    line-height: 50px;
    padding-left: 10px;
    border-left: 6px solid #67cc86;
  }
  .blog-container {
    font-size: 14px;
    margin-top: 40px;
  }
  .addBtns {
    display: flex;
    margin: 10px;
    justify-content: space-between;
  }
  .show-comment {
    display: flex;
    /* 竖向排列 */
    flex-direction: column;
    /* justify-content: center; */
    justify-items: center;
    margin: 5px 5px 3px 5px;
  }
  .header-ifo {
    display: flex;
    height: 60px;
    flex-direction: row;
  }
  .header-img {
    width: 50px;
    height: 50px;
  }
  .header-img img {
    width: 50px;
    height: 50px;
  }
  .header-top {
    display: flex;
    width: 100%;
    height: 60px;
    flex-direction: column;
    margin: 0px 10px 5px 5px;
  }
  .header-footer {
    display: flex;
    margin-top: 5px;
    justify-content: space-between;
  }
  .show-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    margin: 5px 10px 0px 55px;
    min-height: 60px;
    padding: 5px;
    background-color: #f3f4f4;
  }
}

.demo-image__preview {
  display: flex;
  justify-content: center;
}
/* 鼠标经过回复按钮时 */
.cursor {
  cursor: pointer;
}

</style>
