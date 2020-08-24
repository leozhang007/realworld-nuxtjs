import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io/'
})

export default ({ store }) => {
  request.interceptors.request.use(function (config) {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, function (error) {
    // 如果请求失败 (此时请求还没有发出去) 就会进入这里
    return Promise.reject(error)
  })
}