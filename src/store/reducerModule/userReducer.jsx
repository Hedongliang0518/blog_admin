// reducers.js
import { getToken, removeToken } from "@/utils/auth";
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
    // 定义reducer函数
    logOut: (state) => {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            state.token = "";
            state.roles = [];
            state.permissions = [];
            removeToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export const { logOut } = counterSlice.actions;

export default counterSlice.reducer;
