import {
  TextInput,
} from '@axa-fr/react-toolkit-all';
import React from 'react';

export const UrlsMultiInput = ({
  id,
  labelValue,
  urlValue,
  classNameContainerLabel,
  classNameContainerInput,
  onChange
}: {
  id: string,
  labelValue: string,
  urlValue: string,
  classNameContainerLabel?: string,
  classNameContainerInput?: string,
  onChange: (...args: any[]) => void
}) => (
  <>
    <TextInput 
      name="label"
      label="Label"
      id={`${id}-label`}
      onChange={onChange}
      value={labelValue}
      classNameContainerLabel={classNameContainerLabel}
      classNameContainerInput={classNameContainerInput}
    />
    <TextInput 
      name="url"
      label="Url"
      id={`${id}-url`}
      onChange={onChange}
      value={urlValue}
      classNameContainerLabel={classNameContainerLabel}
      classNameContainerInput={classNameContainerInput}
    />
  </>
);
