<template>
  <!-- <div class="tips">网站图片资源管理</div> -->
  <div>
    <el-button-group>
      <el-button type="primary" size="mini" icon="el-icon-arrow-left" @click="handlePre" :disabled="start === 0">上一页</el-button>
      <el-button type="primary" size="mini" @click="handleNext" :disabled="(start + size) >= count">
        下一页
        <i class="el-icon-arrow-right el-icon--right"></i>
      </el-button>
    </el-button-group>
    <div class="container">
      <div class="father-element" v-for="(url, i) in imageUrlList" :key="i">
        <div class="demo-image__preview">
          <video v-if="(/^.+(\.mp4)$/).test(url)" :src="url"></video>
          <el-image v-else style="width: 150px; height: 150px" :src="url" :preview-src-list="imageUrlList"> </el-image>
        </div>
        <div class="delete-element">
          <el-button type="danger" size="mini" icon="el-icon-delete" title="删除" @click="handleDelete(url)"></el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      start: 0,
      size: 45,
      count: 0,
      imageUrlList: [],
    }
  },
  created() {
    this.getSourceImage()
  },
  methods: {
    handlePre () {
      if (this.start < 0) {
        this.start = 0;
        this.getSourceImage();
        return;
      }
      this.start -= this.size;
      this.getSourceImage();
    },
    handleNext () {
      if ((this.start + this.size) >= this.count) {
        this.$message.info('最后一页了');
      } 
      else {
        this.start += this.size;
        this.getSourceImage();
      }
    
    },
    async handleDelete(url) {
      //  js截取字符串最后一个 ‘ / ’后的内容
      const index = url.lastIndexOf("\/");
      const fileName = url.substring(index + 1, url.length);
      // 获取登录名
      const userName = window.sessionStorage.getItem('username');
      // 弹出提示
      const resConfirm = await this.$confirm('此操作将永久删除该条文件,是否继续?', '提示', {
        confirmButtonText: '确定',
        canceButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (resConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 发送请求: 执行删除请求
      this.$http.get('http://api-vueblog.czc.cool/deleteFile.php?fileName='+fileName+'&userName='+userName).then((res) => {
        const { data } = res;
        if (data.status === 1) {
          this.$message.success(data.msg || '删除成功')
          this.getSourceImage()
          return
        }
        this.$message.error(data.msg || '删除失败');
      })
    },
    getSourceImage() {
      this.$http.get('http://api-vueblog.czc.cool/getSourceImage.php', { params: { start: this.start, size: this.size } }).then((res) => {
        this.imageUrlList = res.data.url || [];
        this.count = res.data.count;
      })
    },
  },
}
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center; 
  align-content: center;
  text-align: center;
}
.el-button-group {
  padding-top: 30px;
}
.father-element {
  position: relative;
  width: 150px;
  height: 150px;
  margin-top: 15px;
  margin: 15px;
  border: 1px solid red;
  border-radius: 10px;
   overflow: hidden;
}
.demo-image__preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.delete-element {
  position: absolute;
  display: none;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}
.father-element:hover .delete-element {
  display: block;
}
</style>
