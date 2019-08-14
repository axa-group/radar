import { Button, Loader, Paging, Table, Text } from '@axa-fr/react-toolkit-all';
import React from 'react';
import { dateObjectToString } from '../generic/dateStringHandler';
import { IPaging } from '../types';
import './DataTable.scss';
import { ISort } from './Sort';

export const DataTable = ({
  clearFilter,
  filters,
  hasEdit,
  hasHistory,
  keys,
  items,
  loading,
  numberPages,
  onChange,
  onFilterChange,
  onSort,
  onView,
  onEdit,
  onHistory,
  paging,
  sort
}: {
  clearFilter: (key: string) => void,
  filters: object[],
  hasEdit: boolean,
  hasHistory: boolean,
  keys: string[],
  items: object[],
  loading: boolean,
  numberPages: number,
  onChange:  (paging: IPaging) => (items: object[], paging: IPaging) => void,
  onFilterChange: (object: {id: string, name: string, value: string}) => void,
  onSort: (...args: any[]) => any,
  onView: (...args: any[]) => any,
  onEdit: (...args: any[]) => any,
  onHistory: (...args: any[]) => any,
  paging: IPaging,
  sort: ISort
}) => {
  return (
    <Loader text="Loading ..." mode={loading ? 'get' : 'none'}>
    {!loading && items &&
    <>
      <Table>
        <Table.Header>
          <Table.Tr>
            {keys.map(k => (
              <Table.Th className="af-table__th af-table__th--radar af-table__th-sortable" key={k}>
                <span className="af-table__th-content">
                  <Button id={`${k}-sort`} className="af-btn af-btn--table-sorting" onClick={(event) => onSort(event.id)}>
                    <div className="af-table__th-button-text">
                      <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                      {sort && sort.sortBy === k ? 
                        <div className={`glyphicon ${sort.reverse ? 'glyphicon-arrow-xs-up' : 'glyphicon-arrow-xs-down'}`}/>
                        : <div className="glyphicon glyphicon-sorting" />}
                    </div>  
                    <div className="af-table__th-filter af-form__text-wrapper">
                      <Text
                        id={`${k}-filter`}
                        name={k}
                        onChange={onFilterChange}
                        value={filters[k]}
                      />
                      <div className="glyphicon glyphicon-close af-form__clear" 
                        role="button" onClick={() => clearFilter(k)} />
                    </div>
                  </Button >
                </span>
              </Table.Th>
            ))}
            <Table.Th className="af-table__th af-table__th--radar">
              <span className="af-table__th-content">Actions</span>
            </Table.Th>
          </Table.Tr>
        </Table.Header>
        <Table.Body>
          {(!Array.isArray(items) || items.length === 0) && (
            <Table.Tr>
              <Table.Td className="af-table--empty" colSpan={keys.length + 1}>
                <div>The list is empty</div>
              </Table.Td>
            </Table.Tr>            
          )}
          {Array.isArray(items) && items.map((item, index) => (
            <Table.Tr key={`item_${index}`}>
              {keys.map(k => (
                <Table.Td key={`item_${index}_${k}`}>
                  {item[k] ? dateObjectToString(item[k]) : ''}
                </Table.Td>
              ))}
              <Table.Td>
                <div className="af-btn--group af-btn--table-action-group">
                  {hasHistory && <button className="btn af-btn--circle af-btn--circle-reverse af-btn--table-action" 
                    onClick={() => onHistory(item)} role="button">
                    <i className="glyphicon glyphicon-time" />
                  </button> }
                  {hasEdit && <button className="btn af-btn--circle af-btn--circle-reverse af-btn--table-action" 
                    onClick={() => onEdit(item)} role="button">
                    <i className="glyphicon glyphicon-edit" />
                  </button> }
                  <button className="btn af-btn--circle af-btn--circle-reverse af-btn--table-action"
                    onClick={() => onView(item)} role="button">
                    <i className="glyphicon glyphicon-eye-open" />
                  </button> 
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
      <Paging
        id="tablePaging"
        onChange={onChange}
        numberItems={paging.numberItems}
        numberPages={numberPages}
        currentPage={paging.page}
      />
    </>}
    </Loader>
  );
};
