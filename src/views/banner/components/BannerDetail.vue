<template>
  <div class="createPost-container">
    <el-card class="box-card" style="margin:20px 20px">
      <div slot="header" class="clearfix">
        <span>{{ $route.meta.title }}</span>
      </div>
      <el-form ref="postForm" :model="form" label-width="200px">
        <el-form-item label="Banner upload">
          <el-upload
            ref="upload"
            :action="uploadURL"
            :on-success="getCoverResponse"
            :headers="header"
            :limit=1
            list-type="picture-card"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">

            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="Related exhibition">
          <el-select
            v-model="searchStr"
            filterable
            remote
            reserve-keyword
            placeholder="Please enter a keyword"
            :remote-method="getBanner()"
            :loading="loading">
            <el-option
              v-for="item in exhibitions"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="success" @click="submitForm">Create</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { fetchList } from '@/api/exhibition'
import { createBanner } from '@/api/banner'
import { updateBanner } from '@/api/banner'
import { fetchBanner } from '@/api/banner'

const defaultForm = {
  id: null,
  mediaId: null,
  exhibitionId: null
}
export default {
  name: 'BannerDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {},
      loading: false,
      exhibitions: [],
      searchStr: '',
      exSearchStr: '',
      uploadURL: process.env.VUE_APP_BASE_URL+process.env.VUE_APP_BASE_API+'/medias',
      postForm: Object.assign({}, defaultForm),
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      header: {
        token: this.$store.state.user.token
      },
      coverResponse: {},
      fileList:[],
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    getBanner(searchStr) {
      if (searchStr != this.exSearchStr) {
        this.loading = true;
        fetchList({searchStr: searchStr})
        .then((res) => {
          this.loading = false;
          this.exhibitions = res
          this.exSearchStr = searchStr
        })
      }
    },
    getCoverResponse: function(response,file,fileList){
      this.coverResponse = response
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    submitForm(){
      this.$refs['postForm'].validate((valid) => {
        if(valid) {
          if(typeof(this.coverResponse.medias) != 'undefined')
              this.postForm["imageId"] = this.coverResponse.medias.id
            if(this.searchStr!='')
              this.postForm["exhibitionId"] = this.searchStr

          if(this.isEdit){
            this.postForm["exhibition"] = null
            this.postForm["image"] = null
            console.log(this.postForm)
            const id = this.$route.params && this.$route.params.id
            updateBanner(id, this.postForm, this.$store.state.user.token)
            .then(response => {
              this.$message('Edit')
            })
            .then(response => {
              this.$router.push({name: 'BannerList'})
            })
          }
          else{
            createBanner(this.postForm, this.$store.state.user.token)
            .then(response => {
              this.$message('submit!')
            })
            .then(response => {
              this.$router.push({name: 'BannerList'})
            })
          }


        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    fetchData(id){
      fetchBanner(id).then(response => {
        console.log(response)
        this.postForm = response
        console.log(process.env.VUE_APP_BASE_URL+"/static/uploads/"+response.image.file)
        this.fileList.push({url: process.env.VUE_APP_BASE_URL+"/static/uploads/"+response.image.file })
        this.searchStr = response.exhibition.id
        this.exSearchStr = this.searchStr
        this.exhibitions.push(response.exhibition)
      }).catch(err => {
        console.log(err)
      })
    },
  }
}
</script>
