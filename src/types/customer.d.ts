export interface ApiResponse<T> {
  message: string;
  result: T;
}

export interface CustomerResponse {
  id: number; 
  fullName: string;
  company: string;
  location: string;
  emailAddress: string;
  job: string; 
  profilePictureUrl?: string; 
  phoneNumber?: string;

}


export interface CustomerRequest {
  fullName: string;
  company: string;
  location: string;
  emailAddress: string;
  job: string; 
  phoneNumber?: string;
}


export interface CustomerListResponse {
  content: CustomerResponse[];
  totalPages: number;
  totalElements: number;
  currentPage: number; 
  pageSize: number;
}


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
  sortBy?: string; 
  sortDir?: 'asc' | 'desc'; 
  filterJob?: string;
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