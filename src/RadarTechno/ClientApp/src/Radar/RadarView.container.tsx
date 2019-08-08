import React, { useContext, useEffect, useState } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import { closeModal, viewItem } from '../AllItems';
import { customFetchWithUser }from '../customFetch';
import { IFormattedEntityTechnology } from '../Entity';
import { formatEntityTechnology } from '../Entity/Entity.action';
import { EnvironmentContext } from '../Environment';
import logMiddleware from '../logMiddleware';
import { UserContext } from '../User';
import { loadRadarTechnologies, setHoverId } from './Radar.action';
import { LOAD_TECHNOLOGIES, radarColors } from './Radar.constants';
import { initState, radarReducer } from './Radar.reducer';
import { getRadarTechnologies } from './Radar.services';
import { RadarView } from './RadarView';

const itemsMiddleware = () => {
  return next => action => {
    if(action.type === LOAD_TECHNOLOGIES) {
      next({
        ...action, 
        radarTechnologies: action.radarTechnologies.length ? formatEntityTechnology(action.radarTechnologies) : []
      });
    } else {
      next(action);
    }
  };
};

const EnhancedRadarView = () => {
  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;
  const [state, dispatch] = useEnhancedReducer(
    radarReducer,
    initState,
    [thunkMiddleware, logMiddleware, itemsMiddleware],
  );
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    const { entity } = currentUser;
    dispatch(loadRadarTechnologies(
        getRadarTechnologies(customFetchWithUser(fetch)(apiUrl)(currentUser))(entity.id)
      ));
  }, []);

  const handleScroll = () => {
    const top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    setSticky(top > 250 && document.body.scrollHeight > 1090);
  };

  const onMouseEnter = (id: string) => dispatch(setHoverId(id)); 
  const onMouseLeave = () => dispatch(setHoverId(null)); 
  const actionOnClose = () => dispatch(closeModal());
  const actionOnClick = (item: IFormattedEntityTechnology) => dispatch(viewItem(item));

  return (
    <RadarView
      sticky={sticky}
      hoverId={state.hoverId}
      onTechnologyClick={actionOnClick}
      onTechnologyModalClose={actionOnClose}
      isModalOpen={state.isModalOpen}
      modalItem={state.modalItem}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      colors={radarColors}
      loading={state.loading}
      radarTechnologies={state.radarTechnologies} />
  );
};
export default EnhancedRadarView;
