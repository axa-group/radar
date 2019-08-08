import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number, object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { DataTable } from '../DataTable';

const items =[
  {
    label1: 'value1',
    label2: 'value2',
    label3: 'value3',
    label4: 'value4'
  },{
    label1: 'value1',
    label2: 'value2',
    label3: 'value3',
    label4: 'value4'
  },{
    label1: 'value1',
    label2: 'value2',
    label3: 'value3',
    label4: 'value4'
  },{
    label1: 'value1',
    label2: 'value2',
    label3: 'value3',
    label4: 'value4'
  },{
    label1: 'value1',
    label2: 'value2',
    label3: 'value3',
    label4: 'value4'
  },{
    label1: 'value1',
    label2: 'value2',
    label3: 'value3',
    label4: 'value4'
  },{
    label1: 'value1',
    label2: 'value2',
    label3: 'value3',
    label4: 'value4'
  }
];

storiesOf('DataTable', module)
.addDecorator(withKnobs)
.add('Data table', () => 
  <DataTable 
    hasEdit={boolean('hasEdit', true)}
    hasHistory={boolean('hasHistory', true)}
    clearFilter={action('clearFilter')}
    filters={object('filters', {})}
    sort={object('sort', {})}
    loading={boolean('loading', false)} 
    items={items} 
    keys={Object.keys(items.reduce((result, obj) => {
      return Object.assign(result, obj);
    }, {}))}
    onChange={action('onChange')}
    onSort={action('onSort')}
    onFilterChange={action('onFilterChange')}
    onView={action('onView')}
    onEdit={action('onEdit')}
    onHistory={action('onHistory')}
    paging={object('paging', {numberItems: 10, page: 1})}
    numberPages={number('numberPages', 1)} />
);
