import router from "@/router";
import { getToken } from "@/utils/auth";
import { useEffect } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";

const ToPage = () => {
  const navigateTo = useNavigate();
  useEffect(() => {
    navigateTo("/pag1");
  }, []);
  return <div></div>;
};

const ToLogin = () => {
  const navigateTo = useNavigate();
  useEffect(() => {
    navigateTo("/login");
  }, []);
  return <div></div>;
};

const BeforeRouterEnter = () => {
  const outlet = useRoutes(router);
  const location = useLocation();
  // 访问登录页，有token，跳转首页
  // 访问不是登录页，无token，跳转登录页
  const token = getToken() || "";
  if (location.pathname === "/login" && token) {
    return <ToPage />;
  }
  if (location.pathname !== "/login" && !token) {
    return <ToLogin />;
  }
  return outlet;
};
const App = () => {
  return (
    <div>

      {/* 路由展示 */}
      <BeforeRouterEnter />
    </div>
  );
};

export default App;
