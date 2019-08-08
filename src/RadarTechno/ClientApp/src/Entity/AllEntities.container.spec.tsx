import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { DataTable } from '../DataTable';
import { EnvironmentContext } from '../Environment';
import { ICurrentUser } from '../types';
import { UserContext } from '../User';
import { AllEntities } from './AllEntities.container';

configure({ adapter: new Adapter() });

describe('AllEntities container test', () => {
  test('AllEntities container renders without crashing', () => {
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
      <EnvironmentContext.Provider value={{apiUrl: ''}}>
        <UserContext.Provider value={{currentUser: user}}>
          <AllEntities />
        </UserContext.Provider>
      </EnvironmentContext.Provider>
    );
    const wrapper = mount(<Component />);
    expect(wrapper.find(DataTable)).toHaveLength(1);
  });
});
