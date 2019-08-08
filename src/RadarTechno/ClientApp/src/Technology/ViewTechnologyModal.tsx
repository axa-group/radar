import React from 'react';
import { dateObjectToString } from '../generic/dateStringHandler';
import { EnhancedSideModal } from '../SideModal';
import { ITechnology } from '../Technology';

import '../generic/ViewItem.scss';
import { Radar } from '../Radar/Radar';
import { radarColors } from '../Radar/Radar.constants';
import { EntitiesModalTable } from './EntitiesModalTable';
import { convertEntitiesStatusToRadarTechnologies } from './ViewTechnologyModal.action';

export const ViewTechnologyModal = ({
  item,
  isOpen,
  onClose
}: {
  item: ITechnology,
  isOpen: boolean,
  onClose: () => void
}) => (
  <EnhancedSideModal isOpen={isOpen} 
    onClose={() => onClose()} title={item ? item.name : ''}>
  {item && (<div className="row">
    <div className="col-md-6 af-restitution">
      <section className="af-restitution__content">

      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Category</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">{item.category}</div>
      </div>

      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Description</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">{item.description ? item.description : ''}</div>
      </div>
      
      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Scope</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">{item.scope ? item.scope : ''}</div>
      </div>
      
      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Reporter</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">{item.reporter ? item.reporter : ''}</div>
      </div>

      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Last updated on</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">
          {dateObjectToString(item.updateDate)}
        </div>
      </div>

      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Version</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">{item.version}</div>
      </div>

      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Recommended status</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">
          {item.groupStatus ? item.groupStatus : 'No recommendation'}
        </div>
      </div>

      <EntitiesModalTable entitiesStatus={item.entitiesStatus} groupStatus={item.groupStatus} />

      </section>
    </div>
    
    {item.entitiesStatus && <div className="col-md-6">
      <Radar 
        sticky={true}
        width={400} 
        height={400} 
        colors={radarColors[item.category]} 
        hoverId={null}
        forceDisplayPoints={true}
        forceDisplayGroupStatus={item.groupStatus}
        technologies={convertEntitiesStatusToRadarTechnologies(item)} />
    </div>}
  </div>)}
  </EnhancedSideModal>
);
