// src/api/interaction.ts
import apiClient from './index';
import type { ApiResponse, Interaction, InteractionRequest } from '../types';

const INTERACTION_URL = '/interactions';

// Lấy tất cả tương tác của một khách hàng
export const getInteractionsByCustomerIdApi = async (customerId: string): Promise<Interaction[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Interaction[]>>(`/customers/${customerId}/interactions`);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi fetch tương tác cho khách hàng ${customerId}:`, error);
    throw new Error('Không thể tải lịch sử tương tác.');
  }
};

// Thêm một tương tác mới
export const addInteractionApi = async (data: InteractionRequest): Promise<Interaction> => {
  try {
    const response = await apiClient.post<ApiResponse<Interaction>>(INTERACTION_URL, data);
    return response.data.data;
  } catch (error) {
    console.error('Lỗi khi thêm tương tác:', error);
    throw new Error('Không thể thêm tương tác.');
  }
};

// Cập nhật một tương tác
export const updateInteractionApi = async ({ id, data }: { id: string; data: InteractionRequest }): Promise<Interaction> => {
  try {
    const response = await apiClient.put<ApiResponse<Interaction>>(`${INTERACTION_URL}/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật tương tác ${id}:`, error);
    throw new Error('Không thể cập nhật tương tác.');
  }
};

// Xóa một tương tác
export const deleteInteractionApi = async (id: string): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<null>>(`${INTERACTION_URL}/${id}`);
  } catch (error) {
    console.error(`Lỗi khi xóa tương tác ${id}:`, error);
    throw new Error('Không thể xóa tương tác.');
  }
};