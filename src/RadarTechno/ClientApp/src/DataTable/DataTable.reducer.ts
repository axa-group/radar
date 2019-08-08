import { IPaging } from '../types';
import {
  TABLE_SET_ITEMS,
  TABLE_SORT_ITEMS,
  TABLE_UPDATE_FILTERS,
  TABLE_UPDATE_PAGING,
} from './DataTable.constants';
import { ISort } from './Sort';

export interface IState {
  keys: string[];
  filters: object;
  items: object[];
  loading: boolean;
  numberPages: number;
  paging: IPaging;
  sort: ISort;
}

export interface IAction {
  type: string;
  filters?: object;
  items?: object[];
  loading?: boolean;
  numberPages?: number;
  paging?: IPaging;
  sort?: ISort;
}

export const initState = {
  keys: null,
  filters: {},
  items: null,
  loading: true,
  numberPages: 1,
  paging: { page: 1, numberItems: 10 },
  title: '',
  sort: null
};

export const dataTableReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case TABLE_SET_ITEMS:
      return {
        ...state,
        items: action.items,
        keys: action.items.length ? Object.keys(action.items.reduce((result, obj) => {
          return Object.assign(result, obj);
        }, {})) : [],
        loading: false,
      };
    case TABLE_SORT_ITEMS: 
      return {
        ...state,
        sort: action.sort
      };
    case TABLE_UPDATE_FILTERS:
      return {
        ...state,
        filters: action.filters
      };
    case TABLE_UPDATE_PAGING:
      return {
        ...state,
        numberPages: action.numberPages,
        paging: action.paging,
      };
    default:
      return state;
  }
};
