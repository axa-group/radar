import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../../User';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={props =>
        currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location },
          }} />
        )
      }
    />
  );
};
export { PrivateRoute };
