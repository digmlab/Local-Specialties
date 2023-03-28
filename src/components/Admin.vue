<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/blog_log.png" alt="" style="width: 50px; height: 50px" />
        <span>地方特产后台管理</span>
      </div>
      <el-tooltip class="item" effect="dark" content="点击注销登录" placement="bottom-start">
        <!-- 退出按钮 -->
        <el-button class="logout-bt" type="info" @click="logout">{{ usernameTag }}</el-button>
      </el-tooltip>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#313743" text-color="#fff" active-text-color="#459afe" unique-opened :collapse-transition="false" :collapse="isCollapse" router :default-active="activePath">
          <el-menu-item :index="'/Welcome'" @click="saveNavState('/Welcome')">
            <i class="el-icon-s-opportunity"></i>
            <span slot="title">后台首页</span>
          </el-menu-item>

          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>文章管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/Container'" @click="saveNavState('/Container')">
              <template slot="title">
                <i class="el-icon-coin"></i>
                <span>文章列表</span>
              </template>
            </el-menu-item>
            <el-menu-item :index="'/Category'" @click="saveNavState('/Category')">
              <template slot="title">
                <i class="el-icon-coin"></i>
                <span>分类列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>评论管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/Comment'" @click="saveNavState('/Comment')">
              <template slot="title">
                <i class="el-icon-coin"></i>
                <span>评论列表</span>
              </template>
            </el-menu-item>
            <!-- <el-menu-item :index="'/CommentReplay'" @click="saveNavState('/CommentReplay')">
              <template slot="title">
                <i class="el-icon-coin"></i>
                <span>回复列表</span>
              </template>
            </el-menu-item> -->
          </el-submenu>
          
          <el-submenu v-if="this.isadmin === '1'" index="3">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>网站资源</span>
            </template>
            <el-menu-item :index="'/ResourceImges'" @click="saveNavState('/ResourceImges')">
              <template slot="title">
                <i class="el-icon-coin"></i>
                <span>图片管理</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-menu-item :index="'/SLPGroup'">
            <i class="el-icon-coin"></i>
            <span slot="title">小组管理</span>
          </el-menu-item>

          <el-menu-item :index="'/'">
            <i class="el-icon-setting"></i>
            <span slot="title">返回前台</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/Welcome' }">首页</el-breadcrumb-item>
          <!-- <el-breadcrumb-item>{{ '/' }}</el-breadcrumb-item> -->
          <el-breadcrumb-item :to="{ path: '/Container' }">{{ '文章列表' }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      usernameTag: '',
      // 右侧菜单数据
      menus: [],
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
      isadmin: 0,
    }
  },
  // watch: {
  //   $route: {
  //     handler(newVal) {
  //       console.log(newVal)
  //     },
  //     immediate: true,
  //     deep: true
  //   }
  // },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
    this.usernameTag = window.sessionStorage.getItem('username')
    this.username = window.sessionStorage.getItem('username')
    this.checkPower()
  },
  mounted() {
    if (!this.activePath) {
      this.activePath = '/Welcome';
    }
  },
  methods: {
    checkPower() {
      this.$http.get('http://api-vueblog.czc.cool/checkPower.php', { params:{username:this.username } }).then(res => {
        this.commentList = res.data
        this.isadmin = res.data[0].isadmin
      })
    },
    logout() {
      // 清空blogs_check_token
      //   window.sessionStorage.clear()
      window.sessionStorage.removeItem('blogs_check_token')
      window.sessionStorage.removeItem('activePath')
      window.sessionStorage.removeItem('username')
      // window.sessionStorage.removeItem('author')

      this.$http
      .get('http://api-vueblog.czc.cool//logOut.php')
        .then((res) => {
          console.log(res.data)
        })
        .catch((err) => console.log(err))

      this.$router.push('/login')
    },

    // 点击按钮 左侧 菜单 折叠 与 展开。
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style scoped>
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-aside {
  background-color: #313743;
}
.el-main {
  background-color: #e9edf1;
}
.el-container {
  height: 100%;
}
.el-main::-webkit-scrollbar {
  display: none;
}
.iconfont {
  margin: 10px;
}
.el-aside .el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #484f64;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.logout-bt {
  color: #fff;
  outline: none;
  border: none;
  text-shadow: 1px 1px 10px #fff;
  background: rgba(54, 61, 64, 0.5);
}
</style>
