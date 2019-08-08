import { handleResponse } from "./responseHandler";

describe('responseHandler tests', () => {
  test('handleResponse with status 401 returns message', async () => {
    const blob = new Blob();
    const init = {status: 401};
    const response = new Response(blob, init);

    const handledResponse = await handleResponse(response);

    expect(handledResponse).toEqual({'message': 'Unauthorized'});
  });

  test('handleResponse with status 200 returns body', async () => {
    const debug = {hello: "world"};
    const blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const response = new Response(blob, init);

    const handledResponse = await handleResponse(response);

    expect(handledResponse).toEqual(debug);
  });

  
  test('handleResponse with status 204 returns empty', async () => {
    const blob = new Blob([JSON.stringify({}, null, 2)], {type : 'application/json'});
    const init = {status: 204};
    const response = new Response(blob, init);

    const handledResponse = await handleResponse(response);

    expect(handledResponse).toEqual({});
  });
});
