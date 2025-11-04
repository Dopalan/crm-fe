// src/api/customer.ts

import apiClient from './index';
import type { 
  ApiResponse, 
  CustomerListQuery, 
  CustomerListResponse, 
  CustomerResponse,
  CustomerRequest
} from '../types/customer.d';

const CUSTOMER_URL = '/customers';

// api không có search và filter?
export const getCustomerList = async (
  query: CustomerListQuery,
): Promise<CustomerListResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<CustomerListResponse>>(CUSTOMER_URL, {
      params: {
        page: query.page,
        size: query.pageSize,
        sortBy: query.sortBy || 'createdAt', 
        sortDir: query.sortDir || 'desc', 
      },
    });

    return response.data.result; 
  } catch (error) {
    console.error('Lỗi khi fetch danh sách khách hàng:', error);
    throw new Error('Không thể tải danh sách khách hàng.');
  }
};

///// Chưa phân trang?
export const searchCustomers = async (
  searchTerm: string
): Promise<CustomerResponse[]> => { 
  try {
    const response = await apiClient.get<ApiResponse<CustomerResponse[]>>(`${CUSTOMER_URL}/search`, {
      params: {
        q: searchTerm, 
      },
    });
    return response.data.result;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm khách hàng:', error);
    throw new Error('Không thể tìm kiếm khách hàng.');
  }
};

// người khác phụ trách
// export const getCustomerById = async (customerId: number): Promise<CustomerResponse> => {
//   try {
//     const response = await apiClient.get<ApiResponse<CustomerResponse>>(`${CUSTOMER_URL}/${customerId}`);
//     return response.data.result; // Trả về 'result'
//   } catch (error) {
//     console.error(`Lỗi khi fetch chi tiết khách hàng ${customerId}:`, error);
//     throw new Error('Không thể tải chi tiết khách hàng.');
//   }
// };

// mới nối
export const updateCustomer = async (
  customerId: number,
  customerData: CustomerRequest 
): Promise<CustomerResponse> => {
  try {
    const response = await apiClient.put<ApiResponse<CustomerResponse>>(
      `${CUSTOMER_URL}/${customerId}`,
      customerData
    );
    return response.data.result; 
  } catch (error) {
    console.error(`Lỗi khi cập nhật khách hàng ${customerId}:`, error);
    throw new Error('Không thể cập nhật khách hàng.');
  }
};


export const deleteCustomer = async (customerId: number): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<void>>(`${CUSTOMER_URL}/${customerId}`);
  } catch (error) {
    console.error(`Lỗi khi xóa khách hàng ${customerId}:`, error);
    throw new Error('Không thể xóa khách hàng.');
  }
};









//chưa có
export const getFilterOptions = async (): Promise<string[]> => {
  try {
    /// api /customers/filter-options/jobs
    const response = await apiClient.get<string[]>('/customers/filter-options/jobs');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi fetch tùy chọn filter:', error);
    return [];
  }
};


