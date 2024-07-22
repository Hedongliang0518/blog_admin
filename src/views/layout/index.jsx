import Menu from '@/components/menu';
import User from '@/views/compontents/userInfo';
import { Breadcrumb, Layout } from 'antd';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './index.module.less';

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState([]);

  // 获取面包屑数据
  const getBreadcrumb = (data) => {
    setBreadcrumb(data)
  }

  return (
    <Layout className={styles.layoutBox}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className={styles.logoBox} >
          <img src="/public/imgs/page/logo.jpg" alt="logo" className={styles.logoImg}/>
        </div>
        <Menu getBreadcrumb={getBreadcrumb}/>
      </Sider>
      <Layout>
        <Header className={styles.headerBox} style={{ padding: 0, background: '#001529' }} >
          {/* 面包屑区域 */}
          <Breadcrumb className={styles.breadcrumbBox} items={breadcrumb}>
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