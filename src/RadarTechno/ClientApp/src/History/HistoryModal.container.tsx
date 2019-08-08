import React, { useContext, useEffect, useState } from 'react';

import { customFetchWithUser } from '../customFetch';
import { EnvironmentContext } from '../Environment';
import { UserContext } from '../User';
import { getHistory } from './History.service';
import { HistoryModal } from './HistoryModal';

export const EnhancedHistoryModal = ({
  item,
  isOpen,
  onClose,
  type
}: {
  item: any,
  isOpen: boolean,
  onClose: () => void,
  type: string
}) => {

  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;
  const [state, setState] = useState({loading: true, history: null, idToOpen: null});

  useEffect(() => {
    if(item) {
      setState({...state, history: null, loading: true});
      getHistory(customFetchWithUser(fetch)(apiUrl)(currentUser))(type, item.id)()
        .then(history => setState({...state, history, loading: false}));
    }
  }, [item]);

  const actionOnToggle = ({id}) => setState({...state, idToOpen: id});

  return (
    <HistoryModal 
      {...state} 
      isOpen={isOpen} 
      title={item ? `History for ${item.name}` : ''} 
      onClose={onClose} 
      onToggle={(props) => actionOnToggle(props)} />
  );
};
