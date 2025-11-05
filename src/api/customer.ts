// src/api/customer.ts
import apiClient from './index';
import { useAuthStore } from '../store/auth';
import type { CustomerListQuery, CustomerListResponse, Customer, CustomerRequest, CustomerResponse } from '../types/customer.d';

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

export const createCustomer = async (
  customerData: Omit<Customer, 'id'>
): Promise<CustomerResponse> => {
  try {
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại.');
    }

    // Chuyển đổi từ Customer format sang CustomerRequest format
    const requestData: CustomerRequest = {
      name: customerData.fullName,
      email: customerData.emailAddress || undefined,
      phone: customerData.phoneNumber || undefined,
      company: customerData.company,
      notes: undefined,
      profilePicture: customerData.profilePictureUrl || undefined,
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