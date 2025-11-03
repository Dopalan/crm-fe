// src/components/common/Pagination.tsx
import React from 'react';
import '../../styles/Pagination.css'; 

interface PaginationProps {
  currentPage: number; 
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        &lt; Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page + 1} 
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;