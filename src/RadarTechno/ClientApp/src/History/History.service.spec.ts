import { getHistory } from "./History.service";

const fakeHistory = { 
  "_id" : "5ccaec7275dbbc092cb9029b", 
  "author" : "Test@axa.fr", 
  "type" : "technology", 
  "elementId" : "5823926b69170e15d895fda0", 
  "entityId" : null, 
  "diff" : "{}", 
  updateDate: new Date('2018-07-23T14:41:36.328Z'),
};

describe('History service test', () => {
  test('History service should return history', async () => {
    const fetch = jest.fn();
    const type = 'type';
    const id = 'id';
    const blob = new Blob([JSON.stringify(fakeHistory, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);

    const response = await getHistory(fetch)(type, id)();
    expect(response).toEqual(fakeHistory);
  });
});
