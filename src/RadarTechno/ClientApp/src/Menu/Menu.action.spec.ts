import { SET_POSITION, SET_VISIBLE } from '../constants/actions';
import { handleClick, initPosition, setPosition } from './Menu.action';

describe('menu action test', () => {
  test('initPosition test', () => {
    const dispatch = jest.fn();
    initPosition()(dispatch);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: SET_POSITION, position: 0 });
  });

  test('handleClick', () => {
    const getState = jest.fn();
    getState.mockReturnValue({ visible: false });
    const dispatch = jest.fn();
    handleClick()(dispatch, getState);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: SET_VISIBLE, visible: true });
  });

  test('setPosition dispatch SET_POSITION action', () => {
    const position = 2;
    const dispatch = jest.fn();
    setPosition(position)(dispatch);
    expect(dispatch.mock.calls[0][0]).toEqual({ position, type: SET_POSITION });
  });
});
