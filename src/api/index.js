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
