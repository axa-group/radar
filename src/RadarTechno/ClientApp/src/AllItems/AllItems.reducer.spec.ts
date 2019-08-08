import { initializeAllItemsState } from "./AllItems.action";
import { CLOSE_MODAL, EDIT_ITEM, VIEW_ITEM } from "./AllItems.constants";
import { allItemsReducer } from "./AllItems.reducer";

const initState = initializeAllItemsState({});

describe('allItems reducer state', () => {
  test('default action returns state', () => {
    const newState = allItemsReducer(initState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toBe(initState);
  });

  test('VIEW_ITEM action', () => {
    const action = { type: VIEW_ITEM, item: [] };
    const actual = allItemsReducer(initState, action);

    expect(actual.isOpen).toBeTruthy();
    expect(actual.isEdit).toBeFalsy();
    expect(actual.item).toEqual([]);
  });

  test('EDIT_ITEM action', () => {
    const action = { type: EDIT_ITEM, item: [] };
    const actual = allItemsReducer(initState, action);

    expect(actual.isOpen).toBeFalsy();
    expect(actual.isEdit).toBeTruthy();
    expect(actual.item).toEqual([]);
  });

  test('CLOSE_MODAL action', () => {
    const action = { type: CLOSE_MODAL };
    const actual = allItemsReducer(initState, action);

    expect(actual.isOpen).toBeFalsy();
    expect(actual.isEdit).toBeFalsy();
  });
});

