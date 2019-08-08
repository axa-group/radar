import {
  EMAIL,
  PASSWORD,
} from '../constants';
import { handleResponse } from '../generic/responseHandler';
import { ILoginFields } from '../types';

export const authenticateUser = (fetch: (...args: any[]) => any) => (localStorage: Storage) =>
  async(fields: ILoginFields) => {
  const response = await fetch('users/auth', {
    method: 'POST',
    body: JSON.stringify({
      [EMAIL]: fields[EMAIL].value,
      [PASSWORD]: fields[PASSWORD].value,
    }),
  });

  const handledResponse = await handleResponse(response);

  if (handledResponse.token) {
    localStorage.clear();
    localStorage.setItem('token', JSON.stringify(handledResponse.token));
  }

  return handledResponse;
};
