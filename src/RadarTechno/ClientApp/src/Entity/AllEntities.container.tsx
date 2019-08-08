import React, { useContext, useEffect } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import { allItemsReducer, closeModal, editItem, initializeAllItemsState, viewItem } from '../AllItems';
import { customFetchWithUser }from '../customFetch';
import { EnhancedDataTable, setItems } from '../DataTable';
import { TABLE_SET_ITEMS } from '../DataTable/DataTable.constants';
import { EditItemModal } from '../EditItemModal';
import { EnvironmentContext } from '../Environment';
import { handleChange, handleSubmit, initReadOnlyFields, setSuggestions } from '../Form';
import { formatEntities, getExcelExportLink } from '../generic/excelExport';
import logMiddleware from '../logMiddleware';
import { TablePageHeader } from '../TablePageHeader';
import { getUsers, UserContext } from '../User';
import { rules } from './EditEntity.validation.rules';
import { IEntity } from './Entity';
import { formatEntity } from './Entity.action';
import { ADMINLIST, NAME, WORKFLOW_URL } from './Entity.constants';
import { getEntities, updateEntity } from './Entity.service';
import { EnhancedViewEntityModal } from './ViewEntityModal.container';

import '../generic/TableView.scss';

const itemsMiddleware = () => {
  return next => action => {
    if(action.type === TABLE_SET_ITEMS) {
      const formattedItems = formatEntity(action.items);
      next({...action, items: formattedItems});
    } else {
      next(action);
    }
  };
};

export const AllEntities = () => {
  
  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;
  
  const fields = {
    [NAME]: { name: NAME, label: 'Name', value: '', message: null, type: 'text' },
    [ADMINLIST] : { name: ADMINLIST, label: 'Admin list', values: [], message: null, type: 'multi-select', options: []},
    [WORKFLOW_URL]: { name: WORKFLOW_URL, label: 'Workflow url', value: '', message: null, type: 'text' },
  };

  const initState = initializeAllItemsState(fields);

  const [state, dispatch] = useEnhancedReducer(
    allItemsReducer,
    initState,
    [thunkMiddleware, itemsMiddleware, logMiddleware],
  );

  useEffect(() => {
    dispatch(setItems(getEntities(customFetchWithUser(fetch)(apiUrl)(currentUser))));
    dispatch(setSuggestions(getUsers(customFetchWithUser(fetch)(apiUrl)(currentUser)), ADMINLIST, 'email', 'email'));
  }, []);
  

  const actionOnClose = () => dispatch(closeModal());
  const actionOnSubmit = () => dispatch(handleSubmit(
    updateEntity(customFetchWithUser(fetch)(apiUrl)(currentUser))(state.item.id),
    () => dispatch(setItems(getEntities(customFetchWithUser(fetch)(apiUrl)(currentUser))))
  ));
  const actionOnEdit = (item: IEntity) => {
    dispatch(initReadOnlyFields({
      [NAME]: { ...state.fields[NAME], value: item.name },
      [ADMINLIST] : { ...state.fields[ADMINLIST], values: item.adminList ? item.adminList : [] },
      [WORKFLOW_URL] : { ...state.fields[WORKFLOW_URL], value: item.workflowUrl }
    }));
    dispatch(editItem(item));
  };
  const actionOnChange = (event) => dispatch(handleChange(event, rules));
  const actionOnView = (item: IEntity) => dispatch(viewItem(item));

  const headerTitleCount = state.items ? `(${state.items.length})` : '';

  return (
    <div className="container">
      <TablePageHeader
        title={`Entities ${headerTitleCount}`}
        ctaVisible={currentUser.role === 'root'}
        ctaPath="/new-entity"
        ctaText="New Entity"
        excelFileName="entities.csv"
        excelLink={getExcelExportLink(state.items, formatEntities, window.URL.createObjectURL)}
      />
      <EnhancedDataTable 
        {...state}
        hasEdit={currentUser.role === 'root'}
        hasHistory={false}
        keys={['name', 'admins', 'numberOfTechnologies', 'workflowUrl']}
        onView={actionOnView}
        onEdit={actionOnEdit} />
      <EnhancedViewEntityModal
        isOpen={state.isOpen} 
        item={state.item} 
        onClose={actionOnClose} />
      <EditItemModal 
        {...state}
        disableSubmit={state.fields === state.readOnlyFields}
        onSubmit={actionOnSubmit}
        onChange={actionOnChange}
        isOpen={state.isEdit} 
        onClose={actionOnClose} 
        title={`${state.item && state.item.name}`} />
    </div>
  );
};
