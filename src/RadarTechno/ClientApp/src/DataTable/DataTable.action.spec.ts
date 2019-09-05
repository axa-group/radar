import {
  changeFilters,
  changePaging,
  clearFilter,
  filterTableItems,
  setItems,
  sortTable,
} from './DataTable.action';
import {
  TABLE_SET_ITEMS,
  TABLE_SORT_ITEMS,
  TABLE_UPDATE_FILTERS,
  TABLE_UPDATE_PAGING,
} from './DataTable.constants';

const fakeTechnologies = [{
  updateDate:'2018-07-23T14:41:36.328Z',
  id:'5823926b69170e15d895fda7',
  version:0,
  category:'frameworks',
  name:'Node.JS',
  scope:'',
  key:'node.js',
}];

const state = {
  keys: null,
  filters: {},
  items: null,
  loading: true,
  numberPages: 1,
  paging: { page: 1, numberItems: 10 },
  title: '',
  sort: null
};

describe('dataTable action test', () => {
  test('changePaging dispatch UPDATE_PAGINg action with paging', () => {
    const dispatch = jest.fn();
    const paging = { numberItems: 10, page: 2 };
    changePaging(paging)(dispatch);
    expect(dispatch.mock.calls[0][0]).toEqual({ paging, type: TABLE_UPDATE_PAGING });
  });

  test('setItems dispatch SET_ITEMS action with items', async() => {
    const dispatch = jest.fn();
    const asyncGetItems = jest.fn();

    asyncGetItems.mockReturnValue(fakeTechnologies);
    await setItems(asyncGetItems)(dispatch);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: TABLE_SET_ITEMS, items: fakeTechnologies });
  });

  test('changeFilters dispatch UPDATE_FILTERS action with filters', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    getState.mockReturnValue({filters: {description: 'desc'}});
    const filterInput = {name: 'description', id: 'description-filter', value: 'newDesc'};
    changeFilters(filterInput)(dispatch, getState);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: TABLE_UPDATE_FILTERS, filters: {description: 'newDesc'} });
  });

  test('clearFilter dispatch UPDATE_FILTERS action without the deleted filter', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    getState.mockReturnValue({filters: {description: 'desc', name: 'a'}});
    clearFilter('name')(dispatch, getState);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: TABLE_UPDATE_FILTERS, filters: {description: 'desc'} });
  });

  test('sortTable dispatch SORT_ITEMS action with sort object', () => {
    const sort = {sortBy: 'key', reverse: false};
    const dispatch = jest.fn();
    const id = 'key-sort';
    const getState = jest.fn();
    getState.mockReturnValue({sort});
    sortTable(id)(dispatch, getState);
    expect(dispatch.mock.calls[0][0]).toEqual({type: TABLE_SORT_ITEMS, sort: {sortBy: 'key', reverse: true}});
  });

  
  test('sortTable with null sort dispatch SORT_ITEMS action with sort object', () => {
    const sort = null;
    const dispatch = jest.fn();
    const id = 'key-sort';
    const getState = jest.fn();
    getState.mockReturnValue({sort});
    sortTable(id)(dispatch, getState);
    expect(dispatch.mock.calls[0][0]).toEqual({type: TABLE_SORT_ITEMS, sort: {sortBy: 'key', reverse: false}});
  });

  test('filterTableItems with no items returns initial state', () => {
    const items = [];
    const {tableItems, tablePaging, numberPages} = filterTableItems(items, state);
    expect(tableItems).toEqual([]);
    expect(tablePaging).toEqual(state.paging);
    expect(numberPages).toEqual(1);
  });

  test('filterTableItems with items and updateDate sort returns filtered items, new paging and number of pages', () => {
    const items = [{
      updateDate:'2018-07-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda7',
      version:0,
      category:'frameworks',
      name:'Node.JS',
      scope:'',
      key:'node.js',
    }, {
      updateDate:'2018-08-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda8',
      version:0,
      category:'frameworks',
      name:'Node.JS2',
      scope:'',
      key:'node.js2',
    }];
    state.sort = {sortBy: 'updateDate', reverse: true};
    state.filters = {'name': 'js'};
    const {tableItems, tablePaging, numberPages} = filterTableItems(items, state);
    expect(tableItems).toEqual(items.reverse());
    expect(tablePaging).toEqual(state.paging);
    expect(numberPages).toEqual(1);
  });

  test('filterTableItems with 4 items returns filtered items, new paging and number of pages', () => {
    const items = [{
      updateDate:'2018-07-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda7',
      version:0,
      category:'frameworks',
      name:'Node.JS',
      scope:'',
      key:'node.js',
    }, {
      updateDate:'2018-08-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda8',
      version:0,
      category:'frameworks',
      name:'Node.JS2',
      scope:'',
      key:'node.js2',
    }, {
      updateDate:'2018-08-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda8',
      version:0,
      category:'frameworks',
      name:'Node.JS3',
      scope:'',
      key:'node.js3',
    }, {
      updateDate:'2018-08-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda8',
      version:0,
      category:'frameworks',
      name:'Node.JS3',
      scope:'',
      key:'node.js3',
    }];
    state.paging = {numberItems: 3, page: 5};
    state.sort = {sortBy: 'name', reverse: false};
    state.filters = {'name': 'js'};
    const {tableItems, tablePaging, numberPages} = filterTableItems(items, state);
    expect(tableItems).toEqual([items[0], items[1], items[2]]);
    expect(tablePaging).toEqual(state.paging);
    expect(numberPages).toEqual(2);
  });

  test('filterTableItems with 2 items returns filtered items, new paging and number of pages', () => {
    const items = [{
      updateDate:'2018-08-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda8',
      version:0,
      category:'frameworks',
      name:'Node.JS2',
      scope:'',
      key:'node.js2',
    }, {
      updateDate:'2018-07-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda7',
      version:0,
      category:'frameworks',
      name:'Node.JS',
      scope:'',
      key:'node.js',
    }];
    state.paging = {numberItems: 1, page: 1};
    state.sort = {sortBy: 'name', reverse: false};
    state.filters = {'name': 'js'};
    const {tableItems, tablePaging, numberPages} = filterTableItems(items, state);
    expect(tableItems).toEqual([items[1]]);
    expect(tablePaging).toEqual(state.paging);
    expect(numberPages).toEqual(2);
  });

  test('filterTableItems with items and without sort or filter returns tableItems', () => {
    const items = [{
      updateDate:'2018-08-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda8',
      version:0,
      category:'frameworks',
      name:'Node.JS2',
      scope:'',
      key:'node.js2',
    }, {
      updateDate:'2018-07-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda7',
      version:0,
      category:'frameworks',
      name:'Node.JS',
      scope:'',
      key:'node.js',
    }];
    state.paging = {numberItems: 10, page: 1};
    state.filters = {id: ''};
    state.sort = null;
    const {tableItems, tablePaging, numberPages} = filterTableItems(items, state);
    expect(tableItems).toEqual(items);
    expect(tablePaging).toEqual(state.paging);
    expect(numberPages).toEqual(1);
  });

  test('filterTableItems with item missing the filter key returns empty result', () => {
    const items = [{
      updateDate:'2018-08-23T14:41:36.328Z',
      id:'5823926b69170e15d895fda8',
      version:0,
      category:'frameworks',
      name:'Node.JS2',
      scope:'',
      key:'node.js2',
    }];
    state.paging = {numberItems: 0, page: 1};
    state.sort = {sortBy: 'unknown', reverse: false};
    state.filters = {'unknown': 'key'};
    const {tableItems, tablePaging, numberPages} = filterTableItems(items, state);
    expect(tableItems).toEqual([]);
    expect(tablePaging).toEqual(state.paging);
    expect(numberPages).toEqual(1);
  });
});
