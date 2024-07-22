import { logout } from '@/api/login';
import { LogOut } from "@/store/reducerModule/userReducer";
import { getToken } from "@/utils/auth";
import { Dropdown, Image, Modal } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

const User = () => {
  const userInfo = useSelector((state) => state.userReducer.userInfo);
  const dispatch = useDispatch();
  const navGateTo = useNavigate();

  // 退出登录
  const handleLogOut = () => {
    confirm({
      title: `确定注销并退出系统吗？`,
      okText: '确认',
      cancelText: '取消',
      onCancel: () => {},
      onOk: () => {
        goback()
      }
    })
  };

  // 登出回调
  const goback = async () => {
    await logout(getToken())
    dispatch(LogOut())
    navGateTo("/")
  }

  // 下拉展示
  const items = [
    {
      key: '1',
      label: (
        <a>
          个人中心
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={handleLogOut}>
          退出
        </a>
      ),
    },
  ];

  return (<div>
    <Image width={40} src={userInfo.avatar} style={{borderRadius: "50%", overflow: "hidden"}} />
    <Dropdown menu={{ items }} placement="bottomLeft">
      <span style={{marginLeft: '10px', cursor: "pointer", color: '#fff'}}>{userInfo.name || '-'}</span>
    </Dropdown>
  </div>)
}
export default User