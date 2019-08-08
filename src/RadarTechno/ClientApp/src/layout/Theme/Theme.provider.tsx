import React, { createContext, useEffect } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import logMiddleware from '../../logMiddleware';
import Storage from '../../Storage';
import { themeReducer } from './Theme.reducer';

export const ThemeContext = createContext(null);

export const ThemeProvider = (props) => {
  const [state, dispatch] = useEnhancedReducer(
    themeReducer,
    {darkTheme: Storage.getItem('darkTheme') === 'true'},
    [thunkMiddleware,logMiddleware]
  );

  useEffect(() => {
    if(state.darkTheme) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [state]);

  return (
    <ThemeContext.Provider value={{dispatch, state}}>
        {props.children}
    </ThemeContext.Provider>
  );
};
