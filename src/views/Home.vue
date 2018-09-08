<template>
    <div class='home'>
        <el-container>
            <el-aside width="auto">
              <div class='logo'></div>
                <el-menu class="el-menu-admin" @open="handleOpen" @close="handleClose" background-color="#41b883" text-color="#fff" active-text-color="#384b5f" :unique-opened='true' :collapse='isCollapse' :router='true'>
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="user">
                                <i class="el-icon-menu"></i>
                                <span slot="title">用户列表</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="canse">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="right">
                                <i class="el-icon-menu"></i>
                                <span slot="title">权限列表</span>
                            </el-menu-item>
                            <el-menu-item index="role">
                                <i class="el-icon-menu"></i>
                                <span slot="title">角色列表</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="3-1">
                                <i class="el-icon-menu"></i>
                                <span slot="title">商品分类</span>
                            </el-menu-item>
                            <el-menu-item index="3-2">
                                <i class="el-icon-menu"></i>
                                <span slot="title">商品列表</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                   <span class='myicon myicon-menu toggle-btn' @click='isCollapse=!isCollapse'></span>
                   <span class='system-title'>电商后台管理系统</span>
                   <div class='welcome'>
                     <span>你好:</span>
                     <span>admin</span>
                     <el-button type="text" @click='loginout' style='color:red'>退出</el-button>
                   </div>
                </el-header>
                <el-main>
                  <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    loginout () {
      localStorage.removeItem('mytoken')
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style lang='scss' scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #41b883;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #41b883;
  }
  .logo {
    height: 60px;
    background: url(../assets/timg.jpg);
    background-size: cover;
    background-color: #41b883;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #41b883;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
