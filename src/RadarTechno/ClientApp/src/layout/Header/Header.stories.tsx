import React from 'react';

import { action } from '@storybook/addon-actions';
import { object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import HeaderApp from './Header';

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

storiesOf('Layout', module)
  .addDecorator(withKnobs)
  .add('Header', () => 
    <HeaderApp 
    user={object('user', fakeUser)} 
    onLogout={action('onClick')}  
  />
);
