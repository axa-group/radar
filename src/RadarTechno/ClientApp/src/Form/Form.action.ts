import { RouteComponentProps } from 'react-router-dom';
import { IFormFields, ILoginFields } from '../types';
import { FORM_END_SUBMIT, FORM_ON_SUBMIT, FORM_SET_ERROR, FORM_SET_FIELDS, FORM_SET_READONLY_FIELDS, FORM_UPDATE_FIELDS } from './Form.constants';
import { IAction, IState } from './Form.reducer';

export const initializeState = (fields: IFormFields) => ({
  fields,
  error: null,
  hasSubmit: false,
  loading: false,
});

export const handleChange = (event, rules) => ({ event, rules, type: FORM_UPDATE_FIELDS });

const errorList = (fields: ILoginFields) =>
  Object.keys(fields).filter(key => setErrorMessage(key)(fields));

const setErrorMessage = (key: string) => (fields: ILoginFields) => fields[key].message !== null;

export const handleSubmit = (
  submitAsync: (...args: any[]) => any,
  responseCallback : (...args: any[]) => any
) => async (
  dispatch: (...args: any[]) => any,
  getState: (...args: any[]) => any,
) => {

  dispatch({ type: FORM_ON_SUBMIT });
  const state = getState();
  const errors = errorList(state.fields);

  if (!errors.length) {
    let response;
    if(state.readOnlyFields) {
      if(state.fields !== state.readOnlyFields) {
        response = await submitAsync(state.fields, state.readOnlyFields);
      }
    }
    else {
      response = await submitAsync(state.fields);
    }
    if (response) {
      if(response.message) {
        dispatch({ type: FORM_SET_ERROR, error: response.message });
      } else {
        responseCallback(response);
      }
    }
  }
  dispatch({ type: FORM_END_SUBMIT });
};

export const afterSubmitRedirect = (history: RouteComponentProps) => (path: string) => (response: any) => {
  if(response) {
    history.push(path);
  }
};

export const setSuggestions = (getSuggestions: (...args: any[]) => any, field: string, label: string, value: string) => 
  async(dispatch: (action: IAction) => void, getState: (...args: any[]) => IState) => {
  const { fields } = getState();
  const suggestions = await getSuggestions();
  const newFields = fields;
  suggestions.map(suggestion => {
    newFields[field].options.push({value: suggestion[value], label: suggestion[label], clearableValue: false});
  });
  dispatch({fields: newFields, type: FORM_SET_FIELDS});
};

export const initReadOnlyFields = (fields: IFormFields) => 
  (dispatch: (action: IAction) => void) => {
  dispatch({type: FORM_SET_READONLY_FIELDS, readOnlyFields: fields});
  dispatch({fields, type: FORM_SET_FIELDS});
};
