import { EMAIL, PASSWORD } from '../constants';
import { authenticateUser } from './Login.services';

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
  technologies: [{ technologyId: '5823926b69170e15d895fda7', status: 'Excel' }],
  version:0,
}];

const fakeUser = {
  id:'1',
  email:'Test',
  entity: fakeEntities[0],
  token:'token',
};

const fields = {
  [EMAIL]:{
    name: 'Email',
    value:'Test',
    message: null,
  },
  [PASSWORD]:{
    name: 'Password',
    value:'Test',
    message: null,
  },
};

describe('login services test', () => {
  test('authenticate user returns a currentUser', async() => {
    const localStorageMock = new LocalStorageMock();
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeUser, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await authenticateUser(fetch)(localStorageMock)(fields);
    expect(fetch.mock.calls[0][0]).toBe('users/auth');
    expect(response).toEqual(fakeUser);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', JSON.stringify(fakeUser.token));
  });

  test('authenticate user returns a response', async() => {
    const localStorageMock = new LocalStorageMock();
    const message = {message: 'Unauthorized'};
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(message, null, 2)], {type : 'application/json'});
    const init = {status: 401};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await authenticateUser(fetch)(localStorageMock)(fields);
    expect(fetch.mock.calls[0][0]).toBe('users/auth');
    expect(response).toEqual(message);
    expect(localStorageMock.setItem).toBeCalledTimes(0);
  });
});
