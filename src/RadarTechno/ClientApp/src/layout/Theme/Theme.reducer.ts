import { TOGGLE_DARK_THEME } from "./Theme.constants";

export interface IState {
  darkTheme: boolean;
}

export interface IAction {
  type: string;
  darkTheme?: boolean;
}

export const themeReducer = (state: IState, action: IAction) => {
  switch(action.type) {
    case TOGGLE_DARK_THEME:
      return {
        ...state,
        darkTheme: !state.darkTheme
      };
    default:
      return state;
  }
};
