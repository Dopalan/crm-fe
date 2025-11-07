import apiClient from './index';
import type { ApiResponse, Interaction, InteractionRequest, InteractionUpdateRequest } from '../types';

// Lấy tất cả tương tác của một khách hàng
// ✅ SỬA Ở ĐÂY: customerId phải là number
export const getInteractionsByCustomerIdApi = async (customerId: number): Promise<Interaction[]> => {
  try {
    // Kiểu dữ liệu T ở đây là một đối tượng chứa mảng interactions, nên ta dùng any để linh hoạt
    const response = await apiClient.get<ApiResponse<any>>(`/customers/${customerId}/interactions`);
    // ✅ SỬA LỖI Ở ĐÂY: Truy cập vào đúng mảng interactions bên trong đối tượng data
    return response.data.metadata.data.data || [];
  } catch (error) {
    console.error(`Lỗi khi fetch tương tác cho khách hàng ${customerId}:`, error);
    throw new Error('Không thể tải lịch sử tương tác.');
  }
};

// ✅ SỬA Ở ĐÂY: customerId phải là number
export const addInteractionApi = async (customerId: number, data: InteractionRequest): Promise<Interaction> => {
  try {
    const response = await apiClient.post<ApiResponse<Interaction>>(`/customers/${customerId}/interactions`, data);
    return response.data.metadata.data;
  } catch (error) {
    const errorMessage = (error as any).response?.data?.message || 'Không thể thêm tương tác.';
    throw new Error(errorMessage);
  }
};

// Cập nhật một tương tác
export const updateInteractionApi = async ({ customerId, id, data }: { customerId: number; id: string; data: InteractionUpdateRequest }): Promise<Interaction> => {
  try {
    const response = await apiClient.put<ApiResponse<Interaction>>(`/customers/${customerId}/interactions/${id}`, data);
    return response.data.metadata.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật tương tác ${id}:`, error);
    throw new Error('Không thể cập nhật tương tác.');
  }
};

// Xóa một tương tác
// ✅ SỬA LỖI Ở ĐÂY: Hàm phải nhận cả customerId và xây dựng URL cho đúng
export const deleteInteractionApi = async ({ customerId, id }: { customerId: number; id: string }): Promise<void> => {
  try {
    await apiClient.delete(`/customers/${customerId}/interactions/${id}`);
  } catch (error)
  {
    console.error(`Lỗi khi xóa tương tác ${id}:`, error);
    throw new Error('Không thể xóa tương tác.');
  }
};