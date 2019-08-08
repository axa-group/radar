import { closeModal, editItem, viewItem, viewItemHistory } from "./AllItems.action";
import { CLOSE_MODAL, EDIT_ITEM, VIEW_ITEM, VIEW_ITEM_HISTORY } from "./AllItems.constants";

describe('allItems action test', () => {
  test('closeModal dispatch CLOSE_MODAL action', () => {
    const dispatch = jest.fn();
    closeModal()(dispatch);
    
    expect(dispatch.mock.calls[0][0]).toEqual({type: CLOSE_MODAL});
  });
  
  test('viewItem dispatch VIEW_ITEM action', () => {
    const dispatch = jest.fn();
    const item = [];
    viewItem(item)(dispatch);
    
    expect(dispatch.mock.calls[0][0]).toEqual({item, type: VIEW_ITEM});
  });

  test('viewItemHistory dispatch VIEW_ITEM_HISTORY action', () => {
    const dispatch = jest.fn();
    const item = [];
    viewItemHistory(item)(dispatch);
    
    expect(dispatch.mock.calls[0][0]).toEqual({item, type: VIEW_ITEM_HISTORY});
  });
  
  test('editItem dispatch EDIT_ITEM action', () => {
    const dispatch = jest.fn();
    const item = [];
    editItem(item)(dispatch);
    
    expect(dispatch.mock.calls[0][0]).toEqual({item, type: EDIT_ITEM});
  });
});
