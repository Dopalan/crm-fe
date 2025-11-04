import { useState, useEffect, useCallback } from 'react';
import { getCustomerList, searchCustomers } from '../api/customer'; 
import type { CustomerResponse, CustomerListQuery } from '../types/customer.d';

export const useCustomerData = (initialQuery: CustomerListQuery) => {
  const [data, setData] = useState<CustomerResponse[]>([]); 
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
      if (query.searchTerm && query.searchTerm.trim() !== '') {
        const searchResult = await searchCustomers(query.searchTerm);
        setData(searchResult);
        setPagination({
          totalPages: 1,
          totalElements: searchResult.length,
          currentPage: 0,
          pageSize: searchResult.length > 0 ? searchResult.length : initialQuery.pageSize,
        });

      } else {

        const pageQuery: CustomerListQuery = {
          page: query.page,
          pageSize: query.pageSize,
          sortBy: query.sortBy,
          sortDir: query.sortDir,
        };
        const response = await getCustomerList(pageQuery);
        setData(response.content);
        setPagination({
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          currentPage: response.currentPage,
          pageSize: response.pageSize,
        });
      }
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

  const setQueryParam = useCallback(<K extends keyof CustomerListQuery>(key: K, value: CustomerListQuery[K]) => {
    if (key === 'searchTerm' || key === 'filterJob' || key === 'sortBy') {
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