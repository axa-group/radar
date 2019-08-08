import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { IHistory } from './History';
import { HistoryDiffEditor } from './HistoryDiffEditor';
import { HistoryModal } from './HistoryModal';

configure({ adapter: new Adapter() });

describe('HistoryModal test', () => {
  test('HistoryModal renders without crashing', () => {    
    const history: IHistory[] = [{
      author: 'author',
      diff: '{"key": ["old", "new"], "key2": ["new"]}',
      elementId: 'id',
      id: 'id',
      type: 'type',
      updateDate: new Date()
    }];
    const Component = () => (
      <HistoryModal 
        history={history}
        title="title" 
        loading={false} 
        idToOpen="id" 
        isOpen={true} 
        onClose={() => null} 
        onToggle={() => null} />
    );
    const wrapper  = shallow(<Component />);

    expect(wrapper.dive().find(HistoryDiffEditor)).toHaveLength(1);
  });
});
