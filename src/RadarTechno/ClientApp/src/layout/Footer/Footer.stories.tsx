import React from 'react';

import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import FooterApp from './Footer';

storiesOf('Layout', module)
  .addDecorator(withKnobs)
  .add('Footer', () => <FooterApp />
);
