<template>
  <div>
    <el-form :inline="true" ref="vForm" :model="searchFormData" label-position="right" class="demo-form-inline"
             label-width="80px">
      <el-form-item label="学生姓名" prop="name">
        <el-input v-model="searchFormData.name" placeholder="学生姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input v-model="searchFormData.phone" placeholder="联系方式"></el-input>
      </el-form-item>
      <el-form-item label="所在班级" prop="className">
        <!--        <el-input v-model="searchFormData.className" placeholder="所在班级"></el-input>-->
        <!--        根據班級查詢學生-->
        <el-select v-model="classXueS" placeholder="请选择">
          <el-option
            v-for="item in studentList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSubmit">查询</el-button>
        <el-button type="primary" @click="searchResetFrom">重置</el-button>
      </el-form-item>
    </el-form>

    <div style="background-color:gray">
      <el-button type="primary" @click="openAddWindow">添加</el-button>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible"
               :close-on-click-modal="true"
               :destroy-on-close="true"
               width="30%">
      <div>
        <el-form :model="formDate" :rules="formRules" ref="formDate">
          <el-form-item label="id" :label-width="formLabelWidth" prop="id">
            <el-input v-model="formDate.id" placeholder="id" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="学生姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formDate.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="formDate.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所在班级" :label-width="formLabelWidth" prop="phone">
            <el-select v-model="classXueS" placeholder="请选择">
              <el-option
                v-for="item in studentList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--  头像    -->
          <el-form-item label="用户头像" :label-width="formLabelWidth">
            <Upload :uploadObject="uploadObject"/>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFormData">确 定</el-button>
      </span>
    </el-dialog>


    <el-table :data="tableData" style="width: auto">
      <el-table-column prop="name" label="姓名" width="">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="">
      </el-table-column>
      <el-table-column prop="avatar" label="头像" width="">
        <template slot-scope="scope">  <!--插槽-->
          <!--          <span>{{scope.row.avatar}}</span>-->
          <!--  http://localhost:8082/api/file/download/Snipaste_2023-03-28_14-14-40.png ==> http://localhost:8080/file/download/Snipaste_2023-03-28_14-14-40.png-->
          <el-avatar v-if="scope.row.avatar" :src="'/api/file/download/'+scope.row.avatar"></el-avatar>
          <el-avatar v-else src=""></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="className" label="所在班级" width="">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="$event => openEditWindow(scope.row.id)" type="text" size="small">编辑</el-button>
          <el-button @click="$event => delectById(scope.row.id)" type="text" size="small">删除</el-button>

          <!--scope.row.id,指代一行数据-->

        </template>
      </el-table-column>
    </el-table>
    <br/>
    <el-pagination @size-change="handleSzieChange" @current-change="handleCurrentChange"
                   :current-page="pageObj.currentPage" :page-sizes="[5,10,20,30,40]" :page-size="pageObj.pageSize"
                   layout="total, sizes, prev, pager, next" :total="pageObj.total">
    </el-pagination>
  </div>
</template>

<script>
import axios from "axios";
import Upload from "../../components/Upload.vue";
import {Message} from "element-ui";

export default {
  name: "Student",
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
      formDate: {},

      dialogTitle: null, // 弹窗标题
      dialogVisible: false, // 弹窗是否显示

      searchFormData: {},
      tableData: [{
        /*name:"sb",phone: "Phone",avatar: "Avatar",*/
      }],
      pageObj: {
        pageSize: 10, // 每页显示条数
        total: 0, // total 总条数
        currentPage: 1 // 当前页数
      },
      studentList: [],
      classXueS: '',
    }
  },
  computed: {

  },
  mounted() { // 页面加载时触发
    this.selectList();
    this.search();
  },
  methods: {
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
        axios.get('/api/score/scStudent/list', {
          params: params
        }).then((resp) => {
          console.log("-----------", resp.data)
          if (resp.data.code === '200') {
            console.log("我是梅豪的大爹asdasd", resp.data.data.records)
            that.tableData = resp.data.data.records //你可以在这里进行数据处理
            that.pageObj.total = resp.data.data.total //将后端数据的total赋值给pageObj.total
          }
        }).catch((err) => { //这里是处理错误的
          console.log(err)
        })
      })
      return false
    },
    /**
     * 清空数据
     */
    searchResetFromStu() {
      // 清空选中的班级和学生列表
      this.classXueS = '';
      this.studentList = [];
    },
    // 根據班級查詢學生
    searchSubmit() {
      // 获取选中的班级
      const selectedClass = this.classXueS;
      if (selectedClass === '') {
        Message({
          message: '请选择班级',
          type: 'warning'
        });
      } else {
        // 使用Axios发送HTTP请求到后端API接口
        axios.get(`/api/score/scStudent/getByClassId?classId=${selectedClass}`).then(response => {
          this.tableData = response.data.data;
          console.log("tableData====>", this.tableData)
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
      this.dialogVisible = true;
      this.$refs['formDate'].validate(valid => {
        if (!valid) return
        this.formDate.avatar = this.uploadObject.fileName; // 上传文件名
        this.formDate.className = this.classXueS;
        console.log("提交的数据", this.formDate)
        if (this.formDate.id || this.formDate.id === 0) {
          axios.put('/api/score/scStudent/update', this.formDate).then((resp) => {
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
          // 修改
        } else {
          axios.post('/api/score/scStudent/add',this.formDate).then((resp) => {
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
          that.studentList = resp.data.data.records.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      }).catch((err) => { //这里是处理错误的
        console.log("烦了，操", err)
      })
    },
    /**
     * 打开编辑窗口
     * @param id  编辑的id
     */
    openEditWindow(id) {
      let that = this
      this.dialogVisible = true
      that.dialogTitle = '编辑'
      axios.get(`/api/score/scStudent/get/${id}`).then((resp) => { // 请求的是后端的接口 /api/score/scTeacher/1 1是传入的id
        console.log("openEditWindows:", resp.data)
        if (resp.data.code === '200') {
          that.formDate = resp.data.data
          that.uploadObject.fileName = that.formDate.avatar
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

