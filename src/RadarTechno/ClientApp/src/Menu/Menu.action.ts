import { SET_POSITION, SET_VISIBLE } from '../constants/actions';

export const handleClick = () => (dispatch: (...args: any[]) => any, getState: (...args: any[]) => any) => {
  const body = document.body;
  body.classList.toggle('af-menu-open');
  const { visible } = getState();
  dispatch({ type: SET_VISIBLE, visible: !visible });
};

export const initPosition = () => (dispatch: (...args: any[]) => any) => {
  const paths = ['/workflow', '/technologies', '/all-technologies', '/users', '/entities'];
  const position = paths.indexOf(location.pathname) + 1;
  dispatch({ position, type: SET_POSITION });
};

export const setPosition = (position: number) => (dispatch: (...args: any[]) => any) => {
  dispatch({ position, type: SET_POSITION });
};
