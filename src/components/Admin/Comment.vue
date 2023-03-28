<template>
  <div>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域start -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getCommentList(0)" @change="getCommentList(0)">
            <el-button slot="append" icon="el-icon-search" @click="getCommentList(0)"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
    <!-- 表格区域 -->
    <el-table :data="commentList" stripe>
        <!-- 展开行 -->
        <!-- <el-table-column type="expand"></el-table-column> -->
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="评论者" width="100px"> </el-table-column>
      <el-table-column prop="topic_title" label="评论帖子" width="280px"> </el-table-column>
      <el-table-column prop="comment" label="评论内容"> </el-table-column>
      <!-- <el-table-column prop="container" label="文章内容" width="400"> </el-table-column> -->
      <el-table-column prop="createdate" label="发布时间" width="180px"> </el-table-column>
      <!-- <el-table-column prop="tag" label="文章类型" width="80px"> </el-table-column> -->
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditComment(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteComment(scope.row.id, scope.row.comment)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 下拉弹窗 -->
    <el-drawer title="修改评论" :visible.sync="showCommentDrawer" direction="ttb" size="33%" :before-close="handleClose" :wrapperClosable="false">
      <el-form :model="commentForm" :rules="commentFormRules" ref="commentFormRef" style="margin:10px">
        <el-form-item prop="comment">
          <el-input type="textarea" v-model.trim="commentForm.comment" placeholder="修改评论" :rows="3" @keyup.ctrl.enter.native="editComment"></el-input>
        </el-form-item>
      </el-form>
      <div class="addBtns">
        <el-tag type="success">按【ctrl+enter】键可以快速发送</el-tag>
        <el-button type="primary" class="addBtn" @click="editComment">修 改</el-button>
      </div>
    </el-drawer>
    <!-- 分页区 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 15, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      commentList: [],
      queryInfo: {
        query: '',
        pagenum: 0,
        pagesize: 10,
        username: '',
      },
     showCommentDrawer:false,
      commentForm: {
        id:0,
        comment:'',
        username: '',
      },
      commentFormRules: {
        comment: [
          { required: true, message: '请输内容', trigger: 'blur' },
          { min: 1, max: 300, message: '标题长度在 1-300 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.queryInfo.username = window.sessionStorage.getItem('username')
    this.getCommentList(0)
    // 获取登录的用户昵称
    this.commentForm.username = window.sessionStorage.getItem('username')
  },
  methods: {
    getCommentList(number) {
       // 当number为0时, 跳到第一页
      if (number === 0) this.queryInfo.pagenum = 0;
      this.$http.get('http://api-vueblog.czc.cool/getComment.php', { params: this.queryInfo }).then(res => {
        this.commentList = res.data
        this.total = res.data[0].total
      })
    },
    async deleteComment(commentId, comment) {
      const resConfirm = await this.$confirm(`此操作将永久删除【${comment}】的评论内容,是否继续?`, '提示', {
        confirmButtonText: '确定',
        canceButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如何确认删除,则返回字符串 confirm ,取消删除返回 cance
      if (resConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.get('http://api-vueblog.czc.cool/deleteEditComment.php', { params: { id: commentId, username: this.commentForm.username } })
      if (res.result.status != 1) {
        // '删除失败!'
        return this.$message.error(res.result.mgs)
      }
      this.$message.success('删除成功!')
      this.getCommentList(1)
    },
    // 修改评论
    editComment(){
       
        this.$refs.commentFormRef.validate(async valid => {
        if (!valid) {
          return
        }
         console.log(this.commentForm.comment)
        const { data: res } = await this.$http.post('http://api-vueblog.czc.cool/deleteEditComment.php', { commentForm: this.commentForm })
        if (res.result.status != 1) {
          return this.$message.error(res.result.mgs)
        }
        this.$message.success('修改成功！')
        this.showCommentDrawer = false
        // 清除表单验证
        this.$refs.commentFormRef.clearValidate()
        // 重置表单初始值
        this.$refs.commentFormRef.resetFields()
        this.getCommentList(1)
      })
    },
    // 点击修改按钮事件
    showEditComment(row) {
        this.commentForm.id = row.id
        this.commentForm.comment = row.comment
        this.showCommentDrawer = true
    },
     // 抽屉弹窗关闭调事件
    handleClose(done) {
      this.$refs.commentFormRef.clearValidate()
      this.$refs.commentFormRef.resetFields()
      done()
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.queryInfo.pagenum = 0
      this.getCommentList(1)
    },
    // 监听页码值对的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCommentList(1)
    }
  }
}
</script>
<style scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.addBtns {
    display: flex;
    justify-content: space-between;
    margin: 10px;
}
</style>
