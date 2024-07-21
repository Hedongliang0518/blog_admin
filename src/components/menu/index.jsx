import { getRouters } from '@/api/menu';
import { setRouter } from "@/store/reducerModule/userReducer";
import {
  PieChartOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const MenuComp = () => {
  const [openKeys, setOpenKeys] = useState([""]); // 展开菜单初始值
  const [menu, setMenu] = useState([]); // 展开菜单初始值

  const routerList = useSelector((state) => state.userReducer.routerList);
  const dispatch = useDispatch();

  const navigateTo = useNavigate();
  const currentRoute = useLocation();


  const getRouterData = async () => {
    if(routerList && routerList.length) {
      menuData(routerList)
    } else {
      const res = await getRouters()
      if(res.code === 200) {
        dispatch(setRouter(res?.data?.menus))
        menuData(res?.data?.menus)
      }
    }
  }

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  // 处理menu数据
  const menuData = (data) => {
    const list = data.map(item => {
      let obj;
      if(!item.children?.length) {
        obj = getItem(item.menuName, item.path, <PieChartOutlined />)
      } else {
        const childrenMenu = item.children.map(i => {
          let o;
          return getItem(i.menuName, i.path, <PieChartOutlined />)
        })
        obj = getItem(item.menuName, item.path, <PieChartOutlined />, childrenMenu)
      }
      return obj
    })
    const i = getItem('首页', 'home', <PieChartOutlined />)
    const newList = [i, ...list]
    setMenu(newList)
    newList.forEach((item) => {
      const isKey =
        item["children"] &&
        item["children"].length &&
        item["children"].find((i) => findKey(i));
      if (isKey) setOpenKeys([item.key]);
    });
  }

  useEffect(() => {
    getRouterData()
  }, []);

  const findKey = (obj) => {
    return obj.key === currentRoute.pathname.substring(1);
  };

  // 菜单点击事件
  const menuClick = (e) => {
    // 路由跳转
    navigateTo(e.key);
  };

  // 菜单展开回收处理
  const handleOpenChange = (keys) => {
    setOpenKeys([keys[keys.length - 1]]);
  };

  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={[currentRoute.pathname.substring(1)]}
      mode="inline"
      items={menu}
      openKeys={openKeys}
      onClick={menuClick}
      onOpenChange={handleOpenChange}
    />
  );
};

export default MenuComp;
