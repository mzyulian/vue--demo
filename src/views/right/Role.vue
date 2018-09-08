<template>
    <div class='role'>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加角色按钮 -->
        <el-button type="success" plain style="width:100%">添加角色</el-button>
        <!-- 表格 -->
        <div style='margin-top:15px'>
            <el-table :data="roleDataList" style="width: 100%" border v-loading="loading">
                <el-table-column type="expand">
                    <!-- template 模板渲染数据 -->
                    <template slot-scope="scope">
                        <!--Layout 布局设置栅格系统布局 4-20 4-20-->
                        <el-row v-for='first in scope.row.children' :key='first.id'>
                            <!-- 循环行 -->
                            <el-col :span="4">
                                <el-tag closable style='margin:4px' @close='deleterole(scope.row,first.id)'>
                                    {{first.authName}}
                                </el-tag>
                            </el-col>
                            <el-col :span="20">
                                <!-- 循环行 -->
                                <el-row v-for='second in first.children' :key='second.id'>
                                    <el-col :span='4'>
                                        <el-tag closable type="warning" style='margin:4px' @close='deleterole(scope.row,second.id)'>
                                            {{second.authName}}
                                        </el-tag>
                                    </el-col>
                                    <el-col :span='20'>
                                        <el-tag closable type="info" v-for='third in second.children' :key='third.id' style='margin:4px' @close='deleterole(scope.row,third.id)'>
                                            {{third.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 如果没有数据 -->
                        <el-row v-if='scope.row.children.length===0'>
                            <el-col>
                                没有权限，请前往添加
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column label="角色名称" prop="roleName">
                </el-table-column>
                <el-table-column label="描述" prop="roleDesc">
                </el-table-column>
                <el-table-column label="操作" prop="desc">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button type="primary" icon="el-icon-edit" circle plain @click='edituserDialog(scope.row)'></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button type="danger" icon="el-icon-delete" circle plain @click='deleteUser(scope.row)'></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="授权管理" placement="top">
                            <el-button type="warning" icon="el-icon-star-off" circle plain @click='changeuserGrant(scope.row)'></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 授权管理对话框 -->
        <el-dialog title="权限管理" :visible.sync="rightcontroldialogFormVisible" label-width="formLabelWidth" >
            <div style="height:300px;overflow:auto">
                <!-- tree 树状表 currentchecknode默认选中的数组，根据数据的id来,展开的节点向上会展开-->
            <el-tree :data="rightAllTteedata" show-checkbox node-key="id"  :default-checked-keys="currentchecknode" :props="defaultProps" ref='tree' :default-expand-all='true'>
            </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rightcontroldialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeuserRight">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getALLrolesList, deleteAppointGrant, getAllRightTreeGrant, setUserRightgrant } from '@/api/index.js'
export default {
  data () {
    return {
      roleDataList: [],
      loading: true,
      rightcontroldialogFormVisible: false,
      formLabelWidth: '120px',
      rightAllTteedata: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认展开的节点
      currentchecknode: [],
      roleId: ''
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    initList () {
      getALLrolesList().then(res => {
        console.log(res)
        setTimeout(() => {
          if (res.meta.status === 200) {
            this.roleDataList = res.data
            this.loading = false
          }
        }, 1000)
      })
    },
    // 删除指定权限 角色id 权限id
    deleterole (row, rightId) {
      deleteAppointGrant({ roleId: row.id, rightId: rightId }).then(res => {
        console.log(res)
        // 返回的数据是角色权限的数据，这个时候将数据重置一下，达到不刷新页面，按钮消失的效果
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
          row.children = res.data
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'error'
          })
        }
      })
    },
    // 授权管理按钮,点击显示对话框
    changeuserGrant (row) {
      // 存用户id
      this.roleId = row.id
      this.rightcontroldialogFormVisible = true
      // 发送请求权限数据tree模式
      getAllRightTreeGrant('tree').then(res => {
        console.log(res)
        this.rightAllTteedata = res.data
      })
      // 加载之前将默认选中的数组清空，不然下一次的点击会保留上次的
      this.currentchecknode.length = 0
      // 加载默认选中的项,tree组件的原因，当选中子项的时候，父级会被选中，因此要找到子项
      if (row.children.length > 0) {
        row.children.forEach(first => {
          // 继续判断
          if (first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children.length > 0) {
                second.children.forEach(third => {
                  // 找到子项的id
                  this.currentchecknode.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    // 对话框点击确认修改用户的权限
    changeuserRight () {
      // 获取到被选中的项 getCheckedNodes获取到点击的项的数组
      var checkArr = this.$refs.tree.getCheckedNodes()
      // 遍历数组 将两个id加入到一个数组
      var mapArr = checkArr.map(value => {
        return value.id + ',' + value.id
      })
      // ["105,105", "116,116", "117,117", "150,150"]
      // 将数组拆分 得到105,105,116,116,117,117,150,150,151
      var joArr = mapArr.join(',')
      // 将字符串切割成数组
      var strArr = joArr.split(',')
      // 去点重复的值   Array.from(new set(数组))
      var final = Array.from(new Set(strArr))
      // 将数组转为字符串
      var rids = final.join(',')
      // 发送请求设置权限
      setUserRightgrant({roleId: this.roleId, rids: rids}).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
          // 影藏对话框
          this.rightcontroldialogFormVisible = false
          // 刷新页面
          this.initList()
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'error'
          })
        }
      })
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
