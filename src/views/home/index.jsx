import Menu from '@/components/menu';
import { Breadcrumb, Layout, theme } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './index.module.less';

const { Header, Content, Footer, Sider } = Layout;




const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  return (
    <Layout className={styles.layoutBox}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} >
          {/* 面包屑区域 */}
          <Breadcrumb className={styles.breadcrumbBox}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Content className={styles.contentBox}>
          {/* 内容视窗 */}
          <Outlet />
        </Content>
        <Footer className={styles.footerBox}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default App;