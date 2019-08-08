import React, { useContext, useEffect } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import { allItemsReducer, closeModal, editItem, initializeAllItemsState, viewItem, viewItemHistory } from '../AllItems';
import { customFetchWithUser }from '../customFetch';
import { EnhancedDataTable, setItems } from '../DataTable';
import { TABLE_SET_ITEMS } from '../DataTable/DataTable.constants';
import { EditItemModal } from '../EditItemModal';
import { EnvironmentContext } from '../Environment';
import { handleChange, handleSubmit, initReadOnlyFields } from '../Form';
import { formatEntityTechnologies, getExcelExportLink } from '../generic/excelExport';
import { EnhancedHistoryModal } from '../History';
import logMiddleware from '../logMiddleware';
import { TablePageHeader } from '../TablePageHeader';
import { SCOPE, STATUS, StatusOptions } from '../Technology/Technology.constants';
import { UserContext } from '../User';
import { rules } from './EditEntityTechnology.validation.rules';
import { IFormattedEntityTechnology } from './Entity';
import { TECHNOLOGY_URLS } from './Entity.constants';
import { getEntityTechnologies, updateEntityTechnology } from './Entity.service';
import { ViewEntityTechnologyModal } from './ViewEntityTechnologyModal';

import '../generic/TableView.scss';
import { formatEntityTechnology } from './Entity.action';

const itemsMiddleware = () => {
  return next => action => {
    if(action.type === TABLE_SET_ITEMS) {
      next({
        ...action, 
        items: action.items.length ? formatEntityTechnology(action.items) : []
      });
    } else {
      next(action);
    }
  };
};

export const EntityTechnologies = () => {
  
  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;

  const fields = {
    [STATUS] : { name: STATUS, label: 'Status', value: '', message: null, type: 'select', options: StatusOptions},
    [SCOPE] : { name: SCOPE, label: 'Scope', value: '', message: null, type: 'textarea'},
    [TECHNOLOGY_URLS] : { name: TECHNOLOGY_URLS, label: 'Useful links', 
      values: [], message: null, type: 'multi-urls-inputs'}
  };

  const initState = initializeAllItemsState(fields);
  
  const [state, dispatch] = useEnhancedReducer(
    allItemsReducer,
    initState,
    [thunkMiddleware, logMiddleware, itemsMiddleware],
  );

  useEffect(() => {
    const { entity } = currentUser;
    dispatch(setItems(
      getEntityTechnologies(customFetchWithUser(fetch)(apiUrl)(currentUser))(entity.id)
    ));
  }, []);

  const actionOnClose = () => dispatch(closeModal());
  const actionOnSubmit = () => dispatch(handleSubmit(
    updateEntityTechnology(customFetchWithUser(fetch)(apiUrl)(currentUser))(currentUser.entity.id, state.item.technologyId),
    () => dispatch(setItems(getEntityTechnologies(customFetchWithUser(fetch)(apiUrl)(currentUser))(currentUser.entity.id)))
  ));
  const actionOnEdit = (item: IFormattedEntityTechnology) => {
    dispatch(initReadOnlyFields({
      [STATUS]: {...state.fields[STATUS], value: item.status},
      [SCOPE] : { ...state.fields[SCOPE], value: item.entityScope},
      [TECHNOLOGY_URLS]: {...state.fields[TECHNOLOGY_URLS], values: item.entityTechnologyUrls}
    }));
    dispatch(editItem(item));
  };
  const actionOnChange = (event) => dispatch(handleChange(event, rules));
  const actionOnHistory = (item: IFormattedEntityTechnology) => dispatch(viewItemHistory(item));
  const actionOnView = (item: IFormattedEntityTechnology) => dispatch(viewItem(item));
  const actionOnMultiUrlsAdd = (values) => {
    let newValues = values;
    const newUrl = {label: '', url: ''};
    if(!newValues || newValues.length === 0) {
      newValues = [newUrl];
    } else {
      if(!(newValues[newValues.length - 1].label === '' && newValues[newValues.length - 1].url === '')) {
        newValues = [...newValues, newUrl];
      }
    }
    actionOnChange({name: TECHNOLOGY_URLS,  id: TECHNOLOGY_URLS, values: newValues});
  };
  const actionOnMultiUrlsRemove = (values, index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    actionOnChange({name: TECHNOLOGY_URLS,  id: TECHNOLOGY_URLS, values: newValues});
  };

  const headerTitleCount = state.items ? `(${state.items.length})` : '';

  return (
    <div className="container">
      <TablePageHeader
        title={`Technologies in ${currentUser.entity.name} ${headerTitleCount}`}
        ctaVisible={['admin', 'root'].includes(currentUser.role)}
        ctaPath="/add-technology"
        ctaText="Add a technology"
        excelFileName={`${currentUser.entity.name} technologies.csv`}
        excelLink={getExcelExportLink(state.items, formatEntityTechnologies, window.URL.createObjectURL)}
      />
      <EnhancedDataTable 
        {...state} 
        hasEdit={currentUser.role === 'admin' || currentUser.role === 'root'}
        hasHistory={true}
        keys={['name', 'category', 'status', 'updateDate']}
        onView={actionOnView}
        onHistory={actionOnHistory}
        onEdit={actionOnEdit} />
      <ViewEntityTechnologyModal isOpen={state.isOpen} item={state.item} onClose={actionOnClose} />
      <EditItemModal 
        {...state}
        disableSubmit={state.fields === state.readOnlyFields}
        onSubmit={actionOnSubmit}
        onChange={actionOnChange}
        onMultiUrlsAdd={actionOnMultiUrlsAdd}
        onMultiUrlsRemove={actionOnMultiUrlsRemove}
        isOpen={state.isEdit} 
        onClose={actionOnClose} 
        title={`${state.item && state.item.name}`} />
      <EnhancedHistoryModal
        type={'entity-technology'}
        item={state.item}
        isOpen={state.isHistory} 
        onClose={actionOnClose}  />
    </div>
  );
};
