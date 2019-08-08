import React from 'react';

import './SideModal.scss';

export const SideModal = (props: {
  children: any,
  isOpen: boolean,
  onClose: (...args: any[]) => any,
  title: string
}) => (
    <>
      <div className={`af-modal ${props.isOpen ? 'af-modal--opened' : 'af-modal--closed'}`}>
        <div className="af-modal__header">
          <h2 className="af-modal__header-title">{props.title}</h2>
          <button className="af-modal__header-close-btn" onClick={() => props.onClose()} type="button" aria-label="Close">
            <i className="glyphicon glyphicon-close" aria-hidden="true" />
          </button>
        </div>
        <div className="af-modal__body">
          {props.children}
        </div>
      </div>
      {props.isOpen && <div className="af-modal__overlay" onClick={() => props.onClose()} />}
    </>
);
