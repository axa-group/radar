import React from 'react';

import { action } from '@storybook/addon-actions';
import { boolean, object, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import { RadarView } from '.';

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
.add('Technology radar view', () => 
  <RadarView 
    hoverId={text('hoverId', '')}
    colors={{
      default: ["#777", "#64ffda", "#1de9b6", "#00bfa5"],
      infrastructures: ["#777", "#64ffda", "#1de9b6", "#00bfa5"],
      frameworks: ["#777", "#ef9a9a", "#ef5350", "#d32f2f"],
      patterns: ["#777", "#fff176", "#fdd835", "#f9a825"],
      platforms: ["#777", "#69f0ae", "#00e676", "#00c853"],
      tools: ["#777", "#98E0FF", "#31C1FF", "#008DCA"],
      practices: ["#777", "#cfd8dc", "#b0bec5", "#90a4ae"]
    }}
    loading={boolean('loading', false)}
    radarTechnologies={object('Radar technologies', radarTechnologies)}
    sticky={boolean('sticky', false)}
    isModalOpen={boolean('isModalOpen', false)}
    modalItem={object('Modal Item', radarTechnologies[0])}
    onTechnologyClick={action('onTechnologyClick')}
    onTechnologyModalClose={action('onTechnologyModalClose')}
    onMouseEnter={action('onMouseEnter')}
    onMouseLeave={action('onMouseLeave')}
  />
);
