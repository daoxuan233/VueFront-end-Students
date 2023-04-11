<template>
  <div>
    <el-form ref="form" :model="form">
      <el-form-item label="请选择课程" prop="option">
        <el-select v-model="option" placeholder="请选择">
          <el-option
            v-for="item in studentList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="getYAxisData">查询</el-button>
    <el-button type="primary" @click="showCharts">绘制图表</el-button>
    <div id="container">
      <!--图表容器-->
      <div id="newCharts"></div>
    </div>
  </div>
</template>
<script>
import {Message} from "element-ui";
import axios from "axios";
// 导入echarts依赖
import echarts from 'echarts/lib/echarts';

export default {
  name: "StatisticsTeacher",
  data() {
    return {
      myChart: null,
      form: {
        options: ''
      },
      formatter: "分数：{value}",
      studentList: [],
      option: '',
      teacherList: [],
      scoreList: [],
      AVGList: []
    }
  },
  mounted() {
    this.getCourseList();
    this.$echarts = echarts;
  },
  methods: {
    // 根据课程查询教师，得到成绩
    // getScoreData() { // 改为 showCharts
    //   if (this.option === '') {
    //     Message({
    //       message: '请选择课程！',
    //       type: 'warning'
    //     });
    //     return Promise.reject(); // 返回一个失败的 Promise 对象，以便后续处理
    //   }
    //   // 发送 HTTP 请求到后端 API 接口
    //   return axios.get(`/api/score/scScore/getByCourseId?courseId=${this.option}`).then(response => {
    //     // 将返回的List中的teacherName取出放入teacherList
    //     this.teacherList = response.data.data.map((item) => ({
    //       value: item.teacherId,
    //       label: item.teacherName,
    //     }));
    //     // 将返回的List中的score取出放入scoreList
    //     this.scoreList = response.data.data.map((item) => ({
    //       value: item.id,
    //       score: item.score
    //     }));
    //     console.log("teacherList===>", this.teacherList)
    //   }).catch(err => {
    //     Message({
    //       message: '获取成绩数据失败！',
    //       type: 'error'
    //     });
    //     console.error(err);
    //     return Promise.reject(); // 返回一个失败的 Promise 对象，以便后续处理
    //   });
    // },
    // 根据课程查询教师，得到平均成绩
    //从外部传入参数，这里的参数是option // 改为 getYAxisData( option )
    getYAxisData() {
      console.log("this.option==>", this.option)
      if (this.option === undefined) {
        Message({
          message: '请选择课程！',
          type: 'warning'
        });
      }
      return axios.get('/api/score/scScore/getAvgScoreByCourseId?courseId=' + this.option).then(response => {
        // 将后端返回的Map中的数据取出放入AVGList
        this.AVGList = new Map(Object.entries(response.data.data));
        console.log("AVGList===>", this.AVGList)
      }).catch(err => {
        Message({
          message: '获取成绩数据失败！',
          type: 'error'
        });
        console.error(err);
        return Promise.reject(); // 返回一个失败的 Promise 对象，以便后续处理
      });
    },
// 将后端的[课程]name和id传入前端select下拉框
    getCourseList() { // 改为 selectList
      return axios.get('/api/score/scCourse/listAll').then(resp => {
        if (resp.data.code === '200') {
          // 将后端的name和id传入前端select下拉框
          this.studentList = resp.data.data.map((item) => ({
            value: item.id,
            label: item.name
          }));
        } else {
          throw new Error('获取课程列表失败！');
        }
      }).catch(err => { //这里是处理错误的
        Message({
          message: '获取课程列表失败！',
          type: 'error'
        });
        console.error(err);
        return Promise.reject(); // 返回一个失败的 Promise 对象，以便后续处理
      });
    },
// 根据教师所教课程的成绩，绘制图表
    /*showCharts() {
      //*Promise.all([this.getCourseList(), this.getYAxisData()]).then(() => { //Q:这里的意义是什么？ //A:这里的意义是等待两个异步请求都完成后再执行下面的代码

      });*!/
      const chartDom = document.getElementById('newCharts');
      // let myChart = echarts.init(document.getElementById('newCharts'))
      this.echarts.dispose(chartDom); // 清空已有的实例
      const option = {
        title: {
          // 选中的课程名
          text: this.studentList.find(item => item.value === this.option).label,
        },
        tooltip: {},
        legend: { // 图例 用于显示不同系列的标记和名称
          data: ['成绩'],
        },
        xAxis: {
          // 将AVGList对象的key取出放入一个新数组,如：11:78.5将11取出放入xAxisData
          data: this.AVGList.keys()
        },
        yAxis: {
          type : 'value',
        },
        series: [{
          name: '成绩',
          type: 'line', // 柱状图 bar 折线图 line 饼图 pie 玫瑰图 rose 雷达图 radar 漏斗图 funnel 矩形树图 treemap 热力图 heatmap 散点图 scatter 关系图 graph K线图 k 桑基图 sankey 主题河流图 themeRiver 箱型图 boxplot 平行坐标系 parallel 日历图 calendar 地图 map 树图 tree 矩形树图 treemap 旭日图 sunburst 环形图 funnel 仪表盘 gauge 水球图 liquidfill
          data: this.AVGList.values()
        }]
      };
      chartDom.setOption(option); // 使用刚指定的配置项和数据显示图表。
    }*/

    /*showCharts() {
      const chartDom = document.getElementById('newCharts');
      if (this.myChart) {
        // 如果实例存在，则清空并重新渲染
        this.myChart.clear();
      } else {
        // 如果实例不存在，则创建
        this.myChart = echarts.init(chartDom);
      }

      // 处理数据时进行错误处理，避免出现异常
      const xAxisData = this.AVGList ? Array.from(this.AVGList.keys()) : [];
      const yAxisData = this.AVGList ? Array.from(this.AVGList.values()) : [];
      const courseName = this.option ? this.studentList.find(item => item.value === this.option).label : '';

      const option = {
        title: {
          text: courseName
        },
        tooltip: {},
        legend: {
          data: ['成绩'],
        },
        xAxis: {
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '成绩',
          type: 'bar',
          color: [
            '#003153',
          ],
          data: yAxisData,
          label:{
            show: true,
            position: 'top', // 在柱子顶部显示 label 值
            formatter: '{c}' // 显示 label 值 {c} 表示当前柱子的值 {b} 表示当前柱子的类目
          }
        }]
      };
      this.myChart.setOption(option);
    }*/

    showCharts() {
      const chartDom = document.getElementById('newCharts');
      if (this.myChart) {
        // 如果实例存在，则清空并重新渲染
        this.myChart.clear();
      } else {
        // 如果实例不存在，则创建
        this.myChart = echarts.init(chartDom);
      }

      // 处理数据时进行错误处理，避免出现异常
      const xAxisData = this.AVGList ? Array.from(this.AVGList.keys()) : [];
      const yAxisData = this.AVGList ? Array.from(this.AVGList.values()) : [];
      const courseName = this.option ? this.studentList.find(item => item.value === this.option).label : '';

      const option = {
        title: {
          text: courseName
        },
        tooltip: {},
        legend: {
          data: ['成绩'],
        },
        xAxis: {
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '成绩',
          type: 'bar',
          data: yAxisData,
          label:{
            show: true,
            position: 'top',
            formatter: '{c}'
          },
          itemStyle: {
            normal: {
              // 非高亮状态下的样式
              color: function(params) {
                if(params.data < 60) {
                  return '#7f0020';
                }else {
                  return '#003153';
                }
              }
            },
            emphasis: {
              // 高亮状态下的样式
              color: '#7f0020', // 高亮标记的颜色
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
      this.myChart.setOption(option);
    }

  },
}
</script>
<style scoped>
#container {
  width: 100%;
  height: 100vh;
  padding-top: 100px;
}

#newCharts {
  margin: 0 auto 0 auto;
  width: 100%;
  height: 550px;
}
</style>
