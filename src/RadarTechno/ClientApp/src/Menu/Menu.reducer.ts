import { SET_POSITION, SET_VISIBLE } from '../constants/actions';

interface IState {
  position: number;
  visible: boolean;
}

interface IAction {
  type: string;
  position?: number;
  visible?: boolean;
}

export const initState = {
  position: 0,
  visible: false,
};

export const menuReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case SET_VISIBLE:
      return { ...state, visible: action.visible };
    case SET_POSITION:
      return { ...state, position: action.position, visible: false };
    default:
      return state;
  }
};
