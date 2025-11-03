// src/components/customer/CustomerTable.tsx
import React from 'react';
import type { Customer } from '../../types/customer.d';
import '../../styles/CustomerTable.css'; 

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onEdit,
  onDelete,
}) => {
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
            <tr key={customer.id}>
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
                  <button onClick={() => onEdit(customer.id)} className="action-btn edit">
                  </button>
                  <button onClick={() => onDelete(customer.id)} className="action-btn delete">
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