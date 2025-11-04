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


export interface CustomerListQuery {
  page: number;
  pageSize: number;
  searchTerm?: string;
  filterJob?: string; 
  sortBy?: string; 
  sortDir?: 'asc' | 'desc'; 
}