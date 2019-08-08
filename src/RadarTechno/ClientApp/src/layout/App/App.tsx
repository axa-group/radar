import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { EnvironmentProvider } from '../../Environment';
import { EnhancedMenu } from '../../Menu';
import { UserProvider } from '../../User/User.provider';
import Footer from '../Footer';
import { EnhancedHeader } from '../Header';
import Routes from '../Routes';
import { ThemeProvider } from '../Theme/Theme.provider';

import '../Theme/Colors.scss';
import './App.scss';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <EnvironmentProvider>
          <UserProvider>
            <>
              <EnhancedHeader />
              <EnhancedMenu />
              <Routes />
              <Footer />
            </>
          </UserProvider>
        </EnvironmentProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
