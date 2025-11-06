// src/pages/CustomerDetail.tsx
import React, { useState } from 'react';
import {
  Layout, Menu, Button, Avatar, Typography, Row, Col, Card, Tabs, List, Spin, Alert, Empty, Form, Input
} from 'antd';
import {
  HomeOutlined, UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, PlusOutlined,
  InfoCircleOutlined, MessageOutlined, HistoryOutlined, ScheduleOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCustomerById } from '../api/customer';
import type { Customer, Note } from '../types';

const { Sider, Content, Header } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  
  // State để quản lý chế độ chỉnh sửa (edit mode)
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const { data: customer, isLoading, error, refetch } = useQuery<Customer>({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomerById(customerId!),
    enabled: !!customerId,
  });

  // Hàm xử lý khi nhấn nút Edit
  const handleEdit = () => {
    // Đổ dữ liệu hiện tại của khách hàng vào form
    form.setFieldsValue({
      name: customer?.name,
      company: customer?.company,
      email: customer?.email,
      phone: customer?.phone
    });
    setIsEditing(true);
  };

  // Hàm xử lý khi nhấn nút Cancel
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  // Hàm xử lý khi submit form (nhấn Save)
  const handleSave = (values: any) => {
    console.log('Dữ liệu mới đã lưu:', values);
    // Tương lai: ở đây bạn sẽ gọi API để cập nhật backend
    // ví dụ: mutation.mutate({ customerId, ...values });
    setIsEditing(false); // Quay lại chế độ xem
  };


  if (isLoading) {
    return <Layout style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></Layout>;
  }

  if (error) {
    return (
        <div style={{ padding: 50 }}>
            <Alert
                message="Error"
                description={(error as Error).message}
                type="error"
                showIcon
                action={<Link to="/"><Button size="small" type="primary">Back to Home</Button></Link>}
            />
        </div>
    );
  }

  if (!customer) {
    return <Layout style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}><Spin tip="Preparing data..." size="large" /></Layout>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ... (Phần Sider và Header giữ nguyên) ... */}
      <Content style={{ margin: '24px 16px 0' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card bordered={false}>
              {/* Chế độ xem thông tin */}
              {!isEditing && (
                <>
                  <Button 
                    icon={<EditOutlined />} 
                    style={{ position: 'absolute', top: 16, right: 16 }}
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <div style={{ textAlign: 'center', paddingTop: 24 }}>
                    <Avatar size={96} src={customer.profilePicture || undefined} icon={<UserOutlined />} />
                    <Title level={4} style={{ marginTop: 16, marginBottom: 0 }}>{customer.name}</Title>
                    <Text type="secondary">{customer.company}</Text>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <Paragraph><MailOutlined style={{ marginRight: 8 }} /> {customer.email}</Paragraph>
                    <Paragraph><PhoneOutlined style={{ marginRight: 8 }} /> {customer.phone}</Paragraph>
                    <Paragraph><InfoCircleOutlined style={{ marginRight: 8 }} /> Status: <Text strong>{customer.status}</Text></Paragraph>
                  </div>
                </>
              )}

              {/* Chế độ chỉnh sửa (inline editing) */}
              {isEditing && (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSave}
                  initialValues={customer}
                >
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <Avatar size={96} src={customer.profilePicture || undefined} icon={<UserOutlined />} />
                  </div>
                  <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
                    <Input />
                  </Form.Item>
                   <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Please input the company!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item 
                    name="email" 
                    label="Email" 
                    rules={[
                      { required: true, message: 'Please input the email!' },
                      { type: 'email', message: 'The input is not valid E-mail!' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please input the phone number!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
                    <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                      Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </Col>
          <Col xs={24} md={16}>
            <Card bordered={false}>
              <Tabs defaultActiveKey="notes">
                <TabPane tab={<span><MessageOutlined /> Notes</span>} key="notes">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <Title level={5} style={{ margin: 0 }}>Notes</Title>
                      <Button icon={<PlusOutlined />} onClick={() => console.log('Add Note clicked')}>Add Note</Button>
                  </div>
                  <List
                    dataSource={customer?.notes || []}
                    renderItem={(item: Note) => (
                      <List.Item>
                        <List.Item.Meta
                            title={item.author}
                            description={`${item.content} - ${new Date(item.createdAt).toLocaleDateString()}`}
                        />
                      </List.Item>
                    )}
                    locale={{ emptyText: <Empty description="No notes available." /> }}
                  />
                </TabPane>
                
                <TabPane tab={<span><HistoryOutlined /> Interaction History</span>} key="interaction">
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <Title level={5} style={{ margin: 0 }}>Interaction History</Title>
                      <Button icon={<PlusOutlined />} onClick={() => console.log('Add Interaction clicked')}>Add Interaction</Button>
                  </div>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No interaction history available." />
                </TabPane>

                <TabPane tab={<span><ScheduleOutlined /> Schedule</span>} key="schedule">
                   <Title level={5} style={{ margin: 0, marginBottom: 24 }}>Schedule</Title>
                   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No schedule available." />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}