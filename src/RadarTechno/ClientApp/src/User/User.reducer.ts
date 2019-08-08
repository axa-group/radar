import { LOGIN, STOP_LOADING, VALIDATE_TOKEN } from '../constants/actions';
import { ICurrentUser } from '../types';

interface IState {
  loading: boolean;
  currentUser: ICurrentUser;
}

interface IAction {
  type: string;
  user?: ICurrentUser;
}

export const initState = {
  currentUser: null,
  loading: true,
};

export const userReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, currentUser: action.user };
    case STOP_LOADING:
      return { ...state, loading: false };
    case VALIDATE_TOKEN:
      return { ...state, currentUser: action.user, loading: false };
    default:
      return state;
  }
};
