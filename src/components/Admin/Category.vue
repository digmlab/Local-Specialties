<template>
  <div>
    <!-- 卡片区域 -->
    <el-card v-if="this.isadmin==='1'">
      <!-- 搜索区域start -->
      <el-row :gutter="10">
        <el-col :span="8">
        </el-col>
        <el-col :span="4">
          <el-button  type="primary" @click="show">添加分类</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 表格区域 -->
    <el-table :data="categoryList" width="200px" stripe border>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="categoryName" label="分类名称" width="180px"> 
        <!-- <template slot-scope="scope">
          <span>{{ scope.row[0] }}</span>
        </template> -->
      </el-table-column>
      <!-- <el-table-column prop="title" label="文章标题"> </el-table-column>
      <el-table-column prop="description" label="文章简介" width="500px"> </el-table-column>
      <el-table-column prop="createdate" label="发布时间" width="160px"> </el-table-column>
      <el-table-column prop="tag" label="文章类型" width="100px"> </el-table-column>
      <el-table-column label="顶置状态" width="80px">
        <template slot-scope="scope">
          <el-tag type="success" effect="dark" size="small" v-show="scope.row.istop === 'yes'">已顶置</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="隐藏状态" width="80px">
        <template slot-scope="scope">
          <el-tag type="danger" effect="dark" size="small" v-show="scope.row.isHide === 'yes'">已隐藏</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column v-if="this.isadmin==='1'"  label="操作" width="130" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCategory(scope.row.id, scope.row.categoryName)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog弹窗区 -->
    <el-dialog :title="isShowAddBtn ? '发布分类' : '修改分类名称'" :visible.sync="editDialogVisible" width="25%" @close="editDialogColosed" :close-on-click-modal="false">
      <span>
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editFormRef">
          <el-form-item label="分类名称" prop="categoryName">
            <el-input v-model="editForm.categoryName"></el-input>
          </el-form-item>
          <!-- <el-form-item label="文章简介" prop="description">
            <el-input type="textarea" v-model="editForm.description" placeholder="用简洁明了的一小段话,来介绍本文章的核心内容"></el-input>
          </el-form-item>
          <el-form-item label="文章分类" prop="tag">
            <el-select v-model="editForm.tag" placeholder="请选择文章标签" filterable clearable allow-create>
              <el-option v-for="item in editForm.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="顶置帖子">
            <el-select v-model="editForm.isTop" placeholder="帖子顶置选择">
              <el-option key="null" label="null" value="null"></el-option>
              <el-option key="yes" label="yes" value="yes"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="隐藏帖子">
            <el-select v-model="editForm.isHide" placeholder="帖子隐藏选择">
              <el-option key="null" label="null" value="null"></el-option>
              <el-option key="yes" label="yes" value="yes"></el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="文章内容" prop="container"> -->
            <!-- 富文本编辑器 -->
            <!-- <quill-editor v-model="editForm.container" ref="myQuillEditor" :options="editorOption"></quill-editor>
          </el-form-item> -->
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isShowAddBtn" @click="add">确 定</el-button>
        <el-button type="primary" v-else @click="editBlog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页区 -->
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[7, 6, 8, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination> -->
    <!-- 
      文件上传 
      action 自己写的上传接口
      on-success 文件上传完的回调
      accept 上传文件格式
      multiple 是否支持多选
      before-upload 文件上传之前钩子
      on-error 文件上传失败钩子
      -->
    <el-upload style="display: none" :on-success="handleSuccess" accept=".jpg,.jpeg,.png,.gif,.mp4" :before-upload="beforeUpload" :on-error="handleError" multiple :action="uploadUrl">
      <el-button size="small" type="primary" class="upload-file">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>
// 引入代码高亮js
import hljs from 'highlight.js'
// 引入emoji
import 'quill-emoji/dist/quill-emoji.css'
// https://github.com/contentco/quill-emoji
import 'quill-emoji'
export default {
  data() {
    return {
      // 控制添加弹窗按钮的隐藏与展示
      isShowAddBtn: false,
      editDialogVisible: false,
      categoryList: [],
      total: 0,
      isadmin: 0,
      // process.env.NODE_ENV: 用于判断当前环境是生产模式(production)还是本地调试开发模式
      uploadUrl: process.env.NODE_ENV === 'production' ? 'http://api-vueblog.czc.cool/upload.php' : 'http://api-vueblog.czc.cool/upload.php',
      // 获取帖子参数对象
      queryInfo: {
        // 文章分类
        tag: '',
        // 搜索提交参数
        query: '',
        // 当前的页数（控制分页）
        pagenum: 0,
        // 每页显示多少条数据
        pagesize: 7,
        username: '',
      },
      //   修改表单
      editForm: {
        id:'',
        categoryName:'',
        username: '',
        // tag: '',
        // isTop: 'null',
        // isHide: 'null',
        // title: '',
        // description: '',
        // container: '',
        // blogId: 0,
        // 文章分类
        // options: [],
      },
      //   表单验证
      editFormRules: {
        categoryName: [
          { required: true, message: '请输内容', trigger: 'change' },
          { min: 1, max: 40, message: '标题长度在 1-40 个字符', trigger: 'blur' },
        ],
        // title: [
        //   { required: true, message: '请输内容', trigger: 'change' },
        //   { min: 3, max: 40, message: '标题长度在 3-40 个字符', trigger: 'blur' },
        // ],
        // description: [
        //   { required: true, message: '请输内容', trigger: 'change' },
        //   { min: 5, max: 150, message: '介绍的内容在 5-150 个字符', trigger: 'blur' },
        // ],
        // container: [
        //   { required: true, message: '请输内容', trigger: 'change' },
        //   { min: 5, max: 50000, message: '文章内容长度在 5-50000 个字符', trigger: 'blur' },
        // ],
        // tag: [
        //   { required: true, message: '请选择分类', trigger: 'change' },
        //   { min: 2, max: 10, message: '标签长度在 2-10 个字符', trigger: 'blur' },
        // ],
      },

      // 代码高亮
      editorOption: {
        theme: 'snow', // 编辑器主题配置,内置两种snow,bubble 默认为snow
        modules: {
          'emoji-toolbar': true,
          'emoji-textarea': true,
          'emoji-shortname': true,
          // 富文本编辑器顶部工具栏设置
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ['clean'],
              ['emoji'],
              ['link', 'image', 'video'],
            ],
            // 当点击quill中图片图标的时候将触发自定义按钮的点击事件
            handlers: {
              image: (value) => {
                if (value) {
                  // 调用el-upload图片上传
                  document.querySelector('.upload-file').click()
                } else {
                  this.quill.format('image', false)
                }
              },
              // 当点击quill中视频上传图标的时候将触发自定义按钮的点击事件
              video: (value) => {
                if (value) {
                  document.querySelector('.upload-file').click()
                } else {
                  this.quill.format('video', false)
                }
              },
            },
          },
          syntax: {
            highlight: (text) => {
              return hljs.highlightAuto(text).value // 这里就是代码高亮需要配置的地方
            },
          },
        },
      },
    }
  },
  created() {
    this.queryInfo.username = window.sessionStorage.getItem('username')
    this.CategoryList(0)
    // this.getTags()
    // 获取登录的用户昵称
    this.editForm.username = window.sessionStorage.getItem('username')
  },
  methods: {
    // 获取文章分类标签
    getTags() {
      this.$http.get('http://api-vueblog.czc.cool/tag.php').then((res) => {
        if (res.data != 0) {
          res.data.forEach((item) => {
            this.editForm.options.push({ value: item[0], label: item[0] })
          })
        }
      })
    },
    // el-upload上传文件成功触发事件
    handleSuccess(res) {
      const { status, type, url, mgs } = res.result || {}
      if (status === 1) {
        this.insertFile(type, url)
      } else {
        this.$message.error(mgs || '文件上传失败')
        this.loading.close()
      }
    },
    // 把上传成功文件的url插入到编辑器
    insertFile(type, url) {
      console.log(type, url)
      let quill = this.$refs.myQuillEditor.quill
      // 获取光标所在位置
      let lenght = quill.getSelection().index
      // 插入图片
      quill.insertEmbed(lenght, type, url)
      // 调整光标到最后
      quill.setSelection(lenght + 1)
      // 关闭loading
      this.loading.close()
    },
    // 文件上传前触发
    beforeUpload(file) {
      // 开启loading
      this.openFullScreenLoading()
      // 设置支持上传的格式
      const types = ['video/mp4', 'image/jpeg', 'image/jpg', 'image/gif', 'image/png']
      // 文件大小
      const fileSize = file.size / 1024 / 1024
      if (types.includes(file.type)) {
        if (file.type.indexOf('image') !== -1) {
          if (!(fileSize < 5)) {
            this.loading.close()
            this.$message.error('上传图片大小不能超过5MB!')
            return false
          }
        } else {
          if (!(fileSize < 50)) {
            this.loading.close()
            this.$message.error('上传视频大小不能超过50MB!')
            return false
          }
        }
      } else {
        this.loading.close()
        this.$message.error(`不支持该文件类型, 支持上传文件类型有: ${types.join(',')}格式`)
        return false
      }
    },
    // 文件上传失败时触发
    handleError() {
      this.loading.close()
      this.$message.error('上传失败')
    },
    // 文件上传loading
    openFullScreenLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '正在上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    },
    CategoryList(number) {
      // 当number为0时, 跳到第一页
      if (number === 0) this.queryInfo.pagenum = 0
      this.$http.get('http://api-vueblog.czc.cool/getCategory.php', { params: this.queryInfo }).then((res) => {
        const { data } = res || {}
        if (!Array.isArray(data)) return this.$message.error('获取数据失败');
        this.categoryList = data;
        this.total = data[0]?.total || 0;
        this.isadmin = data[0]?.isadmin || 0;
      });
    },

    // 删除操作
    async deleteCategory(categoryid, categoryName) {
      const resConfirm = await this.$confirm(`此操作将永久删除【${categoryName}】的文章,是否继续?`, '提示', {
        confirmButtonText: '确定',
        canceButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      // 如何确认删除,则返回字符串 confirm ,取消删除返回 cance
      if (resConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.get('http://api-vueblog.czc.cool/deleteEditCategory.php', { params: { id: categoryid, username: this.editForm.username } })
      if (res.result.status != 1) {
        // '删除失败!'
        return this.$message.error(res.result.mgs)
      }
      this.$message.success('删除成功!')
      this.CategoryList(1)
    },
    // 编辑文章内容
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editForm.id = row.id
      this.editForm.categoryName = row.categoryName
      alert(scope.row)
    },
    // 修改分类名称
    editBlog() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('http://api-vueblog.czc.cool/deleteEditCategory.php', { editForm: this.editForm })
        // const { data: res } = await this.$http.post('http://api-vueblog.czc.cool/deleteEditCategory.php', { params: { id: categoryid,categoryName: this.editForm.categoryName, username: this.editForm.username } })

        if (res.result.status != 1) {
          // '更新失败！'
          return this.$message.error(res.result.mgs)
        }
        this.$message.success('更新成功!')
        this.editDialogVisible = false
        this.CategoryList(1)
      })
    },
    // 点击添加按钮显示弹窗
    show() {
      this.isShowAddBtn = true
      this.editDialogVisible = true
    },
    // 新增添加帖子
    add() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(this.editForm)
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('http://api-vueblog.czc.cool/addCategory.php', { editForm: this.editForm })
        // const {data:res} = await this.$http.post('addBlog.php', this.editForm)
        console.log(res)
        if (res !== 1) {
          return this.$message.error('发布失败!')
        }
        this.$message.success('发布成功!')
        this.CategoryList(0)
        this.isShowAddBtn = false
        this.editDialogVisible = false
      })
    },
    // 编辑弹窗关闭触发事件
    editDialogColosed() {
      this.editDialogVisible = false
      this.isShowAddBtn = false
      // 重置表单
      this.$refs.editFormRef.resetFields()
      this.editForm.categoryName = ''
      // this.editForm.description = ''
      // this.editForm.tag = ''
      // this.editForm.container = ''
      // this.editForm.blogId = ''
      // this.editForm.isTop = 'null'
      // this.editForm.isHide = 'null'
    },
    // 监听 page-size 改变事件
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      // 当改变每页显示的数量时，页码重新回到第一页
      this.queryInfo.pagenum = 0
      this.CategoryList(1)
    },
    // 监听页码值对的改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.CategoryList(1)
    },
  },
}
</script>

<style scoped>
.el-table {
  margin-top: 15px;
  width: 380px;
}
.el-pagination {
  margin-top: 20px;
}
.el-card {
  margin-top: 15px;
  width: 380px;

}
</style>
