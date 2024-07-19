// reducers.js
import { getInfo } from "@/api/login";
import { getToken } from "@/utils/auth";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 初始状态
  token: getToken(),
  name: "",
  avatar: "",
  roles: [],
  permissions: [],
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // 登录
    Login: (state, { payload }) => {
      state.token = payload.data.token;
    },
    // 登出
    LogOut: async (state) => {
      state.token = "";
      state.roles = [];
      state.permissions = [];
    },

    // 获取用户信息
    GetInfo(state) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const user = res.user;
            const avatar =
              user.avatar === ""
                ? require("@/assets/images/profile.jpg")
                : process.env.REACT_BASE_API + user.avatar;
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              state.roles = res.roles;
              state.permissions = res.permissions;
            } else {
              state.roles = ["ROLE_DEFAULT"];
            }
            state.name = user.userName;
            state.avatar = avatar;
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export const { Login, LogOut, GetInfo } = counterSlice.actions;

export default counterSlice.reducer;
