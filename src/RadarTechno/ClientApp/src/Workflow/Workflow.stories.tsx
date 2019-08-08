import React from 'react';

import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { Workflow } from './Workflow';

storiesOf('Workflow', module)
  .add('Workflow', () => 
  <Workflow 
    loading={boolean('loading', false)}
    url={text('url', null)}
  />
);
