import React from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';
import { changeFilters, changePaging, DataTable, dataTableReducer, initState } from '../DataTable';
import logMiddleware from '../logMiddleware';
import { IPaging } from '../types';
import { clearFilter, filterTableItems, sortTable } from './DataTable.action';

export const EnhancedDataTable = (props) => {

  const [state, dispatch] = useEnhancedReducer(
    dataTableReducer,
    initState,
    [thunkMiddleware, logMiddleware],
  );
  
  const {tableItems, tablePaging, numberPages} = filterTableItems(props.items, state);

  return (
    <DataTable 
      {...props}
      filters={state.filters}
      items={tableItems}
      numberPages={numberPages}
      paging={tablePaging}
      clearFilter={(key: string) => dispatch(clearFilter(key))}
      onChange={(paging: IPaging) => dispatch(changePaging(paging))} 
      onFilterChange={(object) => dispatch(changeFilters(object))}
      onSort={(id) => dispatch(sortTable(id))} 
      sort={state.sort} />
  );
};
