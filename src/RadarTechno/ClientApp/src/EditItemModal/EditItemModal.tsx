import React from 'react';
import { Form } from '../Form';
import { EnhancedSideModal } from '../SideModal';
import { IFormFields } from '../types';

export const EditItemModal = ({
  error,
  disableSubmit,
  fields,
  hasSubmit,
  loading,
  onChange,
  onSubmit,
  onMultiUrlsAdd,
  onMultiUrlsRemove,
  item,
  isOpen,
  onClose,
  title
}: {
  error: string,
  disableSubmit: boolean,
  fields: IFormFields,
  hasSubmit: boolean,
  loading: boolean,
  onChange:(...args: any[]) => any,
  onSubmit: (...args: any[]) => any,
  onMultiUrlsAdd?: (...args: any[]) => any,
  onMultiUrlsRemove?: (...args: any[]) => any,
  item: any,
  isOpen: boolean,
  onClose: () => void,
  title: string
}) => (
  <EnhancedSideModal isOpen={isOpen} onClose={onClose} item={item} title={title}>
    {item && <div>
      <Form 
        disableSubmit={disableSubmit}
        error={error}
        loading={loading}
        fields={fields}
        hasSubmit={hasSubmit}
        onSubmit={onSubmit}
        onChange={onChange}
        onMultiUrlsAdd={onMultiUrlsAdd}
        onMultiUrlsRemove={onMultiUrlsRemove}
      />
    </div>}
  </EnhancedSideModal>
);
