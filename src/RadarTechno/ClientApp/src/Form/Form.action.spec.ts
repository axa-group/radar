import { EMAIL, MSG_REQUIRED, PASSWORD } from '../constants';
import { ADMINLIST, NAME } from '../Entity/Entity.constants';
import { afterSubmitRedirect, handleChange, handleSubmit, initializeState, initReadOnlyFields, setSuggestions } from './Form.action';
import { FORM_END_SUBMIT, FORM_ON_SUBMIT, FORM_SET_ERROR, FORM_SET_FIELDS, FORM_SET_READONLY_FIELDS, FORM_UPDATE_FIELDS } from './Form.constants';

const fakeEntities = [{
  id:'5a4e2821a111b016c4cc5804',
  name:'AXA France',
  adminList:['Test@axa.fr'],
  technologies: [{ technologyId: '5823926b69170e15d895fda7', status: 'Excel' }],
  version:0,
}];

const fakeUser = {
  id:'1',
  email:'Test',
  entity: fakeEntities[0],
  token:'token',
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

describe('form action', () => {
  test('initializeState returns state with fields', () => {
    const fields = {
      [EMAIL]: { name: EMAIL, label: EMAIL, value: '', message: MSG_REQUIRED, type: 'text' },
      [PASSWORD]: { name: PASSWORD, label: PASSWORD, value: '', message: MSG_REQUIRED, type: 'pass'},
    };
    const expectedState = {
      fields,
      error: null,
      hasSubmit: false,
      loading: false,
    };
    expect(initializeState(fields)).toEqual(expectedState);
  });

  test('handleChange returns UPDATE_FIELDS action', () => {
    const event = {};
    const actual = handleChange(event, rules);
    expect(actual.type).toBe(FORM_UPDATE_FIELDS);
    expect(actual.event).toBe(event);
  });

  test('handleSubmit', async() => {
    const fakeAuthenticateUser = () => {
      return fakeUser;
    };
    const getState = () => {
      return {
        fields:{
          [EMAIL]:{
            name: 'Email',
            value:'Test',
            message: null,
          },
          [PASSWORD]:{
            name: 'Password',
            value:'Test',
            message: null,
          },
        },
      };
    };

    const dispatch = jest.fn();
    const userDispatch = jest.fn();

    await handleSubmit(fakeAuthenticateUser, userDispatch)(dispatch, getState);

    expect(dispatch.mock.calls[0][0]).toEqual({ type: FORM_ON_SUBMIT });
    expect(dispatch.mock.calls[1][0]).toEqual({ type: FORM_END_SUBMIT });
    expect(userDispatch).toBeCalled();
  });


  test('handleSubmit with readOnlyFields', async() => {
    const fakeAuthenticateUser = jest.fn();
    fakeAuthenticateUser.mockReturnValue(fakeUser);
    const getState = () => {
      return {
        fields:{
          [EMAIL]:{
            name: 'Email',
            value:'Test',
            message: null,
          },
          [PASSWORD]:{
            name: 'Password',
            value:'Test',
            message: null,
          },
        },
        readOnlyFields:{
          [EMAIL]:{
            name: 'Email',
            value:'Test',
            message: null,
          },
          [PASSWORD]:{
            name: 'Password',
            value:'Test',
            message: null,
          },
        },
      };
    };

    const dispatch = jest.fn();
    const userDispatch = jest.fn();

    await handleSubmit(fakeAuthenticateUser, userDispatch)(dispatch, getState);

    expect(dispatch.mock.calls[0][0]).toEqual({ type: FORM_ON_SUBMIT });
    expect(dispatch.mock.calls[1][0]).toEqual({ type: FORM_END_SUBMIT });
    expect(fakeAuthenticateUser.mock.calls[0][0]).toEqual(getState().fields);
    expect(fakeAuthenticateUser.mock.calls[0][1]).toEqual(getState().readOnlyFields);
    expect(userDispatch).toBeCalled();
  });

  test('handleSubmit field error', async () => {
    const fakeAuthenticateUser = () => {
      return fakeUser;
    };
    const dispatch = jest.fn();
    const userDispatch = jest.fn();
    const getState = () => {
      return {
        fields:{
          [EMAIL]:{
            name: 'Email',
            value:'Test',
            message: 'ERROR',
          },
          [PASSWORD]:{
            name: 'Password',
            value:'Test',
            message: null,
          },
        },
      };
    };

    await handleSubmit(fakeAuthenticateUser,userDispatch)(dispatch, getState);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: FORM_ON_SUBMIT });
    expect(dispatch.mock.calls[1][0]).toEqual({ type: FORM_END_SUBMIT });
    expect(userDispatch).toBeCalledTimes(0);
  });

  test('handleSubmit api response error', async() => {
    const fakeAuthenticateUser = () => {
      return { message: 'ERROR' };
    };
    const dispatch = jest.fn();
    const userDispatch = jest.fn();
    const getState = () => {
      return {
        fields:{
          [EMAIL]:{
            name: 'Email',
            value:'Test',
            message: null,
          },
          [PASSWORD]:{
            name: 'Password',
            value:'Test',
            message: null,
          },
        },
      };
    };

    
    await handleSubmit(fakeAuthenticateUser, userDispatch)(dispatch, getState);

    expect(dispatch.mock.calls[0][0]).toEqual({ type: FORM_ON_SUBMIT });
    expect(dispatch.mock.calls[1][0]).toEqual({ type: FORM_SET_ERROR, error: 'ERROR' });
    expect(dispatch.mock.calls[2][0]).toEqual({ type: FORM_END_SUBMIT });
  });

  test('afterSubmitRedirect with response pushes path in history', () => {
    const historyMock = { push: jest.fn() };
    const response = {};
    afterSubmitRedirect(historyMock)('/path')(response);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/path');
  });

  test('afterSubmitRedirect with null response doesn\'t change history', () => {
    const historyMock = { push: jest.fn() };
    const response = null;
    afterSubmitRedirect(historyMock)('/path')(response);
    expect(historyMock.push).toHaveBeenCalledTimes(0);
  });

  test('setSuggestions dispatch SET_FIELD action', async() => {
    const getSuggestions = jest.fn();
    const dispatch = jest.fn();
    const getState = jest.fn();
    const field = ADMINLIST;  
    const label = 'email';
    const value = 'id';

    getState.mockReturnValue({fields :{
      [NAME]: { name: NAME, label: 'Name *', value: '', message: null, type: 'text' },
      [ADMINLIST] : { name: ADMINLIST, label: 'Admin list', values: [], message: null, type: 'multi-select', options: []}
    }});
    getSuggestions.mockReturnValue([{id: 'id', email: 'email'}]);

    await setSuggestions(getSuggestions, field, label, value)(dispatch, getState);
    const expected = {
      [NAME]: { name: NAME, label: 'Name *', value: '', message: null, type: 'text' },
      [ADMINLIST] : { name: ADMINLIST, label: 'Admin list', values: [],
        message: null, type: 'multi-select', options: [{value: 'id', label: 'email', clearableValue: false}]}
    };

    expect(dispatch.mock.calls[0][0]).toEqual({fields: expected, type: FORM_SET_FIELDS});
  });

  test('initReadOnlyFields dispatch SET_READONLY_FIELDS and SET_FIELDS actions', () => {
    const dispatch = jest.fn();
    const fields = {
      [EMAIL]:{
        name: 'Email',
        value:'Test',
        label: 'Email',
        message: 'ERROR',
        type: 'text'
      },
      [PASSWORD]:{
        name: 'Password',
        value:'Test',
        label: 'Password',
        message: null,
        type: 'pass'
      },
    };
    initReadOnlyFields(fields)(dispatch);
    expect(dispatch.mock.calls[0][0]).toEqual({readOnlyFields: fields, type: FORM_SET_READONLY_FIELDS});
    expect(dispatch.mock.calls[1][0]).toEqual({fields, type: FORM_SET_FIELDS});
  });
});
