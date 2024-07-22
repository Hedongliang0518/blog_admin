// reducers.js
import { getToken, removeToken } from "@/utils/auth";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 初始状态
  token: getToken(),
  userInfo: {},
  name: "",
  avatar: "",
  roles: [],
  permissions: [],
  routerList: []
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
    LogOut: (state) => {
      state.userInfo = {
        name: '',
        avatar: null
      }
      state.name = '';
      state.avatar = null;
      state.token = "";
      state.roles = [];
      state.permissions = [];
      state.routerList = [];
      removeToken()
    },
    // 获取用户信息
    SetInfo: (state, { payload }) => {
      const user = payload.data.user;
      const avatar =
              user.avatar === ""
                ? require("@/assets/images/profile.jpg")
                : user.avatar;
      if (payload.data.roles && payload.data.roles.length > 0) {
        // 验证返回的roles是否是一个非空数组
        state.roles = payload.data.roles;
        state.permissions = payload.data.permissions;
      } else {
        state.roles = ["ROLE_DEFAULT"];
      }
      state.name = user.nickName;
      state.avatar = avatar;
      state.userInfo = {
        name: user.nickName,
        avatar: avatar
      }
    },
    // 登录
    setRouter: (state, { payload }) => {
      state.routerList = payload;
    },
  },
});

export const { Login, LogOut, SetInfo, setRouter} = counterSlice.actions;

export default counterSlice.reducer;
