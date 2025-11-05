// src/types/customer.d.ts
<<<<<<< Updated upstream
=======
import type { Interaction } from './interaction';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
// CustomerBE = Customer
export interface CustomerBE {
  id: number; 
  name: string; // BE dùng 'name'
  email: string;
  phone: string;
  company: string;
  notes: Note[];
  profilePicture: string;
  teamId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;       
  number: number;      
}
export interface CustomerListQuery {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  searchTerm?: string;
}

>>>>>>> Stashed changes

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
  name: string;
  email: string;
  phone: string; // Hoặc phoneNumber, cần khớp với backend
  company: string;
  status: string;
  profilePicture: string | null;
  notes: Note[];
  teamId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

<<<<<<< Updated upstream
// "Bản thiết kế" cho các tham số truy vấn danh sách (đã có)
=======
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

//Edit Customer Information
export interface CustomerUpdateRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  profilePicture?: string | null;
}

// "Bản thiết kế" cho các tham số truy vấn danh sách
>>>>>>> Stashed changes
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