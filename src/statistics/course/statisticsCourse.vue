<template>
  <div class="teacher-statistics">

  </div>
</template>

<script>
import * as echarts from 'echarts';
import {mapGetters} from 'vuex';

export default {
  name: "statisticsCourse",
  data: function () {
    return {
      treeData: [], // 教师列表数据
      selectedTeacherId: '', // 当前选中的教师id
      tableData: [], // 表格数据
    };
  },
  computed: {
    ...mapGetters(['teachClasses']),
    defaultProps() {
      return {
        children: 'children',
        label: 'name',
      };
    },
  },
  mounted() {
    this.treeData = this.buildTreeData();
    this.drawChart();
  },
  methods: {
    // 构建教师列表树形数据
    buildTreeData() {
      let results = [];
      for (let teachClass of this.teachClasses) {
        let teachers = [];
        // 循环遍历班级中的所有学生，将每个学生的任课教师添加到teachers列表中
        // 注意：这里的teach_class_students是一个关联了teachClass和student的中间表
        for (let sc of teachClass.teach_class_students) {
          let teacher = sc.course.teacher;
          if (!teachers.find((t) => t.id === teacher.id)) {
            teachers.push({
              id: teacher.id,
              name: teacher.name,
            });
          }
        }
        // 构建班级节点和教师节点，并添加到结果列表中
        results.push({
          id: teachClass.id,
          name: teachClass.name,
          children: teachers,
        });
      }
      return results;
    },
    // 渲染图表
    drawChart() {
      // 使用 ECharts 渲染图表
      let myChart = echarts.init(this.$refs.chart);
      myChart.setOption({
        /* 图表配置 */
      });
    },
    // 处理左侧教师列表节点点击事件
    handleNodeClick(data, node) {
      // 保存当前选中的教师id
      this.selectedTeacherId = data.id;
      // 获取当前教师的成绩数据
      // 注意：这里的sc_scores是关联了score、sc、course、teacher和student的一个包含所有成绩信息的大表
      this.tableData = this.sc_scores.filter(
        (sc) => sc.course.teacher.id === this.selectedTeacherId
      );
    },
    // 根据表格中不同的成绩数据，设置不同的行样式
    rowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'row-color';
      }
      return '';
    },
    // 根据表格中不同的成绩数据，设置不同的单元格样式
    cellClassName({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 3) {
        if (row.score >= 90) {
          return 'cell-great';
        } else if (row.score >= 60) {
          return 'cell-good';
        } else {
          return 'cell-bad';
        }
      }
      return '';
    },
  },
};
</script>

<style scoped lang="scss">
.teacher-statistics {
  padding: 20px;

  .el-row {
    margin-right: -10px;
    margin-left: -10px;
  }

  .teacher-list {
    height: 500px;
    overflow: auto;

    .teacher-tree {
      margin-top: 20px;

      .el-tree-node__expand-icon {
        margin-right: 5px;
      }
    }
  }

  .chart-area {
    height: 500px;
    padding-left: 10px;
    padding-right: 10px;

    .chart-card {
      height: 400px;
      margin-bottom: 20px;
    }
  }

  /* 行样式 */
  .row-color {
    background-color: #f7faff;
  }

  /* 成绩单元格样式 */
  .cell-bad {
    background-color: #ffcccc;
    color: #ff0000;
  }

  .cell-good {
    background-color: #f1f8e9;
    color: #4caf50;
  }

  .cell-great {
    background-color: #e7ffcc;
    color: #cddc39;
  }
}
</style>
