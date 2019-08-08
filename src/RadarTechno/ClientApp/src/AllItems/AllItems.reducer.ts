import { dataTableReducer, IAction as TableAction, IState as TableState } from '../DataTable';
import { formReducer, IAction as FormAction, IState as FormState} from '../Form';
import { CLOSE_MODAL, EDIT_ITEM, VIEW_ITEM, VIEW_ITEM_HISTORY } from './AllItems.constants';

export interface IState extends TableState, FormState {
  isOpen: boolean;
  isEdit: boolean;
  isHistory: boolean;
  item: object;
}

export interface IAction extends TableAction, FormAction {
  item?: object;
}

export const allItemsReducer = (state: IState, action: IAction) => {
  if(action.type.startsWith('TABLE_')) {
    return {
      ...state,
      ...dataTableReducer(state, action)
    };
  }
  if(action.type.startsWith('FORM_')) {
    return {
      ...state,
      ...formReducer(state, action)
    };
  }
  switch(action.type) {
    case VIEW_ITEM:
      return {...state, item: action.item, isOpen: true, isEdit: false, isHistory: false};
    case VIEW_ITEM_HISTORY:
      return {...state, item: action.item, isOpen: false, isEdit: false, isHistory: true};
    case EDIT_ITEM:
      return {...state, item: action.item, isOpen: false, isEdit: true, isHistory: false};
    case CLOSE_MODAL:
      return {...state, isOpen: false, isEdit: false, isHistory: false};
    default:
      return state;
  }
};
