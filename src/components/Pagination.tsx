import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: white;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Pagination: React.FC = observer(() => {
  const store = useStore();

  const handlePrevious = () => {
    if (store.offset > 0) {
      store.setOffsetAndFetch(store.offset - store.limit); // Устанавливаем новый offset и загружаем данные
    }
  };

  const handleNext = () => {
    if (store.offset + store.limit < store.total) {
      store.setOffsetAndFetch(store.offset + store.limit); // Устанавливаем новый offset и загружаем данные
    }
  };

  return (
    <PaginationContainer>
      <Button onClick={handlePrevious} disabled={store.offset === 0}>
        Previous
      </Button>
      <span>{`Page ${store.currentPage} of ${store.totalPages}`}</span>
      <Button
        onClick={handleNext}
        disabled={store.offset + store.limit >= store.total}
      >
        Next
      </Button>
    </PaginationContainer>
  );
});

export default Pagination;
