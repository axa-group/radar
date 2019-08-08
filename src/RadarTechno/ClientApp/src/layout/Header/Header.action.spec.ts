import { onLogout } from "./Header.action";

class LocalStorageMock implements Storage {
  public length = 0;
  public key = jest.fn();
  public getItem = jest.fn();
  public setItem = jest.fn();
  public clear = jest.fn();
  public removeItem = jest.fn();
}

describe('Header action test', () => {
  test('onLogout clears storage', () => {
    const localStorageMock = new LocalStorageMock();
    onLogout(localStorageMock);
    expect(localStorageMock.removeItem).toBeCalledWith('token');
  });
});
