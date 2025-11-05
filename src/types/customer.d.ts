// src/types/customer.d.ts

// "Bản thiết kế" cho một Ghi chú (Note)
export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// "Bản thiết kế" cho một Khách hàng (Customer) - Dùng cho cả List và Detail
export interface Customer {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  company: string;
  status: string;
  profilePictureUrl: string | null;
  notes: Note[];
  teamId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  location: string;
  job: string;
}

// API customer request 
export interface CustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  company: string;
  notes?: string;
  profilePicture?: string;
  teamId?: number;
  createdBy?: number;
}

// API customer response
export interface CustomerResponse {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company: string;
  notes?: string;
  profilePicture?: string;
  teamId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// "Bản thiết kế" cho các tham số truy vấn danh sách
export interface CustomerListQuery {
  page: number;
  pageSize: number;
  searchTerm?: string;
  filterJob?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// "Bản thiết kế" cho dữ liệu trả về từ API danh sách (đã có)
export interface CustomerListResponse {
  content: Customer[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}