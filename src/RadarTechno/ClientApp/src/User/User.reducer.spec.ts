import { LOGIN, STOP_LOADING, VALIDATE_TOKEN } from '../constants/actions';
import { initState, userReducer } from './User.reducer';

const fakeEntities = [{
  id:'5a4e2821a111b016c4cc5804',
  name:'AXA France',
  adminList:['Test@axa.fr'],
  technologies: [{ id: '', technologyId: '5823926b69170e15d895fda7', status: 'Excel' }],
  version:0,
}];

const fakeUser = {
  id:'1',
  email:'Test',
  entity: fakeEntities[0],
  token:'token',
};

describe('radar reducer state', () => {
  test('default action returns state', () => {
    const newState = userReducer(initState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toBe(initState);
  });

  test('LOGIN action', () => {
    const action = { type: LOGIN, user: fakeUser };
    const actual = userReducer(initState, action);
    expect(actual.currentUser).toBe(fakeUser);
  });

  test('STOP_LOADING action', () => {
    const action = { type: STOP_LOADING };
    const actual = userReducer(initState, action);
    expect(actual.loading).toBe(false);
  });

  test('VALIDATE_TOKEN action', () => {
    const action = { type: VALIDATE_TOKEN, user: fakeUser };
    const actual = userReducer(initState, action);
    expect(actual.currentUser).toBe(fakeUser);
    expect(actual.loading).toBe(false);
  });
});
