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
    <el-table :data="tableData" style="width: auto">
      <el-table-column prop="name" label="课程名称" width="">
      </el-table-column>
      <el-table-column prop="phone" label="创建时间" width="">
      </el-table-column>
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

  }
}
</script>
