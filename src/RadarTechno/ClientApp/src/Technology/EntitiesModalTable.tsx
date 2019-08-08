import { Table } from '@axa-fr/react-toolkit-all';
import React from 'react';

import { IEntitiesStatus } from './Technology';

export const EntitiesModalTable = ({
  entitiesStatus,
  groupStatus
}: {
  entitiesStatus: IEntitiesStatus[], 
  groupStatus: string
}) => (
  <div className="radar-restitution__table">
    {entitiesStatus && entitiesStatus.length && <Table>
      <Table.Header>
        <Table.Tr>
          <Table.Th>Entity</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Header>
      <Table.Body>
        <Table.Tr>
          <Table.Td>Group status</Table.Td>
          <Table.Td>{groupStatus ? groupStatus : 'No recommendation'}</Table.Td>
        </Table.Tr>
        {entitiesStatus.map(entityStatus => (
        <Table.Tr  key={`${entityStatus.entityId}`}>
          <Table.Td key={`${entityStatus.entityId}-name`}>{entityStatus.entityName}</Table.Td>
          <Table.Td key={`${entityStatus.entityId}-status`}>{entityStatus.status}</Table.Td>
        </Table.Tr>
        ))}
      </Table.Body>
    </Table>}
  </div>
);
