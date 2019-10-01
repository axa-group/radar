import React, { createContext, useEffect, useState } from 'react';

import { customFetch } from '../customFetch';
import { getConfigurationAsync } from './Configuration.service';

export const ConfigurationContext = createContext(null);

export const ConfigurationProvider = ({ children }) => {
    const [state, setState] = useState({ configuration: { version: null, loading: true }});
  useEffect(() => {
      getConfigurationAsync(customFetch(fetch)('/api/{path}'))().then(data => {
          setState({ configuration: { version: data.version, loading: false } });
    });
  }, []);

  return (
    <>
      {<ConfigurationContext.Provider value={state.configuration}>{children}</ConfigurationContext.Provider>}
    </>
  );
};
