<template>
  <div>
    <el-card>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="标题名称" prop="title">
          <el-input v-model="editForm.title" placeholder="文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章简介" prop="description">
         <el-input v-model="editForm.description" placeholder="用简洁明了的一小段话,来介绍本文章的核心内容"></el-input> -->
          <el-input type="textarea" v-model="editForm.description" placeholder="用简洁明了的一小段话,来介绍本文章的核心内容"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="tag">
          <el-select v-model="editForm.tag" placeholder="请选择文章标签" filterable clearable allow-create>
            <el-option v-for="item in editForm.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容编辑" prop="container"> -->
          <!-- 富文本编辑器 -->
          <quill-editor v-model="editForm.container"></quill-editor>
          <div class="addBtns">
            <el-button type="success" class="addBtn" @click="cancel">取 消</el-button>
            <el-button type="primary" class="addBtn" @click="add">发 布</el-button>
          </div>
        </el-form-item>
      </el-form> 

      <div class="addBtns">
        <el-button type="success" class="addBtn" @click="cancel">返 回</el-button>
        <!-- <el-button type="primary" class="addBtn" @click="add">发 布</el-button> -->
      </div>
      
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 发帖表单对象
      editForm: {
        username: '',
        title: '',
        description: '',
        container: '',
        tag: '',
        options: [
          { value: 'php', label: 'php' },
          { value: 'vue', label: 'vue' },
          { value: 'java', label: 'java' },
          { value: '前端', label: '前端' },
          { value: '散文', label: '散文' },
          { value: '软件', label: '软件' },
          { value: 'python', label: 'python' },
          { value: '文章', label: '文章' },
          { value: '吐槽', label: '吐槽' },
          { value: '其他', label: '其他' }
        ]
      },
      editFormRules: {
        title: [
          { required: true, message: '请输内容', trigger: 'change' },
          { min: 3, max: 40, message: '标题长度在 3-40 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输内容', trigger: 'change' },
          { min: 5, max: 150, message: '介绍的内容在 5-150 个字符', trigger: 'blur' }
        ],
        container: [
          { required: true, message: '请输内容', trigger: 'change' },
          { min: 5, max: 20000, message: '文章内容长度在 5-20000 个字符', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '请选择分类', trigger: 'change' },
          { min: 2, max: 10, message: '标签长度在 2-10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 获取登录的用户昵称
    if (window.sessionStorage.getItem('username')) {
      this.editForm.username = window.sessionStorage.getItem('username')
    }
  },
  methods: {
    // 发送帖子
    add() {
      // console.log(this.editForm)
      this.$refs.editFormRef.validate(async valid => {
        console.log(this.editForm)
        if (!valid) {
          return
        }

        const { data: res } = await this.$http.post('http://api-vueblog.czc.cool/addBlog.php', { editForm: this.editForm })
        // const {data:res} = await this.$http.post('http://api-vueblog.czc.cool/addBlog.php', this.editForm)
        console.log(res)
        if (res !== 1) {
          return this.$message.error('发布失败！')
        }
        this.$message.success('发布成功！')
        this.$router.go(-1)
      })
    },
    cancel() {
      // this.$router.go(-1) //返回上一层
      this.$router.push('/Main');
      // this.editForm = {}
    }
  }
}
</script>
<style scoped>
.el-card {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px 90px 0px 90px;
}
.addBtn {
  margin-top: 15px;
}
.addBtns {
  display: flex;
  justify-content: flex-start;
}
</style>
