import React, {useState} from "react";
import type { Customer } from "../../types/customer";
import "../../styles/CustomerForm.css";


interface CustomerFormProps {
  onSubmit: (customerData: Omit<Customer, "id">) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, onCancel }) => {
    const [customerData, setCustomerData] = useState<Omit<Customer, "id">>({
        fullName: '',
        company: '',
        location: '',
        emailAddress: '',
        job: '',
        phoneNumber: '',
        profilePictureUrl: '',
        status: '',
        notes: [],
        teamId: 0,
        createdBy: 0,
        createdAt: '',
        updatedAt: '',
    });
    const [errors, setErrors] = useState<Partial<Omit<Customer, "id">>>({});
    const validateForm = (): boolean => {
        const newErrors: Partial<Omit<Customer, "id">> = {};

        if (!customerData.fullName.trim()) {
            newErrors.fullName = 'Họ tên là bắt buộc';
        }
        if (!customerData.emailAddress.trim()) {
            newErrors.emailAddress = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(customerData.emailAddress)) {
            newErrors.emailAddress = 'Email không hợp lệ';
        }
        if (!customerData.company.trim()) {
            newErrors.company = 'Công ty là bắt buộc';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with data:', customerData);
        console.log('Starting validation...');
        
        if (validateForm()) {
            console.log('Form is valid, calling onSubmit...');
            const dataToSubmit = {
                fullName: customerData.fullName,
                company: customerData.company,
                emailAddress: customerData.emailAddress,
                phoneNumber: customerData.phoneNumber || '',
                profilePictureUrl: customerData.profilePictureUrl || '',
                location: customerData.location,
                job: customerData.job,
                status: customerData.status,
                notes: customerData.notes,
                teamId: customerData.teamId,
                createdBy: customerData.createdBy,
                createdAt: customerData.createdAt,
                updatedAt: customerData.updatedAt
            };
            console.log('Data to submit:', dataToSubmit);
            onSubmit(dataToSubmit);
        } else {
            console.log('Form validation failed, errors:', errors);
        }
    };
    const handleChange = (field: keyof Omit<Customer, 'id'>, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <div className="customer-form-overlay">
      <div className="customer-form-modal">
        <div className="form-header">
          <h2>Add New Customer</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="fullName">Name</label>
              <input
                id="fullName"
                type="text"
                value={customerData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

          <div className="form-group">
            <label htmlFor="emailAddress">Email</label>
            <input
              id="emailAddress"
              type="email"
              value={customerData.emailAddress}
              onChange={(e) => handleChange('emailAddress', e.target.value)}
              className={errors.emailAddress ? 'error' : ''}
            />
            {errors.emailAddress && <span className="error-message">{errors.emailAddress}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              type="text"
              value={customerData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className={errors.company ? 'error' : ''}
            />
            {errors.company && <span className="error-message">{errors.company}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              value={customerData.phoneNumber || ''}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePictureUrl">Profile Picture</label>
            <input
              id="profilePictureUrl"
              type="url"
              value={customerData.profilePictureUrl || ''}
              onChange={(e) => handleChange('profilePictureUrl', e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CustomerForm;
