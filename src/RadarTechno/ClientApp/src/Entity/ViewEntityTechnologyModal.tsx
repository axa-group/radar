import React from 'react';
import { dateObjectToString } from '../generic/dateStringHandler';
import { Radar } from '../Radar/Radar';
import { radarColors } from '../Radar/Radar.constants';
import { EnhancedSideModal } from '../SideModal';
import { IFormattedEntityTechnology } from './Entity';

import '../generic/ViewItem.scss';

export const ViewEntityTechnologyModal = ({
  item,
  isOpen,
  onClose
}: {
  item: IFormattedEntityTechnology,
  isOpen: boolean,
  onClose: () => void
}) => (<EnhancedSideModal isOpen={isOpen} 
  onClose={() => onClose()} title={item ? item.name : ''}>
  {item && (<div className="row">
    <div className="af-restitution col-md-6">
      <section className="af-restitution__content">

      <div className="row af-restitution__listdef">
          <div className="col-md-6 af-restitution__listdef-item">
            <span className="radar-restitution__text">Status</span>
          </div>
          <div className="col-md-6 af-restitution__listdef-value">{item.status}</div>
        </div>

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
          <div className="col-md-6 af-restitution__listdef-value">{item.entityScope ? item.entityScope : item.scope}</div>
        </div>
        
        <div className="row af-restitution__listdef">
          <div className="col-md-6 af-restitution__listdef-item">
            <span className="radar-restitution__text">Reporter</span>
          </div>
          <div className="col-md-6 af-restitution__listdef-value">{item.reporter ? item.reporter : ''}</div>
        </div>
        
        <div className="row af-restitution__listdef">
          <div className="col-md-6 af-restitution__listdef-item">
            <span className="radar-restitution__text">Useful links</span>
          </div>
          <div className="col-md-6 af-restitution__listdef-value">
            <ul className="af-list radar-restitution__links">
              {item.entityTechnologyUrls && item.entityTechnologyUrls.map((link) => (
                <li key={`${link.label}-link`}>
                  <a target="_blank" rel="noopener" href={link.url}>{link.label ? link.label : link.url }</a>
                </li>
              ))}
            </ul>
          </div>
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
            <span className="radar-restitution__text">Status</span>
          </div>
          <div className="col-md-6 af-restitution__listdef-value">
            {item.status}
          </div>
        </div>

        <div className="row af-restitution__listdef">
          <div className="col-md-6 af-restitution__listdef-item">
            <span className="radar-restitution__text">Recommended status</span>
          </div>
          <div className="col-md-6 af-restitution__listdef-value">
            {item.groupStatus ? item.groupStatus : 'No recommendation'}
          </div>
        </div>

        </section>
      </div>
      
      <div className="col-md-6">
        <Radar
          sticky={true}
          width={400}
          height={400} 
          colors={radarColors[item.category]}
          hoverId={null}
          forceDisplayPoints={true}
          forceDisplayGroupStatus={item.groupStatus}
          technologies={[item]} />
      </div>
    </div>
  )}
</EnhancedSideModal>
);
