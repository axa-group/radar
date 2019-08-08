import { Header, Name, User } from '@axa-fr/react-toolkit-all';
import logo from '@axa-fr/react-toolkit-core/dist/assets/logo-axa.svg';
import React from 'react';

import { ICurrentUser } from '../../types';
import './Header.scss';

const HeaderApp = ({ 
  user, 
  onLogout, 
  toggleTheme 
}: {
  user: ICurrentUser, 
  onLogout: (...args: any[]) => any, 
  toggleTheme?: (...args: any[]) => any
}) => (
  <Header>
    <Name
      title="Technology Radar"
      img={logo}
      alt="Axa Logo"
    />
      <div className="radar-header__user">
        {user && (<User
          name={user.email}
          profile={user.entity.name} />
        )}
        <div className="radar-header__logout">
          <a className="af-link af-link--hasIconLeft radar-header__theme-link" href="#" onClick={toggleTheme}>
            <i className="glyphicon glyphicon-adjust" />
            <span className="af-link__text">Change theme</span> 
          </a>
          {user && (
            <a className="af-link af-link--hasIconLeft radar-header__logout-link" href="login" onClick={onLogout}>
              <i className="glyphicon glyphicon-off" />
              <span className="af-link__text">Logout</span> 
            </a>
          )}
        </div>
      </div>
  </Header>
);

export default HeaderApp;
