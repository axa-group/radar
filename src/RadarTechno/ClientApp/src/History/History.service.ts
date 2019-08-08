import { handleResponse } from '../generic/responseHandler';

export const getHistory = (fetch: (...args: any[]) => any) => (type: string, id: string) => async() => {
  const response = await fetch(`history/${type}/${id}`, {
    method: 'GET'
  });
  const handledResponse = await handleResponse(response);
  return handledResponse;
};
