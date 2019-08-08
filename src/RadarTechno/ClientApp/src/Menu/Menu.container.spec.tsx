import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { EnvironmentContext } from '../Environment';
import { ICurrentUser } from '../types';
import { UserContext } from '../User';
import { Menu } from './Menu';
import { EnhancedMenu } from './Menu.container';

configure({ adapter: new Adapter() });

describe('Menu container test', () => {
  test('Menu container renders without crashing', () => {
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
      token: 'token',
      role: 'root'
    };
    const Component = () => (
      <MemoryRouter>
        <EnvironmentContext.Provider value={{apiUrl: ''}}>
          <UserContext.Provider value={{currentUser: user}}>
            <EnhancedMenu />
          </UserContext.Provider>
        </EnvironmentContext.Provider>
      </MemoryRouter>
    );
    const wrapper = mount(<Component />);
    expect(wrapper.find(Menu)).toHaveLength(1);
  });
});
