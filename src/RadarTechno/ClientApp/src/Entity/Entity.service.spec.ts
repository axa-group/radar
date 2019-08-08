import { MSG_REQUIRED } from '../constants';
import { NAME, SCOPE, STATUS, StatusOptions, TECHNOLOGY } from '../Technology/Technology.constants';
import { ADMINLIST, TECHNOLOGY_URLS, WORKFLOW_URL } from './Entity.constants';
import { addEntity, addTechnologyToEntity, getEntities, getEntity, getEntityTechnologies, updateEntity, updateEntityTechnology } from './Entity.service';

const fakeEntities = [{
  id:'5a4e2821a111b016c4cc5804',
  name:'AXA France',
  adminList:['Test@axa.fr'],
  technologies: [{ technologyId: '5823926b69170e15d895fda7', status: 'Excel', applicationUrl: '' }],
  version:0,
  workflowUrl: null
}];

const fakeTechnologies = [{
  updateDate: new Date('2018-07-23T14:41:36.328Z'),
  id:'5823926b69170e15d895fda7',
  version:0,
  category:'frameworks',
  name:'Node.JS',
  scope:'',
  key:'node.js',
}];

const fakeEntityTechnologies = [{
  technology: fakeTechnologies[0],
  status: 'Excel',
  entityTechnologyUrls: []
}];

const fields = {
  [NAME]: { name: NAME, label: 'Name *', value: 'AXA France', message: MSG_REQUIRED, type: 'text' },
  [ADMINLIST] : { name: ADMINLIST, label: 'Admin list', values: ['Test@axa.fr'], message: null, type: 'multi-select', options: []},
  [WORKFLOW_URL]: { name: WORKFLOW_URL, label: 'Workflow url', value: '', message: null, type: 'text' }
};

const entityTechnofields = {
  [TECHNOLOGY]: { name: TECHNOLOGY, label: 'Technology *', value: 'id', message: null, type: 'multi-select', options: [] },
  [STATUS] : { name: STATUS, label: 'Status *', value: 'Excel', message: null, type: 'select', options: StatusOptions},
  [SCOPE] : { name: SCOPE, label: 'Scope', value: '', message: null, type: 'textarea'},
  [TECHNOLOGY_URLS]: { name: TECHNOLOGY_URLS, label: '', values: [{label: '', url: ''}], message: null, type: 'text' }
};

describe('Entity service test', () => {
  test('getEntities returns entities', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeEntities, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await getEntities(fetch)();
    expect(response).toEqual(fakeEntities);
  });

  test('getEntity returns entity', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeEntities[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await getEntity(fetch)('5a4e2821a111b016c4cc5804');
    expect(response).toEqual(fakeEntities[0]);
  });

  test('getEntityTechnologies returns entity technologies', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeEntityTechnologies, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await getEntityTechnologies(fetch)('5a4e2821a111b016c4cc5804')();
    expect(response).toEqual(fakeEntityTechnologies);
  });

  test('addEntity without workflowUrl returns a new entity', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeEntities[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await addEntity(fetch)(fields);
    expect(response).toEqual(fakeEntities[0]);
  });

  
  test('addEntity with workflowUrl returns a new entity', async () => {
    const fieldsWithWorkflow = {
      ...fields,
      [WORKFLOW_URL] : {...fields[WORKFLOW_URL], value: 'url'}
    };
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeEntities[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await addEntity(fetch)(fieldsWithWorkflow);
    expect(response).toEqual(fakeEntities[0]);
  });

  test('AddTechnologyToEntity returns an update result', async () => {
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(
      {"isAcknowledged":true,"isModifiedCountAvailable":true,"matchedCount":1,"modifiedCount":1,"upsertedId":null},
      null,
      2)], 
      {type : 'application/json'}
    );
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    
    const response = await addTechnologyToEntity(fetch)(fakeEntities[0].id)(entityTechnofields);
    expect(response).toEqual({"isAcknowledged":true,"isModifiedCountAvailable":true,"matchedCount":1,"modifiedCount":1,"upsertedId":null});
  });

  test('updateEntity without workflowUrl returns an updated entity', async () => {
    const fetch = jest.fn();
    const readOnlyFields = fields;
    const updatedFields = { 
      [NAME]: {...fields[NAME]},
      [ADMINLIST]: {...fields[ADMINLIST], values: ['Test@axa.fr', 'Test2@axa.fr']},
      [WORKFLOW_URL]: { ...fields[WORKFLOW_URL], value: ''}
    };
    const blob = new Blob([JSON.stringify(fakeEntities[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await updateEntity(fetch)('5a4e2821a111b016c4cc5804')(updatedFields, readOnlyFields);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'PATCH',
      body: JSON.stringify([
        {"op": "replace", "path": '/adminList', "value": ['Test@axa.fr', 'Test2@axa.fr']},
        {"op": "replace", "path": '/workflowUrl', "value": null}
      ])
    });
    expect(response).toEqual(fakeEntities[0]);
  });

  
  test('updateEntity with workflowUrl returns an updated entity', async () => {
    const fetch = jest.fn();
    const readOnlyFields = fields;
    const updatedFields = { 
      [NAME]: {...fields[NAME]},
      [ADMINLIST]: {...fields[ADMINLIST], values: ['Test@axa.fr', 'Test2@axa.fr']},
      [WORKFLOW_URL]: { ...fields[WORKFLOW_URL], value: 'url'}
    };
    const blob = new Blob([JSON.stringify(fakeEntities[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await updateEntity(fetch)('5a4e2821a111b016c4cc5804')(updatedFields, readOnlyFields);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'PATCH',
      body: JSON.stringify([
        {"op": "replace", "path": '/adminList', "value": ['Test@axa.fr', 'Test2@axa.fr']},
        {"op": "replace", "path": '/workflowUrl', "value": 'url'}
      ])
    });
    expect(response).toEqual(fakeEntities[0]);
  });


  test('updateEntityTechnology returns an updated entity', async () => {
    const fetch = jest.fn();
    const updatedFields = { 
      [TECHNOLOGY]: {...entityTechnofields[TECHNOLOGY]},
      [STATUS]: {...entityTechnofields[STATUS], value: 'Assess'},
      [SCOPE]: {...entityTechnofields[SCOPE], value: 'scope'},
      [TECHNOLOGY_URLS]: {...entityTechnofields[TECHNOLOGY_URLS], values: [{label: '', url: ''}]}
    };
    const blob = new Blob([JSON.stringify(fakeEntities[0], null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await updateEntityTechnology(fetch)('5a4e2821a111b016c4cc5804', '1')(updatedFields);
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'PATCH',
      body: JSON.stringify({technologyId: '1', status: 'Assess', scope: 'scope', entityTechnologyUrls: []})
    });
    expect(response).toEqual(fakeEntities[0]);
  });
});
