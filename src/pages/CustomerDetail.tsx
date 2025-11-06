// src/pages/CustomerDetail.tsx
import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Button, Avatar, Typography, Row, Col, Card, Tabs, List, Spin, Alert, Empty, Form, Input, message
} from 'antd';
import {
  ArrowLeftOutlined, // ✅ ĐÃ IMPORT THÊM ICON MŨI TÊN
  UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, PlusOutlined,
  InfoCircleOutlined, MessageOutlined, HistoryOutlined, ScheduleOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCustomerById, addCustomerNote, updateCustomerById } from '../api/customer';
import type { Customer, CustomerBE, Note, CustomerUpdateRequest } from '../types';
import CustomerNoteForm from '../components/customer/CustomerNoteForm';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: customer, isLoading, error, refetch } = useQuery<CustomerBE>({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomerById(customerId!),
    enabled: !!customerId,
  });

  const updateMutation = useMutation({
    mutationFn: updateCustomerById,
    onSuccess: () => {
      message.success('Cập nhật khách hàng thành công!');
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      setIsEditing(false);
    },
    onError: (err: Error) => {
      message.error(err.message);
    }
  });

  useEffect(() => {
  if (isEditing && customer) {
    form.setFieldsValue({
      name: (customer as any).fullName ?? (customer as any).name ?? '',
      company: (customer as any).company ?? '',
      email: (customer as any).emailAddress ?? (customer as any).email ?? '',
      phone: (customer as any).phoneNumber ?? (customer as any).phone ?? '',
      profilePicture: (customer as any).profilePictureUrl ?? (customer as any).profilePicture ?? '',
    });
  }
}, [isEditing, customer, form]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  
  const handleSave = (values: CustomerUpdateRequest) => {
    if (!customerId) return;
    updateMutation.mutate({ customerId, data: values });
  };

  const handleAddNote = () => {
    setShowNoteForm(true);
  };

  const handleSubmitNotes = async (notes: Omit<Note, "id" | "createdAt">[]) => {
    try {
      // API chỉ nhận 1 note mỗi lần, nên gọi API nhiều lần
      for (const note of notes) {
        await addCustomerNote(Number(customerId), note.content);
      }
      
      console.log('Đã lưu ghi chú');
      refetch();
      
      setShowNoteForm(false);

      alert(`Đã thêm ${notes.length} ghi chú thành công!`);
    } catch (error: any) {
      console.error('Lỗi khi lưu notes:', error);
      alert('Có lỗi xảy ra khi lưu ghi chú: ' + error.message);
    }
  };

  const handleCancelNoteForm = () => {
    setShowNoteForm(false);
  };


  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Spin size="large" /></div>;
  }

  if (error) {
    return (
      <div style={{ padding: 50 }}>
        <Alert
          message="Error"
          description={(error as Error).message}
          type="error"
          showIcon
          action={<Link to="/customers"><Button size="small" type="primary">Back to List</Button></Link>}
        />
      </div>
    );
  }

  if (!customer) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Spin tip="Preparing data..." size="large" /></div>;
  }

  return (
    <Layout>
      {/* ✅ HEADER MỚI: THÊM NÚT BACK ICON VÀ CĂN CHỈNH */}
      <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px' // Tạo khoảng cách giữa nút và tiêu đề
      }}>
        <Button 
          type="text" // Nút không có nền, trông gọn gàng hơn
          shape="circle"
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/customers')} // Quay về trang danh sách
        />
        <Title level={4} style={{ margin: 0 }}>Customer Details</Title>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          {/* CỘT THÔNG TIN VÀ CHỨC NĂNG EDIT */}
          <Col xs={24} md={8}>
            <Card bordered={false} style={{ position: 'relative' }}>
              {!isEditing && (
                <>
                  <Button icon={<EditOutlined />} onClick={handleEdit} style={{ position: 'absolute', top: 16, right: 16 }}>Edit</Button>
                  <div style={{ textAlign: 'center', paddingTop: '24px' }}>
                    <Avatar
                      size={96}
                      src={(customer as any).profilePictureUrl ?? (customer as any).profilePicture ?? undefined}
                      icon={<UserOutlined />}
                    />
                    <Title level={4} style={{ marginTop: 16, marginBottom: 0 }}>
                      {(customer as any).fullName ?? (customer as any).name ?? 'Unknown'}
                    </Title>
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <Paragraph><MailOutlined style={{ marginRight: 8 }} /> {(customer as any).emailAddress ?? (customer as any).email ?? '-'}</Paragraph>

                    <Paragraph><PhoneOutlined style={{ marginRight: 8 }} /> {(customer as any).phoneNumber ?? (customer as any).phone ?? '-'}</Paragraph>
                    <Paragraph><ApartmentOutlined style={{ marginRight: 8 }} /> Company: <Text strong>{(customer as any).company ?? '-'}</Text></Paragraph>
                  </div>
                </>
              )}
              {isEditing && (
                <Form form={form} layout="vertical" onFinish={handleSave}>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Avatar
                      size={96}
                      src={(customer as any).profilePictureUrl ?? (customer as any).profilePicture ?? undefined}
                      icon={<UserOutlined />}
                    />
                  </div>
                  <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="company" label="Company" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="profilePicture" label="Profile Picture URL">
                    <Input placeholder="https://example.com/image.png" />
                  </Form.Item>
                  <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
                    <Button onClick={handleCancel} style={{ marginRight: 8 }}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>Save</Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </Col>
          
          {/* CỘT CHỨA CÁC TAB */}
          <Col xs={24} md={16}>
              <Card bordered={false}>
                <Tabs defaultActiveKey="notes">
                  <TabPane tab={<span><MessageOutlined /> Notes</span>} key="notes">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                        <Title level={5} style={{ margin: 0 }}>Notes</Title>
                        <Button icon={<PlusOutlined />} onClick={handleAddNote}>Add Note</Button>
                    </div>
                    <List
                      dataSource={(customer as any).notes ?? (customer as any).noteList ?? []}
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
                        <Button icon={<PlusOutlined />}>Add Interaction</Button>
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

      {/* Customer Note Form Modal */}
      {showNoteForm && customer && (
        <CustomerNoteForm
          customerId={Number(customerId)}
          customerName={customer.name}
          onSubmit={handleSubmitNotes}
          onCancel={handleCancelNoteForm}
        />
      )}
    </Layout>
  );
}