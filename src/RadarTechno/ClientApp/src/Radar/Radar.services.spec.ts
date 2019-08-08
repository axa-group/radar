import { getRadarTechnologies } from './Radar.services';

const fakeEntities = [{
  id:'5a4e2821a111b016c4cc5804',
  name:'AXA France',
  adminList:['Test@axa.fr'],
  technologies: [{ technologyId: '5823926b69170e15d895fda7', status: 'Excel' }],
  version:0,
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
}];

const fakeRadarTechnologies = [{
  technologyId: fakeEntityTechnologies[0].technology.id,
  status :  fakeEntityTechnologies[0].status,
  technology: fakeEntityTechnologies[0].technology,
}];

const fakeUser = {
  id:'1',
  email:'Test',
  entity: fakeEntities[0],
  token:'token',
};

describe('radar services test', () => {
  test('getRadarTechnologies returns entity technologies', async() => {
    const { entity } = fakeUser;
    const fetch = jest.fn();
    const blob = new Blob([JSON.stringify(fakeRadarTechnologies, null, 2)], {type : 'application/json'});
    const init = {status: 200};
    const rawResponse = new Response(blob, init);
    fetch.mockReturnValue(rawResponse);
    const response = await getRadarTechnologies(fetch)(fakeEntities[0].id);
    expect(fetch.mock.calls[0][0]).toBe(`entities/${entity.id}/technologies`);
    expect(response).toEqual(fakeRadarTechnologies);
  });
});
