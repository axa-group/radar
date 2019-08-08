import { initState } from '../DataTable';
import { initializeState } from '../Form';
import { IFormFields } from '../types';
import { CLOSE_MODAL, EDIT_ITEM, VIEW_ITEM, VIEW_ITEM_HISTORY } from './AllItems.constants';
import { IAction } from './AllItems.reducer';

export const initializeAllItemsState = (fields: IFormFields) => {
  return {
    ...initializeState(fields),
    ...initState,
    loading: true,
    item: null,
    isOpen: false,
    isEdit: false,
    isHistory: false
  };
};

export const closeModal = () => (dispatch: (action: IAction) => void) => {
  dispatch({type: CLOSE_MODAL});
};

export const viewItem = (item: object) => (dispatch: (action: IAction) => void) => {
  dispatch({item, type: VIEW_ITEM});
};

export const viewItemHistory = (item: object) => (dispatch: (action: IAction) => void) => {
  dispatch({item, type: VIEW_ITEM_HISTORY});
};

export const editItem = (item: object) => (dispatch: (action: IAction) => void) => {
  dispatch({item, type: EDIT_ITEM});  
};
