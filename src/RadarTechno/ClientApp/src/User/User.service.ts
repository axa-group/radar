import { handleResponse } from '../generic/responseHandler';
import { IFormFields } from '../types';
import { IEditUser, IUser } from './User';
import { EMAIL, ENTITY, NAME, PASSWORD, ROLE } from './User.constants';

export const validateToken = (fetch: (...args: any[]) => any) => async(token: string) => {
  const response = await fetch('users/token-validation', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getUsers = (fetch: (...args: any[]) => any) => async () => {
  const response = await fetch('users', {
    method: 'GET'
  });

  return handleResponse(response);
};

export const addUser = (fetch: (...args: any[]) => any) => 
  async(fields: IFormFields) => {
  
  const user: IUser = {
    name: fields[NAME].value,
    email: fields[EMAIL].value,
    entity: fields[ENTITY].value,
    password: fields[PASSWORD].value,
    role: fields[ROLE].value,
  };
  const response = await fetch('users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
  
  return handleResponse(response);
};

export const updateUser = (fetch: (...args: any[]) => any) => (id: string) => 
  async(fields: IFormFields, readOnlyFields: IFormFields) => {

  const user: IEditUser = {
    name: fields[NAME].value,
    role: fields[ROLE].value,
    entity: fields[ENTITY].value,
  };

  const readOnlyUser: IEditUser = {
    name: readOnlyFields[NAME].value,
    role: readOnlyFields[ROLE].value,
    entity: readOnlyFields[ENTITY].value,
  };

  const diff = [];
  Object.keys(readOnlyUser).forEach(k => {
    if(user[k] !== readOnlyUser[k]) {
      if(k==='entity') {
        diff.push({'op': 'replace', 'path': `/entityList`, 'value': [user[k]]});
      } else {
        diff.push({'op': 'replace', 'path': `/${k}`, 'value': user[k]});
      }      
    }
  });

  const response = await fetch(`users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(diff)
  });

  return handleResponse(response);
};
