import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { SideModal } from './SideModal';
import { EnhancedSideModal } from './SideModal.container';

configure({ adapter: new Adapter() });

describe('SideModal container test', () => {
  test('SideModal container renders without crashing', () => {
    const wrapper = mount(<EnhancedSideModal />);
    expect(wrapper.find(SideModal)).toHaveLength(1);
  });
});
