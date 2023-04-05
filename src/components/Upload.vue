<template>
  <div>
    <el-upload class="avatar-uploader" :action="action" :on-success="handleAvatarSuccess" :show-file-list="false"
               :before-upload="beforeAvatarUpload">

      <img v-if="imageShow" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>


<script>
export default {
  props:{
    uploadObject:{
      type :Object,
    }
  },
  name: "Upload",
  data(){
    return{
      action: "/api/file/upload",//需要与后端服务器对应，上传地址
      download: "/api/file/download/", //需要与后端服务器对应
      imageUrlShow: false
    };
  },
  methods: {
    //文件上传成功时调用
    handleAvatarSuccess(res, file, fileList){
      this.uploadObject.fileName = res.description
      console.log("imageUrl==>",this.imageUrl)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 15;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 15MB!');
      }
      return isLt2M;
    },
  },
  computed: {
    imageUrl() {
      // alert("计算图片：")
      console.log("计算图片：",this.download + this.uploadObject.fileName)
      this.imageUrlShow=true;
      return this.download + this.uploadObject.fileName;
    },
  //   控制图片与icon的显示与隐藏
    imageShow(){
      return this.imageUrlShow
    }

  }
}
</script>

<style scoped>
   .avatar-uploader .el-upload {
     border: 1px dashed #d9d9d9;
     border-radius: 6px;
     cursor: pointer;
     position: relative;
     overflow: hidden;
   }

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 40px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/*虚线*/
   .el-icon-plus{

   }
</style>
