import React from 'react';

import { IEntity } from '../Entity';
import { EnhancedSideModal } from '../SideModal';
import { TechnologiesModalTable } from './TechnologiesModalTable';

import '../generic/ViewItem.scss';

export const ViewEntityModal = ({
  item,
  items,
  loading,
  isOpen,
  onClose
}: {
  item: IEntity,
  items: any,
  loading: boolean,
  isOpen: boolean,
  onClose: () => void
}) => (
  <EnhancedSideModal isOpen={isOpen} 
    onClose={() => onClose()} title={item ? item.name : ''}>
    {item && (<div className="row">
      <div className="af-restitution col-md-6">
        <section className="af-restitution__content">
          <div className="row af-restitution__listdef">
            <div className="col-md-6 af-restitution__listdef-item">
              <span className="radar-restitution__text">Name</span>
            </div>
            <div className="col-md-6 af-restitution__listdef-value">{item.name}</div>
          </div>

          <div className="row af-restitution__listdef">
            <div className="col-md-6 af-restitution__listdef-item">
              <span className="radar-restitution__text">Worklow url</span>
            </div>
            <div className="col-md-6 af-restitution__listdef-value radar-restitution__links">
              <a href={item.workflowUrl} title={item.workflowUrl} rel="noopener" target="_blank">{item.workflowUrl}</a>
            </div>
          </div>

          <div className="row af-restitution__listdef">
            <div className="col-md-6 af-restitution__listdef-item">
              <span className="radar-restitution__text">Admin list</span>
            </div>
            <div className="col-md-6 af-restitution__listdef-value">
              <ul className="af-restitution__listul">
                {item.adminList && item.adminList.map(admin => (
                  <li key={`${admin}`} className="af-restitution__listul-item">{admin}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row af-restitution__listdef">
            <div className="col-md-6 af-restitution__listdef-item">
              <span className="radar-restitution__text">Number of Technologies</span>
            </div>
            <div className="col-md-6 af-restitution__listdef-value">{item.numberOfTechnologies}</div>
          </div>
        </section>
      </div>
      
      <div className="col-md-6">
          <TechnologiesModalTable loading={loading} items={items}/>
      </div>
    </div>)}
  </EnhancedSideModal>
);
