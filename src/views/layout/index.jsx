import Menu from '@/components/menu';
import User from '@/views/compontents/userInfo';
import { Breadcrumb, Layout } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './index.module.less';

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={styles.layoutBox}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu />
      </Sider>
      <Layout>
        <Header className={styles.headerBox} style={{ padding: 0, background: 'rgb(246, 255, 237)' }} >
          {/* 面包屑区域 */}
          <Breadcrumb className={styles.breadcrumbBox}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          {/* 用户信息区域 */}
          <div className={styles.userBox}>
            <User />
          </div>
        </Header>
        <Content className={styles.contentBox}>
          {/* 内容视窗 */}
          <Outlet />
        </Content>
        <Footer className={styles.footerBox}>hedongliang.com</Footer>
      </Layout>
    </Layout>
  );
};

export default App;