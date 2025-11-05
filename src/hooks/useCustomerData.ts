import { useState, useEffect, useCallback } from 'react';
import { getCustomerList }//, searchCustomers } //  bỏ search 
from '../api/customer';
import type { CustomerBE, CustomerListQuery } from '../types/customer.d';


export const useCustomerData = (initialQuery: CustomerListQuery) => {
  const [data, setData] = useState<CustomerBE[]>([]); // Respone -> CustomerBE
  const [query, setQuery] = useState<CustomerListQuery>(initialQuery);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalElements: 0,
    currentPage: initialQuery.page,
    pageSize: initialQuery.pageSize,
  });

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
   try {

      
      const response = await getCustomerList(query);
      
      setData(response.content);
      setPagination({
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: response.number, 
        pageSize: response.size,
      });

    } catch (err) {
      setError('Lỗi khi tải dữ liệu khách hàng. Vui lòng thử lại.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  //TODO: search, filter, sort chưa xong
  const setQueryParam = useCallback(<K extends keyof CustomerListQuery>(key: K, value: CustomerListQuery[K]) => {
    if (key === 'searchTerm'  || key === 'sortBy') {
      setQuery(prev => ({
        ...prev,
        page: 0, 
        [key]: value,
      }));
    } else {
      setQuery(prev => ({
        ...prev,
        [key]: value,
      }));
    }
  }, []);

  return {
      customers: data,
      loading,
      error,
      pagination,
      query,
      setQueryParam,
      refetch: fetchCustomers, 
    };
};