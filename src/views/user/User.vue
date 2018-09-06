<template>
  <div class='user'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="input5" class="input-with-select search-input" @keyup.native.enter='searchUser'>
        <el-button slot="append" icon="el-icon-search" @click='searchUser'></el-button>
      </el-input>
      <el-button type="success" plain @click='addUser'>添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%;margin-top:15px">
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change='userstate(scope.row)'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="管理">
        <!-- 将来我们点击这个按钮，不仅仅需要让用户看到按钮，而且还要能够获取这个按钮所在行的数据，那么template就能够实现这个愿望。它里面有一个属性slot-scope，这个属性的值scop.row就是我们需要的这一行所对应的数据 -->
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
    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[1, 2, 3, 4]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="adduserdialogFormVisible">
      <!-- 给表单添加检验规则rules 以及ref -->
      <el-form :model="adduserform" label-width="100px" ref='adduserform' :rules="rules">
        <el-form-item label="用户名称" prop='username'>
          <el-input v-model="adduserform.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop='password'>
          <el-input v-model="adduserform.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="adduserform.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="adduserform.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adduserdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduserEvent('adduserform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户信息" :visible.sync="eaitUserdialogFormVisible">
      <!-- form表单添加rules验证,添加ref  -->
      <el-form :model="editform" :rules='rules' ref='editform' label-width='100px'>
        <el-form-item label="用户名称" prop='username'>
          <el-input v-model="editform.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="editform.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editform.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eaitUserdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser('editform')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 用户角色分配管理对话框 -->
    <el-dialog title="授权管理" :visible.sync="usergrantdialogFormVisible">
      <el-form :model="grantform" label-width="100px" ref='grantform'>
        <el-form-item label="用户名:">
          <el-input v-model="grantform.username" auto-complete="off" style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户角色:">
          <el-select v-model="grantform.rid" placeholder="请选择">
            <el-option v-for='item in Usergrantlist' :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="usergrantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editusergrant">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入api请求文件
import {
  getuserList,
  adduserMsg,
  eaituserMsg,
  deleteuserMsg,
  changUserstate,
  getALLusergrant,
  setuserGrant
} from '@/api/index.js'
export default {
  data () {
    return {
      input5: '',
      value2: '',
      tableData: [],
      currentPage: 1,
      pagesize: 4,
      totalCount: 100,
      // 添加用户组件
      adduserdialogFormVisible: false,
      // 添加用户组件数据
      adduserform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'change,blur'
          }
        ],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      // 编辑用户信息
      editform: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      eaitUserdialogFormVisible: false,
      // 用户角色分配管理
      usergrantdialogFormVisible: false,
      grantform: {
        id: '',
        username: '',
        rid: ''
      },
      // 用户权限列表
      Usergrantlist: []
    }
  },
  mounted () {
    this.inint()
  },
  methods: {
    inint () {
      getuserList({ query: this.input5, pagenum: this.currentPage, pagesize: this.pagesize }).then(
        res => {
          console.log(res)
          this.tableData = res.data.users
          this.totalCount = res.data.total
        }
      )
    },
    // 获取表格数据 分页器
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.inint()
    },
    // 分页器
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.inint()
    },
    // 点击搜索以及键盘回车
    searchUser () {
      this.inint()
    },
    // 点击添加用户
    addUser () {
      // 对话框显示
      this.adduserdialogFormVisible = true
    },
    // 添加用户对话框确认添加
    adduserEvent (formname) {
      console.log(123)
      // 获取表单dom
      this.$refs[formname].validate(valid => {
        if (valid) {
          adduserMsg(this.adduserform).then(res => {
            console.log(res)
            if (res.meta.status === 201) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
              // 将对话框影藏
              this.adduserdialogFormVisible = false
              // 刷新数据
              this.inint()
            } else {
              this.$message.error(res.meta.msg)
            }
          })
        }
      })
    },
    // 点击编辑按钮弹出对话框
    edituserDialog (scope) {
      this.eaitUserdialogFormVisible = true
      // 将表格数据渲染到对话框
      this.editform.id = scope.id
      this.editform.username = scope.username
      this.editform.mobile = scope.mobile
      this.editform.email = scope.email
    },
    // 对话框点击确定
    edituser (formname) {
      // 获取表单dom
      this.$refs[formname].validate(valid => {
        if (valid) {
          // 发送请求
          eaituserMsg(this.editform).then(res => {
            // console.log(res)
            if (res.meta.status === 200) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
              // 影藏对话框
              this.eaitUserdialogFormVisible = false
              // 刷新
              this.inint()
            } else {
              this.$message.error(res.meta.msg)
            }
          })
        } else {
          this.$message.error('输入的数据不合法')
        }
      })
    },
    // 点击删除
    deleteUser (scope) {
      // 组件询问是否删除
      this.$confirm(
        `是否删除${scope.username}(id为${scope.id})这个用户?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 点击确认删除
          deleteuserMsg(scope).then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
              // 刷新
              this.inint()
            } else {
              this.$message({
                showClose: true,
                message: res.meta.msg,
                type: 'error'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 状态改变
    userstate (scope) {
      console.log(scope)
      // 发送请求
      changUserstate({ id: scope.id, state: scope.mg_state }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'success'
          })
          // 刷新页面
          this.inint()
        } else {
          this.$message({
            showClose: true,
            message: res.meta.msg,
            type: 'error'
          })
        }
      })
    },
    // 改变用户的授权
    changeuserGrant (row) {
      // 将表格数据转到对话框
      this.grantform.id = row.id
      this.grantform.username = row.username
      // 对话框显示
      this.usergrantdialogFormVisible = true
      // 获取用户权限
      getALLusergrant().then(res => {
        console.log(res)
        this.Usergrantlist = res.data
      })
    },
    // 点击确认改变权限
    editusergrant () {
      setuserGrant(this.grantform).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          // 设置成功，影藏对话框
          this.usergrantdialogFormVisible = false
        } else {
          this.$message({
            showClose: true,
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
.user {
  .search-input {
    width: 300px;
  }
}
</style>
