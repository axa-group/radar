import React, { createContext, useEffect, useState } from 'react';

import { customFetch } from '../customFetch';
import { getConfigurationAsync } from './Configuration.service';

export const ConfigurationContext = createContext(null);

export const useConfigurationPure = (iUseState, iUseEffect, iGetConfigurationAsync) => ()  =>  {
    const [state, setState] = iUseState({ configuration: { version: null, loading: true }});
    iUseEffect(() => {
        iGetConfigurationAsync().then(data => {
            setState({ configuration: { version: data.version, loading: false } });
        });
    }, []);
    return state;
};

const useConfiguration = useConfigurationPure(useState, useEffect, getConfigurationAsync(customFetch(fetch)('/api/{path}')));

export const ConfigurationProvider = ({ children }) => {
    const state = useConfiguration();
    return (
    <>
      {<ConfigurationContext.Provider value={state.configuration}>{children}</ConfigurationContext.Provider>}
    </>
  );
};
