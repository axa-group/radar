import React from 'react';
import { EnhancedSideModal } from '../SideModal';
import { IUser } from './User';

import '../generic/ViewItem.scss';

export const ViewUserModal = ({
  item,
  isOpen,
  onClose
}: {
  item: IUser,
  isOpen: boolean,
  onClose: () => void
}) => (
  <EnhancedSideModal isOpen={isOpen} 
    onClose={() => onClose()} title={item ? item.email : ''}>
    {item && <div className="container af-restitution">
    <section className="af-restitution__content">

      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Name</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">{item.name ? item.name : '' }</div>
      </div>

      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Email</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">{item.email ? item.email : '' }</div>
      </div>

      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Role</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">{item.role}</div>
      </div>

      <div className="row af-restitution__listdef">
        <div className="col-md-6 af-restitution__listdef-item">
          <span className="radar-restitution__text">Entity</span>
        </div>
        <div className="col-md-6 af-restitution__listdef-value">{item.entity.name}</div>
      </div>
      
      </section>
    </div>}
  </EnhancedSideModal>
);
