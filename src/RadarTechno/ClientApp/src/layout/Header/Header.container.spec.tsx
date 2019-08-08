import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { ICurrentUser } from '../../types';
import { UserContext } from '../../User';
import { ThemeContext } from '../Theme/Theme.provider';
import HeaderApp from './Header';
import { EnhancedHeader } from './Header.container';

configure({ adapter: new Adapter() });

describe('Header container test', () => {
  test('Header container renders without crashing', () => {
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
      <ThemeContext.Provider value={{state: {darkTheme: false}, dispatch: jest.fn()}}>
        <UserContext.Provider value={{currentUser: user}}>
          <EnhancedHeader />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
    const wrapper  = mount(<Component />);

    expect(wrapper.find(HeaderApp).props().user).toEqual(user);
  });
});
