import { STOP_LOADING, VALIDATE_TOKEN } from '../constants/actions';

export const verifyToken = (validateTokenAsync: (...args: any[]) => any) => (localStorage: Storage) =>
  async(dispatch: (...args: any[]) => any) => {
  const localData = localStorage.getItem('token'); 
  if (localData) {
    const token = JSON.parse(localData);
    const data = await validateTokenAsync(token);
    if (!data.token) {
      localStorage.clear();
    }
    dispatch({ type: VALIDATE_TOKEN, user: data.token ? data : null });
  } else { dispatch({ type: STOP_LOADING }); }
};
