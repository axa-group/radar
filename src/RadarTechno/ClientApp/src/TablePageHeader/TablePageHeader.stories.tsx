import React from 'react';

import { boolean, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

import { TablePageHeader } from '../TablePageHeader';

storiesOf('DataTable', module)
.addDecorator(withKnobs)
.addDecorator(StoryRouter())
.add('Data table page header', () =>
<TablePageHeader
  title={text('title', 'title')}
  ctaVisible={boolean('ctaVisible', true)}
  ctaPath={text('ctaPath', 'path')}
  ctaText={text('ctaText', 'link')}
  excelFileName={text('excelFileName', 'file.csv')}
  excelLink={text('excelLink')}
/>
);
