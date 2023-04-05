<template>
  <div>
    <el-form :inline="true" ref="vForm" :model="searchFormData" label-position="right" class="demo-form-inline" label-width="80px">
      <el-form-item label="教师姓名" prop="name">
        <el-input v-model="searchFormData.name" placeholder="教师姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="searchFormData.phone" placeholder="电话"></el-input>
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
               :close-on-click-modal="false"
               :destroy-on-close="true"
               width="30%">
      <div>
        <el-form :model="formDate" :rules="formRules" ref="formDate">
          <el-form-item label="id" :label-width="formLabelWidth" prop="id">
            <el-input v-model="formDate.id" placeholder="id" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="教师姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formDate.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="formDate.phone" autocomplete="off" ></el-input>
          </el-form-item  >
          <!--  头像    -->
          <el-form-item label="用户头像" :label-width="formLabelWidth">
            <Upload :uploadObject = "uploadObject"/>
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
          <el-avatar v-if="scope.row.avatar" :src="'/api/file/download/'+scope.row.avatar" ></el-avatar>
          <el-avatar v-else src=""></el-avatar>
        </template>
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
export default {
  name:"Teacher",
  components:{
    Upload
  },
  data: function () {
    return {
      // 上传文件内容
      uploadObject: {
        fileName: null
      },
      formRules: { // 校验
        name: [
          {required: true, message: '请输入教师姓名', trigger: 'blur'}, // 必填
          {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'} // 长度
        ],
        phone: [ // 电话 正则表达式
          {required: true, message: '请输入电话', trigger: 'blur'}, // 必填
          {message: '请输入正确的电话号码', pattern: /^1[3456789]\d{9}$/, trigger: 'blur'}
        ],
      },
      formLabelWidth: '120px',
      formDate: {},

      dialogTitle: null, // 弹窗标题
      dialogVisible: false, // 弹窗是否显示

      searchFormData: {},
      tableData: [{
        /*name:"sb",phone: "Phone",avatar: "Avatar",*/
      }],
      pageObj: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    }
  },
  methods: {
    openAddWindow(){
      this.dialogVisible = true;
      this.dialogTitle = "添加教师";
      this.formDate = {}
      this.uploadObject.fileName = null;
    },
    search(){
      let that = this
      this.$refs['vForm'].validate(valid => {
        if (!valid) return
        this.formDate.avatar = this.uploadObject.fileName;
        console.log(that.searchFormData)
        let params = Object.assign(that.searchFormData, {current: that.pageObj.currentPage,
          size: that.pageObj.pageSize})
        console.log("甩给后端：",params)
        axios.get('/api/score/scTeacher/list', {
          params: params
        }).then((resp) => {
          console.log("-----------",resp.data)
          if (resp.data.code === '200') {
            that.tableData = resp.data.data.records //你可以在这里进行数据处理
            that.pageObj.total = resp.data.data.total //将后端数据的total赋值给pageObj.total
          }
        }).catch((err) => { //这里是处理错误的
          console.log(err)
        })
      })
      return false
    },

    // 查询
    searchSubmit() {
      console.log("我是梅豪的大爹")
      this.search()
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
    saveFormData(){
      this.dialogVisible = true
      this.$refs['formDate'].validate(valid => {
        if (!valid) return
        this.formDate.avatar = this.uploadObject.fileName; // 上传文件名
        console.log("提交的数据",this.formDate)
        if (this.formDate.id || this.formDate.id === 0){ // 修改
          axios.put('/api/score/scTeacher/update', this.formDate).then((resp) => {
            console.log("-----------",resp.data)
            if (resp.data.code === '200') {
              this.$message({
                message: resp.data.description,
                type: 'success'
              });
              this.dialogVisible = false
              this.search()
            }
          }).catch((err) => { //这里是处理错误的
            console.log(err)
          })
        } else { // 新增
          axios.post('/api/score/scTeacher/add', this.formDate).then((resp) => {
            console.log("-----------",resp.data)
            if (resp.data.code === '200') {
              this.$message({
                message: resp.data.description,
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
    delectById(id){
      axios.delete('/api/score/scTeacher/delete/'+id).then((resp) => {
        console.log("delectById***",resp.data) // 打印后台返回的数据
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
    // 编辑
    openEditWindow(id){
      let that = this
      this.dialogVisible = true
      that.dialogTitle = '编辑'
      axios.get(`/api/score/scTeacher/get/${id}`).then((resp) => { // 请求的是后端的接口 /api/score/scTeacher/1 1是传入的id
        console.log("openEditWindows:",resp.data)
        if (resp.data.code === '200') {
          that.formDate = resp.data.data
          that.uploadObject.fileName = that.formDate.avatar
        }
        this.search()
      }).catch((err) => { //这里是处理错误的
        console.log("--------------------",err)
      })
    },
  }
}
</script>

<style>

</style>
