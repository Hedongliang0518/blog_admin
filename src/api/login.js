import request from "@/utils/request";

// 登录方法
export const login = (data, code, uuid) => {
  const params = {
    ...data,
    code,
    uuid,
  };
  return request({
    url: "/user/login",
    headers: {
      isToken: false,
    },
    method: "post",
    data: params,
  });
};

// 注册方法
export const register = (data) => {
  return request({
    url: "/register",
    headers: {
      isToken: false,
    },
    method: "post",
    data: data,
  });
};

// 获取用户详细信息
export const getInfo = () => {
  return request({
    url: "/getInfo",
    method: "get",
  });
};

// 退出方法
export const logout = () => {
  return request({
    url: "/user/logout",
    method: "post",
  });
};

// 获取验证码
export const getCodeImg = () => {
  return request({
    url: "/captchaImage",
    headers: {
      isToken: false,
    },
    method: "get",
    timeout: 20000,
  });
};
