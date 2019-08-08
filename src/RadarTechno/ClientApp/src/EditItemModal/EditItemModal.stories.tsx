import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { EditItemModal } from '../EditItemModal';

const fields = [
  {
    type: 'text',
    name: 'name',
    label: 'label',
  }, {
    type: 'pass',
    name: 'pass',
    label: 'label',
  }, {
    type: 'textarea',
    name: 'textarea',
    label: 'label',
  }, {
    type: 'select',
    name: 'select',
    label: 'label',
    options: [
      {value: '1', label: '1'},
      {value: '2', label: '2'},
      {value: '3', label: '3'}
    ]
  }, {
    type: 'multi-select',
    name: 'multi-select',
    label: 'label',
    options: [
      {value: '1', label: '1'},
      {value: '2', label: '2'},
      {value: '3', label: '3'}
    ]
  },
  {
    type: 'multi-urls-inputs',
    name: 'multi-urls-inputs',
    label: 'label',
    values: [
      {label: '1', url: '1'},
      {label: '2', url: '2'},
      {label: '3', url: '3'},
    ]
  }
];

const item = {
  label1: 'value1',
  label2: 'value2'
};

storiesOf('SideModal', module)
  .addDecorator(withKnobs)
  .add('Edit item modal', () => 
    <EditItemModal 
      disableSubmit={boolean('disableSubmit', false)}
      title={text('title', 'title')}
      loading={boolean('loading', false)}
      error={text('error', null)}
      fields={object('fields', fields)}
      hasSubmit={boolean('hasSubmit', false)}
      onChange={action('onChange')}
      onSubmit={action('onSubmit')}
      item={item}
      isOpen={boolean('isOpen', true)}
      onClose={action('onClose')}
      onMultiUrlsAdd={action('onMultiUrlsAdd')}
      onMultiUrlsRemove={action('onMultiUrlsRemove')}
    />
);
