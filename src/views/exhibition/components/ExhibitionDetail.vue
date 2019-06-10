<template>
  <div class="createPost-container">
    <el-form labelPosition="left" ref="postForm" :model="postForm" class="form-container" label-width="80px" :rules="rules">
      <sticky :z-index="10" class="sub-navbar draft">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Publish
        </el-button>
      </sticky>
      <div class="createPost-main-container">

            <div class="postInfo-container">

              <el-form-item label="活動類型">
                <el-select v-model="postForm.type" placeholder="活動類型">
                  <el-option label="公共藝術" value="public_art"></el-option>
                  <el-option label="視覺藝術" value="visual_art"></el-option>
                  <el-option label="表演藝術" value="show"></el-option>
                  <el-option label="電影藝術" value="film"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="封面圖片">
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">Upload image</el-button>
                <el-upload
                  ref="upload"
                  :action="uploadURL"
                  :auto-upload=false
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

              <el-row>
                <el-col :span="10">
                  <el-form-item label="標題" prop="title">
                    <el-input v-model="postForm.title"></el-input>
                  </el-form-item>
                  <el-form-item label="副標題">
                    <el-input v-model="postForm.subtitle"></el-input>
                  </el-form-item>
                  <el-form-item label="主辦">
                    <el-input v-model="postForm.host"></el-input>
                  </el-form-item>
                   <el-form-item label="展演者" prop="performer">
                    <el-input v-model="postForm.performer"></el-input>
                  </el-form-item>
                  <el-form-item label="地點">
                    <el-input v-model="postForm.location"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                  <el-form-item label="title">
                    <el-input v-model="postForm.en_title"></el-input>
                  </el-form-item>
                  <el-form-item label="subtitle">
                    <el-input v-model="postForm.en_subtitle"></el-input>
                  </el-form-item>
                  <el-form-item label="host">
                    <el-input v-model="postForm.en_subtitle"></el-input>
                  </el-form-item>
                  <el-form-item label="performer">
                    <el-input v-model="postForm.en_performer"></el-input>
                  </el-form-item>
                  <el-form-item label="location">
                    <el-input v-model="postForm.en_location"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>


              <el-form-item label="開始時間" prop="start_date">
                <el-col :span="6">
                  <el-date-picker type="date" placeholder="選擇日期" v-model="postForm.start_date" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2"></el-col>
                <el-col :span="6" :offset="1">
                  <el-time-picker placeholder="選擇時間" v-model="postForm.daily_start_time" style="width: 100%;"></el-time-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="結束時間">
                <el-col :span="6">
                  <el-date-picker type="date" placeholder="選擇日期" v-model="postForm.end_date" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2"></el-col>
                <el-col :span="6" :offset="1">
                  <el-time-picker placeholder="選擇時間" v-model="postForm.daily_end_time" style="width: 100%;"></el-time-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="售票資訊">
                <el-input v-model="postForm.ticket_info"></el-input>
              </el-form-item>
              <el-form-item label="報名連結">
                <el-input v-model="postForm.registration_link"></el-input>
              </el-form-item>
              <el-form-item label="描述" prop="description">
                <markdown-editor v-model="postForm.description" />
              </el-form-item>
              <el-form-item label="description">
                <markdown-editor v-model="postForm.en_description" />
              </el-form-item>
            </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import Sticky from '@/components/Sticky'
import { fetchExhibition } from '@/api/exhibition'
import { createExhibition } from '@/api/exhibition'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { isNullOrUndefined } from 'util';

const defaultForm = {
  id:null,
  type:null,
  title:null,
  en_title:null,
  subtitle:null,
  en_subtitle:null,
  host:null,
  en_host:null,
  performer:null,
  en_performer:null,
  location:null,
  en_location:null,
  start_date:null,
  end_date:null,
  daily_start_time:null,
  daily_end_time:null,
  ticket_info:null,
  registration_link:null,
  description:null,
  en_description:null,
  coverId:null,
}

export default {
  name: 'ExhibitionDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: { MarkdownEditor, Sticky },
  data() {
    return {
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
      rules:{
        title:[
          { required: true, message: '請輸入活動名稱', trigger: 'blur' },
        ],
        start_date:[
          { required: true, message: '請輸入開始日期', trigger: 'change'}
        ],
        performer:[
          { required: true, message: '請輸入展演者', trigger: 'blur' }
        ],
        description:[
          { required: true, message: '請輸入描述', trigger: 'blur' }
        ]

      }
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
    fetchData(id){
      fetchExhibition(id).then(response => {
        console.log(response)
        this.postForm = response
        console.log(process.env.VUE_APP_BASE_URL+"static/uploads/"+response.cover)
        this.fileList.push({url: process.env.VUE_APP_BASE_URL+"/static/uploads/"+response.cover })
        // just for test
        //this.postForm.title += `   Article Id:${this.postForm.id}`
        //this.postForm.content_short += `   Article Id:${this.postForm.id}`
        // set tagsview title
        //this.setTagsViewTitle()
        // set page title
        //this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })

    },
    submitUpload(){
      this.$refs.upload.submit()
    },
    submitForm(){
      this.$refs['postForm'].validate((valid) => {
        if (valid) {
          console.log(this.postForm)
          console.log(this.coverResponse)
          if(typeof(this.coverResponse.medias) != 'undefined')
            this.postForm["coverId"] = this.coverResponse.medias.id
          console.log(this.postForm)
          createExhibition(this.postForm,this.$store.state.user.token)
          .then(response => {
            this.$message('submit!')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    draftForm() {

    }
  }

}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }
}
</style>

