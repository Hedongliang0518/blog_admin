// store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage';

// 创建持久化配置
const persistConfig = {
  key: 'root',
  storage,
};

// 引入你的root reducer
import rootReducer from "./reducerModule/rootReducer";
import userReducer from "./reducerModule/userReducer";

const Reducer = combineReducers({
  rootReducer: rootReducer,
  userReducer: userReducer,
});

// 应用持久化配置
const persistedReducer = persistReducer(persistConfig, Reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
