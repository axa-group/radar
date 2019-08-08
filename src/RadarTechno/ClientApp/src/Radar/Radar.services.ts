import { handleResponse } from '../generic/responseHandler';

export const getRadarTechnologies = (fetch: (...args: any[]) => any) => async(entityId: string) => {
  const response = await fetch(`entities/${entityId}/technologies`, {method: 'GET'});
  return handleResponse(response);
};
