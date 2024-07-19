import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Option 1", "/page1", <PieChartOutlined />),
  getItem("Option 2", "/page2", <DesktopOutlined />),
  getItem("User", "page3", <UserOutlined />, [
    getItem("Tom", "/page3/301"),
    getItem("Bill", "/page3/302"),
    getItem("Alex", "/page3/303"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const MenuComp = () => {
  const [openKeys, setOpenKeys] = useState([""]); // 展开菜单初始值

  const navigateTo = useNavigate();
  const currentRoute = useLocation();

  useEffect(() => {
    items.forEach((item) => {
      const isKey =
        item["children"] &&
        item["children"].length &&
        item["children"].find((i) => findKey(i));
      if (isKey) setOpenKeys([item.key]);
    });
  }, []);

  const findKey = (obj) => {
    return obj.key === currentRoute.pathname;
  };

  // 菜单点击事件
  const menuClick = (e) => {
    // 路由跳转
    navigateTo(e.key);
  };

  // 菜单展开回收处理
  const handleOpenChange = (keys) => {
    // const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    // if (latestOpenKey) {
    //   setOpenKeys(keys);
    // } else {
    //   setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    // }
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", keys);

    setOpenKeys([keys[keys.length - 1]]);
  };

  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={[currentRoute.pathname]}
      mode="inline"
      items={items}
      openKeys={openKeys}
      onClick={menuClick}
      onOpenChange={handleOpenChange}
    />
  );
};

export default MenuComp;
