import { createOptions, createUrlFromPath, customFetch, customFetchWithUser} from "./customFetch";

describe('customFetch tests', () => {
  test('createUrlFromPath returns url with path', () => {
    const baseUrl = 'https://localhost/{path}';
    const path = 'path';
    const url = createUrlFromPath(baseUrl, path);

    expect(url).toBe('https://localhost/path');
  });

  test('createOptions returns options with content-type', () => {
    const options = {headers: {}};
    const newOptions = createOptions(options);
    expect(newOptions).toEqual({headers: {"map": {"content-type": "application/json"}}});
  });

  test('createOptions returns options with content-type and authorization', () => {
    const options = {headers: {}};
    const fakeUser = {
      id:'1',
      email:'Test',
      entity: {
        id:'5a4e2821a111b016c4cc5804',
        name:'AXA France',
        adminList:['Test@axa.fr'],
        technologies: [{ id: '', technologyId: '5823926b69170e15d895fda7', status: 'Excel' }],
        version:0,
      },
      token:'token',
    };
    const newOptions = createOptions(options, fakeUser);
    expect(newOptions).toEqual({headers: {"map": {"content-type": "application/json", "authorization": "Bearer token"}}});
  });

  test('customFetch calls fetch with url and path, returns a response', async () => {
    const fetch = jest.fn();
    const baseUrl = 'https://localhost/{path}';
    const path = 'path';
    const options = {headers: {}};

    fetch.mockReturnValue(new Response());
    const response = await customFetch(fetch)(baseUrl)(path, options);

    expect(fetch).toHaveBeenCalledWith(
      'https://localhost/path',
      {headers: {"map": {"content-type": "application/json"}}}
    );
    expect(response).toEqual(new Response());
  });

  test('customFetchWithUser calls fetch with url and path, returns a response', async () => {
    const fetch = jest.fn();
    const baseUrl = 'https://localhost/{path}';
    const path = 'path';
    const options = {headers: {}};
    const fakeUser = {
      id:'1',
      email:'Test',
      entity: {
        id:'5a4e2821a111b016c4cc5804',
        name:'AXA France',
        adminList:['Test@axa.fr'],
        technologies: [{ id: '', technologyId: '5823926b69170e15d895fda7', status: 'Excel' }],
        version:0,
      },
      token:'token',
    };

    fetch.mockReturnValue(new Response());
    const response = await customFetchWithUser(fetch)(baseUrl)(fakeUser)(path, options);

    expect(fetch).toHaveBeenCalledWith(
      'https://localhost/path',
      {headers: {"map": {"content-type": "application/json", "authorization": "Bearer token"}}}
    );
    expect(response).toEqual(new Response());
  });
  
});
