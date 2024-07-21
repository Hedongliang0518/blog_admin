import { logout } from "@/api/login";
import store from '@/store';
import { LogOut } from "@/store/reducerModule/userReducer";
import { getToken, removeToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { message } from "antd";

import axios from "axios";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_BASE_API,
  // 超时
  timeout: 10000,
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["token"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?";
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        const part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof value !== "undefined") {
          if (typeof value === "object") {
            for (const key of Object.keys(value)) {
              if (value[key] !== null && typeof value[key] !== "undefined") {
                const params = propName + "[" + key + "]";
                const subPart = encodeURIComponent(params) + "=";
                url += subPart + encodeURIComponent(value[key]) + "&";
              }
            }
          } else {
            url += part + encodeURIComponent(value) + "&";
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  async (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    if (code === 401) {
      message.error(msg);
      const res = await logout(getToken())
      if(res.code === 200) {
        removeToken();
        store.dispatch(LogOut)
        location.href = "/login";
      }
      return {code: 401, msg: msg, data: null};
    } else if (code === 500) {
      message.error(msg);
      return {code: 500, msg: msg, data: null};
    } else if (code !== 200) {
      message.error(msg);
      return {code: code, msg: msg, data: null};
    } else {
      //把字符串total 转换成 数字 total
      if (res.data.data && res.data.data.total) {
        res.data.data.total = parseInt(res.data.data.total);
      }
      return {code: 200, msg: msg, data: res.data.data};
    }
  },
  (error) => {
    console.log("err" + error);
    let { message: msg } = error;
    if (msg === "Network Error") {
      msg = "后端接口连接异常";
    } else if (msg.includes("timeout")) {
      msg = "系统接口请求超时";
    } else if (msg.includes("Request failed with status code")) {
      msg = "系统接口" + msg.substr(msg.length - 3) + "异常";
    }
    message.error(msg);
    return Promise.reject(error);
  },
);

export default service;
