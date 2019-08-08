import { CollapseCard, CollapseCardBase, Loader } from '@axa-fr/react-toolkit-all';
import React from 'react';

import { dateObjectToString } from '../generic/dateStringHandler';
import { EnhancedSideModal } from '../SideModal';
import { IHistory } from './History';
import { HistoryDiffEditor } from './HistoryDiffEditor';

import './HistoryModal.scss';

export const HistoryModal = ({
  loading,
  title,
  history,
  isOpen,
  onClose,
  onToggle,
  idToOpen
}: {
  loading: boolean,
  title: string,
  history: IHistory[],
  isOpen: boolean,
  onClose: () => void,
  onToggle: (...args: any[]) => void,
  idToOpen: string
}) => (
    <EnhancedSideModal isOpen={isOpen} 
      onClose={() => onClose()} title={title}>
      <Loader text="Loading ..." mode={loading ? 'get' : 'none'}>
      {history && history.map((element) => (
        <CollapseCardBase onToggle={onToggle} classModifier="radar"
          id={`${element.id}`} key={element.id} collapse={idToOpen === element.id}>
          <CollapseCard.Header>
            {dateObjectToString(element.updateDate)}
          </CollapseCard.Header>
          <CollapseCard.Body>
            <div className="container af-restitution">
              <div className="af-restitution__content">
                <div className="row af-restitution__listdef">
                  <div className="col-md-6 af-restitution__listdef-item">
                    <span className="radar-restitution__text">Type</span>
                  </div>
                  <div className="col-md-6 af-restitution__listdef-value">{element.type}</div>
                </div>

                <div className="row af-restitution__listdef">
                  <div className="col-md-6 af-restitution__listdef-item">
                    <span className="radar-restitution__text">Author</span>
                  </div>
                  <div className="col-md-6 af-restitution__listdef-value">{element.author}</div>
                </div>
                
                <div className="row af-restitution__listdef">
                  <div className="col-md-12 radar-restitution__differences">
                    <span className="radar-restitution__text">Differences</span>
                    {idToOpen === element.id && (<HistoryDiffEditor diff={element.diff} />)}
                  </div>
                </div>
              </div>
            </div>
          </CollapseCard.Body>
        </CollapseCardBase>))}
    </Loader>
  </EnhancedSideModal>
);
