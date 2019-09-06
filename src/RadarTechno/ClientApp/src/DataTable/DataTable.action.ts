import { IPaging } from '../types';
import { TABLE_SET_ITEMS, TABLE_SORT_ITEMS, TABLE_UPDATE_FILTERS, TABLE_UPDATE_PAGING } from './DataTable.constants';
import { IAction, IState } from './DataTable.reducer';

export const changeFilters = (object: {id: string, name: string, value: string}) => 
  (dispatch: (action: IAction) => void, getState: (...args: any[]) => IState) => {
  const { name, value } = object;
  const { filters } = getState();
  const newFilters = {
    ...filters,
    [name] : value
  };
  dispatch({ type: TABLE_UPDATE_FILTERS, filters: newFilters });
};

export const clearFilter = (key: string) =>
  (dispatch: (action: IAction) => void, getState: (...args: any[]) => IState) => {
  const { filters } = getState();
  const newFilters = filters;
  delete newFilters[key];
  dispatch({ type: TABLE_UPDATE_FILTERS, filters: newFilters });
};

export const changePaging = (paging: IPaging) => 
  (dispatch: (action: IAction) => void) => {
  dispatch({ paging, type: TABLE_UPDATE_PAGING });
};

export const setItems = (
  getItemsAsync: (...args: any[]) => any
) => async(dispatch : (action: IAction) => void) => {
  const action = { type: TABLE_SET_ITEMS, items: [] };
  action.items = await getItemsAsync();
  dispatch(action);
};

export const sortTable = (id: string) => async(dispatch : (action: IAction) => void, getState: () => IState) => {
  const { sort } = getState();
  dispatch({
    type: TABLE_SORT_ITEMS, 
    sort: {
      sortBy: id.replace('-sort', ''), 
      reverse: sort != null ? !sort.reverse : false
    }
  });
};

export const filterTableItems = (items: object[], state: IState) => {
  
  const tablePaging = state.paging;
  let tableItems = items;
  let numberPages = 1;
  if(items && items.length) {
    const { numberItems, page } = tablePaging;
    
    Object.keys(state.filters).forEach(key => {
      if(state.filters[key] && state.filters[key] !== '') {
        tableItems = tableItems.filter(item =>
          item[key] != null && 
            ((item[key].toString().toLowerCase().replace(/\s/g, '')
              .includes(state.filters[key].toString().toLowerCase().replace(/\s/g, '-')))
            || (item[key].toString().toLowerCase()
              .includes(state.filters[key].toString().toLowerCase())))
        );
      }
    });
    if(state.sort != null) {
      const sort = state.sort;
      tableItems.sort((a, b) => {
        const firstElement = a[sort.sortBy];
        const secondElement = b[sort.sortBy];
        if(firstElement > secondElement) {
          return 1;
        } 
        if(firstElement < secondElement) {
          return -1;
        }
        return 0;
      });
      if(sort.reverse) {
        tableItems.reverse();
      }
    }

    numberPages = tableItems.length > numberItems ?
      Math.floor(tableItems.length / numberItems) + (tableItems.length % numberItems ? 1 : 0) : 1;

    if (numberItems * page > tableItems.length 
      && (numberItems * page) - tableItems.length > numberItems) {
      tablePaging.page = 1;
    }

    tableItems = tableItems.slice(
      (tablePaging.page - 1) * tablePaging.numberItems,
      ((tablePaging.page - 1) * tablePaging.numberItems) + tablePaging.numberItems
    );
  }
  return {tableItems, tablePaging, numberPages};
};
