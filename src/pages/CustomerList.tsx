// src/pages/CustomerList.tsx
import React, { useState, useEffect } from 'react';
import { useCustomerData } from '../hooks/useCustomerData';
import { createCustomer } from '../api/customer';
import type { CustomerBE, CustomerListQuery } from '../types/customer.d';
import { deleteCustomer } from '../api/customer';
import CustomerTable from '../components/customer/CustomerTable';
import CustomerForm from '../components/customer/CustomerForm';
import Pagination from '../components/common/Pagination';
import '../styles/CustomerList.css'; 
import { Select} from 'antd';

const INITIAL_PAGE_SIZE = 10;
const VIETNAM_LOCATIONS = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", 
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận",
  "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai",
  "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương",
  "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum"
];
const CustomerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState<string | undefined>(undefined);
  const [showAddForm, setShowAddForm] = useState(false);

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
  // filter không có searchTerm
  const handleFilterLocationChange = (newLocation: string | undefined) => {
    const actualLocation = newLocation === "ALL" ? undefined : newLocation;
    setFilterLocation(actualLocation);
    setQueryParam('filterLocation', actualLocation);
    setQueryParam('searchTerm', undefined);
  };


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

  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleFormSubmit = async (customerData: Omit<CustomerBE, 'id'>) => {
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
       <Select
          value={filterLocation === undefined ? "ALL" : filterLocation}
          onChange={handleFilterLocationChange}
          placeholder="Lọc theo địa điểm"
          style={{ minWidth: 150 }}
          allowClear 
        >
          <Select.Option key="all-locations" value="ALL">Tất cả địa điểm</Select.Option>
          {VIETNAM_LOCATIONS.map(loc => (
            <Select.Option key={loc} value={loc}>{loc}</Select.Option>
          ))}
        </Select>
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