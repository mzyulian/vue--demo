import axios from 'axios'
// 设置基本路径
var baseURL = 'http://localhost:8888/api/private/v1/'
// 添加axios 默认 的的基本路径
axios.defaults.baseURL = baseURL
// 添加axios拦截器,在每次请求的时候带上token令牌
axios.interceptors.request.use(function (config) {
  // 获取token
  let token = localStorage.getItem('mytoken')
  if (token) {
    // 设置请求头
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 处理请求
export const login = (params) => {
  // 将请求的axios函数 返回
  return axios.post('login', params).then((res) => {
    return res.data
  })
}
// 处理用户列表的请求
export const getuserList = (pa) => {
  // 将请求的axios函数返回
  return axios.get('users', {params: pa}).then((res) => {
    return res.data
  })
}
// 点击确认添加用户
export const adduserMsg = (pa) => {
  return axios.post('users', pa).then(res => {
    return res.data
  })
}
// 编辑用户信息
export const eaituserMsg = (pa) => {
  return axios.put(`users/${pa.id}`, pa).then(res => {
    return res.data
  })
}
// 点击删除用户
export const deleteuserMsg = (pa) => {
  return axios.delete(`users/${pa.id}`, pa).then(res => {
    return res.data
  })
}
// 改变用户状态
export const changUserstate = (pa) => {
  return axios.put(`users/${pa.id}/state/${pa.state}`, pa).then(res => {
    return res.data
  })
}
// 获取用户的所有权限
export const getALLusergrant = () => {
  return axios.get('roles').then(res => {
    return res.data
  })
}
// 点击确认改变权限
export const setuserGrant = (pa) => {
  return axios.put(`users/${pa.id}/role`, {rid: pa.id}).then(res => {
    return res.data
  })
}
