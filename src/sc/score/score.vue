<template>
  <div>
    <!--  这是banner  -->
    <el-form ref="vForm" :inline="true" :model="searchFormData" class="demo-form-inline" label-position="right"
             label-width="80px">
      <el-form-item label="学生姓名" prop="studentName">
        <el-input v-model="searchFormData.name" placeholder="学生姓名"></el-input>
      </el-form-item>
      <el-select v-model="course" placeholder="请选择课程">
        <el-option v-for="item in courses" :key="item.id" :label="item.name" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="className" placeholder="请选择班级">
        <el-option v-for="item in classes" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="teacher" placeholder="请选择任课教师">
        <el-option v-for="item in teachers" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-form-item>
        <el-button type="primary" @click="searchThree">查询</el-button>
        <el-button type="primary" @click="searchResetFrom">重置</el-button>
      </el-form-item>
    </el-form>
    <!--这是中间栏-->
    <div style="background-color:gray">
      <el-button type="primary" @click="openAddWindow">添加</el-button>
    </div>
    <el-dialog :close-on-click-modal="true" :destroy-on-close="true"
               :title="dialogTitle"
               :visible.sync="dialogVisible"
               width="30%">
      <!--这是新增的新弹窗-->
      <div>
        <el-form ref="formDate" :model="formDate" :rules="formRules">
          <el-form-item :label-width="formLabelWidth" label="id" prop="id">
            <el-input v-model="formDate.id" :disabled="true" autocomplete="off" placeholder="id"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="学生姓名" prop="teacherName">
            <el-select v-model="formDate.studentName" placeholder="请选择">
              <el-option
                v-for="item in studentList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="课程名称" prop="courseName">
            <el-select v-model="formDate.courseName" placeholder="请选择">
              <el-option
                v-for="item in courseList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="任课教师" prop="teacherName">
            <el-select v-model="formDate.teacherName" placeholder="请选择">
              <el-option
                v-for="item in teachers"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="所在班级" prop="className">
            <el-input v-model="formDate.className" :disabled="true" autocomplete="off" placeholder="id"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" label="当课成绩" prop="score">
            <el-input v-model="formDate.score" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFormData">确 定</el-button>
      </span>
    </el-dialog>

    <!--这是内容栏-->
    <el-table :data="tableData" style="width: auto">
      <el-table-column label="学生姓名" prop="studentName" width="">
      </el-table-column>
      <el-table-column label="所在班级" prop="className" width="">
      </el-table-column>
      <el-table-column label="课程名称" prop="courseName" width="">
      </el-table-column>
      <el-table-column label="当科成绩" prop="score" width="">
      </el-table-column>
      <el-table-column label="任课教师" prop="teacherName" width="">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="$event => openEditWindow(scope.row.id)">编辑</el-button>
          <el-button size="small" type="text" @click="$event => delectById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br/>
    <el-pagination :current-page="pageObj.currentPage" :page-size="pageObj.pageSize"
                   :page-sizes="[5,10,20,30,40]" :total="pageObj.total" layout="total, sizes, prev, pager, next"
                   @size-change="handleSzieChange" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import Upload from "../../components/Upload.vue";
import axios from "axios";

export default {
  name: "score",
  components: {
    Upload,
  },
  data() {
    return {
      uploadObject: {
        fileName: null
      },
      formRules: {},
      formLabelWidth: '120px',
      formDate: {
        studentName: '',
        courseName: '',
        teacherName: '',
        className: '',
        score: '',
      },
      course: '',
      className: '',
      teacher: '',
      dialogTitle: null, // 弹窗标题
      dialogVisible: false, // 弹窗是否显示
      searchFormData: {},
      tableData: [{}],
      pageObj: {
        pageSize: 10, // 每页显示条数
        total: 0, // total 总条数
        currentPage: 1 // 当前页数
      },
      studentList: [],
      value: '',
      courseList: [],
      teacherList: [],
      courses: [],
      classes: [],
      teachers: [],
      classXueS: '',
      classList: [],
    }
  },
  computed: {
    // 将
  },
  mounted() { // 页面加载时触发
    this.search();
    this.selectList(); // 查询所有班级信息
    this.CourseList(); // 查询所有课程信息
    this.TeacherList(); // 查询所有教师信息
    this.StuList(); //
  },
  watch: {
    'formDate.studentName'(newVal, oldVal) {
      if (newVal !== oldVal && newVal) {
        this.getClassName(newVal);
      }
    },
    /*formDate: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && newVal) {
          this.getClassName(newVal.studentName);
        }
        console.log("newVal", newVal);
      },
      deep: true
    }*/
  },
  methods: {
    getClassName(studentName) {
      axios.get('/api/score/scClass/class_studentName', { params: { studentId: studentName } })
        .then(({ data }) => {
          this.formDate.className = data.description;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    /**
     * 查询所有学生信息,动态查询
     */
    searchThree() {
      // 发送请求至后端接口
      axios.get('/api/score/scScore/search', {
        params: {
          courseName: this.course,
          className: this.className,
          teacherName: this.teacher,
        }
      }).then((resp) => {
        console.log("-----------", resp.data)
        if (resp.data.code === '200') {
          if (resp.data.data !== null && resp.data.data.records !== null) {
            console.log("返回的数据", resp.data.data)
            this.tableData = resp.data.data;
          } else {
            console.log("返回的数据为空")
          }
        } else {
          console.log("请求后端数据失败")
        }
      }).catch((error) => {
        console.log("请求后端接口出错", error)
      })
    },
    openAddWindow() {
      this.dialogVisible = true;
    },
    search() {
      let that = this
      this.$refs['vForm'].validate(valid => {
        if (!valid) return
        console.log(that.searchFormData)
        let params = Object.assign(that.searchFormData, {
          current: that.pageObj.currentPage,
          size: that.pageObj.pageSize
        })
        console.log("甩给后端：", params)
        axios.get('/api/score/scScore/list', {
          params: params
        }).then((resp) => {
          console.log("-----------", resp.data)
          if (resp.data.code === '200') {
            console.log("分页请求全部数据的接口", resp.data.data.records)
            that.tableData = resp.data.data.records //你可以在这里进行数据处理
            that.pageObj.total = resp.data.data.total //将后端数据的total赋值给pageObj.total
          }
        }).catch((err) => { //这里是处理错误的
          console.log(err)
        })
      })
      return false
    },
    searchResetFromStu() {
      // 清空选中的班级和学生列表
      this.value = '';
      this.studentList = [];
    },
    /**
     * 清空选中的班级和学生列表
     */
    searchResetFromCourse() {
      this.value = '';
      this.courses = [];
    },
    searchResetFromTeacher() {
      // 清空选中的班级和学生列表
      this.value = '';
      this.teacherList = [];
    },
    // 根據班級查詢學生
    searchSubmit() {
      // 获取选中的班级
      const selectedClass = this.value;
      if (selectedClass === '') {
        MessageClass({
          message: '请选择班级',
          type: 'warning'
        });
        return;
      } else {
        // 使用Axios发送HTTP请求到后端API接口
        axios.get(`/api/score/scStudent/getByClassId?classId=${selectedClass}`).then(response => {
          this.tableData = response.data.data;
        });
      }
    },
    // 每页显示条数改变时触发
    handleSzieChange(pageSize) {
      this.pageObj.currentPage = 1
      this.pageObj.pageSize = pageSize
      this.search()
    },
    // 重置表单
    searchResetFrom() {
      this.$refs['vForm'].resetFields()
      this.search()
    },
    // 当前页数改变时触发
    handleCurrentChange(currentPage) {
      this.pageObj.currentPage = currentPage
      this.search()
    },

    // 新增
    saveFormData() {
      this.$refs['formDate'].validate(valid => {
        if (!valid) return
        console.log("提交的数据", this.formDate)
        if (this.formDate.id || this.formDate.id === 0) {
          axios.put('/api/score/scScore/update?').then((resp) => {
            console.log("-----------", resp.data)
            if (resp.data.code === '200') {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.dialogVisible = false
              this.search()
            }
          }).catch((err) => { //这里是处理错误的
            console.log(err)
          })
        } else {

          axios.post(`/api/score/scScore/addScore?`+'studentId='+this.formDate.studentName+'&courseName='+this.formDate.courseName+'&teacherID='+this.formDate.teacherName+'&className='+this.formDate.className+'&score='+this.formDate.score).then((resp) => {
            console.log("-----------", resp.data)
            if (resp.data.code === '200') {
              this.$message({
                message: '新增成功',
                type: 'success'
              });
              this.dialogVisible = false
              this.search()
            }
          }).catch((err) => { //这里是处理错误的
            console.log(err)
          })
        }
      })
      this.dialogVisible = false
    },
    // 删除 传入id
    delectById(id) {
      axios.delete('/api/score/scStudent/delete/' + id).then((resp) => {
        console.log("delectById***", resp.data) // 打印后台返回的数据
        if (resp.data.code === '200') {
          this.$message({
            message: resp.data.description,/*'删除成功'*/
            type: 'success'
          });
          this.search()
        }
      }).catch((err) => { //这里是处理错误的
        console.log(err)
      })
    },
    // 将后端的name和id传入前端select下拉框
    CourseList() {
      let that = this
      let params = Object.assign(that.searchFormData, {
        current: 1, // 将pageObj的currentPage赋值给后端的current
        size: 100
      })
      axios.get('/api/score/scCourse/list', {
        params: params
      }).then((resp) => {
        console.log("-----------Course/list", resp.data)
        if (resp.data.code === '200') {
          that.courses = resp.data.data.records.map((item) => {
            return {
              value: item.name,
              label: item.name
            }
          })
          this.courseList = resp.data.data.records.map((item) => {
            return {
              value: item.name,
              label: item.name
            }
          })
        }
      }).catch((err) => { //这里是处理错误的
        console.log("烦 12312 ", err)
      })
    },
    // 将后端的name和id传入前端select下拉框
    selectList() {
      let that = this
      let params = Object.assign(that.searchFormData, {
        current: 1, // 将pageObj的currentPage赋值给后端的current
        size: 100
      })
      axios.get('/api/score/scClass/list', {
        params: params
      }).then((resp) => {
        console.log("-----------", resp.data)
        if (resp.data.code === '200') {
          // 将后端的name和id传入前端select下拉框
          that.classes = resp.data.data.records.map((item) => {
            return {
              value: item.name,
              label: item.name
            }
          })
          this.classList = resp.data.data.records.map((item) => {
            return {
              value: item.name,
              label: item.name
            }
          })
        }
      }).catch((err) => { //这里是处理错误的
        console.log("烦了，操", err)
      })
    },
    // 将后端的name和id传入前端select下拉框
    TeacherList() {
      let that = this
      let params = Object.assign(that.searchFormData, {
        current: 1, // 将pageObj的currentPage赋值给后端的current
        size: 100
      })
      axios.get('/api/score/scTeacher/list', {
        params: params
      }).then((resp) => {
        console.log("-----------", resp.data)
        if (resp.data.code === '200') {
          // 将后端的name和id传入前端select下拉框
          that.teachers = resp.data.data.records.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.teacherList = resp.data.data.records.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      }).catch((err) => { //这里是处理错误的
        console.log("烦 12312 ", err)
      })
    },
    // 将后端的name和id传入前端select下拉框
    StuList() {
      let that = this
      let params = Object.assign(that.searchFormData, {
        current: 1, // 将pageObj的currentPage赋值给后端的current
        size: 100
      })
      axios.get('/api/score/scStudent/list', {
        params: params
      }).then((resp) => {
        console.log("-----------", resp.data)
        if (resp.data.code === '200') {
          // 将后端的name和id传入前端select下拉框
          that.studentList = resp.data.data.records.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
          this.teacherList = resp.data.data.records.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      }).catch((err) => { //这里是处理错误的
        console.log("烦 12312 ", err)
      })
    },
    openEditWindow(id) {
      let that = this
      this.dialogVisible = true
      that.dialogTitle = '编辑'
      axios.get(`/api/score/scScore/get/${id}`).then((resp) => { // 请求的是后端的接口 /api/score/scTeacher/1 1是传入的id
        console.log("openEditWindows:", resp.data)
        if (resp.data.code === '200') {
          that.formDate = resp.data.data
        }
        this.search()
      }).catch((err) => { //这里是处理错误的
        console.log("--------------------", err)
      })
    },
  }
}
</script>

<style>


</style>
