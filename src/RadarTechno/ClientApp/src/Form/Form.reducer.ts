import { genericHandleChange } from '../generic/validation';
import { IFormFields } from '../types';
import { FORM_END_SUBMIT,
  FORM_ON_SUBMIT,
  FORM_SET_ERROR,
  FORM_SET_FIELDS,
  FORM_SET_READONLY_FIELDS,
  FORM_UPDATE_FIELDS, } from './Form.constants';

export interface IState {
  error: string;
  fields: IFormFields;
  readOnlyFields?: IFormFields;
  hasSubmit: boolean;
  loading: boolean;
}

export interface IAction {
  type: string;
  error?: string;
  event?: any;
  fields?: IFormFields;
  readOnlyFields?: IFormFields;
  hasSubmit?: boolean;
  loading?: boolean;
  rules?: any;
}

export const formReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case FORM_ON_SUBMIT:
      return {
        ...state,
        error: null,
        hasSubmit: true,
        loading: true,
      };
    case FORM_END_SUBMIT:
      return { ...state, loading: false };
    case FORM_SET_ERROR:
      return { ...state, error: action.error };
    case FORM_SET_FIELDS:
      return { ...state, fields: action.fields};
    case FORM_SET_READONLY_FIELDS:
      return {...state, readOnlyFields: action.readOnlyFields};
    case FORM_UPDATE_FIELDS:
      const newFields = genericHandleChange(action.rules, state.fields, action.event);
      return { ...state, fields: newFields };
    default:
      return state;
  }
};
