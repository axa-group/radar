import React from 'react';

import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

import { NotFound } from './NotFound';

storiesOf('NotFound', module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())
  .add('NotFound', () => <NotFound />
);
