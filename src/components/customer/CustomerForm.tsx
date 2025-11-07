import React, {useState} from "react";
import type { Customer, CustomerBE } from "../../types/customer";
import "../../styles/CustomerForm.css";

const VIETNAM_LOCATIONS = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", 
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận",
  "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai",
  "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương",
  "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum",
  "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
  "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La",
  "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang",
  "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

interface CustomerFormProps {
  onSubmit: (customerData: Omit<CustomerBE, "id">) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, onCancel }) => {
    const [customerData, setCustomerData] = useState<Omit<CustomerBE, "id">>({
        name: '',
        company: '',
        location: '',
        email: '',
        phone: '',
        profilePicture: '',
        notes: [],
        teamId: 0,
        createdBy: 0,
        createdAt: '',
        updatedAt: '',
    });
    const [errors, setErrors] = useState<Partial<Omit<CustomerBE, "id">>>({});
    const validateForm = (): boolean => {
        const newErrors: Partial<Omit<CustomerBE, "id">> = {};

        if (!customerData.name.trim()) {
            newErrors.name = 'Họ tên là bắt buộc';
        }
        if (!customerData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
            newErrors.email = 'Email không hợp lệ';
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
                name: customerData.name,
                company: customerData.company,
                location: customerData.location,
                email: customerData.email,
                phone: customerData.phone || '',
                profilePicture: customerData.profilePicture || '',
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
    const handleChange = (field: keyof Omit<CustomerBE, 'id'>, value: string) => {
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
                value={customerData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
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
            <label htmlFor="location">Location</label>
            <select
              id="location"
              value={customerData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="location-select"
            >
              <option value="">-- Choose a location --</option>
              {VIETNAM_LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={customerData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="profilePictureUrl">Profile Picture</label>
            <input
              id="profilePicture"
              type="url"
              value={customerData.profilePicture || ''}
              onChange={(e) => handleChange('profilePicture', e.target.value)}
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
