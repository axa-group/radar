import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { UserContext } from '../../User';
import { PublicRoute } from './PublicRoute';

configure({ adapter: new Adapter() });

describe('Public route test', () => {
  test('Public route without user renders without crashing', () => {
    const ChildComponent = () => (<div />);
    const Component = () => (
      <MemoryRouter initialEntries={['/']} keyLength={0}>
        <UserContext.Provider value={{currentUser: null}}>
          <PublicRoute component={ChildComponent} />
        </UserContext.Provider>
      </MemoryRouter>
    );
    const wrapper  = mount(<Component />);

    expect(wrapper.find(ChildComponent)).toHaveLength(1);
  });
});
