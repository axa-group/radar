import React, { useContext, useEffect } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import { allItemsReducer, closeModal, editItem, initializeAllItemsState, viewItem } from '../AllItems';
import { customFetchWithUser }from '../customFetch';
import { EnhancedDataTable, setItems } from '../DataTable';
import { TABLE_SET_ITEMS } from '../DataTable/DataTable.constants';
import { EditItemModal } from '../EditItemModal';
import { getEntities } from '../Entity';
import { EnvironmentContext } from '../Environment';
import { handleChange, handleSubmit, initReadOnlyFields, setSuggestions } from '../Form';
import { formatUsers, getExcelExportLink } from '../generic/excelExport';
import logMiddleware from '../logMiddleware';
import { TablePageHeader } from '../TablePageHeader';
import { UserContext } from '../User';
import { rules } from './EditUser.validation.rules';
import { IUser } from './User';
import { ENTITY, NAME, ROLE, roleOptions } from './User.constants';
import { getUsers, updateUser } from './User.service';
import { ViewUserModal } from './ViewUserModal';

import '../generic/TableView.scss';

const itemsMiddleware = () => {
  return next => action => {
    if(action.type === TABLE_SET_ITEMS) {
      const formattedItems = [];
      action.items.map((user) => (
        formattedItems.push({
          ...user,
          entityName: user.entity.name
        })
      ));
      next({...action, items: formattedItems});
    } else {
      next(action);
    }
  };
};

export const AllUsers = () => {
  
  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;
  
  const fields = {
    [NAME]: {name: NAME, label: 'Name', value: '', message: null, type: 'text' },
    [ROLE]: { name: ROLE, label: 'Role', value: '', message: null, type: 'select', options: [ 
      {value: 'user', label: 'User'},
      {value: 'admin', label: 'Admin'},
    ]},
    [ENTITY]: { name: ENTITY, label: 'Entity', value: '', message: null, type: 'select', options: [], disabled: true}
  };

  const initState = initializeAllItemsState(fields);

  const [state, dispatch] = useEnhancedReducer(
    allItemsReducer,
    initState,
    [thunkMiddleware, itemsMiddleware, logMiddleware],
  );

  useEffect(() => {
    dispatch(setItems(getUsers(customFetchWithUser(fetch)(apiUrl)(currentUser))));
    dispatch(setSuggestions(getEntities(customFetchWithUser(fetch)(apiUrl)(currentUser)), ENTITY, 'name', 'id'));
    if(currentUser.role === 'root') {
      fields[ENTITY].disabled = false;
      fields[ROLE].options = roleOptions;
    }
  }, []);
  
  const actionOnClose = () => dispatch(closeModal());
  const actionOnSubmit = () => dispatch(handleSubmit(
    updateUser(customFetchWithUser(fetch)(apiUrl)(currentUser))(state.item.id),
    () => dispatch(setItems(getUsers(customFetchWithUser(fetch)(apiUrl)(currentUser))))
  ));
  const actionOnEdit = (item: IUser) => {
    dispatch(initReadOnlyFields({
      [NAME]: { ...state.fields[NAME], value: item.name ? item.name : '' },
      [ROLE]: { ...state.fields[ROLE], value: item.role },
      [ENTITY] : { ...state.fields[ENTITY], value: item.entityList[0] }
    }));
    dispatch(editItem(item));
  };
  const actionOnChange = (event) => dispatch(handleChange(event, rules));
  const actionOnView = (item: IUser) => dispatch(viewItem(item));

  const headerTitleCount = state.items ? `(${state.items.length})` : '';
  
  return (
    <div className="container">
      <TablePageHeader
        title={`All Users ${headerTitleCount}`}
        ctaVisible={currentUser.role === 'admin' || currentUser.role === 'root' }
        ctaPath="/new-user"
        ctaText="New User"
        excelFileName="users.csv"
        excelLink={getExcelExportLink(state.items, formatUsers, window.URL.createObjectURL)}
      />    
      <EnhancedDataTable 
        {...state} 
        hasEdit={currentUser.role === 'admin' || currentUser.role === 'root' }
        hasHistory={false}
        keys={['email', 'role', 'entityName']}
        onView={actionOnView}
        onEdit={actionOnEdit} />
      <ViewUserModal isOpen={state.isOpen} 
        onClose={actionOnClose} item={state.item} />
      <EditItemModal 
        {...state}
        disableSubmit={state.fields === state.readOnlyFields}
        onSubmit={actionOnSubmit}
        onChange={actionOnChange}
        isOpen={state.isEdit} 
        onClose={actionOnClose} 
        title={`${state.item && state.item.email}`} />
    </div>
  );
};
