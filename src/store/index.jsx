// store.js
import { configureStore } from "@reduxjs/toolkit";

// 引入你的root reducer
import rootReducer from "./reducerModule/rootReducer";
import userReducer from "./reducerModule/userReducer";

const store = configureStore({
  reducer: {
    rootReducer: rootReducer,
    userReducer: userReducer,
  },
});

export default store;
