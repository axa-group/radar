import React, { useContext, useEffect } from 'react';
import useEnhancedReducer from 'react-enhanced-reducer-hook';
import thunkMiddleware from 'redux-thunk';

import { allItemsReducer, closeModal, editItem, initializeAllItemsState, viewItem, viewItemHistory } from '../AllItems';
import { customFetchWithUser } from '../customFetch';
import { EnhancedDataTable, setItems } from '../DataTable';
import { EditItemModal } from '../EditItemModal';
import { EnvironmentContext } from '../Environment';
import { handleChange, handleSubmit, initReadOnlyFields } from '../Form';
import { formatTechnologies, getExcelExportLink } from '../generic/excelExport';
import { EnhancedHistoryModal } from '../History';
import logMiddleware from '../logMiddleware';
import { TablePageHeader } from '../TablePageHeader';
import { ITechnology } from '../Technology';
import { UserContext } from '../User';
import { rules } from './EditTechnology.validation.rules';
import { CATEGORY, CategoryOptions, DESCRIPTION, NAME, SCOPE } from './Technology.constants';
import { getTechnologies, updateTechnology } from './Technology.service';
import { ViewTechnologyModal } from './ViewTechnologyModal';

import '../generic/TableView.scss';

export const AllTechnologies = () => {
  
  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;

  const fields = {
    [NAME]: { name: NAME, label: 'Name', value: '', message: null, type: 'text' },
    [CATEGORY]: { name: CATEGORY, label: 'Category', value: '', message: null, type: 'select', options: CategoryOptions},
    [DESCRIPTION]: { name: DESCRIPTION, label: 'Description', value: '', message: null, type: 'textarea' },
    [SCOPE]: { name: SCOPE, label: 'Scope and usage restriction', value: '', message: null, type: 'textarea'},
  };
  
  const initState = initializeAllItemsState(fields);

  const [state, dispatch] = useEnhancedReducer(
    allItemsReducer,
    initState,
    [thunkMiddleware, logMiddleware],
  );

  useEffect(() => {
    dispatch(setItems(getTechnologies(customFetchWithUser(fetch)(apiUrl)(currentUser))));
  }, []);

  const actionOnClose = () => dispatch(closeModal());
  const actionOnSubmit = () => dispatch(handleSubmit(
    updateTechnology(customFetchWithUser(fetch)(apiUrl)(currentUser))(state.item.id),
    () => dispatch(setItems(getTechnologies(customFetchWithUser(fetch)(apiUrl)(currentUser))))
  ));
  const actionOnChange = (event) => dispatch(handleChange(event, rules));
  const actionOnEdit = (item: ITechnology) => {
    dispatch(initReadOnlyFields({
      [NAME]: { ...state.fields[NAME], value: item.name },
      [CATEGORY] : { ...state.fields[CATEGORY], value: item.category },
      [DESCRIPTION]: { ...state.fields[DESCRIPTION], value: item.description ? item.description : '' },
      [SCOPE] : { ...state.fields[SCOPE], value: item.scope ? item.scope : '' }
    }));
    dispatch(editItem(item));
  };
  const actionOnHistory = (item: ITechnology) => dispatch(viewItemHistory(item));
  const actionOnView = (item: ITechnology) => dispatch(viewItem(item));

  return (
    <div className="container">
      <TablePageHeader
        title={`All technologies ${state.items ? `(${state.items.length})` : ''}`}
        ctaVisible={currentUser.role === 'root'}
        ctaPath="/new-technology"
        ctaText="New Technology"
        excelFileName="technologies.csv"
        excelLink={getExcelExportLink(state.items, formatTechnologies, window.URL.createObjectURL)}
      />
      <EnhancedDataTable 
        hasEdit={currentUser.role === 'root'}
        hasHistory={true}
        items={state.items}
        loading={state.loading}
        filters={state.filters}
        keys={['name', 'category', 'updateDate']}
        onHistory={actionOnHistory}
        onView={actionOnView}
        onEdit={actionOnEdit} 
      />
      <ViewTechnologyModal isOpen={state.isOpen} item={state.item} onClose={actionOnClose} />
      <EditItemModal 
        {...state}
        disableSubmit={state.fields === state.readOnlyFields}
        onSubmit={actionOnSubmit}
        onChange={actionOnChange}
        isOpen={state.isEdit} 
        onClose={actionOnClose} 
        title={`${state.item && state.item.name}`} />
      <EnhancedHistoryModal  
        type={'technology'}
        item={state.item}
        isOpen={state.isHistory} 
        onClose={actionOnClose}  />
    </div>
  );
};
