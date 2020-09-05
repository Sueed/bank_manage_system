import axios from 'axios' //引入 axios
import baseUrl from '../api/baseUrl.js' //使用环境变量 + 模式的方式定义基础URL

// 创建 axios 实例
const service = axios.create({
  baseURL: baseUrl, // api 的 base_url
  timeout: 15000, // 请求超时时间
  withCredentials: true //允许携带cookie
})

service.interceptors.request.use(
  config => {
      return config;
  },
  error => {
      console.log(error);
      return Promise.reject();
  }
);

service.interceptors.response.use(
  response => {
      if (response.status === 200) {
          return response.data;
      } else {
          Promise.reject();
      }
  },
  error => {
      console.log(error);
      return Promise.reject();
  }
);

export default service;