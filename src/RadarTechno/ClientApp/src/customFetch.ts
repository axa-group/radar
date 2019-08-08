import { ICurrentUser } from './types';

export const customFetch = fetch => (apiBaseUrl: string) => 
  async (path?: string, options?) => {
    const url = createUrlFromPath(apiBaseUrl, path);
    const newOptions = createOptions(options);
    return fetch(url, newOptions);
};

export const customFetchWithUser = fetch => (apiBaseUrl: string) => 
  (currentUser: ICurrentUser) => async (path?: string, options?) => {
    const url = createUrlFromPath(apiBaseUrl, path);
    const newOptions = createOptions(options, currentUser);
    return fetch(url, newOptions);
};

export const createUrlFromPath = (url: string, path: string)  => {
  return url.replace('{path}', path);
};

export const createOptions = (options, currentUser: ICurrentUser = undefined ) => {
  let headers = new Headers();
  if (options.headers && !(options.headers instanceof Headers)) {
    headers = new Headers(options.headers);
  }
  headers.set('Content-Type', 'application/json');

  if (currentUser) {
    headers.set('Authorization', `Bearer ${currentUser.token}`);
  }

  return Object.assign(options, { headers });
};
