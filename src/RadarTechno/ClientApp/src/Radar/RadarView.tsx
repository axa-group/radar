import { HelpButton, Loader, Tabs } from '@axa-fr/react-toolkit-all';
import React from 'react';

import { IFormattedEntityTechnology } from '../Entity';
import { ViewEntityTechnologyModal } from '../Entity/ViewEntityTechnologyModal';
import { Category, Status, StatusDescription } from '../types';
import { Radar } from './Radar';
import { IRadarColors } from './Radar.d';

import './RadarView.scss';

export const RadarView = ({
  loading,
  radarTechnologies,
  colors,
  hoverId,
  isModalOpen,
  modalItem,
  onTechnologyClick,
  onTechnologyModalClose,
  onMouseEnter,
  onMouseLeave,
  sticky,
}: {
  loading: boolean,
  radarTechnologies: IFormattedEntityTechnology[],
  colors: IRadarColors,
  hoverId: string,
  isModalOpen: boolean,
  modalItem: IFormattedEntityTechnology,
  onTechnologyClick: (...args: any[]) => void,
  onTechnologyModalClose: (...args: any[]) => void,
  onMouseEnter: (...args: any[]) => void,
  onMouseLeave: (...args: any[]) => void,
  sticky?: boolean
}) => (
  <div className="af-home container">
    <Loader text="Loading ..." mode={loading ? 'get' : 'none'}>
      {radarTechnologies && (
        <Tabs>
        {Object.keys(Category).map((key, index) => (
          <Tabs.Tab
            key={key}
            id={index}
            classModifier="radar"
            title={Category[key]}>
            <div className="container-fluid">
            <div className="row">
              <div className="col-md-4">
              {Object.keys(Status).map(statusKey => (
                <div key={statusKey}>
                  <div className="rt-radar__status">
                    <h2 className="rt-radar__status-title">{Status[statusKey]}</h2>
                    <HelpButton className="rt-radar__status-help">{StatusDescription[statusKey]}</HelpButton>
                  </div>
                  <ul>
                    {radarTechnologies.length ? radarTechnologies.filter(element =>
                        element.status === Status[statusKey] &&
                        element.category.toLowerCase() === key)
                      .map(element =>
                        <li key={element.technologyId} className="rt-radar__technology"
                          onClick={() => onTechnologyClick(element)}
                          onMouseEnter={() => onMouseEnter(element.technologyId)} 
                          onMouseLeave={() => onMouseLeave(element.technologyId)}>
                          <span className="rt-radar__technology-name">
                            {element.name}
                          </span>
                          {element.scope && 
                            (<span className="af-badge af-badge--danger rt-radar__badge">
                              Scope and/or usage restriction
                            </span>) 
                          }
                        </li>) : ''}
                  </ul>
                </div>
              ))}
              </div>
              <div className="col-md-6 offset-md-2 rt-radar__container">
                <Radar 
                  width={600} 
                  height={600} 
                  colors={colors[key.toLowerCase()]} 
                  hoverId={hoverId}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                  sticky={sticky}
                  technologies={radarTechnologies.length && 
                    radarTechnologies.filter(element => element.category === key)} />
              </div>
            </div>
          </div>
        </Tabs.Tab>
        ))}
      </Tabs>)}
      <ViewEntityTechnologyModal isOpen={isModalOpen} item={modalItem} onClose={onTechnologyModalClose} />
    </Loader>
  </div>
);
