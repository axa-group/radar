import { FORM_END_SUBMIT, FORM_ON_SUBMIT, FORM_SET_ERROR, FORM_SET_FIELDS, FORM_SET_READONLY_FIELDS, FORM_UPDATE_FIELDS } from './Form.constants';
import { formReducer } from './Form.reducer';

import {
  EMAIL,
  MSG_REQUIRED,
  PASSWORD,
} from '../constants';

const initState = {
  fields: {
    [EMAIL]: { name: EMAIL, label: EMAIL, value: '', message: MSG_REQUIRED, type: 'text' },
    [PASSWORD]: { name: PASSWORD, label: PASSWORD, value: '', message: MSG_REQUIRED, type: 'pass'},
  },
  error: null,
  hasSubmit: false,
  loading: false,
};

const rules = {
  [EMAIL]:{
    required: {
      message: MSG_REQUIRED,
    }
  },
  [PASSWORD]: {
    required: {
      message: MSG_REQUIRED,
    }
  },
};

describe('login reducer state', () => {
  test('default action returns state', () => {
    const newState = formReducer(initState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toBe(initState);
  });

  test('update fields action', () => {
    const event = {
      target: {
        name: EMAIL,
        value: 'test',
        message: MSG_REQUIRED,
      }
    };
    const newState = formReducer(initState, { event, rules, type: FORM_UPDATE_FIELDS });
    expect(newState).toEqual({ ...initState, ...newState });
  });

  test('set error action', () => {
    const error = 'Error';
    const newState = formReducer(initState, { error, type: FORM_SET_ERROR });
    expect(newState.error).toEqual(error);
  });

  test('set fields action', () => {
    const fields = {
      [EMAIL]: { name: EMAIL, label: EMAIL, value: 'email', message: MSG_REQUIRED, type: 'text' },
      [PASSWORD]: { name: PASSWORD, label: PASSWORD, value: 'pass', message: MSG_REQUIRED, type: 'pass'},
    };
    const newState = formReducer(initState, {fields, type: FORM_SET_FIELDS});
    expect(newState.fields).toEqual(fields);
  });

  test('set readOnlyFields action', () => {
    const fields = {
      [EMAIL]: { name: EMAIL, label: EMAIL, value: 'email', message: MSG_REQUIRED, type: 'text' },
      [PASSWORD]: { name: PASSWORD, label: PASSWORD, value: 'pass', message: MSG_REQUIRED, type: 'pass'},
    };
    const newState = formReducer(initState, {readOnlyFields: fields, type: FORM_SET_READONLY_FIELDS});
    expect(newState.readOnlyFields).toEqual(fields);
  });

  test('on submit action', () => {
    const newState = formReducer(initState, { type: FORM_ON_SUBMIT });
    expect(newState.error).toEqual(null);
    expect(newState.hasSubmit).toBeTruthy();
    expect(newState.loading).toBeTruthy();
  });

  test('end submit action', () => {
    const newState = formReducer(initState, { type: FORM_END_SUBMIT });
    expect(newState.loading).toBeFalsy();
  });
});
