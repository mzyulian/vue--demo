<template>
  <div class='user'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">活动管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="input5" class="input-with-select search-input">
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-top:15px">
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="管理">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle plain></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" circle plain></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权管理" placement="top">
            <el-button type="warning" icon="el-icon-star-off" circle plain></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 引入api请求文件
import { getuserList } from '@/api/index.js'
export default {
  data () {
    return {
      input5: '',
      value2: '',
      tableData: []
    }
  },
  mounted () {
    getuserList({ query: '', pagenum: 1, pagesize: 10 }).then(res => {
      console.log(res)
      this.tableData = res.data.users
    })
  }
}
</script>

<style lang='scss' scoped>
.el-breadcrumb {
  background-color: #f5f5f5;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
  margin-bottom: 15px;
}
.user {
  .search-input {
    width: 300px;
  }
}
</style>
