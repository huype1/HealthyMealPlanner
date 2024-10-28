import React from 'react';
import { Pagination as BsPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage && pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 8; 

    if (totalPages <= maxPagesToShow) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <BsPagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </BsPagination.Item>
        );
      }
    } else {
      // Render a combination of first/last and ellipsis
      items.push(
        <BsPagination.Item
          key={1}
          active={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </BsPagination.Item>
      );

      if (currentPage > 4) {
        items.push(<BsPagination.Ellipsis key="start-ellipsis" disabled />);
      }

      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);

      for (let number = startPage; number <= endPage; number++) {
        items.push(
          <BsPagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </BsPagination.Item>
        );
      }

      if (currentPage < totalPages - 3) {
        items.push(<BsPagination.Ellipsis key="end-ellipsis" disabled />);
      }

      items.push(
        <BsPagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </BsPagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="d-flex justify-content-end">
      <BsPagination>
        <BsPagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {renderPaginationItems()}
        <BsPagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </BsPagination>
    </div>
  );
};

export default Pagination;
