<template>
 <div class='login'>
    <div class='container'>
        <img src="../assets/2098592_yulianmz.png" alt="" class='avatar'>
        <!-- :model 表单对象，指的是当前表单和输入框元素的数据的双向绑定 -->
        <!-- rules就是表单的校验规则，是一个对象 -->
       <el-form  ref="loginform" :model="loginForm" :rules='rules'>
           <el-form-item prop='username'>
               <!-- prop就是要校验的表单元素 prop对应的值就是验证的规则-->
              <el-input v-model="loginForm.username" prefix-icon='myicon myicon-user'></el-input>
           </el-form-item>
           <el-form-item prop='password'>
              <el-input v-model="loginForm.password" prefix-icon="myicon myicon-key"></el-input>
           </el-form-item>
           <el-form-item>
               <!-- 点击的时候将ref 的字符串传入，在事件中通过$refs=‘’获取到dom元素，即表单 -->
             <el-button type="primary" class='login-btn' @click="submitForm('loginform')">登陆</el-button>
           </el-form-item>
        </el-form>
    </div>
    <!-- 粒子漂浮物 -->
        <vue-particles
            color="#fff"
            :particleOpacity="0.7"
            :particlesNumber="30"
            shapeType="star"
            :particleSize="5"
            linesColor="#fff"
            :linesWidth="2"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="3"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
        >
        </vue-particles>
 </div>
</template>
<script>
// 引入api请求模块 解构  设置   引入对应的方法
import {login} from '@/api/index.js'
export default {
  data () {
    return {
      // 表单和表单元素数据的双向绑定
      loginForm: {
        username: '',
        password: ''
      },
      // rules表单验证规则  prop 对应表单元素的验证
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交的时候对整个表单进行校验
    submitForm (formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
        //   console.log('可以发送请求')  调用login请求的方法，方法有个回调函数 .then
          login(this.loginForm).then((res) => {
            console.log(res)
            if (res.meta.status === 200) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
              // 设置本地永久存储记录token
              localStorage.setItem('mytoken', res.data.token)
              // 获取用户表数据
              // getuserList({query: '', pagenum: 1, pagesize: 10}).then((res) => {
              //   console.log(res)
              // })
              // 跳转home首页
              this.$router.push({name: 'home'})
            } else {
              this.$message.error(res.meta.msg)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
  .login {
  position: fixed;
  width: 100%;
  height: 100%;
   background-image: url('../assets/sky.jpg');
     background-position: -20% 10%;
    background-size: contain;
  background-color: #000;

  .container {
    position: absolute;
    border-radius: 5px;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    background: rgba(216,220,229,0.5);
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
