import { Action } from '@axa-fr/react-toolkit-all';
import React, { useContext, useEffect } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import { MSG_REQUIRED } from '../constants';
import { customFetchWithUser } from '../customFetch';
import { getEntities } from '../Entity';
import { EnvironmentContext } from '../Environment';
import { afterSubmitRedirect, Form, formReducer, handleChange, handleSubmit, initializeState, setSuggestions } from '../Form';
import logMiddleware from '../logMiddleware';
import { UserContext } from '../User';
import { rules } from './NewUser.validation.rules';
import { EMAIL, ENTITY, NAME, PASSWORD, ROLE, roleOptions } from './User.constants';
import { addUser } from './User.service';

import '../generic/FormView.scss';

export const NewUser = (props) => {

  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;

  const fields = {
    [NAME]: {name: NAME, label: 'Name', value: '', message: null, type: 'text' },
    [EMAIL]: { name: EMAIL, label: 'Email *', value: '', message: MSG_REQUIRED, type: 'text' },
    [PASSWORD]: { name: PASSWORD, label: 'Password *', value: '', message: MSG_REQUIRED, type: 'pass' },
    [ROLE]: { name: ROLE, label: 'Role *', value: '', message: MSG_REQUIRED, type: 'select', options: roleOptions },
    [ENTITY]: { 
      name: ENTITY, label: 'Entity *', value: '', message: MSG_REQUIRED, type: 'select', options: [], disabled: false
    },
  };

  const initState = initializeState(fields);

  const [state, dispatch] = useEnhancedReducer(formReducer, initState, [
    thunkMiddleware,
    logMiddleware,
  ]);

  useEffect(() => {
    dispatch(setSuggestions(getEntities(customFetchWithUser(fetch)(apiUrl)(currentUser)), ENTITY, 'name', 'id'));   
    if(currentUser.role === 'admin') {
      fields[ENTITY] = {
        ...fields[ENTITY],
        value: currentUser.entity.id,
        message: null,
        disabled: true
      };
      fields[ROLE].options = [      
        {value: 'user', label: 'User'},
        {value: 'admin', label: 'Admin'},
      ];
    }
  }, []);

  return (
    <div className="container">
      <div className="radar-form__header">
        <Action 
          id="previous" 
          icon="arrow-left"
          classModifier="reverse hasiconLeft" 
          onClick={() => props.history.goBack()} />
        <h2 className="af-subtitle">New User</h2>
      </div>
      <Form
        {...state}
        title="New User"
        onChange={(event) => dispatch(handleChange(event, rules))}
        onSubmit={() => dispatch(handleSubmit(
          addUser(customFetchWithUser(fetch)(apiUrl)(currentUser)), 
          afterSubmitRedirect(props.history)('/users')
        ))}
      />
    </div>
  );
};
