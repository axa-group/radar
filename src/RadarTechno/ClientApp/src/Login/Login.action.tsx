import { LOGIN } from '../constants/actions';

export const submitCallback = (dispatch: (...args: any) => any) => (response: any) => {
  if(response.token) {
    dispatch({ type: LOGIN, user: response });
  }
};
