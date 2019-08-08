import { Action } from '@axa-fr/react-toolkit-all';
import React, { useContext, useEffect } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import { MSG_REQUIRED } from '../constants';
import { customFetchWithUser } from '../customFetch';
import { EnvironmentContext } from '../Environment';
import { afterSubmitRedirect, Form, formReducer, handleChange, handleSubmit, initializeState, setSuggestions } from '../Form';
import logMiddleware from '../logMiddleware';
import { getTechnologiesNotInEntity } from '../Technology';
import { SCOPE, STATUS, StatusOptions, TECHNOLOGY } from '../Technology/Technology.constants';
import { UserContext } from '../User';
import { rules } from './AddTechnology.validation.rules';
import { TECHNOLOGY_URLS } from './Entity.constants';
import { addTechnologyToEntity } from './Entity.service';

import '../generic/FormView.scss';

export const AddTechnology = (props) => {

  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;

  const fields = {
    [TECHNOLOGY]: { name: TECHNOLOGY, label: 'Technology *', value: '', message: MSG_REQUIRED, type: 'multi-select', options: [] },
    [STATUS] : { name: STATUS, label: 'Status *', value: '', message: MSG_REQUIRED, type: 'select', options: StatusOptions},
    [SCOPE] : { name: SCOPE, label: 'Scope', value: '', message: null, type: 'textarea'},
    [TECHNOLOGY_URLS] : { name: TECHNOLOGY_URLS, label: 'Useful links', 
      values: [], message: null, type: 'multi-urls-inputs'}
  };

  const initState = initializeState(fields);

  const [state, dispatch] = useEnhancedReducer(formReducer, initState, [
    thunkMiddleware,
    logMiddleware,
  ]);

  useEffect(() => {
    dispatch(setSuggestions(
      getTechnologiesNotInEntity(customFetchWithUser(fetch)(apiUrl)(currentUser))(currentUser.entity.id), 
      TECHNOLOGY, 'name', 'id'));
  }, []);

  const actionOnChange = (event) => dispatch(handleChange(event, rules));

  const actionOnMultiUrlsAdd = () => {
    const values = state.fields[TECHNOLOGY_URLS].values;
    const newUrl = {label: '', url: ''};
    values.push(newUrl);
    actionOnChange({values, name: TECHNOLOGY_URLS});
  };

  const actionOnMultiUrlsRemove = (index: number) => {
    const values = state.fields[TECHNOLOGY_URLS].values;
    values.splice(index, 1);
    actionOnChange({values, name: TECHNOLOGY_URLS});
  };

  return (
    <div className="container">
      <div className="radar-form__header">
        <Action 
          id="previous" 
          icon="arrow-left"
          classModifier="reverse hasiconLeft" 
          onClick={() => props.history.goBack()} />
        <h2 className="af-subtitle">Add a technology to {currentUser.entity.name}</h2>
      </div>
      <Form
        {...state}
        title={`Add a technology to ${currentUser.entity.name}`}
        onChange={actionOnChange}
        onSubmit={() => dispatch(handleSubmit(
          addTechnologyToEntity(customFetchWithUser(fetch)(apiUrl)(currentUser))(currentUser.entity.id), 
          afterSubmitRedirect(props.history)('/technologies')
        ))}
        onMultiUrlsAdd={actionOnMultiUrlsAdd}
        onMultiUrlsRemove={actionOnMultiUrlsRemove}
      />
    </div>
  );
};
