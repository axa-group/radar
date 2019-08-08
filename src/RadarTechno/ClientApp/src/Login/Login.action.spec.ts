import { LOGIN } from '../constants/actions';
import { submitCallback } from './Login.action';

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

describe('login action', () => {
  test('submitCallback should dispatch LOGIN action with user', () => {
    const dispatch = jest.fn();
    submitCallback(dispatch)(fakeUser);

    expect(dispatch.mock.calls[0][0]).toEqual({ type: LOGIN, user: fakeUser });
  });

  test('submitCallback should not dispatch', () => {
    const dispatch = jest.fn();
    const response = { message: 'ERROR' };
    submitCallback(dispatch)(response);

    expect(dispatch).toBeCalledTimes(0);
  });
});
