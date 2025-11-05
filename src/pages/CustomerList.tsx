// src/pages/CustomerList.tsx
import React, { useState } from 'react';
import { useCustomerData } from '../hooks/useCustomerData';
import { createCustomer } from '../api/customer';
import CustomerTable from '../components/customer/CustomerTable';
import CustomerForm from '../components/customer/CustomerForm';
import Pagination from '../components/common/Pagination';
import '../styles/CustomerList.css'; 
import type { Customer } from '../types/customer';

const INITIAL_PAGE_SIZE = 10;

const CustomerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJob, setFilterJob] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleEdit = (id: string) => {
    console.log('Edit customer:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete customer:', id);
  };

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = async (customerData: Omit<Customer, 'id'>) => {
    try {
      const newCustomer = await createCustomer(customerData);
      console.log('Customer created successfully:', newCustomer);
      
      setShowAddForm(false);
      setQueryParam('page', 0);

      alert('Customer added successfully!');
      
    } catch (error: any) {
      console.error('Error creating customer:', error);
      alert(`An error occurred while adding the customer: ${error.message}`);
    }
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
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
        <button className="add-button" onClick={handleAdd}>
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

      {showAddForm && (
        <CustomerForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default CustomerList;