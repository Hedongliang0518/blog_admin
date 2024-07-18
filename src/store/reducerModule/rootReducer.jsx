// reducers.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 初始状态
  counter: 1,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // 定义reducer函数
    addCounter: (state, { payload }) => {
      state.counter += payload;
    },
  },
});

export const { addCounter } = counterSlice.actions;

export default counterSlice.reducer;
