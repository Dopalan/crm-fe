// src/api/customer.ts
import apiClient from './index';
// ✅ ĐÃ BỔ SUNG "Customer" vào import
import type { CustomerListQuery, CustomerListResponse, Customer } from '../types/customer'; 

// URL này đã đúng, giữ nguyên
const CUSTOMER_URL = '/customers';

// Hàm này đã có sẵn, giữ nguyên
export const getCustomerList = async (
  query: CustomerListQuery,
): Promise<CustomerListResponse> => {
  try {
    const response = await apiClient.get<CustomerListResponse>(CUSTOMER_URL, {
      params: {
        page: query.page,
        size: query.pageSize,
        search: query.searchTerm,
        job: query.filterJob,
        sort: query.sortBy ? `${query.sortBy},${query.sortOrder || 'asc'}` : undefined,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi fetch danh sách khách hàng:', error);
    throw new Error('Không thể tải danh sách khách hàng.');
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