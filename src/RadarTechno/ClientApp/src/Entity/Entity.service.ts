import { handleResponse } from '../generic/responseHandler';
import { SCOPE, STATUS, TECHNOLOGY } from '../Technology/Technology.constants';
import { IFormFields } from '../types';
import { IEntity } from './Entity';
import { ADMINLIST, NAME, TECHNOLOGY_URLS, WORKFLOW_URL } from './Entity.constants';

export const getEntities = (fetch: (...args: any[]) => any) => async() => {
  const response = await fetch('entities', {
    method: 'GET'
  });
  return handleResponse(response);
};

export const getEntity = (fetch: (...args: any[]) => any) => async(id: string) => {
  const response = await fetch(`entities/${id}`, {
    method: 'GET'
  });
  return handleResponse(response);
};

export const getEntityTechnologies = (fetch: (...args: any[]) => any) => (entityId: string) => async() => {
  const response = await fetch(`entities/${entityId}/technologies`, {
    method: 'GET'
  });
  return handleResponse(response);
};

export const addEntity = (fetch: (...args: any[]) => any) => 
  async(fields: IFormFields) => {
  
  const entity: IEntity = {
    name: fields[NAME].value,
    workflowUrl: fields[WORKFLOW_URL].value ? fields[WORKFLOW_URL].value : null,
    version: 1
  };
  const response = await fetch('entities', {
    method: 'POST',
    body: JSON.stringify(entity),
  });
  
  return handleResponse(response);
};

export const addTechnologyToEntity = (fetch: (...args: any[]) => any) => (entityId: string) => 
  async(fields: IFormFields) => {

  const entityTechnology = {
    technologyId: fields[TECHNOLOGY].value,
    status: fields[STATUS].value,
    scope: fields[SCOPE].value,
    entityTechnologyUrls: fields[TECHNOLOGY_URLS].values ? 
      fields[TECHNOLOGY_URLS].values.filter( link=> (link.label !== '' && link.url !== '')) : []
  };
  const response = await fetch(`entities/${entityId}/technologies`, {
    method: 'PATCH',
    body: JSON.stringify(entityTechnology),
  });
  
  return handleResponse(response);
};

export const updateEntity = (fetch: (...args: any[]) => any) => (id: string) => 
  async(fields: IFormFields, readOnlyFields: IFormFields) => {

  const entity: IEntity = {
    name: fields[NAME].value,
    adminList: fields[ADMINLIST].values,
    workflowUrl: fields[WORKFLOW_URL].value ? fields[WORKFLOW_URL].value : null,
  };

  const readOnlyEntity: IEntity = {
    name: readOnlyFields[NAME].value,
    adminList: readOnlyFields[ADMINLIST].values,
    workflowUrl: readOnlyFields[WORKFLOW_URL].value,
  };

  const diff = [];
  Object.keys(readOnlyEntity).forEach(k => {
    if(entity[k] !== readOnlyEntity[k]) {
      diff.push({'op': 'replace', 'path': `/${k}`, 'value': entity[k]});
    }
  });

  const response = await fetch(`entities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(diff)
  });

  return handleResponse(response);
};

export const updateEntityTechnology = (fetch: (...args: any[]) => any) => (id: string, technologyId: string) => 
  async(fields: IFormFields) => {

  const technologyFields = {
    status: fields[STATUS].value,
    scope: fields[SCOPE].value,
    entityTechnologyUrls: fields[TECHNOLOGY_URLS].values ? 
      fields[TECHNOLOGY_URLS].values.filter( link=> (link.label !== '' && link.url !== '')) : []
  };

  const response = await fetch(`entities/${id}/technology-status`, {
    method: 'PATCH',
    body: JSON.stringify({technologyId, ...technologyFields})
  });

  return handleResponse(response);
};
