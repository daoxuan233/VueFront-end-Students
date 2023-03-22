<template>
  <div>
    <el-form :inline="true" ref="vForm" :model="searchFormData" label-position="right" class="demo-form-inline" label-width="80px">
      <el-form-item label="教师姓名">
        <el-input v-model="searchFormData.user" placeholder="教师姓名"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="searchFormData.phone" placeholder="电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSubmit">查询</el-button>
        <el-button type="primary" @click="searchResetFrom">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: auto">
      <el-table-column prop="name" label="姓名" width="">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="">
      </el-table-column>
      <el-table-column prop="avatar" label="头像" width="">
        <template slot-scope="scope">
          <span>{{scope.row.avatar}}</span>
        </template>
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

export default {
  name:"Teacher",
  components:{
  },
  data() {
    return {
      searchFormData: {
      },
      tableData:[{
        name:"sb",phone: "Phone",avatar: "Avatar",
      }],
      pageObj: {
        pageSize:10,
        total:0,
        currentPage:1
      }
    }
  },
  methods: {
    search(){
      let that = this
      this.$refs['vForm'].validate(valid => {
        if (!valid) return
        console.log(that.searchFormData)
        let params = Object.assign(that.searchFormData, {current: that.pageObj.currentPage,
          size: that.pageObj.pageSize})
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
    searchSubmit() {
      console.log("我是梅豪的大爹")
      this.search()
    },
    handleSzieChange(pageSize) {
      this.pageObj.currentPage = 1
      this.pageObj.pageSize = pageSize
      this.search()
    },
    searchResetFrom() {
      console.log("sklaihdsilahfilsaj")
    },
    handleCurrentChange(currentPage) {
      this.pageObj.currentPage = currentPage
      this.search()
    },
  }
}
</script>

<style>

</style>
