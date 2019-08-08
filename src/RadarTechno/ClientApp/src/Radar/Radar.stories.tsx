import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { Radar } from './Radar';

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

storiesOf('Radar', module)
.addDecorator(withKnobs)
.add('Technology radar', () => 
  <Radar
    hoverId={text('hoverId', '')}
    colors={["#777", "#FAA1AC", "#F86382", "#AB082A"]}
    width={600}
    height={600}
    technologies={object('Radar technologies', radarTechnologies)}
    forceDisplayGroupStatus={boolean('forceDisplayGroupStatus', false)}
    forceDisplayPoints={boolean('forceDisplayPoints', false)}
    sticky={boolean('sticky', false)}
    onMouseEnter={action('onMouseEnter')}
    onMouseLeave={action('onMouseLeave')}
  />
);
