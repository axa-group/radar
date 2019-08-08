import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { MemoryRouter, Switch } from 'react-router-dom';

import { EnvironmentContext } from '../../Environment';
import { ICurrentUser } from '../../types';
import { UserContext } from '../../User';
import Routes from './Routes';

configure({ adapter: new Adapter() });

describe('Routes test', () => {
  test('Routes with user renders without crashing', () => {    
    const user: ICurrentUser = {
      email: 'email',
      entity: {
        id:'5a4e2821a111b016c4cc5804',
        name:'AXA France',
        adminList:['Test@axa.fr'],
        technologies: null,
        version:0,
      },
      id: 'id',
      token: 'token'
    };
    const Component = () => (
      <MemoryRouter initialEntries={['/']} keyLength={0}>
        <EnvironmentContext.Provider value={{apiUrl: ''}}>
          <UserContext.Provider value={{currentUser: user}}>
            <Routes />
          </UserContext.Provider>
        </EnvironmentContext.Provider>
      </MemoryRouter>
    );
    const wrapper  = mount(<Component />);

    expect(wrapper.find(Switch)).toHaveLength(1);
  });
});
