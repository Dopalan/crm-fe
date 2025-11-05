// src/types/customer.d.ts


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
  notes: string;
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


// "Bản thiết kế" cho một Ghi chú (Note)
export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// "Bản thiết kế" cho một Khách hàng (Customer) - Dùng cho cả List và Detail
export interface Customer {
  // id: string; // FE dùng string cho id
  id: number; // BE là number, sửa lại?
  name: string;
  email: string;
  phone: string; // Hoặc phoneNumber, cần khớp với backend
  company: string;
  status: string;
  profilePicture: string | null;
  // notes: Note[]; // BE là string, cần đồng bộ
  notes: string; // Tạm thời để là string
  teamId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// cho update
export interface CustomerRequest {
  fullName: string;
  company: string;
  location: string;
  emailAddress: string;
  job: string; 
  phoneNumber?: string;
}

//SpringPage<Customer> = CustomerListResponse
export interface CustomerListResponse {
  content: Customer[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}