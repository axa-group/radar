import { 
  TABLE_SET_ITEMS,
  TABLE_SORT_ITEMS,
  TABLE_UPDATE_FILTERS, 
  TABLE_UPDATE_PAGING
} from './DataTable.constants';
import { dataTableReducer, initState } from './DataTable.reducer';

describe('dataTable reducer state', () => {
  test('default action returns state', () => {
    const newState = dataTableReducer(initState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toBe(initState);
  });

  test('TABLE_SET_ITEMS action', () => {
    const items = [{
      1: 'item 1',
      2: 'item 2',
      3: 'item 3',
      4: 'item 4',
    }];
    const action = { items, type: TABLE_SET_ITEMS };
    const actual = dataTableReducer(initState, action);

    expect(actual.items).toBe(items);
  });

  
  test('TABLE_SET_ITEMS action with empty items', () => {
    const items = [];
    const action = { items, type: TABLE_SET_ITEMS };
    const actual = dataTableReducer(initState, action);

    expect(actual.items).toBe(items);
    expect(actual.keys).toEqual([]);
  });

  test('TABLE_SORT_ITEMS action', () => {
    const sort = {sortBy: 'key', reverse: true};
    const action = { sort, type: TABLE_SORT_ITEMS };
    const actual = dataTableReducer(initState, action);

    expect(actual.sort).toBe(sort);
  });

  test('TABLE_UPDATE_PAGING action', () => {
    const paging = { numberItems: 50, page: 4 };
    const actual = dataTableReducer(initState, { paging, type: TABLE_UPDATE_PAGING });
    expect(actual.paging).toBe(paging);
  });

  test('TABLE_UPDATE_FILTERS action', () => {
    const filters = { description: 'desc'};
    const actual = dataTableReducer(initState, { filters, type: TABLE_UPDATE_FILTERS });
    expect(actual.filters).toBe(filters);
  });

});
