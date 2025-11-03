// src/pages/CustomerList.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thay đổi 1: Import hook useNavigate
import { useCustomerData } from '../hooks/useCustomerData';
import CustomerTable from '../components/customer/CustomerTable';
import Pagination from '../components/common/Pagination';
import '../styles/CustomerList.css'; 

const INITIAL_PAGE_SIZE = 10;

const CustomerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJob, setFilterJob] = useState('All');
  const navigate = useNavigate(); // Thay đổi 2: Khởi tạo hàm navigate

  const {
    customers,
    loading,
    error,
    pagination,
    setQueryParam,
  } = useCustomerData({
    page: 0, 
    pageSize: INITIAL_PAGE_SIZE,
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setQueryParam('searchTerm', searchTerm);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newJob = e.target.value;
    setFilterJob(newJob);
    setQueryParam('filterJob', newJob === 'All' ? undefined : newJob);
  };

  const handlePageChange = (newPage: number) => {
    setQueryParam('page', newPage);
  };

  // Thay đổi 3: Thêm hàm xử lý sự kiện click vào một dòng trong bảng
  // Hàm này sẽ nhận ID của khách hàng và điều hướng đến trang chi tiết
  const handleRowClick = (id: string) => {
    navigate(`/customer/${id}`);
  };

  const handleEdit = (id: string) => {
    // Ngăn sự kiện click của dòng lan ra ngoài khi nhấn nút Edit
    event?.stopPropagation(); 
    console.log('Edit customer:', id);
    // Bạn cũng có thể điều hướng đến trang chỉnh sửa nếu muốn
    // navigate(`/customer/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    // Ngăn sự kiện click của dòng lan ra ngoài khi nhấn nút Delete
    event?.stopPropagation(); 
    console.log('Delete customer:', id);
  };

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
        <select 
          className="filter-select" 
          value={filterJob} 
          onChange={handleFilterChange}
        >
          <option value="All">Job: All</option>
          <option value="A">Job: A</option>
          <option value="B">Job: B</option>
          <option value="C">Job: C</option>
        </select>
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
          onRowClick={handleRowClick} // Thay đổi 4: Truyền hàm mới vào component CustomerTable
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