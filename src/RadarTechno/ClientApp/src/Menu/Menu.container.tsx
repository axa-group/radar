import React, { useContext, useEffect } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';
import logMiddleware from '../logMiddleware';
import { UserContext } from '../User';
import { Menu } from './Menu';
import { handleClick, initPosition, setPosition } from './Menu.action';
import { initState, menuReducer } from './Menu.reducer';

export const EnhancedMenu = () => {
  const { currentUser } = useContext(UserContext);
  const [state, dispatch] = useEnhancedReducer(menuReducer, initState, [
    thunkMiddleware,
    logMiddleware,
  ]);

  useEffect(() => {
    dispatch(initPosition());
  }, []);

  return (
    <Menu
      hideMenuButton={currentUser == null}
      handleClick={() => dispatch(handleClick())}
      user={currentUser}
      isMenuVisible={state.visible}
      position={state.position}
      updatePosition={(position: number) => dispatch(setPosition(position))}
    />
  );
};
