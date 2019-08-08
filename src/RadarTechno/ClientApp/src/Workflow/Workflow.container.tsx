import React, { useContext, useEffect, useState } from 'react';
import { customFetchWithUser } from '../customFetch';
import { getEntity } from '../Entity';
import { EnvironmentContext } from '../Environment';
import { UserContext } from '../User';
import { Workflow } from './Workflow';

export const EnhancedWorkflow = () => {
  
  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;
  const [state, setState] = useState({loading: true, url: null});

  useEffect(() => {
    setState({url: null, loading: true});
    getEntity(customFetchWithUser(fetch)(apiUrl)(currentUser))(currentUser.entity.id)
      .then(entity => setState({url: entity.workflowUrl, loading: false}));
  }, []);

  return(
    <Workflow {...state} />
  );
};
