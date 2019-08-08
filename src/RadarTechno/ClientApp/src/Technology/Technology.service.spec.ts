import { MSG_REQUIRED } from '../constants';
import { CATEGORY, CategoryOptions, DESCRIPTION, NAME, SCOPE } from './Technology.constants';
import { addTechnology, getTechnologies, getTechnologiesNotInEntity, getTechnology, updateTechnology } from './Technology.service';

const fakeTechnologies = [{
  updateDate: new Date('2018-07-23T14:41:36.328Z'),
  id:'5823926b69170e15d895fda7',
  version:0,
  category:'frameworks',
  name:'Node.JS',
  scope:'',
  key:'node.js',
}];

const fields = {
  [NAME]: { name: NAME, label: 'Name *', value: '', message: MSG_REQUIRED, type: 'text' },
  [CATEGORY]: { name: CATEGORY, label: 'Category *', value: '', message: MSG_REQUIRED, type: 'select', options: CategoryOptions},
  [DESCRIPTION]: { name: DESCRIPTION, label: 'Description', value: '', message: '', type: 'text' },
  [SCOPE]: { name: SCOPE, label: 'Scope and usage restriction', value: '', message: '', type: 'text'},
};

describe('Technology service test', () => {
  test('getTechnologies returns technologies', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeTechnologies, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await getTechnologies(fetch)();
    expect(response).toEqual(fakeTechnologies);
  });

  test('getTechnology returns technology', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeTechnologies[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await getTechnology(fetch)('5823926b69170e15d895fda7');
    expect(response).toEqual(fakeTechnologies[0]);
  });

  test('addTechnology returns an error message', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify({ message: 'Unauthorized'}, null, 2)], {type : 'application/json'});
    const init = {status: 401};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const result = await addTechnology(fetch)(fields);
    expect(result).toEqual({ message: 'Unauthorized'});
  });

  test('addTechnology returns a technology', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeTechnologies[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const result = await addTechnology(fetch)(fields);
    expect(result).toEqual(fakeTechnologies[0]);
  });

  test('updateTechnology returns an updated technology', async () => {
    const technology = {
      [NAME]: { name: NAME, label: 'Name', value: '', message: null, type: 'text' },
      [DESCRIPTION]: { name: DESCRIPTION, label: 'Description', value: '', message: null, type: 'textarea' },
      [SCOPE]: { name: SCOPE, label: 'Scope and usage restriction', value: '', message: null, type: 'textarea'},
      [CATEGORY]: { name: CATEGORY, label: 'Category', value: 'frameworks', message: null, type: 'select', options: CategoryOptions},
    };

    const readOnlyTechnology = {
      [NAME]: { name: NAME, label: 'Name', value: '', message: null, type: 'text' },
      [DESCRIPTION]: { name: DESCRIPTION, label: 'Description', value: '', message: null, type: 'textarea' },
      [SCOPE]: { name: SCOPE, label: 'Scope and usage restriction', value: '', message: null, type: 'textarea'},
      [CATEGORY]: { name: CATEGORY, label: 'Category', value: 'tools', message: null, type: 'select', options: CategoryOptions},
    };

    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeTechnologies[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const result = await updateTechnology(fetch)('5823926b69170e15d895fda7')(technology, readOnlyTechnology);
    expect(result).toEqual(fakeTechnologies[0]);
  });

  test('getTechnologiesNotInEntity returns technologies', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeTechnologies, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await getTechnologiesNotInEntity(fetch)("id")();
    expect(response).toEqual(fakeTechnologies);
  });
});
