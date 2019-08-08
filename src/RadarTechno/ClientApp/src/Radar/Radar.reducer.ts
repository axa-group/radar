import { CLOSE_MODAL, VIEW_ITEM } from '../AllItems';
import { IFormattedEntityTechnology } from '../Entity';
import { LOAD_TECHNOLOGIES, SET_HOVER_ID } from './Radar.constants';

interface IState {
  loading: boolean;
  radarTechnologies: IFormattedEntityTechnology[];
  hoverId: string;
  isModalOpen: boolean;
  modalItem: IFormattedEntityTechnology;
}

interface IAction {
  type: string;
  radarTechnologies?: IFormattedEntityTechnology[];
  hoverId?: string;
  isModalOpen?: boolean;
  item?: IFormattedEntityTechnology;
}

export const initState = { 
  loading: true, 
  radarTechnologies: null, 
  hoverId: null, 
  isModalOpen: false, 
  modalItem: null 
};

export const radarReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case LOAD_TECHNOLOGIES:
      return {
        ...state,
        loading: false,
        radarTechnologies: action.radarTechnologies,
      };
    case SET_HOVER_ID:
      return {
        ...state,
        hoverId: action.hoverId
      };
    case CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false
      };
    case VIEW_ITEM:
      return {
        ...state,
        modalItem: action.item,
        isModalOpen: true
      };
    default:
      return state;
  }
};
