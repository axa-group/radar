import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ICurrentUser } from '../../types';
import { UserContext } from '../../User';
import { RootRoute } from './RootRoute';

configure({ adapter: new Adapter() });

describe('Root route test', () => {
  test('Root route with user renders without crashing', () => {    
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
    const ChildComponent = () => (<div />);
    const Component = () => (
      <MemoryRouter initialEntries={['/']} keyLength={0}>
        <UserContext.Provider value={{currentUser: user}}>
          <RootRoute component={ChildComponent} />
        </UserContext.Provider>
      </MemoryRouter>
    );
    const wrapper  = mount(<Component />);

    expect(wrapper.find(ChildComponent)).toHaveLength(1);
  });
});
