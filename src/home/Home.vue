<template>
  <div id="main">
    <div>
      <Aside>

      </Aside>
    </div>
    <div class="body">
      <!--  主内容区域 -->
      <div class="head"> 梅豪你不好 </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Aside from './Aside.vue'

export default {
  name: "Home",
  components:{
    Aside
  }
}
</script>

<style scoped>
#main{
  width: 100%;
  display: flex;
  flex-direction: row;
}
.aside{
  height: 100%;
}
.body{
  background-color: rgb(129,216,208);
  height: 100%;
  width: 100%;
}
.head{
  line-height: 60px;
  color: #fff;
  padding:0px 5px;
}
.content{
  padding: 5px 5px;
}
</style>
