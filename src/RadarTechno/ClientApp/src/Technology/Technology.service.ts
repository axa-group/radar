import { handleResponse } from '../generic/responseHandler';
import { IFormFields } from '../types';
import { ITechnology } from './Technology';
import { CATEGORY, DESCRIPTION, NAME, SCOPE } from './Technology.constants';

export const getTechnologies = (fetch: (...args: any[]) => any) => async () => {
  const response = await fetch('technologies', {
    method: 'GET'
  });
  return handleResponse(response);
};

export const getTechnology = (fetch: (...args: any[]) => any) => async(id: string) => {
  const response = await fetch(`technologies/${id}`, {
    method: 'GET',
  });
  return handleResponse(response);
};

export const getTechnologiesNotInEntity = (fetch: (...args: any[]) => any) => 
  (entityId: string) => async () => {
  const response = await fetch(`technologies/not-in-entity/${entityId}`, {
    method: 'GET'
  });
  return handleResponse(response);
};

export const addTechnology = (fetch: (...args: any[]) => any) => 
  async(fields: IFormFields) => {
  
  const technology: ITechnology = {
    key: fields[NAME].value.toLowerCase().replace(/\s/g, '-'),
    name: fields[NAME].value,
    category: fields[CATEGORY].value,
    description: fields[DESCRIPTION].value,
    scope: fields[SCOPE].value,
    version: 1
  };
  const response = await fetch('technologies', {
    method: 'POST',
    body: JSON.stringify(technology),
  });
  
  return handleResponse(response);
};

export const updateTechnology = (fetch: (...args: any[]) => any) => (id: string) => 
  async(fields: IFormFields, readOnlyFields: IFormFields) => {

  const technology: ITechnology = {
    key: fields[NAME].value.toLowerCase().replace(/\s/g, '-'),
    name: fields[NAME].value,
    category: fields[CATEGORY].value,
    description: fields[DESCRIPTION].value,
    scope: fields[SCOPE].value
  };

  const readOnlyTechnology: ITechnology = {
    key: readOnlyFields[NAME].value.toLowerCase().replace(/\s/g, '-'),
    name: readOnlyFields[NAME].value,
    category: readOnlyFields[CATEGORY].value,
    description: readOnlyFields[DESCRIPTION].value,
    scope: readOnlyFields[SCOPE].value
  };

  const diff = [];
  Object.keys(readOnlyTechnology).forEach(k => {
    if(technology[k] !== readOnlyTechnology[k]) {
      diff.push({'op': 'replace', 'path': `/${k}`, 'value': technology[k]});
    }
  });

  const response = await fetch(`technologies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(diff)
  });

  return handleResponse(response);
};
