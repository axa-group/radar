import { getEnvironmentData } from "./Environment.action";

describe('Envrionment action test', () => {
  test('geEnvironmentData calls fetch with environment file', async() => {
    const fetch = jest.fn();
    const env = 'production';
    const debug = {hello: "world"};
    const blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const response = new Response(blob, init);
    fetch.mockReturnValue(response);

    const result = await getEnvironmentData(env, fetch);

    expect(fetch).toHaveBeenCalledWith('./environment.json');
    expect(result).toEqual({"hello": "world"});
  });

  test('geEnvironmentData calls fetch with dev environment file', async() => {
    const fetch = jest.fn();
    const env = 'development';
    const debug = {hello: "world"};
    const blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const response = new Response(blob, init);
    fetch.mockReturnValue(response);

    const result = await getEnvironmentData(env, fetch);

    expect(fetch).toHaveBeenCalledWith('./environment.dev.json');
    expect(result).toEqual({"hello": "world"});
  });
});
