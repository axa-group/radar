import { Loader } from '@axa-fr/react-toolkit-all';
import React, { useContext, useEffect } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import { customFetch } from '../customFetch';
import { EnvironmentContext } from '../Environment';
import logMiddleware from '../logMiddleware';
import Storage from '../Storage';
import { verifyToken } from './User.action';
import { initState, userReducer } from './User.reducer';
import { validateToken } from './User.service';

export const UserContext = React.createContext(null);

export const UserProvider = (props) => {

  const apiUrl = useContext(EnvironmentContext).apiUrl;
  const [state, dispatch] = useEnhancedReducer(userReducer, initState, [
    thunkMiddleware,
    logMiddleware,
  ]);

  useEffect(() => {
    dispatch(verifyToken(validateToken(customFetch(fetch)(apiUrl)))(Storage));
  }, []);

  return (
    <>
    {state.loading ? <Loader text="Loading ..." mode="get"/> :
      <UserContext.Provider value={{ dispatch, currentUser: state.currentUser }}>
        {props.children}
      </UserContext.Provider>
    }
    </>
  );
};
