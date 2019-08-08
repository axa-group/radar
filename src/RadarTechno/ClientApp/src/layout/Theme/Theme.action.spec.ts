import { toggleDarkTheme } from "./Theme.action";
import { TOGGLE_DARK_THEME } from "./Theme.constants";

class LocalStorageMock implements Storage {
  public length = 0;
  public key = jest.fn();
  public getItem = jest.fn();
  public setItem = jest.fn();
  public clear = jest.fn();
  public removeItem = jest.fn();
}

describe('Theme action test', () => {
  test('toggleDarkTheme sets item in storage and dispatch TOGGLE_DARK_THEME action', () => {
    const storage = new LocalStorageMock();
    const state = {darkTheme: false};
    const dispatch = jest.fn();
    
    toggleDarkTheme(state, dispatch, storage);

    expect(storage.setItem).toHaveBeenCalledWith('darkTheme', JSON.stringify(!state.darkTheme));
    expect(dispatch).toHaveBeenCalledWith({type: TOGGLE_DARK_THEME});
  });
});
