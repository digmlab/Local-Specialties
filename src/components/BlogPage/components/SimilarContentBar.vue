<template>
  <div class="sidebar-block" v-if="similarContent.length > 0">
    <h4>相关文章</h4>
    <div class="entry-list" v-for="item in similarContent" :key="item[0]">
      <a target="_blank" :href="`?blog_id=${item[0]}`"> {{item[2]}} </a>
    </div>
  </div>
</template>
<script>
/* 侧边栏组件,显示【相关文章】 */
export default {
  props: {
    similarContent: {
        type: Array,
        required: true,
        default: [],
    },
    x: {

    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
}
</script>
<style scoped>
.sidebar-block {
    /* 
    box-shadow
        第一个参数控制x轴偏移量 可写负数
        第一个参数控制Y轴偏移量 可写负数
        第三个参数控制阴影大小
        第四个参数控制阴影颜色
    */
  /* box-shadow: 0px 0px 20px #b4b1b1; */
  margin-top: 25px;
  margin-bottom: 20px;
  width: 100%;
  padding: 17px;
  min-height: 100px;
  font-size: 14px;
}
.entry-list {
    padding-bottom: 18px;
    min-height: 35px;
}
.entry-list a {
  text-decoration: none;
  cursor: pointer;
  color: #1949c0;
}
.entry-list:last-child {
    margin-bottom: 20px; 
}
.entry-list a:hover {
  color: #1171ee;
}
</style>
