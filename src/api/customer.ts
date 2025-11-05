// src/api/customer.ts
import apiClient from './index';
import type { 
  ApiResponse, 
  CustomerListQuery, 
  CustomerListResponse, 
  CustomerResponse,
  CustomerRequest
} from '../types/customer.d';


// api không có search và filter?
// ✅ ĐÃ BỔ SUNG "Customer" vào import
import type { Customer } from '../types/customer'; 

// URL này đã đúng, giữ nguyên
const CUSTOMER_URL = '/customers';

// Hàm này đã có sẵn, giữ nguyên
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


// ✅✅✅ BỔ SUNG HÀM NÀY VÀO ✅✅✅
// Hàm lấy chi tiết một khách hàng bằng ID
export const getCustomerById = async (customerId: string): Promise<Customer> => {
  try {
    const response = await apiClient.get<Customer>(`${CUSTOMER_URL}/${customerId}`);
    
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
