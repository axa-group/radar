import { Button } from '@axa-fr/react-toolkit-all';
import React from 'react';

import './NotFound.scss';

export const NotFound = (props: any) => (
  <div className="af-home container radar-notfound__container">
    <span className="af-title--bigTitle">This page was not found</span> 
    <p>The page you are looking for is not available or no longer exists. Try to reload the page.</p>

    <Button id="next" classModifier="radar auto pullRight hasiconRight" onClick={() => props.history.push('/')}>
      <span className="af-btn__text radar-btn__home">
        Go to Home page
      </span>
      <i className="glyphicon glyphicon-arrowthin-right" />
    </Button> 
  </div>
);
