// src/api/customer.ts

import { api as apiClient } from './auth';
import type { 
  ApiResponse, 
  CustomerListQuery, 
  SpringPage,
  CustomerBE,
  CustomerResponse,
  Customer,
  CustomerRequest,
  CustomerUpdateRequest
  //CustomerListResponse,  đã không dùng nữa?
  //CustomerRequest đã không dùng nữa?
} from '../types/customer.d';

import { useAuthStore } from '../store/auth';


const CUSTOMER_URL = '/customers';

export const getCustomerList = async (
  query: CustomerListQuery,
): Promise<SpringPage<CustomerBE>> => {
  try {
    const response = await apiClient.get<ApiResponse<SpringPage<CustomerBE>>>(CUSTOMER_URL, {
      params: {
        page: query.page,
        size: query.pageSize,
        sortBy: query.sortBy || 'createdAt',
        sortDir: query.sortDir || 'desc',
      },
    });
    return response.data.data; 
  } catch (error) {
    console.error('Lỗi khi fetch danh sách khách hàng:', error);
    throw new Error('Không thể tải danh sách khách hàng.');
  }
};

export const createCustomer = async (
  customerData: Omit<CustomerBE, 'id'>
): Promise<CustomerResponse> => {
  try {
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại.');
    }

    const requestData: CustomerRequest = {
      name: customerData.name,
      email: customerData.email || undefined,
      phone: customerData.phone || undefined,
      company: customerData.company,
      notes: undefined,
      profilePicture: customerData.profilePicture || undefined,
      teamId: 1, // Default team ID
      createdBy: 1, // Default created by - có thể lấy từ auth store
    };

    console.log('Sending request data:', requestData);

    const response = await apiClient.post<CustomerResponse>(CUSTOMER_URL, requestData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {

    console.error('Error response:', error.response);

    if (error.response?.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 400) {
      throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
    } else {
      throw new Error(error.message || 'Không thể tạo khách hàng mới.');
    }
  }
};

export const deleteCustomer = async (customerId: number): Promise<void> => {
  try {
    await apiClient.delete<ApiResponse<string>>(`${CUSTOMER_URL}/${customerId}`);
 
  } catch (error) {
    console.error(`Lỗi khi xóa khách hàng ${customerId}:`, error);
    throw new Error('Không thể xóa khách hàng.');
  }
};

//TODO: chưa có
export const getFilterOptions = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/customers/filter-options/jobs');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi fetch tùy chọn filter:', error);
    return [];
  }
};

// Hàm lấy chi tiết một khách hàng bằng ID
export const getCustomerById = async (customerId: string): Promise<CustomerBE> => {
  try {
    const response = await apiClient.get<CustomerBE>(`${CUSTOMER_URL}/${customerId}`);

    // Giả sử backend trả về cấu trúc ApiResponse, dữ liệu thật nằm trong ".data"
    // Cần ép kiểu 'any' vì axios response không biết cấu trúc ApiResponse của bạn
    const apiResponse = response.data as any;
    if (apiResponse && apiResponse.data) {
        return apiResponse.data;
    }
    
    // Nếu cấu trúc không đúng, ném ra lỗi để useQuery bắt được
    throw new Error("Cấu trúc phản hồi từ API không hợp lệ.");

  } catch (error) {
    console.error(`Lỗi khi fetch chi tiết khách hàng ${customerId}:`, error);
    throw new Error('Không thể tải chi tiết khách hàng.');
  }

};


// Hàm cập nhật thông tin khách hàng
export const updateCustomerById = async ({ customerId, data }: { customerId: string; data: CustomerUpdateRequest }): Promise<Customer> => {
  try {
    // Gửi yêu cầu PUT đến, ví dụ: /api/v1/customers/1
    const response = await apiClient.put(`${CUSTOMER_URL}/${customerId}`, data);
    const apiResponse = response.data as any;
    if (apiResponse && apiResponse.data) {
        return apiResponse.data;
    }
    throw new Error("Cấu trúc phản hồi từ API không hợp lệ.");
  } catch (error) {
    console.error(`Lỗi khi cập nhật khách hàng ${customerId}:`, error);
    // Cố gắng đọc thông báo lỗi từ backend nếu có
    const errorMessage = (error as any).response?.data?.message || 'Không thể cập nhật khách hàng.';
    throw new Error(errorMessage);
  }
};

export const addCustomerNote = async (
  customerId: number,
  content: string
): Promise<void> => {
  try {
    await apiClient.post<ApiResponse<any>>(
      `${CUSTOMER_URL}/${customerId}/notes`,
      { content }
    );
  } catch (error) {
    console.error(`Lỗi khi thêm note cho khách hàng ${customerId}:`, error);
    throw new Error('Không thể thêm ghi chú.');
  }
};
