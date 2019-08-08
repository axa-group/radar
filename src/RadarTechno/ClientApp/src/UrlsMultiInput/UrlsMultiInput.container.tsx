import React from 'react';
import { TECHNOLOGY_URLS } from '../Entity/Entity.constants';
import { UrlsMultiInput } from './UrlsMultiInput';

export const EnhancedUrlsMultiInput = ({
  id,
  index,
  value,
  values,
  classNameContainerLabel,
  classNameContainerInput,
  onChange
}: {
  id: string,
  index: number,
  value: any,
  values: any[],
  classNameContainerLabel?: string,
  classNameContainerInput?: string,
  onChange: (...args: any[]) => void
}) => (
  <UrlsMultiInput
    id={id}
    labelValue={value.label}
    urlValue={value.url}
    onChange={(event) => {
      values[index] = {...value, [event.name]: event.value};
      onChange({id, values, name: TECHNOLOGY_URLS});
    }}
    classNameContainerLabel={classNameContainerLabel}
    classNameContainerInput={classNameContainerInput}
  />
);
