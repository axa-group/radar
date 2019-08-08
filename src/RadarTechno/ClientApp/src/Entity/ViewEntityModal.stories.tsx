import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { ViewEntityModal } from '../Entity/ViewEntityModal';

const fakeEntities = [{
  id:'5a4e2821a111b016c4cc5804',
  name:'AXA France',
  adminList:['Test@axa.fr'],
  numberOfTechnologies: 2,
  technologies: 1,
  version:0,
}];

const radarTechnologies = [
  {
    "id": "5cd98e785a1f6046f4976b6b",
    "version": 0,
    "name": "Solution de parametrage",
    "key": "solution-de-parametrage",
    "category": "practices",
    "description": "testbfdbdfbdfb",
    "scope": "gdfbhtrhe",
    "reporter": null,
    "entitiesStatus": null,
    "groupStatus": "Reinforce",
    "updateDate": "2019-03-01T14:21:38.374Z",
    "status": "Candidate",
    "entityScope": "fezezf",
    "entityTechnologyUrls": [
      {
        "label": "rat",
        "url": "egr"
      }
    ],
    "technologyId": "5823926b69170e15d895fda0"
  },
  {
    "id": "5cd98e785a1f6046f4976b6c",
    "version": 0,
    "name": "Angular 2",
    "key": "angular-2",
    "category": "frameworks",
    "description": "POC/Assessment : Etude framework Front.\nRejected : ReactJS choosen to be target UI framework",
    "scope": null,
    "reporter": null,
    "entitiesStatus": null,
    "groupStatus": "Deprecated",
    "updateDate": "2019-03-01T14:21:38.374Z",
    "status": "Deprecated",
    "entityScope": null,
    "entityTechnologyUrls": null,
    "technologyId": "5823926b69170e15d895fda2"
  }
];

storiesOf('Entities', module)
  .addDecorator(withKnobs)
  .add('View entity modal', () => 
  <ViewEntityModal 
    loading={boolean('loading', false)}
    item={object('entity', fakeEntities[0])}
    items={object('technologies', radarTechnologies)}
    isOpen={boolean('isOpen', true)}
    onClose={action('onClose')}
  />
);
