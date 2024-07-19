import { ConfigProvider } from "antd";
import "normalize.css/normalize.css"; // 重置默认样式
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./assets/global.less";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        // Seed Token，影响范围大
        colorPrimary: "#00b96b",
        borderRadius: 2,

        // 派生变量，影响范围小
        colorBgContainer: "#f6ffed",
      },
    }}
  >
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  </ConfigProvider>,
);
