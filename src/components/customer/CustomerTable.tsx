// src/components/customer/CustomerTable.tsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import type { Customer, CustomerListQuery } from '../../types/customer.d';
import '../../styles/CustomerTable.css';
interface CustomerTableProps {
  customers: Customer[];
  onEdit: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: CustomerListQuery['sortDir'] };
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onDelete,
  onSort,
  sortConfig
}) => {

  const navigate = useNavigate();
  const handleNavigateToDetail = (customerId: number) => {
    navigate(`/customers/${customerId}`);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === 'asc') {
      return ' ▲'; // tăng
    }
    return ' ▼'; // giảm 
  };
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th onClick={() => onSort('name')}>
              Name {getSortIcon('name')}
            </th>
            <th onClick={() => onSort('company')}>
              Company {getSortIcon('company')}
            </th>
            <th onClick={() => onSort('email')}>
              Email {getSortIcon('email')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td 
                className="clickable-cell" 
                onClick={() => handleNavigateToDetail(customer.id)}
              >
                <div className="user-profile-cell">
                  <img
                    src={customer.profilePicture || `https://i.pravatar.cc/30?u=${customer.id}`}
                    alt={customer.name}
                    className="avatar"
                  />
                  <span>{customer.name}</span>
                </div>
              </td>
              <td>{customer.company}</td>
              <td>{customer.email}</td>
              <td>
                <div className="action-buttons">
                      <button onClick={() => onEdit(customer.id)} className="action-btn edit">
                        ✏️
                      </button>
                      
                      <button onClick={() => onDelete(customer.id)} className="action-btn delete">
                        🗑️
                      </button>
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