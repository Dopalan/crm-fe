// Interface tạm thời
export interface Customer {
  id: string;
  fullName: string;
  company: string;
  location: string;
  emailAddress: string;
  job: string; 
  profilePictureUrl?: string; 
  phoneNumber?: string;
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

// Định nghĩa cho tham số Truy vấn khi lấy danh sách
export interface CustomerListQuery {
  page: number;
  pageSize: number;
  searchTerm?: string;
  filterJob?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Định nghĩa cho phản hồi (Response) từ API danh sách
export interface CustomerListResponse {
  content: Customer[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}