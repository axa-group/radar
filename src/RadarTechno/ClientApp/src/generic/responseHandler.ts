import { convertStringDateToDateObject } from './dateStringHandler';

export const handleResponse = async(response: Response) => {
  switch(response.status) {
    case 401:
      return { message: 'Unauthorized' };
    case 204:
      return {};
    default:
      const json = await response.json();
      return convertStringDateToDateObject(json);
  }
};
