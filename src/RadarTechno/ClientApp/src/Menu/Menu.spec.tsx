import { NavBar } from '@axa-fr/react-toolkit-all';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { ICurrentUser } from '../types';
import { Menu } from './Menu';

configure({ adapter: new Adapter() });

describe('Menu component test', () => {

  test('Menu component without user matches snapshot', () => {
    const wrapper = shallow(
      <MemoryRouter initialEntries={['/']} keyLength={0}>
        <Menu user={null} isMenuVisible={true} handleClick={() => null}
          position={0} updatePosition={null} hideMenuButton={true}/>
      </MemoryRouter>
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('Menu component with user matches snapshot', () => {
    const user: ICurrentUser = {
      email: 'email',
      entity: {
        id:'5a4e2821a111b016c4cc5804',
        name:'AXA France',
        adminList:['Test@axa.fr'],
        technologies: null,
        version:0,
        workflowUrl: 'url'
      },
      id: 'id',
      token: 'token',
      role: 'root'
    };
    const wrapper = shallow(
      <MemoryRouter initialEntries={['/']} keyLength={0}>
        <Menu user={user} isMenuVisible={true} handleClick={() => null} 
          position={0} updatePosition={null} />
      </MemoryRouter>
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('Menu component with user doesn\'t render NavBar', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']} keyLength={0}>
        <Menu user={null} isMenuVisible={true} handleClick={() => null} 
          position={0} updatePosition={null} hideMenuButton={true} />
      </MemoryRouter>
    );
    expect(wrapper.find(NavBar)).toHaveLength(0);
  });

  test('Menu component with user renders NavBar', () => {
    const user: ICurrentUser = {
      email: 'email',
      entity: {
        id:'5a4e2821a111b016c4cc5804',
        name:'AXA France',
        adminList:['Test@axa.fr'],
        technologies: null,
        version:0,
        workflowUrl: 'url'
      },
      id: 'id',
      token: 'token',
      role: 'root'
    };
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']} keyLength={0}>
        <Menu user={user} isMenuVisible={true} handleClick={() => null} 
          position={0} updatePosition={null} />
      </MemoryRouter>
    );
    expect(wrapper.find(NavBar)).toHaveLength(1);
  });
});
