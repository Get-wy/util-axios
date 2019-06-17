// 'use strict'

import axios from 'axios'
import qs from 'qs'
import { store, cookie } from '../util'
//store 是一个自己封装 获取
axios.interceptors.request.use(config => {
  // loading
  //这里 后端需要携带的 token 之类的事情/
  if (store.get('apiToken')) {
    config.headers.Accept = 'application/json'
    config.headers.Authorization = store.get('apiToken').type + ' ' + store.get('apiToken').token
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    alert(res.msg)
  }
  if (res.data && (!res.data.success)) {
    alert(res.data.error_msg)
  }
  return res
}

export default {
  post (url, data) {
    return axios({
      method: 'post',
      baseURL: '这里写你的请求地址',
      url,
      data: qs.stringify(data),
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get (url, params) {
    return axios({
      method: 'get',
      baseURL: '这里写你的请求地址',
      url,
      params, // get 请求时带的参数
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}


// 在jquery中使用content-type=application/x-www-form-urlencoded 和在axios中添加

// {headers:{"Content-Type":"application/x-www-form-urlencoded"}}时，请求的数据不一样：

// jquery 提交后 formdata 是一个数组 而 axios 请求中是一个对象 而不是数组