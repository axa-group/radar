import { CLOSE_MODAL, VIEW_ITEM } from '../AllItems';
import { IFormattedEntityTechnology } from '../Entity';
import { LOAD_TECHNOLOGIES, SET_HOVER_ID } from './Radar.constants';
import { initState, radarReducer } from './Radar.reducer';

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

const fakeRadarTechnologies: IFormattedEntityTechnology[] = [{
  ...fakeTechnologies[0],
  status :  fakeEntityTechnologies[0].status,
  technologyId: fakeTechnologies[0].id
}];

describe('radar reducer state', () => {
  test('default action returns state', () => {
    const newState = radarReducer(initState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toBe(initState);
  });

  test('load technologies action', () => {
    const action = { type: LOAD_TECHNOLOGIES, radarTechnologies: fakeRadarTechnologies };
    const actual = radarReducer(initState, action);

    expect(actual.radarTechnologies).toBe(fakeRadarTechnologies);
    expect(actual.loading).toBeFalsy();
  });

  test('set hoverId action', () => {
    const action = { type: SET_HOVER_ID, hoverId: 'id' };
    const actual = radarReducer(initState, action);

    expect(actual.hoverId).toBe('id');
  });

  test('close modal action', () => {
    const action = { type: CLOSE_MODAL};
    const state = {...initState, isModalOpen: true};
    const actual = radarReducer(state, action);

    expect(actual.isModalOpen).toBeFalsy();
  });

  test('view item action', () => {
    const action = { type: VIEW_ITEM, item: fakeRadarTechnologies[0]};
    const actual = radarReducer(initState, action);

    expect(actual.modalItem).toEqual(action.item);
    expect(actual.isModalOpen).toBeTruthy();
  });
});
