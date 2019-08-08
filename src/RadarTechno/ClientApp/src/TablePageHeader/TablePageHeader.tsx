import React from 'react';
import { Link } from 'react-router-dom';

import './TablePageHeader.scss';

export const TablePageHeader = ({
  title,
  ctaPath,
  ctaText,
  ctaVisible,
  excelLink,
  excelFileName,
}: {
  title: string,
  ctaPath: string,
  ctaText: string,
  ctaVisible: boolean,
  excelLink: string,
  excelFileName: string,
}) => (
  <div className="radar-table__header">
    <h2 className="af-subtitle radar-table__title">{title}</h2>
    <div className="af-link--group">
      {ctaVisible && <Link to={ctaPath} className="af-link af-link--hasIconLeft">
        <i className="glyphicon glyphicon-plus" />
        <span className='af-link__text'>{ctaText}</span>
      </Link>}
      <a className="af-link af-link--hasIconLeft" 
        href={excelLink} download={excelFileName}>
        <i className="glyphicon glyphicon-save-alt" />
        <span className="af-link__text">Export</span>
      </a> 
    </div>
  </div>
);
