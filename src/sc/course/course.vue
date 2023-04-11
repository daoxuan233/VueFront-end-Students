<template>
  <div>
    <el-form :inline="true" ref="vForm" :model="searchFormData" label-position="right" class="demo-form-inline" label-width="80px">
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="searchFormData.name" placeholder="课程名称"></el-input>
      </el-form-item>
      <!--      <el-form-item label="电话">
              <el-input v-model="searchFormData.phone" placeholder="电话"></el-input>
            </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="searchSubmit">查询</el-button>
        <el-button type="primary" @click="searchResetFrom">重置</el-button>
      </el-form-item>
    </el-form>

    <!--新增窗口-->
    <div style="background-color:gray">
      <el-button type="primary" @click="openAddWindow">添加</el-button>
    </div>
    <el-dialog :title="dialogCourseTitle" :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               :destroy-on-close="true"
               width="30%">
      <div>
        <el-form :model="formDate" :rules="formRules" ref="formDate">
          <el-form-item label="id" :label-width="formLabelWidth" prop="id">
            <el-input v-model="formDate.id" placeholder="id" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="课程名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="formDate.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFormData">确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="tableData" style="width: auto">
      <el-table-column prop="name" label="课程名称" width="">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="$event => openEditWindow(scope.row.id)" type="text" size="small">编辑</el-button>
          <el-button @click="$event => delectById(scope.row.id)" type="text" size="small">编辑</el-button>
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

export default{
  name:"course",
  components:{

  },
  data() {
    return {
      formLabelWidth: '120px',
      formDate: {},
      dialogCourseTitle: null, // 弹窗标题
      dialogVisible: false, // 弹窗是否显示
      searchFormData: {
      },
      tableData:[{
        /*name:"sb",phone: "Phone",avatar: "Avatar",*/
      }],
      pageObj: {
        pageSize:10,
        total:0,
        currentPage:1
      }
    }
  },
  mounted() { // 页面加载时触发
    this.search();
  },
  methods: {
    openAddWindow(){
      this.dialogVisible = true;
      this.dialogCourseTitle = "添加教师";
      this.formDate = {}
      this.uploadObject.fileName = null;
    },
    search(){
      let that = this
      this.$refs['vForm'].validate(valid => {
        if (!valid) return
        console.log(that.searchFormData)
        let params = Object.assign(that.searchFormData, {current: that.pageObj.currentPage,
          size: that.pageObj.pageSize})
        console.log("甩给后端的：",params)
        axios.get('/api/score/scClass/list', {
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
    /**
     * 新增  & 修改
     */
    saveFormData(){
      this.dialogVisible = true
      this.$refs['formDate'].validate(valid => {
        if (!valid) return
        console.log("提交的数据",this.formDate)
        if (this.formDate.id || this.formDate.id === 0){ // 修改
          axios.put('/api/score/scClass/update',this.formDate).then((resp) => {
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
          axios.post('/api/score/scClass/add', this.formDate).then((resp) => {
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
    /**
     * 删除 通过id
     * @param id
     */
    delectById(id){
      axios.delete('/api/score/scClass/delete/'+id).then((resp) => {
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
    /**
     * 打开编辑窗口 通过id 获取数据
     * @param id
     */
    openEditWindow(id){
      let that = this
      this.dialogVisible = true
      that.dialogCourseTitle = '编辑'
      axios.get(`/api/score/scClass/get/${id}`).then((resp) => { // 请求的是后端的接口 /api/score/scTeacher/1 1是传入的id
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
