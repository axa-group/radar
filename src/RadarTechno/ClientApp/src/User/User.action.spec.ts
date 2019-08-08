import { STOP_LOADING, VALIDATE_TOKEN } from '../constants/actions';
import { verifyToken } from './User.action';

class LocalStorageMock implements Storage {
  public length = 0;
  public key = jest.fn();
  public getItem = jest.fn();
  public setItem = jest.fn();
  public clear = jest.fn();
  public removeItem = jest.fn();
}

const fakeEntities = [{
  id:'5a4e2821a111b016c4cc5804',
  name:'AXA France',
  adminList:['Test@axa.fr'],
  technologies: [{ technologyId: '5823926b69170e15d895fda7', status: 'Excel', technology: {
    updateDate:'2018-07-23T14:41:36.328Z',
    id:'5823926b69170e15d895fda7',
    version:0,
    category:'frameworks',
    name:'Node.JS',
    scope:'',
    key:'node.js'} 
  }],
  version:0,
}];

const fakeUser = {
  id:'1',
  email:'Test',
  entity: fakeEntities,
  token:'token',
};

describe('user action', () => {

  test('verifyToken returns STOP_LOADING action', async () => {
    const localStorageMock = new LocalStorageMock();
    localStorageMock.getItem.mockReturnValue(null);
    const fakeValidateToken = () => {
      return Promise.resolve({ token: null });
    };
    const dispatch = jest.fn();
    await verifyToken(fakeValidateToken)(localStorageMock)(dispatch);
    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: STOP_LOADING });
  });

  test('verifyToken returns VALIDATE_TOKEN action with user', async () => {
    const localStorageMock = new LocalStorageMock();
    localStorageMock.getItem.mockReturnValue(JSON.stringify(fakeUser.token));
    const fakeValidateToken = () => {
      return Promise.resolve(fakeUser);
    };
    const dispatch = jest.fn();
    await verifyToken(fakeValidateToken)(localStorageMock)(dispatch);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: VALIDATE_TOKEN, user: fakeUser });
  });

  test('verifyToken returns VALIDATE_TOKEN action with null user', async () => {
    const localStorageMock = new LocalStorageMock();
    localStorageMock.getItem.mockReturnValue(JSON.stringify(fakeUser.token));
    const fakeValidateToken = () => {
      return Promise.resolve({ message: 'Invalid token' });
    };
    const dispatch = jest.fn();
    await verifyToken(fakeValidateToken)(localStorageMock)(dispatch);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: VALIDATE_TOKEN, user: null });
  });
});
