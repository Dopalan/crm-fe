// src/pages/CustomerList.tsx
import React, { useState, useEffect } from 'react';
import { useCustomerData } from '../hooks/useCustomerData';
import type { CustomerListQuery } from '../types/customer.d';
import { deleteCustomer } from '../api/customer';
import CustomerTable from '../components/customer/CustomerTable';
import Pagination from '../components/common/Pagination';
import '../styles/CustomerList.css'; 

const INITIAL_PAGE_SIZE = 10;

const CustomerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // const [filterJob, setFilterJob] = useState('All');
  // const [jobOptions, setJobOptions] = useState<string[]>([]);

  const {
    customers,
    loading,
    error,
    pagination,
    refetch,
    setQueryParam,
  } = useCustomerData({
    page: 0, 
    pageSize: INITIAL_PAGE_SIZE,
    sortBy: 'createdAt', // defalute BE
    sortDir: 'desc', // defalute BE
  });

  const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: CustomerListQuery['sortDir'];
    }>({
      key: 'createdAt',
      direction: 'desc',
    });
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setQueryParam('searchTerm', searchTerm);
    }
  };

  // filter chưa xong
  // const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newJob = e.target.value;
  //   setFilterJob(newJob);
  //   setQueryParam('filterJob', newJob === 'All' ? undefined : newJob);
  // };

  const handlePageChange = (newPage: number) => {
    setQueryParam('page', newPage);
  };


  const handleEdit = async (id: number) => {
      try {
        // const customerDetails = await getCustomerById(id);
        // setEditingCustomer(customerDetails);
        // setIsModalOpen(true);
        console.log('Edit customer with ID:', id);
      } catch (error) {
        alert('Không thể tải thông tin chi tiết.');
      }
    };

const handleDelete = async (id: number) => { 
  if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) {
    try {
      await deleteCustomer(id); 
      alert('Đã xóa thành công!');
      refetch(); 
    } catch (err) {
      alert('Xóa thất bại. Vui lòng thử lại.');
    }
  }
};

const handleSort = (key: string) => {
    let direction: CustomerListQuery['sortDir'] = 'asc';

    // Nếu nhấp vào cột đang được sort -> đảo ngược hướng
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    // Nếu nhấp vào cột mới, mặc định là 'asc'
    
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (sortConfig) {
      setQueryParam('sortBy', sortConfig.key);
      setQueryParam('sortDir', sortConfig.direction);
    }
  }, [sortConfig, setQueryParam]);


// filter chưa xong
  // useEffect(() => {
  //   const fetchJobOptions = async () => {
  //     const options = await getFilterOptions();
  //     setJobOptions(options);
  //   };
  //   fetchJobOptions();
  // }, []);

  return (
    <div className="customer-list-container">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search items..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
        {/* // filter chưa xong */}
        {/* <select
          className="filter-select"
          value={filterJob}
          onChange={handleFilterChange}
        >
          <option value="All">Job: All</option>
          {jobOptions.map((job) => (
            <option key={job} value={job}>
              Job: {job}
            </option>
          ))}
        </select> */}
        <button className="add-button">
          Add
        </button>
      </div>

      {loading && <div className="loading-state">Đang tải dữ liệu...</div>}
      {error && <div className="error-state">{error}</div>}

      {!loading && !error && customers.length > 0 && (
        <CustomerTable
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSort={handleSort}        
          sortConfig={sortConfig}   
        />
      )}
      
      {!loading && !error && customers.length === 0 && (
        <div className="empty-state">Không tìm thấy khách hàng nào.</div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CustomerList;