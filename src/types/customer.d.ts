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

// "Bản thiết kế" cho các tham số truy vấn danh sách (đã có)
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