import { TOGGLE_DARK_THEME } from './Theme.constants';
import { IAction, IState } from './Theme.reducer';

export const toggleDarkTheme = (state: IState, dispatch: (action: IAction) => void, storage: Storage) => {
  storage.setItem('darkTheme', JSON.stringify(!state.darkTheme));
  dispatch({type: TOGGLE_DARK_THEME});
};
