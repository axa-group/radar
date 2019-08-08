import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { ViewEntityTechnologyModal } from '../Entity/ViewEntityTechnologyModal';

const fakeEntityTechnology = {
  status: 'Excel',
  updateDate:'2018-07-23T14:41:36.328Z',
  id:'5823926b69170e15d895fda7',
  version:0,
  category:'frameworks',
  name:'Node.JS',
  scope:'scope',
  description:'description',
  reporter: 'reporter',
  key:'node.js',
  entityTechnologyUrls: [
    {label: 'label', url: 'url'}
  ]
};

storiesOf('Entities', module)
  .addDecorator(withKnobs)
  .add('View entity technology modal', () => 
  <ViewEntityTechnologyModal
    item={object('technology', fakeEntityTechnology)}
    isOpen={boolean('isOpen', true)}
    onClose={action('onClose')}
  />
);
