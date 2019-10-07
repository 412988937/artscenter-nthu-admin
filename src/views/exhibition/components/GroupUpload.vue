<template>
  <div class="group-upload">
    <el-upload
      :action="uploadURL"
      list-type="picture-card"
      :file-list="fileList"
      :headers="header"
      :on-success="getResponse"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      groupFileList: Array
    },
    data() {
      return {
        uploadURL: process.env.VUE_APP_BASE_URL+process.env.VUE_APP_BASE_API+'/medias',
        dialogImageUrl: '',
        dialogVisible: false,
        header: {
          token: this.$store.state.user.token
        },
        fileList: this.groupFileList
      };
    },
    methods: {
      getResponse(response, file, fileList) {
        this.$emit('update-fileList', fileList)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.$emit('update-fileList', fileList)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    },
  }
</script>
