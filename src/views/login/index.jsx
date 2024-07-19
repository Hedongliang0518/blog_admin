import { login } from "@/api/login";
import { Login } from "@/store/reducerModule/userReducer";
import { setToken } from "@/utils/auth";
import { Button, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navGateTo = useNavigate();

  const onFinish = async (values) => {
    const res = await login(values)
    if(res.code === 200) {
      setToken(res.data.token);
      dispatch(Login(res))
      navGateTo("/page1");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginBox}>
        <Form
          initialValues={{ userName: 'hedongliang', password: 'Hdl_0518' }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label=""
            name="userName"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item
            label=""
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
