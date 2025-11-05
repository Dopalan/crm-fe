// src/api/customer.ts
import apiClient from './index';
import type { 
  ApiResponse, 
  CustomerListQuery, 
  SpringPage,
  Customer,
  //CustomerListResponse,  đã không dùng nữa?
  //CustomerRequest đã không dùng nữa?
} from '../types/customer.d';

const CUSTOMER_URL = '/customers';

export const getCustomerList = async (
  query: CustomerListQuery,
): Promise<SpringPage<Customer>> => {
  try {
    const response = await apiClient.get<ApiResponse<SpringPage<Customer>>>(CUSTOMER_URL, {
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

///// TODO: search chưa xong
// export const searchCustomers = async (
//   searchTerm: string
// ): Promise<CustomerResponse[]> => { 
//   try {
//     const response = await apiClient.get<ApiResponse<CustomerResponse[]>>(`${CUSTOMER_URL}/search`, {
//       params: {
//         q: searchTerm, 
//       },
//     });
//     return response.data.result;
//   } catch (error) {
//     console.error('Lỗi khi tìm kiếm khách hàng:', error);
//     throw new Error('Không thể tìm kiếm khách hàng.');
//   }
// };



// TODO: update chưa xong
// export const updateCustomer = async (
//   customerId: number,
//   customerData: CustomerRequest 
// ): Promise<CustomerResponse> => {
//   try {
//     const response = await apiClient.put<ApiResponse<CustomerResponse>>(
//       `${CUSTOMER_URL}/${customerId}`,
//       customerData
//     );
//     return response.data.result; 
//   } catch (error) {
//     console.error(`Lỗi khi cập nhật khách hàng ${customerId}:`, error);
//     throw new Error('Không thể cập nhật khách hàng.');
//   }
// };


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
