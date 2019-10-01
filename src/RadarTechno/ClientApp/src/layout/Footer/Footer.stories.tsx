import React from 'react';

import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import FooterApp from './Footer';

const configuration = { version: '1.0.0.0', loading: false };

storiesOf('Layout', module)
  .addDecorator(withKnobs)
    .add('Footer', () => <FooterApp configuration={configuration} />
);
