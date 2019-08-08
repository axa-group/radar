import { NavBar, NavBarItem, Title } from '@axa-fr/react-toolkit-all';
import React from 'react';
import { Link } from 'react-router-dom';
import { ICurrentUser } from '../types';
import { ALL_TECHNOLOGIES, ENTITIES, HOME, menuPositions, TECHNOLOGIES, USERS, WORKFLOW } from './Menu.constants';

import './Menu.scss';

export const Menu = ({
  user,
  handleClick,
  isMenuVisible,
  position,
  updatePosition,
  hideMenuButton
}: {
  user: ICurrentUser,
  handleClick: (...args: any[]) => any,
  isMenuVisible: boolean,
  position: number,
  updatePosition: (position: number) => any,
  hideMenuButton?: boolean
}) => (
  <>
    {user && <NavBar positionInit={position} isVisible={isMenuVisible} onClick={handleClick}>
      <NavBarItem
        key="home"
        label={HOME}
        actionElt={
          <Link onClick={() => updatePosition(menuPositions[HOME])} className="af-nav__link" to="/">
            {HOME}
          </Link>
        }
      />
      <NavBarItem
        key="workflow"
        label={WORKFLOW}
        actionElt={
          user.entity.workflowUrl ? 
          <a className="af-nav__link" href={user.entity.workflowUrl} rel="noopener" target="_blank">{WORKFLOW}</a> :
          <Link onClick={() => updatePosition(menuPositions[WORKFLOW])} className="af-nav__link" to="/workflow">
            {WORKFLOW}
          </Link>
        }
      />
      <NavBarItem
        key="technologies"
        label={TECHNOLOGIES}
        actionElt={
          <Link onClick={() => updatePosition(menuPositions[TECHNOLOGIES])} className="af-nav__link" to="/technologies">
            Technologies in {user.entity.name}
          </Link>
        }
      />
      {(user.role === 'admin' || user.role === 'root') && <NavBarItem
        key="all-technologies"
        label={ALL_TECHNOLOGIES}
        actionElt={
          <Link onClick={() => updatePosition(menuPositions[ALL_TECHNOLOGIES])} className="af-nav__link" to="/all-technologies">
            List of technologies
          </Link>
        }
      />}
      {(user.role === 'admin' || user.role === 'root') && <NavBarItem
        key="users"
        label={USERS}
        actionElt={
          <Link onClick={() => updatePosition(menuPositions[USERS])} className="af-nav__link" to="/users">
            {USERS}
          </Link>
        }
      />}
      {user.role === 'root' && <NavBarItem
        key="entities"
        label={ENTITIES}
        actionElt={
          <Link onClick={() => updatePosition(menuPositions[ENTITIES])} className="af-nav__link" to="/entities">
            {ENTITIES}
          </Link>
        }
      />}
    </NavBar>}
    <Title
      title="Technology Radar"
      subtitle={`${user ? user.entity.name : ''}`}
      toggleMenu={handleClick}
      classModifier={hideMenuButton ? 'hide-menu-button' : 'show-menu-button'} 
    />
  </>
);
