import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/CustomerList.css'; // Sử dụng chung file CSS

const CustomerDetail: React.FC = () => {
    // Lấy ID của customer từ URL, ví dụ: /customer/123
    const { id } = useParams<{ id: string }>(); 
    const [activeTab, setActiveTab] = useState('details');

    // Dữ liệu mẫu - sau này bạn sẽ dùng `id` để gọi API và lấy dữ liệu thật
    const customer = {
        name: 'Silva Jorge',
        email: 'jorge@gmail.com',
        phone: '017526074',
    };

    return (
        <div className="customer-list-container"> {/* Dùng lại class container chính */}
            <div className="customer-detail-content">
                
                {/* Header chứa thông tin cơ bản và nút Edit */}
                <div className="customer-detail-header">
                    <div className="customer-avatar-large">
                        {customer.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="customer-info">
                        <h1 className="customer-name">{customer.name}</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb-list">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Details</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="header-actions">
                        {/* Sử dụng lại class "add-button" cho đồng bộ */}
                        <button className="add-button">Edit</button>
                    </div>
                </div>

                {/* Thanh điều hướng các Tab */}
                <div className="customer-detail-tabs">
                    <button
                        className={`tab-item ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        Notes
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Interaction History
                    </button>
                    <button
                        className={`tab-item ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        Schedule
                    </button>
                </div>

                {/* Nội dung của Tab */}
                <div className="customer-detail-tab-content">
                    {activeTab === 'details' && (
                        <div className="details-section card-style">
                            <div className="info-block">
                                <label>Email Address</label>
                                <span>{customer.email}</span>
                            </div>
                            <div className="info-block">
                                <label>Phone Number</label>
                                <span>{customer.phone}</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="notes-section card-style">
                            <button className="add-button">Add Note</button>
                            <p className="empty-state">No notes available.</p>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="history-section card-style">
                            <button className="add-button">Add Interaction</button>
                            <p className="empty-state">No interaction history available.</p>
                        </div>
                    )}
                    
                    {activeTab === 'schedule' && (
                        <div className="schedule-section card-style">
                            <p className="empty-state">No schedule available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;