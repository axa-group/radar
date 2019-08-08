import React, { useEffect } from 'react';
import { SideModal } from './SideModal';

export const EnhancedSideModal = (props) => {
  
  useEffect(() => {
    if(props.isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [props.isOpen]);

  return (
    <SideModal 
      {...props}
    />
  );
};
