import { SET_POSITION, SET_VISIBLE } from '../constants/actions';
import { initState, menuReducer } from './Menu.reducer';

describe('menu reducer state', () => {
  test('default action returns state', () => {
    const newState = menuReducer(initState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toBe(initState);
  });

  test('SET_VISIBLE action', () => {
    const visible = true;
    const action = { visible, type: SET_VISIBLE };
    const actual = menuReducer(initState, action);

    expect(actual.visible).toBeTruthy();
  });

  test('SET_POSITION action', () => {
    const position = 2;
    const actual = menuReducer(initState, { position, type: SET_POSITION });
    expect(actual.position).toBe(position);
  });

});
