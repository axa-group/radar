import { Loader, Table } from '@axa-fr/react-toolkit-all';
import React from 'react';

import { IFormattedEntityTechnology } from './Entity';

export const TechnologiesModalTable = ( {
  items,
  loading,
}: {
  items: IFormattedEntityTechnology[],
  loading: boolean
}) => (
  <div className="radar-restitution__table">
    <Loader text="Loading ..." mode={loading ? 'get' : 'none'}>
      <Table>
        <Table.Header>
          <Table.Tr>
            <Table.Th>Technology</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
          {!loading && !items.length && (
            <Table.Tr>
              <Table.Td className="af-table--empty" colSpan={2}>
                <div>The list is empty</div>
              </Table.Td>
            </Table.Tr>
          )}
          {items.length > 0 && items.map(item => (
            <Table.Tr  key={`${item.technologyId}`}>
              <Table.Td key={`${item.technologyId}-name`}>{item.name}</Table.Td>
              <Table.Td key={`${item.technologyId}-status`}>{item.status}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </Loader>
  </div>
);
