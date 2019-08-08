import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { SideModal } from '../SideModal';

storiesOf('SideModal', module)
.addDecorator(withKnobs)
.add('Side modal with item', () => 
  <SideModal
    isOpen={boolean('isOpen', true)}
    onClose={action('onClose')}
    title={text('title', 'title')}
  >
    <p>ieozjfozjefzo</p>
  </SideModal>
);
