import { Loader } from '@axa-fr/react-toolkit-all';
import React, { createContext, useEffect, useState } from 'react';

import { getEnvironmentData } from './Environment.action';

export const EnvironmentContext = createContext(null);

export const EnvironmentProvider = (props) => {
  const [state, setState] = useState({environment: null, loading: true});

  useEffect(() => {
    getEnvironmentData(process.env.NODE_ENV, fetch).then(data => {
      if (data.apiUrl) {
        setState({environment: data, loading: false});
      }
    });
  }, []);

  return (
    <>
    {state.loading ? <Loader text="Loading ..." mode="get"/> :
      <EnvironmentContext.Provider value={state.environment}>
        {props.children}
      </EnvironmentContext.Provider>
    }
    </>
  );
};
