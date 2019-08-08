import { loadRadarTechnologies, setHoverId } from './Radar.action';
import { LOAD_TECHNOLOGIES, SET_HOVER_ID } from './Radar.constants';

const fakeTechnologies = [{
  updateDate:'2018-07-23T14:41:36.328Z',
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

describe('radar action test', () => {
  test('load technologies dispatch LOAD_TECHNOLOGIES with items', async () => {
    const fakeLoadTechnologies = (
      Promise.resolve(fakeRadarTechnologies)
    );
    const dispatch = jest.fn();

    await loadRadarTechnologies(fakeLoadTechnologies)(dispatch);

    expect(dispatch.mock.calls[0][0]).toEqual({ type: LOAD_TECHNOLOGIES, radarTechnologies: fakeRadarTechnologies });
  });

  test('load technologies dispatch LOAD_TECHNOLOGIES with empty array', async () => {
    const fakeLoadTechnologies = (
      Promise.resolve(null)
    );
    const dispatch = jest.fn();

    await loadRadarTechnologies(fakeLoadTechnologies)(dispatch);

    expect(dispatch.mock.calls[0][0]).toEqual({ type: LOAD_TECHNOLOGIES, radarTechnologies: [] });
  });

  test('setHoverId dispatch SET_HOVER_ID action with id', () => {
    const dispatch = jest.fn();

    setHoverId('id')(dispatch);

    expect(dispatch.mock.calls[0][0]).toEqual({type: SET_HOVER_ID, hoverId: 'id'});
  });
});
