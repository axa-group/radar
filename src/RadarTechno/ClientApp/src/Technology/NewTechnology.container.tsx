import { Action } from '@axa-fr/react-toolkit-all';
import React, { useContext } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import { MSG_REQUIRED } from '../constants';
import { customFetchWithUser } from '../customFetch';
import { EnvironmentContext } from '../Environment';
import { afterSubmitRedirect, Form, formReducer, handleChange, handleSubmit, initializeState } from '../Form';
import logMiddleware from '../logMiddleware';
import { UserContext } from '../User';
import { rules } from './NewTechnology.validation.rules';
import { CATEGORY, CategoryOptions, DESCRIPTION, NAME, SCOPE } from './Technology.constants';
import { addTechnology } from './Technology.service';

import '../generic/FormView.scss';

export const NewTechnology = (props) => {

  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;

  const fields = {
    [NAME]: { name: NAME, label: 'Name *', value: '', message: MSG_REQUIRED, type: 'text' },
    [CATEGORY]: { name: CATEGORY, label: 'Category *', value: '', message: MSG_REQUIRED, type: 'select', options: CategoryOptions},
    [DESCRIPTION]: { name: DESCRIPTION, label: 'Description', value: '', message: null, type: 'textarea' },
    [SCOPE]: { name: SCOPE, label: 'Scope and usage restriction', value: '', message: null, type: 'textarea'},
  };

  const initState = initializeState(fields);

  const [state, dispatch] = useEnhancedReducer(formReducer, initState, [
    thunkMiddleware,
    logMiddleware,
  ]);

  return (
    <div className="container">
      <div className="radar-form__header">
        <Action 
          id="previous" 
          icon="arrow-left"
          classModifier="reverse hasiconLeft" 
          onClick={() => props.history.goBack()} />
        <h2 className="af-subtitle">New Technology</h2>
      </div>
      <Form
        {...state}
        title="New Technology"
        onChange={(event) => dispatch(handleChange(event, rules))}
        onSubmit={() => dispatch(handleSubmit(
          addTechnology(customFetchWithUser(fetch)(apiUrl)(currentUser)), 
          afterSubmitRedirect(props.history)('/all-technologies')
        ))}
      />
    </div>
  );
};
