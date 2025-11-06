// src/components/customer/InteractionHistoryTab.tsx
import React, { useState } from 'react';
import { Timeline, Empty, Typography, Spin, Alert, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';
import { MailOutlined, PhoneOutlined, CarryOutOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInteractionsByCustomerIdApi, addInteractionApi, updateInteractionApi, deleteInteractionApi } from '../../api/interaction';
import type { Interaction, InteractionRequest } from '../../types';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface InteractionHistoryTabProps {
  customerId: string;
}

const interactionTypes: InteractionRequest['type'][] = ['MEETING', 'EMAIL', 'CALL'];

const getIconForType = (type: Interaction['type']) => {
  switch (type) {
    case 'EMAIL': return <MailOutlined />;
    case 'CALL': return <PhoneOutlined />;
    case 'MEETING': return <CarryOutOutlined />;
    default: return <CarryOutOutlined />;
  }
};

export default function InteractionHistoryTab({ customerId }: InteractionHistoryTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: interactions, isLoading, isError, error } = useQuery({
    queryKey: ['interactions', customerId],
    queryFn: () => getInteractionsByCustomerIdApi(customerId),
    enabled: !!customerId,
  });

  const onMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['interactions', customerId] });
    setIsModalOpen(false);
    setEditingInteraction(null);
    form.resetFields();
  };

  const addMutation = useMutation({
    mutationFn: addInteractionApi,
    onSuccess: () => { message.success("Thêm tương tác thành công!"); onMutationSuccess(); },
    onError: (err: Error) => message.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateInteractionApi,
    onSuccess: () => { message.success("Cập nhật tương tác thành công!"); onMutationSuccess(); },
    onError: (err: Error) => message.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInteractionApi,
    onSuccess: () => { message.success("Xóa tương tác thành công!"); queryClient.invalidateQueries({ queryKey: ['interactions', customerId] }); },
    onError: (err: Error) => message.error(err.message),
  });

  const handleOpenModal = (interaction: Interaction | null) => {
    setEditingInteraction(interaction);
    form.setFieldsValue({
      type: interaction ? interaction.type : 'MEETING',
      content: interaction ? interaction.content : '',
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingInteraction(null);
    form.resetFields();
  };

  const handleFormSubmit = (values: { type: InteractionRequest['type']; content: string }) => {
    if (!values.content?.trim()) {
      message.error("Nội dung không được để trống.");
      return;
    }

    const requestData: InteractionRequest = { ...values, customerId };

    if (editingInteraction) {
      updateMutation.mutate({ id: editingInteraction.id, data: requestData });
    } else {
      addMutation.mutate(requestData);
    }
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin /></div>;
  }

  if (isError) {
    return <Alert message="Lỗi" description={(error as Error).message} type="error" showIcon />;
  }

  const sortedInteractions = interactions ? [...interactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={5} style={{ margin: 0 }}>Interaction History</Title>
        <Button icon={<PlusOutlined />} onClick={() => handleOpenModal(null)}>Add Interaction</Button>
      </div>

      {sortedInteractions.length === 0 ? (
        <Empty description="No history yet." />
      ) : (
        <Timeline>
          {sortedInteractions.map(item => (
            <Timeline.Item key={item.id} dot={getIconForType(item.type)}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p><strong>{item.content}</strong></p>
                  <p><small>{item.userName} - {new Date(item.createdAt).toLocaleString()}</small></p>
                </div>
                <div>
                  <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleOpenModal(item)} />
                  <Popconfirm
                    title="Xóa tương tác?"
                    description="Bạn có chắc muốn xóa tương tác này?"
                    onConfirm={() => deleteMutation.mutate(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      )}

      <Modal
        title={editingInteraction ? "Edit Interaction" : "Add Interaction"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>Cancel</Button>,
          <Button key="submit" type="primary" loading={addMutation.isPending || updateMutation.isPending} onClick={() => form.submit()}>
            {editingInteraction ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={{ type: 'MEETING' }}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              {interactionTypes.map(type => <Option key={type} value={type}>{type}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Nội dung không được để trống!' }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}