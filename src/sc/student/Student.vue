<template>
  <div>
    <el-form :inline="true" ref="vForm" :model="searchFormData" label-position="right" class="demo-form-inline" label-width="80px">
      <el-form-item label="学生姓名" prop="name">
        <el-input v-model="searchFormData.name" placeholder="学生姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="searchFormData.phone" placeholder="电话"></el-input>
      </el-form-item>
      <el-form-item label="课程名称" >
        <el-select v-model="selectList" placeholder="请选择" class="#selectListDome">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchSubmit">查询</el-button>
        <el-button type="primary" @click="searchResetFrom">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: auto">
      <el-table-column prop="name" label="课程名称" width="">
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" width=""></el-table-column>
      <el-table-column prop="className" label="所在班级" width=""></el-table-column>

      <!--      <el-table-column prop="avatar" label="头像" width="">
              <template slot-scope="scope">
                &lt;!&ndash;          <span>{{scope.row.avatar}}</span>&ndash;&gt;
                &lt;!&ndash;  http://localhost:8082/api/file/download/Snipaste_2023-03-28_14-14-40.png ==> http://localhost:8080/file/download/Snipaste_2023-03-28_14-14-40.png&ndash;&gt;
                <el-avatar v-if="scope.row.avatar" :src="'/api/file/download/'+scope.row.avatar" ></el-avatar>
                <el-avatar v-else src=""></el-avatar>
              </template>
            </el-table-column>-->
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
import {Message} from "element-ui";
export default{
  name: "Student",
  components:{

  },
  data() {
    return {
      formRules:{},
      formLabelWidth:'120px',
      formDate:{},
      options:[
        {

        }
      ],

      dialogTitle: null, // 弹窗标题
      dialogVisible: false, // 弹窗是否显示

      searchFormData: {
      },
      tableData:[{
        /*name:"sb",phone: "Phone",avatar: "Avatar",*/
      }],
      pageObj: {
        pageSize:10, // 每页显示条数
        total:0, // total 总条数
        currentPage:1 // 当前页数
      },
    }
  },
  computed:{
  // 将
  },
  mounted() { // 页面加载时触发
    this.selectList();
  },
  methods: {
    openAddWindow(){
      this.dialogVisible = true;
    },
    search(){
      let that = this
      this.$refs['vForm'].validate(valid => {
        if (!valid) return
        console.log(that.searchFormData)
        let params = Object.assign(that.searchFormData, {current: that.pageObj.currentPage,
          size: that.pageObj.pageSize})
        console.log("甩给后端：",params)
        axios.get('/api/score/scStudent/list', {
          params: params
        }).then((resp) => {
          console.log("-----------",resp.data)
          if (resp.data.code === '200') {
            console.log("我是梅豪的大爹asdasd",resp.data.data.records)
            console.log("selectList",that.selectList)
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
      this.$refs['formDate'].validate(valid => {
        if (!valid) return
        console.log("提交的数据",this.formDate)
        if (this.formDate.id || this.formDate.id === 0){
          axios.put('/api/score/scTeacher/update', this.formDate).then((resp) => {
            console.log("-----------",resp.data)
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
          axios.post('/api/score/scTeacher/add', this.formDate).then((resp) => {
            console.log("-----------",resp.data)
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
    // 将后端的name和id传入前端select下拉框
    selectList(){
      let that = this
      let params = Object.assign(that.searchFormData, {current: 1, // 将pageObj的currentPage赋值给后端的current
        size: 100})
      axios.get('/api/score/scClass/list', {
        params: params
      }).then((resp) => {
        console.log("-----------",resp.data)
        if (resp.data.code === '200') {
          // 将后端的name和id传入前端select下拉框
          that.options = resp.data.data.records.map((item) => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      }).catch((err) => { //这里是处理错误的
        console.log("烦了，操",err)
      })
    },

  }
}
</script>

<style>



</style>

