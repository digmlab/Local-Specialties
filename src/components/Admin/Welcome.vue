<template>
  <div class="my-echarts">
    <div ref="chart" class="eharts"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'welcome',
  data() {
    return {
      myChart: null,
      tag: [],
      count: [],
      total: 0,
    }
  },
  methods: {
    getChart() {
      this.myChart = echarts.init(this.$refs.chart);
      const option = {
        title: {
          text: `文章统计【${this.total}】篇`,
        },
        tooltip: {},
        legend: {
          data: ['总量'],
        },
        xAxis: {
          data: this.tag,
          axisLabel: {
            color: 'blue',
            interval: 0, //设置横坐标为斜
            rotate: -20, //⽂字倾斜⾓度
          },
        },
        yAxis: {
          axisLabel: {
            color: 'blue'
          },
        },
        series: [
          {
            name: '总量',
            type: 'bar',
            data: this.count,
            label: {
              // 柱体显示数子
              show: true,
              color: 'white'
            }
          },
        ],
      }
      option && this.myChart.setOption(option);
    },

    getStatisticsData() {
      this.$http.get('http://api-vueblog.czc.cool/echartStatistics.php').then((res) => {
        const { status, data, message } = res.data;
        if (status === 1) {
          data.forEach((item) => {
            this.count.push(item[1]);
            this.total += Number(item[1]);
            this.tag.push(item[0]);
          });
          // 画echarts
          this.getChart();
          // 监听窗体大小变化
          this._resizeHandler = window.addEventListener('resize', this.debounce(this.updateEchat, 300))
        }
        else {
          this.$message.error(message || "获取统计数据失败");
        }
      })
    },
    // 防抖
    debounce(fn, delay) {
      let timer = null
      return function () {
        // 这里为每次变化要执行旳函数  
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(fn, delay)
      }
    },
    updateEchat() {
      // 重新渲染Echarts
      this.myChart && this.myChart.resize();
    },

  },
  mounted() {
    this.getStatisticsData();
  },
  beforeDestroy() {
    if (this.myChart) {
      // 销毁
      this.myChart.dispose();
      this.myChart = null;
      // 移除监听事件
      window.removeEventListener('resize', this._resizeHandler);
    }
  }
}
</script>
<style scoped>
.my-echarts {
  width: 100%;
  height: 90%;
  margin-top: 30px;
}

.eharts {
  width: 100%;
  height: 100%;
}
</style>