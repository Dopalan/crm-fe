// src/components/common/AppLayout.tsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom'; // ✅ BƯỚC 1: IMPORT OUTLET
import { HomeOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

// ✅ BƯỚC 2: ĐƠN GIẢN HÓA COMPONENT, KHÔNG CẦN "children"
const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div style={{ height: '32px', margin: '16px', color: 'white', textAlign: 'center', fontSize: '20px' }}>
          CRM
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']}>
          <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/customers')}>
            Home
          </Menu.Item>
          {/* Các menu item khác có thể thêm vào đây */}
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
          {/* ✅ BƯỚC 3: OUTLET LÀ NƠI CÁC TRANG CON SẼ ĐƯỢC HIỂN THỊ */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;