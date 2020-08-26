import React from 'react';

import './SideModal.scss';

export const SideModal = (props: {
  children: any,
  isOpen: boolean,
  onClose: (...args: any[]) => any,
  title: string
}) => (
    <>
      <div className={`radar-side-modal ${props.isOpen ? 'radar-side-modal--opened' : 'radar-side-modal--closed'}`}>
        <div className="radar-side-modal__header">
          <h2 className="radar-side-modal__header-title">{props.title}</h2>
          <button className="radar-side-modal__header-close-btn" onClick={() => props.onClose()} type="button" aria-label="Close">
            <i className="glyphicon glyphicon-close" aria-hidden="true" />
          </button>
        </div>
        <div className="radar-side-modal__body">
          {props.children}
        </div>
      </div>
      {props.isOpen && <div className="radar-side-modal__overlay" onClick={() => props.onClose()} />}
    </>
);
