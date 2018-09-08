<template>
    <div class='right'>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 表格 -->
        <template>
            <el-table :data="rightListgrant" height="400" border style="width: 100%">
                <el-table-column prop="authName" label="权限" width="180">
                </el-table-column>
                <el-table-column prop="path" label="路径" width="180">
                </el-table-column>
                <el-table-column label="层级">
                    <!-- temeplate模板过滤数据 插值过滤-->
                    <template slot-scope="scope">
                        <span>{{scope.row.level | levelformData}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
import {getAllrightlistGrant} from '@/api/index.js'
export default {
  data () {
    return {
      rightListgrant: []
    }
  },
  mounted () {
    getAllrightlistGrant('list').then(res => {
      console.log(res)
      this.rightListgrant = res.data
    })
  },
  // 单组件过滤器 filters 默认管道传入参数
  filters: {
    levelformData (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
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
</style>
