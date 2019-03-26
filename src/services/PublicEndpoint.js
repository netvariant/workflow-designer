import axios from 'axios'
import store from '@/store'
import NProgress from 'nprogress'

export default () => {
  // create axios instance
  let instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_PATH,
    headers: {
      'sessionToken': `${store.state.sessionToken}`
    }
  })

  // add interceptors
  instance.interceptors.request.use(function (config) {
    NProgress.start()
    return config
  })
  instance.interceptors.response.use(function (response) {
    NProgress.done()
    return response
  })

  // return instance
  return instance
}
