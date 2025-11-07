// src/pages/CustomerDetail.tsx
import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Button, Avatar, Typography, Row, Col, Card, Tabs, List, Spin, Alert, Empty, Form, Input, message,
  Space, Modal, Checkbox, Select
} from 'antd';
import {
  ArrowLeftOutlined, // ✅ ĐÃ IMPORT THÊM ICON MŨI TÊN
  UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, PlusOutlined,
  InfoCircleOutlined, MessageOutlined, HistoryOutlined, ScheduleOutlined,
  ApartmentOutlined, DeleteOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCustomerById, updateCustomerById } from '../api/customer';
import type { Customer, CustomerBE, CustomerUpdateRequest } from '../types';
import CustomerNoteForm from '../components/customer/CustomerNoteForm';
import InteractionHistoryTab from '../components/customer/InteractionHistoryTab';
import { addCustomerNote, getCustomerNotes, deleteCustomerNote, updateCustomerNote } from '../api/note';
import type { Note } from '../types/note.d';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const VIETNAM_LOCATIONS = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", 
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận",
  "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai",
  "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương",
  "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum",
  "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
  "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La",
  "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang",
  "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState('');
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
      location: (customer as any).location ?? '',
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

  
  //Hiển thị Notes
  const { data: notes = [], isLoading: isLoadingNotes, refetch: refetchNotes } = useQuery<Note[]>({
    queryKey: ['customerNotes', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const notesData = await getCustomerNotes(Number(customerId));
      // Transform nếu cần, hoặc return trực tiếp nếu API đã trả về đúng format
      return notesData || [];
    },
    enabled: !!customerId,
    refetchOnWindowFocus: false, // Tắt auto-refetch khi focus window
    staleTime: 60000,
  });
  
  //Thêm notes
  const handleAddNote = () => {
    setShowNoteForm(true);
  };

  const handleSubmitNotes = async (notesToSubmit: Omit<Note, "id" | "createdAt">[]) => {
  try {
    // API chỉ nhận 1 note mỗi lần, nên gọi API nhiều lần
    for (const note of notesToSubmit) {
      await addCustomerNote(Number(customerId), note.content);
    }
    
    message.success(`Đã thêm ${notesToSubmit.length} ghi chú thành công!`);
    
    await refetchNotes();
    
    setShowNoteForm(false);
  } catch (error: any) {
    console.error('Lỗi khi lưu notes:', error);
    message.error('Có lỗi xảy ra khi lưu ghi chú: ' + error.message);
  }
};

  const handleCancelNoteForm = () => {
    setShowNoteForm(false);
  };

  // Xóa note
  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
    setShowDeleteModal(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    
    try {
      await deleteCustomerNote(Number(customerId), noteToDelete);
      message.success('Đã xóa ghi chú thành công!');
      await refetchNotes();
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error: any) {
      message.error('Có lỗi xảy ra khi xóa ghi chú: ' + error.message);
    }
  };

  const cancelDeleteNote = () => {
    setShowDeleteModal(false);
    setNoteToDelete(null);
  };

  // Xóa nhiều nhiều notes
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedNotes([]); 
  };

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev => {
      if (prev.includes(noteId)) {
        return prev.filter(id => id !== noteId);
      } else {
        return [...prev, noteId];
      }
    });
  };

  const handleDeleteMultipleNotes = () => {
    if (selectedNotes.length === 0) return;
    setShowDeleteModal(true);
  };

  const confirmDeleteMultipleNotes = async () => {
    try {
      // Xóa từng note một
      for (const noteId of selectedNotes) {
        await deleteCustomerNote(Number(customerId), noteId);
      }
      message.success(`Đã xóa ${selectedNotes.length} ghi chú thành công!`);
      await refetchNotes();
      setShowDeleteModal(false);
      setSelectedNotes([]);
      setIsSelectMode(false);
    } catch (error: any) {
      message.error('Có lỗi xảy ra khi xóa ghi chú: ' + error.message);
    }
  };

  // Edit note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editContent.trim()) {
      message.warning('Nội dung ghi chú không được để trống!');
      return;
    }

    try {
      await updateCustomerNote(Number(customerId), editingNote.id, editContent.trim());
      message.success('Đã cập nhật ghi chú thành công!');
      await refetchNotes();
      setEditingNote(null);
      setEditContent('');
    } catch (error: any) {
      message.error('Có lỗi xảy ra khi cập nhật ghi chú: ' + error.message);
    }
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
                    <Paragraph><EnvironmentOutlined style={{ marginRight: 8 }} /> Location: <Text strong>{(customer as any).location ?? '-'}</Text></Paragraph>
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
                  <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                    <Select
                      placeholder="Location"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        { value: '', label: '' },
                        ...VIETNAM_LOCATIONS.map(loc => ({ value: loc, label: loc }))
                      ]}
                    />
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
                      <Space>
                        <Button 
                          onClick={toggleSelectMode}
                          disabled={!!editingNote}
                        >
                          {isSelectMode ? 'Cancel' : 'Choose'}
                        </Button>
                        {!isSelectMode ? (
                          <Button 
                            icon={<PlusOutlined />} 
                            onClick={handleAddNote}
                            disabled={!!editingNote}
                          >
                            Add Note
                          </Button>
                        ) : (
                          <Button 
                            danger={selectedNotes.length > 0}
                            disabled={selectedNotes.length === 0}
                            onClick={handleDeleteMultipleNotes}
                          >
                            Delete {selectedNotes.length > 0 && `(${selectedNotes.length})`}
                          </Button>
                        )}
                      </Space>
                    </div>
                    
                    <Spin spinning={isLoadingNotes}>
                      <List
                        dataSource={notes}
                        renderItem={(item: Note) => (
                          <List.Item
                            actions={!isSelectMode && editingNote?.id !== item.id ? [
                              <Button 
                                type="text" 
                                icon={<EditOutlined />} 
                                size="small"
                                onClick={() => handleEditNote(item)}
                              >
                                Edit
                              </Button>,
                              <Button 
                                type="text" 
                                danger 
                                icon={<DeleteOutlined />} 
                                size="small"
                                onClick={() => handleDeleteNote(item.id)}
                              >
                                Delete
                              </Button>
                            ] : editingNote?.id === item.id ? [
                              <Button 
                                type="primary"
                                size="small"
                                onClick={handleSaveEdit}
                              >
                                Save
                              </Button>,
                              <Button 
                                size="small"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            ] : []}
                          >
                            <List.Item.Meta
                              avatar={
                                isSelectMode ? (
                                  <Checkbox
                                    checked={selectedNotes.includes(item.id)}
                                    onChange={() => toggleNoteSelection(item.id)}
                                  />
                                ) : (
                                  <Avatar icon={<MessageOutlined />} />
                                )
                              }
                              title={
                                <Space>
                                  <Text strong>{item.authorName}</Text>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {new Date(item.createdAt).toLocaleString('vi-VN', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </Text>
                                </Space>
                              }
                              description={
                                editingNote?.id === item.id ? (
                                  <TextArea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                    placeholder="Nhập nội dung ghi chú..."
                                  />
                                ) : (
                                  <div>
                                    <Paragraph style={{ marginBottom: 4 }}>
                                      {item.content}
                                    </Paragraph>
                                    {item.updatedAt !== item.createdAt && (
                                      <Text type="secondary" style={{ fontSize: '11px', fontStyle: 'italic' }}>
                                        (Đã chỉnh sửa: {new Date(item.updatedAt).toLocaleString('vi-VN')})
                                      </Text>
                                    )}
                                  </div>
                                )
                              }
                            />
                          </List.Item>
                        )}
                        locale={{ emptyText: <Empty description="Chưa có ghi chú nào." /> }}
                      />
                    </Spin>
                  </TabPane>
                  
                  <TabPane tab={<span><HistoryOutlined /> Interaction History</span>} key="interaction">
                     {customerId && <InteractionHistoryTab customerId={customerId} />}
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
        </Row>
      </Content>

      {/* Customer's note's form */}
      {showNoteForm && customer && (
        <CustomerNoteForm
          customerId={Number(customerId)}
          customerName={customer.name}
          onSubmit={handleSubmitNotes}
          onCancel={handleCancelNoteForm}
        />
      )}

      {/* Delete confirm popup */}
      <Modal
        title="Xác nhận xóa"
        open={showDeleteModal}
        onOk={isSelectMode ? confirmDeleteMultipleNotes : confirmDeleteNote}
        onCancel={isSelectMode ? () => setShowDeleteModal(false) : cancelDeleteNote}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>
          {isSelectMode 
            ? `Bạn có chắc chắn muốn xóa ${selectedNotes.length} ghi chú đã chọn không?`
            : 'Bạn có chắc chắn muốn xóa ghi chú này không?'
          }
        </p>
      </Modal>
    </Layout>
  );
}