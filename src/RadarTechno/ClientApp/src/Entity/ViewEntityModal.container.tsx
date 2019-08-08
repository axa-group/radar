import React, { useContext, useEffect, useState } from 'react';

import { customFetchWithUser } from '../customFetch';
import { getEntityTechnologies, IEntity } from '../Entity';
import { EnvironmentContext } from '../Environment';
import { UserContext } from '../User';
import { formatEntityTechnology } from './Entity.action';
import { ViewEntityModal } from './ViewEntityModal';

export const EnhancedViewEntityModal = ({
  item,
  isOpen,
  onClose
}: {
  item: IEntity,
  isOpen: boolean,
  onClose: () => void
}) => {

  const [state, setState] = useState({loading: true, items: []});

  const { currentUser } = useContext(UserContext);
  const apiUrl = useContext(EnvironmentContext).apiUrl;

  useEffect(() => {
    if(item) {
      setState({loading: true, items: []});
      getEntityTechnologies(customFetchWithUser(fetch)(apiUrl)(currentUser))(item.id)()
        .then(items => setState({items: formatEntityTechnology(items), loading: false}));
    }
  }, [item]);

  return (
    <ViewEntityModal
      {...state}
      item={item}
      onClose={onClose}
      isOpen={isOpen}
    />
  );
};
