import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { DataTable } from '../DataTable';
import { EnhancedDataTable } from './DataTable.container';

configure({ adapter: new Adapter() });

describe('DataTable container test', () => {
  test('DataTable container renders without crashing', () => {
    const wrapper = mount(<EnhancedDataTable />);
    expect(wrapper.find(DataTable)).toHaveLength(1);
  });
});
