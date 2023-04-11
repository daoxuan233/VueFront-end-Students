<template>
  <div>
    <div>
      <div ref="chartContainer" style="height: 400px"></div>
      <br/>
    </div>
    <div>
      <el-button type="primary" @click="renderChart2">绘制图表</el-button>
      <el-button type="primary" @click="renderChart">恢复</el-button>
      <div ref="chartContainer2" style="height: 400px"></div>
      <br/>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import axios from "axios";

export default {
  name: "statisticsClasses",
  data() {
    return {
      ClassChart: null,
      classList: [],
      selectedClass: '',
      studentData: [],
      backEndDate: [],
      StuScoreAVGCountList: [],
    }
  },
  mounted() {
    this.getClassList();
    this.$echarts = echarts;
    this.getClassData();
    this.getStuScoreAVG();
  },
  methods: {
    async getClassList() {
      try {
        const res = await axios.get('/api/score/scClass/getAllClassName');
        this.classList = res.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getClassData() {
      try {
        const res = await axios.get(`/api/score/scClass/countByClass`);
        this.backEndDate = res.data.data;
        this.renderChart();
      } catch (error) {
        console.error(error);
      }
    },
    async getStuScoreAVG(){
      try {
        const res = await axios.get(`/api/score/scScore/getAvgScoreByClass`);
        this.StuScoreAVGCountList = res.data.data;
        console.log("StuScoreAVGCountList===>", this.StuScoreAVGCountList)
        this.renderChart();
      } catch (error) {
        console.error(error);
      }
    },

    renderChart() {
      const xAxisDataRenderChart = this.backEndDate.map(item => item.class_name)
      const seriesDataRenderChart = this.backEndDate.map(item => item.count)
      if (!this.$refs.chartContainer) {
        return;
      }
      this.ClassChart = echarts.init(this.$refs.chartContainer);
      const option = {
        title: {
          text: '班级人数统计'
        },
        tooltip: {},
        legend: {
          data: ['班级']
        },
        xAxis: {
          type: 'category',
          data: xAxisDataRenderChart
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '班级',
          type: 'bar',
          data: seriesDataRenderChart,
          color: [
            '#003153',
          ],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
          }
        }]
      };
      this.ClassChart.setOption(option);
    },

    renderChart2() {
      const xAxisData = this.StuScoreAVGCountList.map(item => item.class_name)
      const seriesData = this.StuScoreAVGCountList.map(item => item.avg_score)
      if (!this.$refs.chartContainer) {
        return;
      }
      this.ClassChart = echarts.init(this.$refs.chartContainer);
      const option = {
        title: {
          text: '班级平均分统计'
        },
        tooltip: {},
        legend: {
          data: ['班级']
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '班级',
          type: 'bar',
          data: seriesData,
          color: [
            '#003153',
          ],
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
          },
          itemStyle: {
            normal: {
              // 非高亮状态下的样式
              color: function(params) {
                if(params.data < 50) {
                  return 'red';
                }else {
                  return '#003153';
                }
              }
            },
            emphasis: {
              // 高亮状态下的样式
              color: '#16a951', // 高亮标记的颜色
              label: {
                show: false // 高亮标记不显示文本
              }
            }
          },
          markPoint:{
            symbol: 'circle', // 标记点的形状为圆形 分别是什么形状
            symbolSize: 10, // 标记点的大小为10
            itemStyle:{
              color: '#7f0020' // 标记点的颜色为红色
            },
            data: [{
              type: 'min', // 标记点数据为最小值
              yAxis: 60 // 标记点所在的yAxis位置为60
            }]
          }
        }]
      };
      this.ClassChart.setOption(option);
    },
  },
}
</script>
<style scoped>
#chartContainer {
  margin: 0 auto 0 auto;
  width: 1000px;
  height: 600px;
}
</style>
