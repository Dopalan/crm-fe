// src/api/customer.ts

import apiClient from './index';
import type { CustomerListQuery, CustomerListResponse } from '../types/customer.d';
const CUSTOMER_URL = '/customers';

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