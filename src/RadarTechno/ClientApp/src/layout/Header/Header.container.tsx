import React, { useContext } from 'react';

import Storage from '../../Storage';
import { UserContext } from '../../User';
import { toggleDarkTheme } from '../Theme/Theme.action';
import { ThemeContext } from '../Theme/Theme.provider';
import HeaderApp from './Header';
import { onLogout } from './Header.action';

export const EnhancedHeader = () => {
  
  const { currentUser } = useContext(UserContext);
  const { state, dispatch } = useContext(ThemeContext);
  const actionOnToggleTheme = () => toggleDarkTheme(state, dispatch, Storage);

  return (
    <HeaderApp 
      user={currentUser} 
      onLogout={() => onLogout(Storage)} 
      toggleTheme={actionOnToggleTheme} />
  );
};
