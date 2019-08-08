import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, number, object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import StoryRouter from 'storybook-react-router';

import { Menu } from '../Menu';

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

storiesOf('Menu', module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())
  .add('Menu', () => <Menu 
    hideMenuButton={boolean('hideMenuButton', false)}
    user={object('user', fakeUser)}
    handleClick={action('handleClick')}
    position={number('position', 0)}
    isMenuVisible={boolean('isMenuVisible', true)}
    updatePosition={action('updatePosition')}
  />
);
