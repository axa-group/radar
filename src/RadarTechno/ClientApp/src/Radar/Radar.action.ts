import { IPopulatedEntityTechnology } from '../Entity';
import { LOAD_TECHNOLOGIES, SET_HOVER_ID } from './Radar.constants';

export const loadRadarTechnologies = (
  loadRadarTechnologiesAsync: Promise<any>,
) => (
  dispatch: (...args: any[]) => any,
) => {
  return loadRadarTechnologiesAsync.then((technologies: IPopulatedEntityTechnology[]) => {
    dispatch({
      type: LOAD_TECHNOLOGIES,
      radarTechnologies: technologies ? technologies : [],
    });
  });
};

export const setHoverId = (id: string) => (
  dispatch: (...args: any[]) => any,
) => {
  dispatch({type: SET_HOVER_ID, hoverId: id});
};
