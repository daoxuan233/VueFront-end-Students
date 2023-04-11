<template>
  <div class="aside">
    <!--  左侧菜单栏   -->
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @select="handleSelect">
      <el-submenu index="1"  class="aside" >
        <template slot="title" class="aside" >
          <i class="el-icon-location"></i>
          <span slot="title" >权限管理</span>
        </template>
        <el-menu-item class="aside" index="/sysUser">用户管理</el-menu-item>
        <el-menu-item class="aside" index="/sysRole">角色管理</el-menu-item>
        <el-menu-item class="aside" index="/sysMenu">菜单管理</el-menu-item>
        <el-menu-item class="aside" index="/sysMenu">菜单管理</el-menu-item>
      </el-submenu>
      <el-submenu index="2" class="aside" >
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title" >基础管理</span>
        </template>
        <el-menu-item class="aside" index="/student">学生管理</el-menu-item>
        <el-menu-item class="aside" index="/teacher">教师管理</el-menu-item>
        <el-menu-item class="aside" index="/classes">班级管理</el-menu-item>
        <el-menu-item class="aside" index="/course">课程管理</el-menu-item>
        <el-menu-item class="aside" index="/score">成绩管理</el-menu-item>
      </el-submenu>

      <el-submenu index="3" class="aside"  >
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title" >统计管理</span>
        </template>
        <el-menu-item class="aside" index="/statisticsTeacher">按教师统计</el-menu-item>
        <el-menu-item class="aside" index="/statisticsClasses">按班级统计</el-menu-item>
        <el-menu-item class="aside" index="/statisticsCourse">按课程统计</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>

export default{
  name:'Aside',
  components:{

  },
  methods:{

    handleSelect(key,keyPath){
      console.log("菜单点击事件",key)
      if(key != this.$route.path){
        this.$router.push(key);
      }
    }
  }

}
</script>
<style>
  .aside{
    width: 200px;
    height: 100%;
    background-color: rgb(190,224,209);
    color: #21a675;
  }
</style>
