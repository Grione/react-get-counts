import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';
import styled from 'styled-components';
import { ReactComponent as ColdWaterIcon } from '../assets/icons/icon-cold.svg';
import { ReactComponent as HotWaterIcon } from '../assets/icons/icon-hot.svg';
import { ReactComponent as DeleteIcon } from '../assets/icons/trash.svg';

const Container = styled.div`
  height: 750px;
  overflow: auto;
`;

const Table = styled.table`
  max-width: 100%;
  border-collapse: collapse;
`;

const Tr = styled.tr`
  &:hover .delete-button {
    display: inline;
  }
`;

const Th = styled.th`
  position: sticky;
  top: 0;
  background: white;
  border: 1px solid #ddd;
  padding: 8px;
  z-index: 1;
`;

const Td = styled.td`
  position: relative;
  border: 1px solid #ddd;
  padding: 8px;
`;

const DeleteButton = styled.button`
  display: none;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #fee3e3;
  border: none;
  cursor: pointer;
  padding: 12px;
`;

const CountTable: React.FC = observer(() => {
  const store = useStore();

  useEffect(() => {
    store.fetchCounts();
  }, [store]);

  const handleDelete = (id: string) => {
    store.removeCount(id);
  };

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th>Тип</Th>
            <Th>Дата установки</Th>
            <Th>Автоматический</Th>
            <Th>Текущие показания</Th>
            <Th>Адрес</Th>
            <Th>Примечание</Th>
          </tr>
        </thead>
        <tbody>
          {store.counts.map((count, index) => {
            const date = new Date(count.installation_date);

            return (
              <Tr key={count.id}>
                <Td>{index + 1}</Td>
                <Td>
                  {count._type[0] === 'ColdWaterAreaMeter' ? (
                    <span>
                      <ColdWaterIcon />
                      ХВС
                    </span>
                  ) : (
                    <span>
                      <HotWaterIcon />
                      ГВС
                    </span>
                  )}
                  {}
                </Td>
                <Td>{date.toLocaleDateString('ru-RU')}</Td>
                <Td>{count.is_automatic ? 'да' : 'нет'}</Td>
                <Td>{count.initial_values.join()}</Td>
                <Td>{count.address}</Td>
                <Td>
                  {count.description}
                  <DeleteButton
                    className="delete-button"
                    onClick={() => handleDelete(count.id)}
                  >
                    <DeleteIcon />
                  </DeleteButton>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
});

export default CountTable;
