// src/components/customer/InteractionHistoryTab.tsx

import { useState } from 'react';
import { 
  Timeline, Empty, Typography, Spin, Alert, Button, Modal, Form, Input, Select, message, Popconfirm, DatePicker, Tag
} from 'antd';
import { 
  EditOutlined, DeleteOutlined, PlusOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { getInteractionsByCustomerIdApi, addInteractionApi, updateInteractionApi, deleteInteractionApi } from '../../api/interaction';
import type { Interaction, InteractionRequest, InteractionUpdateRequest } from '../../types/interaction';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface InteractionHistoryTabProps {
  customerId: string;
}

const interactionTypes: InteractionRequest['type'][] = ['MEETING', 'EMAIL', 'CALL'];

const getColorForType = (type: Interaction['type']) => {
  switch (type) {
    case 'EMAIL': return 'green';
    case 'CALL': return 'orange';
    case 'MEETING': return 'blue';
    default: return 'default';
  }
};

export default function InteractionHistoryTab({ customerId }: InteractionHistoryTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: interactions, isLoading, isError, error } = useQuery({
    queryKey: ['interactions', customerId],
    queryFn: () => getInteractionsByCustomerIdApi(Number(customerId)),
    enabled: !!customerId,
  });

  const onMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['interactions', customerId] });
    setIsModalOpen(false);
    setEditingInteraction(null);
    form.resetFields();
  };

  const addMutation = useMutation({
    mutationFn: (variables: { customerId: number; data: InteractionRequest }) => addInteractionApi(variables.customerId, variables.data),
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
    if (interaction) {
      form.setFieldsValue({
        type: interaction.type,
        description: interaction.description,
        // ✅ Sửa ở đây: Set giá trị cho trường 'date' của form
        date: dayjs(interaction.interactionDate),
      });
    } else {
      form.setFieldsValue({ type: 'MEETING', description: '', date: null });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingInteraction(null);
    form.resetFields();
  };
  
  // ✅ Sửa ở đây: Tham số 'values' chỉ chứa những gì có trên form
  const handleFormSubmit = (values: { type: InteractionRequest['type']; description: string; date: dayjs.Dayjs }) => {
    if (!values.description?.trim() || !values.date) {
      message.error("Ngày và mô tả không được để trống.");
      return;
    }

    // Lấy chuỗi ngày tháng từ 'values.date'
    const dateString = values.date.format('YYYY-MM-DDTHH:mm:ss');

    if (editingInteraction) {
      // ✅ Sửa ở đây: Xây dựng payload cho update, với trường 'date'
      const updateData: InteractionUpdateRequest = {
        type: values.type,
        description: values.description,
        date: dateString,
      };
      updateMutation.mutate({ customerId: Number(customerId), id: editingInteraction.id, data: updateData });
    } else {
      // ✅ Sửa ở đây: Xây dựng payload cho add, với trường 'interactionDate'
      const requestData: InteractionRequest = {
        type: values.type,
        description: values.description,
        interactionDate: dateString,
      };
      addMutation.mutate({ customerId: Number(customerId), data: requestData });
    }
  };


  if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin /></div>;
  if (isError) return <Alert message="Lỗi" description={(error as Error).message} type="error" showIcon />;
  
  const sortedInteractions = interactions ? [...interactions].sort((a, b) => new Date(b.interactionDate).getTime() - new Date(a.interactionDate).getTime()) : [];

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
            <Timeline.Item key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Tag color={getColorForType(item.type)}>{item.type}</Tag>
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">Description: </Text>
                    <Text strong>{item.description}</Text>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                     <Text type="secondary">Date: </Text>
                     <Text>{new Date(item.interactionDate).toLocaleString()}</Text>
                  </div>
                </div>
                <div>
                  <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleOpenModal(item)} />
                  <Popconfirm
                    title="Delete this interaction?"
                    description="Are you sure?"
                    onConfirm={() => deleteMutation.mutate({ customerId: Number(customerId), id: item.id })}
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
          
          <Form.Item name="date" label="Interaction Date" rules={[{ required: true, message: 'Ngày không được để trống!' }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Mô tả không được để trống!' }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}