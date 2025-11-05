// src/components/common/AppLayout.tsx
import React, { useState } from 'react';
import { Layout, message } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { logoutApi } from '../../api/auth';
import { useAuthStore } from '../../store/auth';

const { Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  // 👇 Hàm xử lý logout chuyển từ Sidebar sang đây
  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await logoutApi();
      logout?.();
      message.success('Đăng xuất thành công!');
      navigate('/login', { replace: true });
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || 'Đăng xuất thất bại!';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        {/* 👇 Truyền logic logout qua props */}
        <Sidebar onLogout={handleLogout} loading={loading} />
      </Sider>

      <Layout>
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
