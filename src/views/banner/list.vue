<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%"
    :default-sort = "{prop: 'start_date', order: 'descending'}" type="index">
      <el-table-column prop="id" align="center" label="ID" width="80" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="start_date" width="120px" align="center" label="Media" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.media.file }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="start_date" width="120px" align="center" label="Exhibition" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.exhibition">{{ scope.row.exhibition.title }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="Media" align="center" label="Media">
        <template slot-scope="scope">
          <span><img height="100" :src="getMediaURL(scope.row.media.file)"></span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="scope">
          <router-link :to="'/banner/edit/'+scope.row.id">
            <el-button type="success" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/banner'
import { deleteBanner } from '@/api/banner'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'BannerList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        //page: 1,
        //limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        console.log(response)
        this.list = response
        this.total = response.length
        this.listLoading = false
      })
    },
    handleDelete(id){
      this.$confirm(`刪除id: ${id}`,  {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(()=> {
        deleteBanner(id,this.$store.state.user.token)
        .then((res)=> {
          for(var i=0;i<this.list.length;i++){
            if(id == this.list[i].id){
              this.list.splice(i,1)
              break
            }
          }
          this.$message('刪除成功')
        })
      })
      .catch(()=> {
        this.$message('取消動作')
      })
      /*

      */
    },
    getMediaURL(filename) {
      return process.env.VUE_APP_BASE_URL + "/static/uploads/" + filename
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
