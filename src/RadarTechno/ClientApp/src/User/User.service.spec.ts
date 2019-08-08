import { EMAIL, ENTITY, NAME, PASSWORD, ROLE } from './User.constants';
import { addUser, getUsers, updateUser, validateToken } from './User.service';

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
  name: 'name',
  token:'token',
};

describe(('User service test'), () => {
  test('validateToken returns error', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify({message: 'Invalid Token'}, null, 2)], {type : 'application/json'});
    const init = {status: 400};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);

    const response = await validateToken(fetch)('token');
    expect(response).toEqual({ message: 'Invalid Token' });
  });

  test('validateToken returns user', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeUser, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);

    const response = await validateToken(fetch)('token');
    expect(response).toEqual(fakeUser);
  });

  test('getUsers returns users', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify([fakeUser], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);

    const response = await getUsers(fetch)();
    expect(response).toEqual([fakeUser]);
  });

  test('addUser returns user', async() => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify([fakeUser], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const fields = {
      [NAME]: {name: NAME, label: 'Name', value: 'name', message: null, type: 'text'},
      [EMAIL]: { name: EMAIL, label: 'Email *', value: 'Test', message: null, type: 'text' },
      [PASSWORD]: { name: PASSWORD, label: 'Password *', value: 'pass', message: null, type: 'pass' },
      [ROLE]: { name: ROLE, label: 'Role *', value: 'user', message: null, type: 'select' },
      [ENTITY]: { name: ENTITY, label: 'Entity *', value: '5a4e2821a111b016c4cc5804', message: null, type: 'select'},
    };

    const response = await addUser(fetch)(fields);
    expect(response).toEqual([fakeUser]);
  });
  
  test('updateUser with updated role, name and entity returns an updated user', async () => {
    const fetch = jest.fn();
    const readOnlyFields = { 
      [NAME]: {name: NAME, label: 'Name', value: 'name', message: null, type: 'text'},
      [ROLE]: { name: ROLE, label: 'Role *', value: 'user', message: null, type: 'select' },
      [ENTITY]: { name: ENTITY, label: 'Entity *', value: '5a4e2821a111b016c4cc5804', message: null, type: 'select'},
    };
    const updatedFields = { 
      [NAME]: {name: NAME, label: 'Name', value: 'new name', message: null, type: 'text'},
      [ROLE]: { name: ROLE, label: 'Role *', value: 'root', message: null, type: 'select' },
      [ENTITY]: { name: ENTITY, label: 'Entity *', value: '5a4e2821a111b016c4cc5805', message: null, type: 'select'},
    };
    const blob = new Blob([JSON.stringify(fakeEntities[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await updateUser(fetch)('5a4e2821a111b016c4cc5804')(updatedFields, readOnlyFields);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'PATCH',
      body: JSON.stringify([
        {"op": "replace", "path": '/name', "value": 'new name'},
        {"op": "replace", "path": '/role', "value": 'root'},
        {"op": "replace", "path": '/entityList', "value": ['5a4e2821a111b016c4cc5805']}
      ])
    });
    expect(response).toEqual(fakeEntities[0]);
  });

  
  test('updateUser with updated role returns an updated user', async () => {
    const fetch = jest.fn();
    const readOnlyFields = { 
      [NAME]: {name: NAME, label: 'Name', value: 'name', message: null, type: 'text'},
      [ROLE]: { name: ROLE, label: 'Role *', value: 'user', message: null, type: 'select' },
      [ENTITY]: { name: ENTITY, label: 'Entity *', value: '5a4e2821a111b016c4cc5804', message: null, type: 'select'},
    };
    const updatedFields = { 
      [NAME]: {name: NAME, label: 'Name', value: 'name', message: null, type: 'text'},
      [ROLE]: { name: ROLE, label: 'Role *', value: 'root', message: null, type: 'select' },
      [ENTITY]: { name: ENTITY, label: 'Entity *', value: '5a4e2821a111b016c4cc5804', message: null, type: 'select'},
    };
    const blob = new Blob([JSON.stringify(fakeEntities[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await updateUser(fetch)('5a4e2821a111b016c4cc5804')(updatedFields, readOnlyFields);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'PATCH',
      body: JSON.stringify([
        {"op": "replace", "path": '/role', "value": 'root'}
      ])
    });
    expect(response).toEqual(fakeEntities[0]);
  });
});
