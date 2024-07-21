import { getRouters } from '@/api/menu';
import { setRouter } from "@/store/reducerModule/userReducer";
import {
  AuditOutlined,
  CalendarOutlined,
  CodeSandboxOutlined,
  HddOutlined,
  HomeOutlined,
  MenuOutlined,
  PaperClipOutlined,
  SettingOutlined,
  SignatureOutlined,
  TagsOutlined,
  UserAddOutlined,
  UserSwitchOutlined
} from '@ant-design/icons';
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const MenuComp = (props) => {
  const {getBreadcrumb} = props
  const [openKeys, setOpenKeys] = useState([""]); // 展开菜单初始值
  const [menu, setMenu] = useState([]); // 展开菜单初始值

  const routerList = useSelector((state) => state.userReducer.routerList);
  const dispatch = useDispatch();

  const navigateTo = useNavigate();
  const currentRoute = useLocation();

  const iconMap = (key) => {
    switch (key) {
    case 'home': // 系统管理
      return <HomeOutlined />
    case 'write': // 系统管理
      return <SignatureOutlined />
    case 'system': // 系统管理
      return <SettingOutlined />
    case 'user': // 系统管理
      return <UserAddOutlined />
    case 'role': // 系统管理
      return <UserSwitchOutlined />
    case 'menu': // 系统管理
      return <MenuOutlined />
    case 'content': // 系统管理
      return <CalendarOutlined />
    case 'article': // 系统管理
      return <AuditOutlined />
    case 'category': // 系统管理
      return <HddOutlined />
    case 'link': // 系统管理
      return <PaperClipOutlined />
    case 'tag': // 系统管理
      return <TagsOutlined />
    default :
      return <CodeSandboxOutlined />
    }
  }

  let paths =[]
  // 构造面包屑数据
  const getPath = (data, keyPath) => {
    data.forEach(item => {
      if(!item.children?.length) {
        if(keyPath.includes(item.key)) {
          paths.push({title: item.label})
        }
      } else {
        if(keyPath.includes(item.key)) {
          paths.push({title: item.label})
        }
        getPath(item.children, keyPath)
      }
    })
  }
  let first = true
  const getRouterData = async () => {
    if(!first) return
    if(routerList && routerList.length) {
      menuData(routerList)
    } else {
      const res = await getRouters()
      if(res.code === 200) {
        dispatch(setRouter(res?.data?.menus))
        menuData(res?.data?.menus)
      }
    }
    first = false
  }

  const getItem = (label, key, children) => {
    return {
      key,
      icon: iconMap(key),
      children,
      label,
    };
  }

  // 处理menu数据
  const menuData = (data) => {
    const list = data.map(item => {
      let obj;
      if(!item.children?.length) {
        obj = getItem(item.menuName, item.path,)
      } else {
        const childrenMenu = item.children.map(i => {
          return getItem(i.menuName, i.path)
        })
        obj = getItem(item.menuName, item.path, childrenMenu)
      }
      return obj
    })
    const i = getItem('首页', 'home')
    const newList = [i, ...list]
    setMenu(newList)
    newList.forEach((item) => {
      const isKey =
        item["children"] &&
        item["children"].length &&
        item["children"].find((i) => findKey(i));
      if (isKey) {
        setOpenKeys([item.key]);
        getPath(newList, [isKey.key, item.key])
        getBreadcrumb(paths)
      }
    });
  }

  useEffect(() => {
    getRouterData()
  }, []);

  const findKey = (obj) => {
    return obj.key === currentRoute.pathname.substring(1);
  };

  // 菜单点击事件
  const menuClick = ({ item, key, keyPath, domEvent }) => {
    console.log( item, key, keyPath, domEvent );
    getPath(menu, keyPath)
    getBreadcrumb(paths)
    // 路由跳转
    navigateTo(key);
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
