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
import {  NAME, WORKFLOW_URL } from './Entity.constants';
import { addEntity } from './Entity.service';
import { rules } from './NewEntity.validation.rules';

import '../generic/FormView.scss';

export const NewEntity = (props) => {

  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;

  const fields = {
    [NAME]: { name: NAME, label: 'Name *', value: '', message: MSG_REQUIRED, type: 'text' },
    [WORKFLOW_URL]: { name: WORKFLOW_URL, label: 'Workflow url', value: '', message: null, type: 'text' },
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
        <h2 className="af-subtitle">New Entity</h2>
      </div>
      <Form
        {...state}
        title="New Entity"
        onChange={(event) => dispatch(handleChange(event, rules))}
        onSubmit={() => dispatch(handleSubmit(
          addEntity(customFetchWithUser(fetch)(apiUrl)(currentUser)), 
          afterSubmitRedirect(props.history)('/entities')
        ))}
      />
    </div>
  );
};
