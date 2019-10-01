import { handleResponse } from '../generic/responseHandler';

export const getConfigurationAsync = (fetch: (...args: any[]) => any) => async () => {
    const response = await fetch(`configuration`, {
        method: 'GET'
    });
    const handledResponse = await handleResponse(response);
    return handledResponse;
};
