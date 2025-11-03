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