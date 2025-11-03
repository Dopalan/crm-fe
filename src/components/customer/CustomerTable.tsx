// src/components/customer/CustomerTable.tsx
import React from 'react';
import type { Customer } from '../../types/customer.d';
import '../../styles/CustomerTable.css';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRowClick: (id: string) => void; 
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onDelete,
  onRowClick, // Thay đổi 1: Nhận prop onRowClick
}) => {
  // Hàm xử lý cho nút Edit để ngăn sự kiện nổi bọt (bubbling)
  const handleEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ <tr>
    onEdit(id);
  };

  // Hàm xử lý cho nút Delete để ngăn sự kiện nổi bọt
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ <tr>
    onDelete(id);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Company</th>
            <th>Location</th>
            <th>Email Address</th>
            <th>Job</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            // Thay đổi 2: Thêm sự kiện onClick và style cho thẻ <tr>
            <tr
              key={customer.id}
              onClick={() => onRowClick(customer.id)}
              className="clickable-row" // Thêm class để dễ dàng định kiểu trong CSS
            >
              <td>
                <div className="user-profile-cell">
                  <img
                    src={customer.profilePictureUrl || `https://i.pravatar.cc/30?u=${customer.id}`}
                    alt={customer.fullName}
                    className="avatar"
                  />
                  <span>{customer.fullName}</span>
                </div>
              </td>
              <td>{customer.company}</td>
              <td>{customer.location}</td>
              <td>{customer.emailAddress}</td>
              <td>{customer.job}</td>
              <td>
                <div className="action-buttons">
                  {/* Thay đổi 3: Gọi hàm xử lý mới cho các nút */}
                  <button onClick={(e) => handleEditClick(e, customer.id)} className="action-btn edit"></button>
                  <button onClick={(e) => handleDeleteClick(e, customer.id)} className="action-btn delete"></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;