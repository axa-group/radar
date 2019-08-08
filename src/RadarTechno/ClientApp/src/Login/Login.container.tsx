import React, { useContext } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';
import { customFetch } from '../customFetch';
import { EnvironmentContext } from '../Environment';
import { Form, formReducer, handleChange, handleSubmit, initializeState} from '../Form';
import logMiddleware from '../logMiddleware';
import Storage from '../Storage';
import { UserContext } from '../User';
import { submitCallback } from './Login.action';
import { authenticateUser } from './Login.services';
import { rules } from './Login.validation.rules';

import {
  EMAIL,
  MSG_REQUIRED,
  PASSWORD,
} from '../constants';


const EnhancedLogin = () => {
  
  const initState = initializeState({
    [EMAIL]: { name: EMAIL, label: EMAIL, value: '', message: MSG_REQUIRED, type: 'text' },
    [PASSWORD]: { name: PASSWORD, label: PASSWORD, value: '', message: MSG_REQUIRED, type: 'pass'},
  });

  const userDispatch = useContext(UserContext).dispatch;
  const [state, dispatch] = useEnhancedReducer(formReducer, initState, [
    thunkMiddleware,
    logMiddleware,
  ]);
  const apiUrl = useContext(EnvironmentContext).apiUrl;
  return (
    <div className="container">
      <h2 className="af-subtitle">Login</h2>
      <Form
        disableSubmit={false}
        error={state.error}
        fields={state.fields}
        hasSubmit={state.hasSubmit}
        loading={state.loading}
        onChange={(event) => dispatch(handleChange(event, rules))}
        onSubmit={() => dispatch(handleSubmit(
          authenticateUser(customFetch(fetch)(apiUrl))(Storage), submitCallback(userDispatch)
        ))} />
    </div>
  );
};

export default EnhancedLogin;
