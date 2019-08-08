import React from 'react';

import { Loader } from '@axa-fr/react-toolkit-all';

import assessmentBPMN from './img/assessment-bpmn.png';
import candidateBPMN from './img/candidate-bpmn.png';
import legend from './img/legend.png';

import './Workflow.scss';

export const Workflow = ({url, loading}: {url: string, loading: boolean}) => (
  
  <Loader text="Loading ..." mode={loading ? 'get' : 'none'}>
    {(!loading && url) && (
      <div className="container">
        <iframe className="radar-workflow__iframe" src={url} />
      </div>
    )}
    {!loading && !url && (<div className="container">
      <h2 className="af-subtitle">What is it ?</h2>
      <p>
        The radar is our tool to manage technology inside our IT Department.
      </p>
      <h2 className="af-subtitle">For what purpose ?</h2>
      <ul>
        <li>Speed up technology adoption/rejection</li>
        <li>Have a clear vision of where we are</li>
        <li>Synchronize initiatives between teams</li>
        <li>Align our sourcing/training strategy with our true needs</li>
      </ul>
      <h2 className="af-subtitle">How to read the radar ?</h2>
      <p>
        Technologies are split in four main themes : Tools, Languages and Frameworks, Platforms and Patterns.
        We attach the maturity level we want to reach in the comming months for each item.
      </p>
      <img className="radar-workflow__img" src={legend} alt="legend" />
      <h2 className="af-subtitle">How to propose a candidate ?</h2>
      <ul>
        <li>First, take a look at the candidate page to be sure your technology isn't already in the radar</li>
        <li>Write a pitch using the template. <a href="#">Download the template</a></li>
        <li>Share with your colleagues in different Community Of Practice</li>
        <li>Submit your pitch by mail to the RadarMaster <a href="#">here</a></li>
        <li>You will be contacted to present your pitch to the Technology Selection Members. 
          A minimum of 1 week is needed to prepare the review.</li>
      </ul>
      <img className="radar-workflow__img" src={candidateBPMN} alt="candidate-bpmn" />
      <h2 className="af-subtitle">How to assess a technology ?</h2>
      <img className="radar-workflow__img" src={assessmentBPMN} alt="assessment-bpmn" />
    </div>
    )}
  </Loader>
);
