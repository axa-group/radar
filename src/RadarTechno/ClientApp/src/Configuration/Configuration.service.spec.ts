import { getConfigurationAsync } from "./Configuration.service";

const fakeConfiguration = { 
  "version" : "1.0.0.0"
};

describe('Configuration service test', () => {
  test('Configuration service should return configuration', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeConfiguration, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);

    const response = await getConfigurationAsync(fetch)();
    expect(response).toEqual(fakeConfiguration);
  });
});
