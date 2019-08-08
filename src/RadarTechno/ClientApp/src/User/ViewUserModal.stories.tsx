import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { ViewUserModal } from '../User/ViewUserModal';

const fakeEntities = [{
  id:'5a4e2821a111b016c4cc5804',
  name:'AXA France',
  adminList:['Test@axa.fr'],
  technologies: 1,
  version:0,
}];

const fakeUser = {
  id:'1',
  email:'Test',
  role: 'user',
  entity: fakeEntities[0],
  entityList: ['5a4e2821a111b016c4cc5804'],
  token:'token',
};

storiesOf('Users', module)
.addDecorator(withKnobs)
.add('View user modal', () => 
<ViewUserModal 
  item={object('user', fakeUser)}
  isOpen={boolean('isOpen', true)}
  onClose={action('onClose')}
/>
);
