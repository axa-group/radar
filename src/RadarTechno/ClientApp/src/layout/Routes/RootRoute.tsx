import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { UserContext } from '../../User';

const RootRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={props =>
        currentUser && currentUser.role === 'root' ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/',
            state: { from: props.location },
          }} />
        )
      }
    />
  );
};
export { RootRoute };
