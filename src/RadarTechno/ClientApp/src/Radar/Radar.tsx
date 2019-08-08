import React from 'react';

import { IFormattedEntityTechnology } from '../Entity';
import { ASSESS, DEPRECATED, EXCEL, REINFORCE } from '../Technology/Technology.constants';
import { IRadarColor } from './Radar.d';

import logo from './img/axa_logo_solid_mono_black_rgb.svg';
import './Radar.scss';

const compareToGroup = (item: IFormattedEntityTechnology) => {
  if(item.status === DEPRECATED) {
    return 'deprecated';
  } 
  if(item.groupStatus === DEPRECATED && item.status !== DEPRECATED) {
    return 'critical';
  }
  if(item.groupStatus === ASSESS && item.status !== ASSESS) {
    return 'warning';
  }
  return 'aligned';
};

const renderPoints = (
  radius: number, 
  innerRadius: number, 
  items: IFormattedEntityTechnology[], 
  maxItemsPerCircle: number, 
  hoverId: string, 
  onMouseEnter: (...args: any[]) => any,
  onMouseLeave: (...args: any[]) => any
) => {
  let numberOfElements = items.length;
  const arrayOfArrays = [];
  let i = 0;
  while(numberOfElements > 0) {
    arrayOfArrays.push(items.splice(0, maxItemsPerCircle+i));
    numberOfElements-=maxItemsPerCircle+i;
    i=i+1;
  }
  return arrayOfArrays.map((array, arrayIndex) => {
    return array.map((item: IFormattedEntityTechnology, index: number) => (
      <div 
        className="radar-technology__container"
        style={{          
          right: `${(innerRadius + (radius-innerRadius) * (arrayIndex+1)/(arrayOfArrays.length+1)) 
            * Math.cos(Math.PI/2 * ((index+1)/(array.length+1)))}px`,
          bottom: `${(innerRadius + (radius-innerRadius) * (arrayIndex+1)/(arrayOfArrays.length+1)) 
            * Math.sin(Math.PI/2 * ((index+1)/(array.length+1)))}px`
        }}
      >
        <span 
          key={`${item.technologyId}__name`}
          className={`radar-technology__name ${hoverId === item.technologyId ? 'radar-technology__name--hover' : ''}`}>
          {item.name}
        </span>
        <div 
          onMouseEnter={() => onMouseEnter ? onMouseEnter(item.technologyId) : null} 
          onMouseLeave={() => onMouseLeave ? onMouseLeave(item.technologyId) : null}
          className={
            `radar-technology ${hoverId === item.technologyId ? 'radar-technology--hover' : ''}`
          }
          key={item.technologyId} id={item.technologyId}
        >
          <div className={`radar-technology__tooltip radar-technology__tooltip--${compareToGroup(item)}`}>
            <span className="radar-technology__tooltiptext">{item.name}</span>
          </div>
        </div>
      </div>
    ));
  });
};

export const Radar = ({
  width, 
  height, 
  technologies,
  colors,
  hoverId,
  onMouseEnter,
  onMouseLeave,
  sticky,
  forceDisplayPoints,
  forceDisplayGroupStatus
}: {
  width: number, 
  height: number, 
  technologies: IFormattedEntityTechnology[],
  colors: IRadarColor,
  hoverId: string,
  onMouseEnter?: (...args: any[]) => void,
  onMouseLeave?: (...args: any[]) => void,
  sticky?: boolean,
  forceDisplayPoints?: boolean,
  forceDisplayGroupStatus?: string
}) => {

  const htmlRadarStyle = {
    width: `${width}px`,
    height: `${height}px`
  };

  const innerRadarWidth2 = 6/7*width + 10;
  const innerRadarHeight2 = 6/7*height + 10;
  const innerRadarWidth3 = 6/7*width;
  const innerRadarHeight3 = 6/7*height;
  const innerRadarWidth4 = 2/3*width;
  const innerRadarHeight4 = 2/3*height;
  const innerRadarWidth5 = 2/5*width;
  const innerRadarHeight5 = 2/5*height;

  const deprecated = technologies ? technologies.filter(t => t.status === 'Deprecated') : [];
  const assess = technologies ? technologies.filter(t => t.status === 'Assess') : [];
  const reinforce = technologies ? technologies.filter(t => t.status === 'Reinforce') : [];
  const excel = technologies ? technologies.filter(t => t.status === 'Excel') : [];

  const hoverItem = technologies && hoverId ? technologies.find(t => t.technologyId === hoverId) : null;
  const groupStatus = forceDisplayGroupStatus ? forceDisplayGroupStatus : hoverItem ? hoverItem.groupStatus : null;

  const radarHighlightClassName = "radar__inner-radar--highlight";

  return (
    <div style={{width, maxWidth: '100%'}} className={`radar__container ${sticky ? 'radar-sticky' : ''}`}>
      <div 
        className={`radar ${hoverItem ? 'radar--hovered' : ''} ${forceDisplayPoints ? 'radar--force-display' : ''}`} 
        style={htmlRadarStyle}
      >
        <div 
          className={`radar__inner-radar radar__inner-radar--1 
            ${hoverItem && (hoverItem.status === DEPRECATED || groupStatus === DEPRECATED) && radarHighlightClassName}`} 
          style={{ width, height, backgroundColor: colors[0] }}>
          {groupStatus === DEPRECATED && (
            <div className="radar-group-status">
              <img className="af-logo__brand" style={{maxWidth: width/20, maxHeight: height/20}} src={logo} alt="AXA" />
            </div>
          )}
          {renderPoints(width, innerRadarWidth2, deprecated, 20, hoverId, onMouseEnter, onMouseLeave)}
        </div>
        <div className={`radar__inner-radar radar__inner-radar--2 
          ${hoverItem && (hoverItem.status === DEPRECATED || groupStatus === DEPRECATED) && radarHighlightClassName}`} 
          style={{width: innerRadarWidth2, height: innerRadarHeight2}} />
        <div className={`radar__inner-radar radar__inner-radar--3 
            ${hoverItem && (hoverItem.status === ASSESS || groupStatus === ASSESS) && radarHighlightClassName}`}  
          style={{width: innerRadarWidth3, height: innerRadarHeight3, backgroundColor: colors[1]}}>
          {groupStatus === ASSESS && (
            <div className="radar-group-status">
              <img className="af-logo__brand" style={{maxWidth: width/20, maxHeight: height/20}} src={logo} alt="AXA" />
            </div>
          )}
          {renderPoints(innerRadarWidth3, innerRadarWidth4, assess, 10, hoverId, onMouseEnter, onMouseLeave)}
        </div>
        <div className={`radar__inner-radar radar__inner-radar--4
            ${hoverItem && (hoverItem.status === REINFORCE || groupStatus === REINFORCE) && radarHighlightClassName}`} 
          style={{width: innerRadarWidth4, height: innerRadarHeight4, backgroundColor: colors[2]}}>
          {groupStatus === REINFORCE && (
            <div className="radar-group-status">
              <img className="af-logo__brand" style={{maxWidth: width/20, maxHeight: height/20}} src={logo} alt="AXA" />
            </div>
          )}
          {renderPoints(innerRadarWidth4, innerRadarWidth5, reinforce, 10, hoverId, onMouseEnter, onMouseLeave)}
        </div>
        <div className={`radar__inner-radar radar__inner-radar--5
            ${hoverItem && (hoverItem.status === EXCEL || groupStatus === EXCEL) && radarHighlightClassName}`} 
          style={{width: innerRadarWidth5, height: innerRadarHeight5, backgroundColor: colors[3]}}>
          {groupStatus === EXCEL && (
            <div className="radar-group-status">
              <img className="af-logo__brand" style={{maxWidth: width/20, maxHeight: height/20}} src={logo} alt="AXA" />
            </div>
          )}
          {renderPoints(innerRadarWidth5, 0, excel, 3, hoverId, onMouseEnter, onMouseLeave)}
        </div>
      </div>
      <div className="radar__legend--container" style={{width}}>
        <div style={{width: width - innerRadarWidth2, backgroundColor: colors[0]}}
          className="radar__legend radar__legend--deprecated">Deprecated</div>
        <div className="radar__legend" style={{width: '10px'}} />
        <div style={{width: innerRadarWidth3 - innerRadarWidth4, backgroundColor: colors[1]}}
          className="radar__legend radar__legend--assess">Assess</div>
        <div style={{width: innerRadarWidth4 - innerRadarWidth5, backgroundColor: colors[2]}}
          className="radar__legend radar__legend--reinforce">Reinforce</div>
        <div style={{width: innerRadarWidth5, backgroundColor: colors[3]}}
          className="radar__legend radar__legend--excel">Excel</div>
      </div>
      {groupStatus && <div className="radar__group-status-legend">
        <img className="radar__group-status-legend--image" src={logo} alt="AXA" />
        <span>AXA Group Status recommendation</span>
      </div>}
    </div>
  );
};
